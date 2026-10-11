from datetime import datetime, timezone
from sqlmodel import Session, select

from app.core.db import engine
from app.models.order import Order

def has_pending_order(channel: str, sender_id: str) -> bool:
    with Session(engine) as session:
        statement = select(Order).where(
            Order.channel == channel,
            Order.sender_id == sender_id,
            Order.status == "new",
        )
        return session.exec(statement).first() is not None


def create_order(
    channel: str,
    sender_id: str,
    sender_name: str | None,
    customer_name: str,
    phone: str,
    address: str,
    height: str = "",
    weight: str = "",
    product_hint: str = "",
    quantity: str = "",
):
    with Session(engine) as session:
        order = Order(
            channel=channel,
            sender_id=sender_id,
            sender_name=sender_name,
            customer_name=customer_name,
            phone=phone,
            address=address,
            height=height or None,
            weight=weight or None,
            product_hint=product_hint or None,
            quantity=quantity or None,
        )
        session.add(order)
        session.commit()


def list_new_orders():
    with Session(engine) as session:
        statement = (
            select(Order)
            .where(Order.status == "new")
            .order_by(Order.created_at.desc())
        )
        return session.exec(statement).all()


def mark_order_handled(order_id: int) -> bool:
    with Session(engine) as session:
        order = session.get(Order, order_id)
        if not order:
            return False
        order.status = "handled"
        order.handled_at = datetime.now(timezone.utc)
        session.add(order)
        session.commit()
        return True