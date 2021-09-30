from typing import List, Optional

from pydantic import BaseModel


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
    article: str
    answer: Answer


class EnQGItem(QGItem):
    class Config:
        schema_extra = {
            "example": {
                "article": "Harry Potter is a series of seven fantasy novels written by British author, J. K. Rowling.",
                "answer": {"tag": "J. K. Rowling", "start_at": 76, "end_at": 88},
            }
        }


class ZhQGItem(QGItem):
    class Config:
        schema_extra = {
            "example": {
                "article": "英國作家J·K·羅琳的兒童奇幻文學系列小說，描寫主角哈利波特在霍格華茲魔法學校7年學習生活中的冒險故事；該系列被翻譯成75種語言",
                "answer": {"tag": "冒險故事", "start_at": 47, "end_at": 50},
            }
        }


class DisItem(BaseModel):
    article: str
    answer: Answer
    question: str
    gen_quantity: int


class EnDisItem(DisItem):
    class Config:
        schema_extra = {
            "example": {
                "article": "Harry Potter is a series of seven fantasy novels written by British author, J. K. Rowling.",
                "answer": {"tag": "J. K. Rowling", "start_at": 76, "end_at": 88},
                "question": "Who wrote Harry Potter?",
                "gen_quantity": 3,
            }
        }


class ZhDisItem(DisItem):
    class Config:
        schema_extra = {
            "example": {
                "article": "英國作家J·K·羅琳的兒童奇幻文學系列小說，描寫主角哈利波特在霍格華茲魔法學校7年學習生活中的冒險故事；該系列被翻譯成75種語言",
                "answer": {"tag": "冒險故事", "start_at": 47, "end_at": 50},
                "question": "哈利波特是一本怎麼樣的小說?",
                "gen_quantity": 3,
            }
        }


class Distractors(BaseModel):
    distractors: List[str]


class QAExportOption(BaseModel):
    option: str
    is_answer: bool


class QAExportItem(BaseModel):
    context: str
    question: str
    options: List[QAExportOption]

    class Config:
        schema_extra = {
            "example": {
                "context": 'Humanity needs to "grow up" and deal with the issue of climate change, British Prime Minister Boris Johnson told world leaders at the United Nations General Assembly in New York on Wednesday. Johnson, a last-minute addition to the speakers\' list that day, slammed the world\'s inadequate response to the climate crisis and urged humanity to "listen to the warnings of the scientists," pointing to the Covid-19 pandemic as "an example of gloomy scientists being proved right."',
                "question": "Who is the prime minister of United Kingdom?",
                "options": [
                    {
                        "option": "The United Nations General Nations president",
                        "is_answer": False,
                    },
                    {
                        "option": "British Prime Ministeroris Johnson",
                        "is_answer": False,
                    },
                    {"option": "Boris Johnson", "is_answer": True},
                    {"option": "Boris Johnson's father.", "is_answer": False},
                ],
            }
        }
