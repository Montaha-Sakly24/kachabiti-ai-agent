from fastapi import APIRouter, HTTPException

from app.schemas.order import OrderResponse
from app.services.order_service import list_new_orders, mark_order_handled

router = APIRouter(prefix="/api/orders", tags=["Orders"])


@router.get("/", response_model=list[OrderResponse])
async def get_orders():
    return list_new_orders()


@router.post("/{order_id}/handled")
async def handle_order(order_id: int):
    if not mark_order_handled(order_id):
        raise HTTPException(status_code=404, detail="Commande introuvable.")
    return {"message": "Commande marquée comme traitée."}