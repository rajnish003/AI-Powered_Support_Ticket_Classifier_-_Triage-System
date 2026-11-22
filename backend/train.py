
from pathlib import Path

import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)


# ==========================================
# 1. PROJECT PATHS
# ==========================================

BASE_DIR = Path(__file__).resolve().parent

DATA_PATH = BASE_DIR / "data" / "tickets.csv"

MODEL_DIR = BASE_DIR / "app" / "ml"

MODEL_PATH = MODEL_DIR / "ticket_model.joblib"


# ==========================================
# 2. LOAD DATASET
# ==========================================

df = pd.read_csv(DATA_PATH)

print("Dataset loaded successfully!")

print("Total tickets:", len(df))

print("\nDataset preview:")
print(df.head())


# ==========================================
# 3. DATA VALIDATION
# ==========================================

df = df.dropna(subset=["text", "category"])

df["text"] = df["text"].astype(str).str.strip()

df["category"] = df["category"].astype(str).str.strip().str.lower()

df = df[df["text"] != ""]

print("\nCategory distribution:")
print(df["category"].value_counts())


# ==========================================
# 4. SEPARATE FEATURES AND LABELS
# ==========================================

X = df["text"]

y = df["category"]


# ==========================================
# 5. TRAIN-TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining records:", len(X_train))

print("Testing records:", len(X_test))


# ==========================================
# 6. CREATE ML PIPELINE
# ==========================================

model = Pipeline([

    (
        "tfidf",
        TfidfVectorizer(
            lowercase=True,
            stop_words="english",
            ngram_range=(1, 2),
            min_df=1,
            sublinear_tf=True
        )
    ),

    (
        "classifier",
        LogisticRegression(
            max_iter=2000,
            random_state=42
        )
    )

])


# ==========================================
# 7. TRAIN THE MODEL
# ==========================================

print("\nTraining started...")

model.fit(X_train, y_train)

print("Model training completed!")


# ==========================================
# 8. MAKE TEST PREDICTIONS
# ==========================================

predictions = model.predict(X_test)


# ==========================================
# 9. EVALUATE THE MODEL
# ==========================================

accuracy = accuracy_score(y_test, predictions)

print("\n================================")
print("MODEL EVALUATION")
print("================================")

print(f"Accuracy: {accuracy:.4f}")

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        predictions,
        labels=model.classes_,
        zero_division=0
    )
)


# ==========================================
# 10. CONFUSION MATRIX
# ==========================================

matrix = confusion_matrix(
    y_test,
    predictions,
    labels=model.classes_
)

print("\nConfusion Matrix:")
print(matrix)

print("\nCategory order:")
print(model.classes_)


# ==========================================
# 11. SAVE TRAINED MODEL
# ==========================================

MODEL_DIR.mkdir(parents=True, exist_ok=True)

joblib.dump(model, MODEL_PATH)

print("\n================================")
print("MODEL SAVED SUCCESSFULLY!")
print("================================")

print("Saved at:", MODEL_PATH)
