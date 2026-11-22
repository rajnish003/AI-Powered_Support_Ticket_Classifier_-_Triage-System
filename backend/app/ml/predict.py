"""Prediction and inference module for support ticket classification."""

from pathlib import Path
from typing import Any, Dict, List
import joblib

# Paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "ticket_model.joblib"

# Cached model instance
_model = None


def get_model():
    """Load and cache the trained pipeline model."""
    global _model
    if _model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Model file not found at {MODEL_PATH}. "
                "Please run train.py first to generate the model."
            )
        _model = joblib.load(MODEL_PATH)
    return _model


def predict(text: str) -> Dict[str, Any]:
    """
    Predict the category and confidence for a single support ticket text.

    Args:
        text: Support ticket content.

    Returns:
        dict containing 'category', 'confidence', and class 'probabilities'.
    """
    if not text or not text.strip():
        return {
            "text": text,
            "category": "unknown",
            "confidence": 0.0,
            "probabilities": {},
        }

    model = get_model()
    cleaned_text = str(text).strip()

    # Predict category
    predicted_category = model.predict([cleaned_text])[0]

    # Predict probabilities if supported
    probabilities = {}
    confidence = 1.0

    if hasattr(model, "predict_proba"):
        probs = model.predict_proba([cleaned_text])[0]
        classes = model.classes_
        probabilities = {
            cls_name: round(float(prob), 4)
            for cls_name, prob in zip(classes, probs)
        }
        confidence = probabilities.get(predicted_category, float(max(probs)))

    return {
        "text": cleaned_text,
        "category": predicted_category,
        "confidence": confidence,
        "probabilities": probabilities,
    }


def predict_batch(texts: List[str]) -> List[Dict[str, Any]]:
    """Predict categories for a batch of ticket texts."""
    return [predict(text) for text in texts]


if __name__ == "__main__":
    import sys

    # Support command-line argument: python -m app.ml.predict "ticket text"
    if len(sys.argv) > 1:
        input_text = " ".join(sys.argv[1:])
        result = predict(input_text)
        print("\nPrediction Result:")
        print("------------------")
        print(f"Ticket     : {result['text']}")
        print(f"Category   : {result['category']}")
        print(f"Confidence : {result['confidence']:.2%}")
        print("Probabilities:")
        for cat, prob in result["probabilities"].items():
            print(f"  - {cat:10s}: {prob:.2%}")
    else:
        sample_tickets = [
            "My credit card was charged twice for one subscription order",
            "I cannot log into my account, password reset email never arrives",
            "The web portal shows an internal 500 error when clicking submit",
            "Suspicious login activity detected from an unknown device",
            "Where can I find documentation about your company policies?",
        ]

        print("=" * 60)
        print("SUPPORT TICKET CLASSIFIER - SAMPLE PREDICTIONS")
        print("=" * 60)

        for ticket in sample_tickets:
            res = predict(ticket)
            print(f"\nTicket     : {res['text']}")
            print(f"Category   : {res['category'].upper()}")
            print(f"Confidence : {res['confidence']:.2%}")
            print("Probabilities:")
            for cat, prob in res["probabilities"].items():
                print(f"  - {cat:10s}: {prob:.2%}")

        print("\n" + "=" * 60)
        print("Inference test completed successfully!")
        print("=" * 60)

