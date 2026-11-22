
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class TicketResponse(BaseModel):

    id: int
    ticket_text: str
    category: str
    confidence: float
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TicketStatusUpdate(BaseModel):

    status: Literal["Pending", "In Progress", "Resolved"]
