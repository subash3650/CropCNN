import os

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io


app = FastAPI(
    title="Crop Classification API",
    description="API for classifying crop images using MobileNetV2.",
    version="1.0.0"
)


# Allow the local Vite development server to reach the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "best_mobilenetv2.keras"
)


# Classes must match the training order
CLASS_NAMES = [
    "Maize",
    "Paddy",
    "Sugarcane",
    "Sunflower",
    "Wheat"
]

IMG_SIZE = (224, 224)


# Load model once when the backend starts
model = tf.keras.models.load_model(MODEL_PATH)


@app.get("/")
def root():
    return {
        "message": "Crop Classification API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "MobileNetV2"
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file."
        )

    try:
        # Read uploaded image
        contents = await file.read()

        image = Image.open(
            io.BytesIO(contents)
        ).convert("RGB")

        # Resize
        image = image.resize(IMG_SIZE)

        # Convert to NumPy array
        image_array = np.array(image, dtype=np.float32)

        # Add batch dimension
        image_array = np.expand_dims(
            image_array,
            axis=0
        )

        # MobileNetV2 preprocessing
        image_array = tf.keras.applications.mobilenet_v2.preprocess_input(
            image_array
        )

        # Prediction
        predictions = model.predict(
            image_array,
            verbose=0
        )

        predicted_index = int(
            np.argmax(predictions[0])
        )

        predicted_class = CLASS_NAMES[predicted_index]

        confidence = float(
            predictions[0][predicted_index]
        )

        return {
            "crop": predicted_class,
            "confidence": round(confidence, 4),
            "confidence_percent": round(confidence * 100, 2)
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )