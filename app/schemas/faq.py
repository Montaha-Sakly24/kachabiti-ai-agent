from pydantic import BaseModel, Field

class FAQCreate(BaseModel):
    question: str = Field(..., min_length=1)
    answer: str = Field(..., min_length=1)


class FAQUpdate(BaseModel):
     question: str = Field(..., min_length=1)
     answer: str = Field(..., min_length=1)


class FAQResponse(BaseModel):
    id: str
    question: str
    answer: str   
