import json
import os
from typing import List

from fastapi import BackgroundTasks, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from loguru import logger
from starlette.background import BackgroundTask
from transformers import (
    AutoModelForCausalLM,
    AutoModelForSeq2SeqLM,
    AutoTokenizer,
    BertTokenizerFast,
)

from config import max_length, max_question_length
from model import (
    Distractors,
    EnDisItem,
    EnQGItem,
    QAExportItem,
    QuestionAndAnswer,
    ZhDisItem,
    ZhQGItem,
)
from utils import (
    BartDistractorGeneration,
    delete_later,
    export_file,
    prepare_dis_model_input_ids,
    prepare_qg_model_input_ids,
)

# init nlp_model
# logger.info("start loading en models...")
# en_qg_path = "p208p2002/bart-squad-qg-hl"
# en_dis_path = "voidful/bart-distractor-generation"

# en_qg_model = AutoModelForSeq2SeqLM.from_pretrained(en_qg_path)
# en_qg_tokenizer = AutoTokenizer.from_pretrained(en_qg_path)
# en_dis_model = BartDistractorGeneration()
# logger.info("loading en models finished !")

# logger.info("start loading zh models...")
# zh_qg_path = "p208p2002/gpt2-drcd-qg-hl"
# zh_qg_model = AutoModelForCausalLM.from_pretrained(zh_qg_path)
# zh_qg_tokenizer = BertTokenizerFast.from_pretrained(zh_qg_path)
# logger.info("loading zh models finished !")

#
app = FastAPI(title="Querator", description="NCHU NLP LAB - QG AI", version="1.0.0")

origins = os.getenv(
    "allow_origins", "http://localhost:8000 http://localhost:3000"
).split()
app.mount("/react", StaticFiles(directory="react/build"), name="react")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# router
@app.get("/")
async def root():
    with open("react/build/index.html", "r", encoding="utf-8") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content, status_code=200)


@app.get("/distractor-mode")
async def distractor_mode():
    with open("react/build/index.html", "r", encoding="utf-8") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content, status_code=200)


@app.post("/export-qa-pairs/{format}")
async def export_qa_pairs(
    qa_pairs: List[QAExportItem], format: str, background_tasks: BackgroundTasks
):
    file_path = export_file(qa_pairs, format)
    background_tasks.add_task(delete_later, file_path)
    return FileResponse(
        file_path,
        filename=file_path.name,
        headers={"Access-Control-Expose-Headers": "Content-Disposition"},
    )


@app.post("/en/generate-question")
async def generate_en_question(item: EnQGItem):
    article = item.article
    start_at = item.answer.start_at
    end_at = item.answer.end_at + 1

    input_ids, input_length = prepare_qg_model_input_ids(
        article, start_at, end_at, en_qg_tokenizer
    )
    outputs = en_qg_model.generate(
        input_ids=input_ids,
        max_length=max_question_length,
        early_stopping=True,
        do_sample=False,
        num_beams=10,
        num_beam_groups=5,
        diversity_penalty=0.5,
        no_repeat_ngram_size=2,
        num_return_sequences=5,
    )

    decode_questions = []
    for output in outputs:
        decode_question = en_qg_tokenizer.decode(output, skip_special_tokens=True)
        decode_questions.append(decode_question)
    return QuestionAndAnswer(
        tag=item.answer.tag,
        start_at=item.answer.start_at,
        end_at=item.answer.end_at,
        questions=decode_questions,
    )


@app.post("/en/generate-distractor")
async def generate_en_distractor(item: EnDisItem):
    article = item.article
    answer = item.answer
    question = item.question
    gen_quantity = item.gen_quantity
    decodes = en_dis_model.generate_distractor(
        article, question, json.dumps(answer.dict()), gen_quantity
    )
    return Distractors(distractors=decodes)


@app.post("/zh/generate-question")
async def generate_zh_question(item: ZhQGItem):
    article = item.article
    start_at = item.answer.start_at
    end_at = item.answer.end_at + 1

    input_ids, input_length = prepare_qg_model_input_ids(
        article, start_at, end_at, zh_qg_tokenizer
    )
    outputs = zh_qg_model.generate(
        input_ids=input_ids,
        max_length=max_length + max_question_length,
        early_stopping=True,
        do_sample=False,
        num_beams=10,
        num_beam_groups=5,
        diversity_penalty=-10,
        no_repeat_ngram_size=2,
        num_return_sequences=5,
        eos_token_id=zh_qg_tokenizer.eos_token_id,
    )

    decode_questions = []
    for output in outputs:
        decode_question = zh_qg_tokenizer.decode(
            output[input_length:], skip_special_tokens=True
        )
        decode_question = decode_question.replace(" ", "")
        decode_questions.append(decode_question)
    return QuestionAndAnswer(
        tag=item.answer.tag,
        start_at=item.answer.start_at,
        end_at=item.answer.end_at,
        questions=decode_questions,
    )


@app.post("/zh/generate-distractor")
async def generate_zh_distractor(item: ZhDisItem):
    pass
