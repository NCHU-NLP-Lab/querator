from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, BertTokenizerFast, AutoModelForCausalLM
import torch
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from loguru import logger
from model import QuestionAndAnswer,EnQGItem,ZhQGItem
import os

# init nlp_model
en_model = AutoModelForSeq2SeqLM.from_pretrained("p208p2002/bart-squad-qg-hl")
en_tokenizer = AutoTokenizer.from_pretrained("p208p2002/bart-squad-qg-hl")

zh_model = AutoModelForCausalLM.from_pretrained("p208p2002/gpt2-drcd-qg-hl")
zh_tokenizer = BertTokenizerFast.from_pretrained("p208p2002/gpt2-drcd-qg-hl")

# config
max_length = 512
max_question_length = 30
hl_token = '[HL]'
hl_token_id = en_tokenizer.convert_tokens_to_ids([hl_token])[0]

# 
app = FastAPI(
    title="Querator",
    description="NCHU NLP LAB - QG AI",
    version="1.0.0"
)

origins = os.getenv("allow_origins","http://localhost:8000 http://localhost:3000").split()
app.mount("/react", StaticFiles(directory="react/build"), name="react")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def prepare_model_input_ids(article,start_at,end_at,tokenizer):
    hl_context = f"{article[:start_at]}{hl_token}{article[start_at:end_at]}{hl_token}{article[end_at:]}"
    logger.info(hl_context)
    model_input = tokenizer(
        hl_context,
        return_length=True
        )

    input_length = model_input['length'][0]
    if input_length > max_length:
        slice_length = int(max_length/2)
        mid_index = model_input['input_ids'].index(hl_token_id)
        new_input_ids = model_input['input_ids'][mid_index-slice_length:mid_index+slice_length]
        model_input['input_ids'] = new_input_ids
    return torch.LongTensor([model_input['input_ids']]), input_length

# router
@app.get("/", response_class=HTMLResponse)
async def root():
    with open("react/build/index.html","r",encoding="utf-8") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content, status_code=200)

@app.post("/en/generate-question")
async def generate_en_question(item:EnQGItem):
    article = item.article
    start_at = item.answer.start_at
    end_at = item.answer.end_at + 1
    
    input_ids,input_length = prepare_model_input_ids(article,start_at,end_at,en_tokenizer)
    outputs = en_model.generate(
        input_ids=input_ids,
        max_length=max_question_length,
        early_stopping=True,
        do_sample=False,
        num_beams=10,
        num_beam_groups=5,
        diversity_penalty=0.5,
        no_repeat_ngram_size=2,
        num_return_sequences=5
    )

    decode_questions = []
    for output in outputs:
        decode_question = en_tokenizer.decode(output, skip_special_tokens=True)
        decode_questions.append(decode_question)
    return QuestionAndAnswer(tag=item.answer.tag,start_at=item.answer.start_at,end_at=item.answer.end_at,questions=decode_questions)

# @app.post("/en/generate-question")


@app.post("/zh/generate-question")
async def generate_zh_question(item:ZhQGItem):
    article = item.article
    start_at = item.answer.start_at
    end_at = item.answer.end_at + 1
    
    input_ids,input_length = prepare_model_input_ids(article,start_at,end_at,zh_tokenizer)
    outputs = zh_model.generate(
        input_ids=input_ids,
        max_length=max_length+max_question_length,
        early_stopping=True,
        do_sample=False,
        num_beams=10,
        num_beam_groups=5,
        diversity_penalty=0.5,
        no_repeat_ngram_size=2,
        num_return_sequences=5,
        eos_token_id=zh_tokenizer.eos_token_id
    )

    decode_questions = []
    for output in outputs:
        decode_question = zh_tokenizer.decode(output[input_length:], skip_special_tokens=True)
        decode_question = decode_question.replace(" ","")
        decode_questions.append(decode_question)
    return QuestionAndAnswer(tag=item.answer.tag,start_at=item.answer.start_at,end_at=item.answer.end_at,questions=decode_questions)
    