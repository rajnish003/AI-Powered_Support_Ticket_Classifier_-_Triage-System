
from pathlib import Path

import joblib

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database.connection import Base, engine, get_db
from app.database import models
from app.database.schemas import (
    TicketResponse,
    TicketStatusUpdate
)


# 1. Create FastAPI application
app = FastAPI(
    title="AI Support Ticket Classifier",
    description="AI ticket classification and management API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 2. Create database tables automatically
Base.metadata.create_all(bind=engine)


# 3. Load trained ML model
MODEL_PATH = (
    Path(__file__).resolve().parent
    / "ml"
    / "ticket_model.joblib"
)

if not MODEL_PATH.exists():
    raise RuntimeError(f"Model not found: {MODEL_PATH}")

model = joblib.load(MODEL_PATH)


# 4. Incoming ticket request
class TicketRequest(BaseModel):

    text: str = Field(
        min_length=5,
        max_length=5000
    )


# 5. Home endpoint
@app.get("/")
def home():

    return {
        "message": "AI Support Ticket Classifier API is running"
    }


# 6. Predict and save ticket
@app.post(
    "/api/tickets/predict",
    response_model=TicketResponse
)
def predict_ticket(
    request: TicketRequest,
    db: Session = Depends(get_db)
):

    ticket_text = request.text.strip()

    if not ticket_text:
        raise HTTPException(
            status_code=422,
            detail="Ticket text cannot be empty"
        )

    # Predict ticket category
    category = model.predict([ticket_text])[0]

    # Calculate probabilities
    probabilities = model.predict_proba([ticket_text])[0]

    confidence = max(probabilities)

    # Create database ticket object
    new_ticket = models.Ticket(
        ticket_text=ticket_text,
        category=str(category),
        confidence=round(float(confidence), 4),
        status="Pending"
    )

    # Save ticket
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    return new_ticket


# 7. Get all tickets
@app.get(
    "/api/tickets",
    response_model=list[TicketResponse]
)
def get_all_tickets(
    db: Session = Depends(get_db)
):

    tickets = (
        db.query(models.Ticket)
        .order_by(models.Ticket.created_at.desc())
        .all()
    )

    return tickets


# 8. Get ticket by ID
@app.get(
    "/api/tickets/{ticket_id}",
    response_model=TicketResponse
)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    ticket = (
        db.query(models.Ticket)
        .filter(models.Ticket.id == ticket_id)
        .first()
    )

    if ticket is None:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    return ticket


# 9. Update ticket status
@app.patch(
    "/api/tickets/{ticket_id}/status",
    response_model=TicketResponse
)
def update_ticket_status(
    ticket_id: int,
    request: TicketStatusUpdate,
    db: Session = Depends(get_db)
):

    ticket = (
        db.query(models.Ticket)
        .filter(models.Ticket.id == ticket_id)
        .first()
    )

    if ticket is None:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    ticket.status = request.status

    db.commit()
    db.refresh(ticket)

    return ticket
