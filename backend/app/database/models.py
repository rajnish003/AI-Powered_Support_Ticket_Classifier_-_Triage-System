
from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from app.database.connection import Base


class Ticket(Base):

    __tablename__ = "tickets"

    # Unique ticket ID
    id = Column(Integer, primary_key=True, index=True)

    # Original customer complaint
    ticket_text = Column(String(5000), nullable=False)

    # ML predicted category
    category = Column(String(50), nullable=False)

    # ML prediction confidence
    confidence = Column(Float, nullable=False)

    # Ticket resolution status
    status = Column(
        String(30),
        default="Pending",
        nullable=False
    )

    # Ticket creation date and time
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )
