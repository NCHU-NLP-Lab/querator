from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional,List
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# init model
model = AutoModelForSeq2SeqLM.from_pretrained("p208p2002/bart-squad-qg-hl")
tokenizer = AutoTokenizer.from_pretrained("p208p2002/bart-squad-qg-hl")

# config
max_length = 512
hl_token = '[HL]'
hl_token_id = tokenizer.convert_tokens_to_ids([hl_token])[0]

# 
app = FastAPI(
    title="Querator",
    description="NCHU NLP LAB - QG AI",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.mount("/static", StaticFiles(directory="react/build/static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# data format
class QuestionAndAnswer(BaseModel):
    tag: str
    start_at: int
    end_at: int
    questions: List[str] = []

class Answer(BaseModel):
    tag: str
    start_at: int
    end_at: int

class Item(BaseModel):
    article:str
    answer:Answer
    class Config:
        schema_extra = {
            "example": {
                "article": "Harry Potter is a series of seven fantasy novels written by British author, J. K. Rowling.",
                "answer":  {
                    "tag": "J. K. Rowling",
                    "start_at": 76,
                    "end_at": 88
                }
            }
        }

# router
@app.get("/", response_class=HTMLResponse)
async def root():
    with open("react/build/index.html","r",encoding="utf-8") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content, status_code=200)

@app.post("/generate-question")
async def generate_question(item:Item):
    article = item.article
    start_at = item.answer.start_at
    end_at = item.answer.end_at + 1
    hl_context = f"{article[:start_at]}{hl_token}{article[start_at:end_at]}{hl_token}{article[end_at:]}"
    print(hl_context)
    model_input = tokenizer(
        hl_context,
        return_length=True
        )

    input_length = model_input['length'][0]
    if input_length > max_length:
        slice_length = int(max_length/2)
        mid_index = model_input['input_ids'].index(hl_token_id)
        new_input_ids = model_input['input_ids'][mid_index-slice_length:mid_index+slice_length+1]
        model_input['input_ids'] = new_input_ids

    outputs = model.generate(
        input_ids=torch.LongTensor([model_input['input_ids']]),
        max_length=30,
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
        decode_question = tokenizer.decode(output, skip_special_tokens=True)
        decode_questions.append(decode_question)
    return QuestionAndAnswer(tag=item.answer.tag,start_at=item.answer.start_at,end_at=item.answer.end_at,questions=decode_questions)
    