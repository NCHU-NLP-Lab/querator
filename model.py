from pydantic import BaseModel
from typing import Optional,List

class QuestionAndAnswer(BaseModel):
    tag: str
    start_at: int
    end_at: int
    questions: List[str] = []

class Answer(BaseModel):
    tag: str
    start_at: int
    end_at: int

class QGItem(BaseModel):
    article:str
    answer:Answer

class EnQGItem(QGItem):
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

class ZhQGItem(QGItem):
     class Config:
        schema_extra = {
            "example":{
                "article":"英國作家J·K·羅琳的兒童奇幻文學系列小說，描寫主角哈利波特在霍格華茲魔法學校7年學習生活中的冒險故事；該系列被翻譯成75種語言",
                "answer":{
                    "tag":"冒險故事",
                    "start_at":47,
                    "end_at":50
                }
            }
        }
