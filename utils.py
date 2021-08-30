from loguru import logger
import torch
from config import max_length,hl_token
import os
import wget
from nlgeval import NLGEval
from transformers import RobertaTokenizer
from transformers import RobertaForMultipleChoice
from torch.distributions import Categorical
import itertools as it
import nlp2go
from functools import lru_cache
import json
from model import Answer

def prepare_qg_model_input_ids(article,start_at,end_at,tokenizer):
    hl_context = f"{article[:start_at]}{hl_token}{article[start_at:end_at]}{hl_token}{article[end_at:]}"
    logger.info(hl_context)
    model_input = tokenizer(
        hl_context,
        return_length=True
    )

    input_length = model_input['length'][0]
    if input_length > max_length:
        hl_token_id = tokenizer.convert_tokens_to_ids([hl_token])[0]
        slice_length = int(max_length/2)
        mid_index = model_input['input_ids'].index(hl_token_id)
        new_input_ids = model_input['input_ids'][mid_index-slice_length:mid_index+slice_length]
        model_input['input_ids'] = new_input_ids
    return torch.LongTensor([model_input['input_ids']]), input_length

def prepare_dis_model_input_ids(article,question,answer,ans_start,ans_end,tokenizer):
    sep_token_id = tokenizer.sep_token_id
    article_max_length = max_length - 52 # 後面會手動插入2個sep_token
    article_max_length -= 20 # 預留20個token空間
    article_input = tokenizer(
        article,
        add_special_tokens=False,
        return_length=True
    )
    # logger.debug(article_input)
    article_length = article_input['length']
    
    # 當文章過長，依據答案位置重新裁切文章
    if article_length > article_max_length:
        slice_length = int(article_max_length/2)
        mid_index = int((ans_start + ans_end)/2)
        new_input_ids = article_input['input_ids'][mid_index-slice_length:mid_index+slice_length]
        article_input['input_ids'] = new_input_ids

    question_input = tokenizer(
        question,
        max_length=30,
        return_length=True,
        add_special_tokens=False,
        truncation=True
    )
    question_length = question_input['length']

    answer_input = tokenizer(
        answer,
        max_length=20,
        return_length=True,
        add_special_tokens=False,
        truncation=True
    )
    answer_length = answer_input['length']
    
    final_input_ids = article_input['input_ids'] + [sep_token_id] + question_input['input_ids'] + [sep_token_id] + answer_input['input_ids']
    total_legnth = len(final_input_ids)
    assert total_legnth <= max_length
    return torch.LongTensor([final_input_ids]), total_legnth

class BartDistractorGeneration():
    def __init__(self,device='cpu'):
        self.device = 'cpu'
        self.nlgeval = NLGEval(metrics_to_omit=['METEOR', 'EmbeddingAverageCosineSimilairty', 'SkipThoughtCS', 'VectorExtremaCosineSimilarity','GreedyMatchingScore', 'CIDEr'])
        self._model_save_dir = '.BDG'
        if not os.path.isdir(self._model_save_dir):
            os.mkdir(self._model_save_dir)
            self.download_model()
        
        #
        self.dg_model = nlp2go.Model(os.path.join(self._model_save_dir,'BDG.pt'))
        self.dg_model_pm = nlp2go.Model(os.path.join(self._model_save_dir,'BDG_PM.pt'))
        self.dg_model_both = nlp2go.Model(os.path.join(self._model_save_dir,'BDG_ANPM.pt'))

        #
        self.tokenizer = RobertaTokenizer.from_pretrained("LIAMF-USP/roberta-large-finetuned-race")
        self.model = RobertaForMultipleChoice.from_pretrained("LIAMF-USP/roberta-large-finetuned-race")
        self.model.eval()
        self.model.to(self.device)

    def _download_file(self,url,f_name):
        wget.download(url,os.path.join(self._model_save_dir,f_name))

    def download_model(self):
        self._download_file('https://github.com/voidful/BDG/releases/download/v2.0/BDG.pt','BDG.pt')
        self._download_file('https://github.com/voidful/BDG/releases/download/v2.0/BDG_PM.pt','BDG_PM.pt')
        self._download_file('https://github.com/voidful/BDG/releases/download/v2.0/BDG_ANPM.pt','BDG_ANPM.pt')
    
    @lru_cache(maxsize=1000)
    def generate_distractor(self,context, question, answer, gen_quantity):
        if type(answer) is str:
            answer = Answer.parse_obj(json.loads(answer))
        d_input_ids,_ = prepare_dis_model_input_ids(context,question,answer.tag,answer.start_at,answer.end_at,self.tokenizer)  # 如果文章過長進行重新裁切與處理
        # d_input = context + '</s>' + question + '</s>' + answer.tag
        d_input = self.tokenizer.decode(d_input_ids[0])
        choices = self.dg_model.predict(d_input, decodenum=gen_quantity)['result']
        choices_pm = self.dg_model_pm.predict(d_input, decodenum=gen_quantity)['result']
        choices_both = self.dg_model_both.predict(d_input, decodenum=gen_quantity)['result']
        all_options = choices + choices_pm + choices_both
        return self._selection(context,question,answer.tag,all_options, gen_quantity)

    def _selection(self,context, question, answer, all_options, gen_quantity):
        max_combin = [0, []]
        for combin in set(it.combinations(all_options, gen_quantity)):
            options = list(combin) + [answer]
            keep = True
            for i in set(it.combinations(options, 2)):
                a = "".join([char if char.isalpha() or char == " " else " " + char + " " for char in i[0]])
                b = "".join([char if char.isalpha() or char == " " else " " + char + " " for char in i[1]])
                metrics_dict = self.nlgeval.compute_individual_metrics([a], b)
                if metrics_dict['Bleu_1'] > 0.5:
                    keep = False
                    break
            if keep:
                prompt = context + self.tokenizer.sep_token + question
                encoding_input = []
                for choice in options:
                    encoding_input.append([prompt, choice])
                encoding_input.append([prompt, answer])
                labels = torch.tensor(len(options) - 1).unsqueeze(0)
                encoding = self.tokenizer(encoding_input, return_tensors='pt', padding=True, truncation='only_first')
                outputs = self.model(**{k: v.unsqueeze(0).to(self.device) for k, v in encoding.items()},
                                labels=labels.to(self.device))  # batch size is 1
                entropy = Categorical(probs=torch.softmax(outputs.logits, -1)).entropy().tolist()[0]
                if entropy >= max_combin[0]:
                    max_combin = [entropy, options]
        return max_combin[1][:-1]
