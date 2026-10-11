from fastapi import APIRouter, HTTPException

from app.schemas.faq import FAQCreate, FAQResponse, FAQUpdate
from app.services.faq_service import (
    create_faq, get_all_faqs, get_faq_by_id, update_faq, delete_faq
)

router = APIRouter(
    prefix="/api/faqs",
    tags=["FAQ"]
)

@router.post("/", response_model=FAQResponse)
async def add_faq(faq: FAQCreate):

    try:
        return create_faq(
            question=faq.question,
            answer=faq.answer
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/", response_model=list[FAQResponse])
async def get_faqs():

    try:
        return get_all_faqs()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/{faq_id}", response_model=FAQResponse)
async def get_faq(faq_id: str):

    try:
        faq = get_faq_by_id(faq_id)

        if not faq:
            raise HTTPException(status_code=404, detail="FAQ not found")

        return faq

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{faq_id}", response_model=FAQResponse)
async def edit_faq(faq_id: str, faq: FAQUpdate):

    try:
        updated = update_faq(
            faq_id=faq_id,
            question=faq.question,
            answer=faq.answer
        )

        if not updated:
            raise HTTPException(status_code=404, detail="FAQ not found")

        return updated

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{faq_id}")
async def remove_faq(faq_id: str):

    try:
        deleted = delete_faq(faq_id)

        if not deleted:
            raise HTTPException(status_code=404, detail="FAQ not found")

        return {"message": "FAQ deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))