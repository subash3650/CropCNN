# 🌾 CropCNN — AI Crop Classification System

CropCNN is a deep-learning-based crop image classification system that identifies agricultural crops from images.

The project uses **MobileNetV2 Transfer Learning** with ImageNet pretrained weights and classifies images into five crop categories:

- 🌽 Maize
- 🌾 Paddy
- 🎋 Sugarcane
- 🌻 Sunflower
- 🌾 Wheat

The trained model achieved **98.33% accuracy on an unseen test dataset**.

The project is a complete ML application with:

- Deep Learning model (MobileNetV2)
- FastAPI backend
- REST API
- React + Vite frontend
- Image upload and prediction
- Confidence score
- Model evaluation
- Confusion matrix
- Training/validation analysis

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Dataset](#-dataset)
- [Dataset Split](#-dataset-split)
- [Model](#-model)
- [Training Configuration](#-training-configuration)
- [Training Results](#-training-results)
- [Evaluation Results](#-evaluation-results)
- [Confusion Matrix](#-confusion-matrix)
- [Backend](#-backend)
- [API](#-api)
- [Frontend](#-frontend)
- [Project Structure](#-project-structure)
- [Running the Backend](#-running-the-backend)
- [Running the Frontend](#-running-the-frontend)
- [Testing the API](#-testing-the-api)
- [Technologies Used](#-technologies-used)
- [Limitations](#-limitations)
- [Future Improvements](#-future-improvements)

---

## 🚀 Project Overview

CropCNN is an image classification application designed to recognize agricultural crops from photographs.

The system follows this pipeline:

```text
                   Crop Image
                       │
                       ▼
              React + Vite Frontend
                       │
                       │ HTTP POST
                       ▼
                 FastAPI Backend
                       │
                       ▼
              Image Preprocessing
                       │
                       ▼
                MobileNetV2
              Transfer Learning
                       │
                       ▼
               Classification
                       │
                       ▼
             Crop + Confidence
```

Example:

```text
Input:
    Wheat crop image

Output:
    Crop: Wheat
    Confidence: 99.98%
```

---

## ✨ Features

### Machine Learning

- MobileNetV2-based image classification
- ImageNet pretrained weights
- Transfer learning
- Five crop classes
- Data augmentation
- Training/validation/test split
- Early stopping
- Best-model checkpointing

### Backend

- FastAPI REST API
- Image upload endpoint
- Image validation
- Model loaded once during application startup
- Prediction endpoint
- Health-check endpoint
- JSON prediction response
- CORS support for the local Vite dev server

### Frontend

The React + Vite frontend provides:

- Image upload and drag-and-drop
- Image preview
- Client-side image validation (type and 10 MB size limit)
- Prediction button with loading state
- Crop prediction with confidence percentage
- Backend health status indicator
- Error handling (invalid file, oversized file, backend offline)
- Responsive interface

---

## 🧠 Model

The project uses **MobileNetV2**:

```text
Pretrained weights: ImageNet
Input size:         224 × 224 × 3
Transfer learning:  Yes
Base model:         Frozen
```

The pretrained MobileNetV2 feature extractor is used to learn useful visual features.

A custom classification head was added:

```text
MobileNetV2
     │
     ▼
Global Average Pooling
     │
     ▼
Dropout (0.2)
     │
     ▼
Dense (128, ReLU)
     │
     ▼
Dropout (0.2)
     │
     ▼
Dense (5, Softmax)
     │
     ▼
Crop Class
```

The five output classes are:

```text
Maize
Paddy
Sugarcane
Sunflower
Wheat
```

---

## 📊 Dataset

A combined agricultural image dataset was prepared from crop image sources.

The final dataset contains:

```text
Total images:       800
Number of classes:  5
Images per class:   160
```

Final balanced dataset:

| Crop      |  Images |
| --------- | ------: |
| Maize     |     160 |
| Paddy     |     160 |
| Sugarcane |     160 |
| Sunflower |     160 |
| Wheat     |     160 |
| **Total** | **800** |

The dataset was intentionally balanced to avoid giving the model a class-frequency advantage.

---

## 📂 Dataset Split

The dataset was split into:

| Dataset    |  Images | Percentage |
| ---------- | ------: | ---------: |
| Training   |     560 |        70% |
| Validation |     120 |        15% |
| Testing    |     120 |        15% |
| **Total**  | **800** |   **100%** |

Each class contains:

```text
Training:     112 images
Validation:    24 images
Testing:       24 images
```

Therefore:

```text
5 × 112 = 560 training images
5 × 24  = 120 validation images
5 × 24  = 120 test images
```

---

## 🔧 Image Preprocessing

Images are resized to `224 × 224`, the input resolution used by MobileNetV2.

MobileNetV2 preprocessing (`preprocess_input`) is applied before prediction.

The training dataset uses augmentation:

```text
Random Horizontal Flip
Random Rotation (0.1)
Random Zoom (0.1)
```

Augmentation is applied only to the training data. Validation and test images are not augmented.

---

## ⚙️ Training Configuration

| Parameter          | Value                           |
| ------------------ | ------------------------------- |
| Model              | MobileNetV2                     |
| Pretrained weights | ImageNet                        |
| Input size         | 224 × 224                       |
| Batch size         | 32                              |
| Epochs             | 20                              |
| Optimizer          | Adam                            |
| Learning rate      | 0.001                           |
| Loss               | Sparse Categorical Crossentropy |
| Metric             | Accuracy                        |
| Classes            | 5                               |

The pretrained MobileNetV2 layers were frozen during training. Only the custom classification head was trained.

The training script is at `backend/training/train_model.py`.

---

## 🛡️ Training Callbacks

### EarlyStopping

```text
Monitors:    val_loss
Patience:    5
Restore best weights: True
```

This prevents unnecessary training and reduces overfitting.

### ModelCheckpoint

The best model is selected based on validation loss and saved to:

```text
backend/model/best_mobilenetv2.keras
```

---

## 📈 Training Results

During training, both training and validation accuracy improved significantly.

At the final epoch the model reached approximately:

```text
Training Accuracy:    96.43%
Validation Accuracy:  94.17%
```

The best validation accuracy observed during training was **95.83%**, with a validation loss of **0.1200** at Epoch 20.

The training and validation accuracy curves stay relatively close, and both loss curves decrease throughout training. Mild fluctuations exist between training and validation performance, but there is no severe overfitting.

> 📸 Suggested screenshots: place `training-accuracy.png` and `training-loss.png` in `docs/images/` and link them here.

---

## 🧪 Test Evaluation

The final evaluation was performed on the completely unseen test dataset:

```text
Test images: 120
```

Final result:

```text
Test Loss:       0.0578
Test Accuracy:   98.33%
```

The model correctly classified **118 / 120** images and incorrectly classified **2 / 120** images.

---

## 📊 Classification Report

| Class                |  Precision |     Recall |   F1-Score | Support |
| -------------------- | ---------: | ---------: | ---------: | ------: |
| Maize                |     95.83% |     95.83% |     95.83% |      24 |
| Paddy                |    100.00% |    100.00% |    100.00% |      24 |
| Sugarcane            |    100.00% |     95.83% |     97.87% |      24 |
| Sunflower            |    100.00% |    100.00% |    100.00% |      24 |
| Wheat                |     96.00% |    100.00% |     97.96% |      24 |
| **Macro Average**    | **98.37%** | **98.33%** | **98.33%** | **120** |
| **Weighted Average** | **98.37%** | **98.33%** | **98.33%** | **120** |

---

## 🔲 Confusion Matrix

```text
              Predicted
              Maize  Paddy  Sugarcane  Sunflower  Wheat
Actual
Maize           23     0       0          0        1
Paddy            0    24       0          0        0
Sugarcane        1     0      23          0        0
Sunflower        0     0       0         24        0
Wheat            0     0       0          0       24
```

> 📸 Suggested screenshot: place `confusion-matrix.png` in `docs/images/` and link it here.

---

## 🔍 Error Analysis

Only two incorrect predictions occurred in the test dataset:

```text
Error 1:  Actual: Maize      → Predicted: Wheat
Error 2:  Actual: Sugarcane  → Predicted: Maize
```

The main class confusion was therefore `Maize ↔ Wheat` and `Sugarcane → Maize`. Paddy, Sunflower, and Wheat had no false-negative predictions in the test set.

---

## ⚡ Backend

The backend is implemented using **FastAPI** and lives in `backend/app/main.py`.

Backend responsibilities:

1. Receive uploaded image
2. Validate the file is an image
3. Read and convert the image to RGB
4. Resize to 224 × 224
5. Apply MobileNetV2 preprocessing
6. Run model inference
7. Select the highest-probability class
8. Return crop and confidence

The trained model is loaded once when the FastAPI application starts, avoiding reloading it for every request.

---

## 🔌 API

Backend dev server: `http://127.0.0.1:8000`

### Root endpoint

```http
GET /
```

```json
{
  "message": "Crop Classification API is running"
}
```

### Health endpoint

```http
GET /health
```

```json
{
  "status": "healthy",
  "model": "MobileNetV2"
}
```

### Prediction endpoint

```http
POST /predict
```

Accepts `multipart/form-data` with the uploaded image field `file`.

```json
{
  "crop": "Wheat",
  "confidence": 0.9998,
  "confidence_percent": 99.98
}
```

### Interactive docs

Open `http://127.0.0.1:8000/docs` for the auto-generated Swagger UI.

---

## 🌐 Frontend

The frontend is implemented with **React 19 + Vite** (JavaScript + plain CSS) in `frontend/`.

Frontend source layout:

```text
frontend/src/
├── App.jsx                    # main app state and flow
├── main.jsx                   # React entry point
├── index.css                  # global styles
├── components/
│   ├── Header.jsx             # page header
│   ├── BackendStatus.jsx      # live backend health indicator
│   ├── ImageUploader.jsx      # upload / drag-and-drop
│   ├── ImagePreview.jsx       # selected image preview
│   ├── LoadingState.jsx       # loading spinner
│   ├── PredictionResult.jsx   # crop + confidence result card
│   └── About.jsx              # about section
├── services/
│   └── api.js                 # fetch calls to the backend
└── utils/
    └── imageUtils.js          # client-side image validation
```

Frontend workflow:

```text
User
 │
 ▼
Select Image
 │
 ▼
Image Preview
 │
 ▼
Click "Classify Crop"
 │
 ▼
POST /predict
 │
 ▼
FastAPI
 │
 ▼
MobileNetV2
 │
 ▼
Prediction JSON
 │
 ▼
Result Card (Crop + Confidence)
```

The frontend provides image validation, loading state, backend health status, error handling, and a responsive layout.

---

## 🏗️ Application Architecture

```text
                    ┌─────────────────────┐
                    │       USER          │
                    │    Crop Image       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React + Vite      │
                    │     Frontend        │
                    │  http://localhost:5173
                    └──────────┬──────────┘
                               │
                         HTTP REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │      FastAPI        │
                    │      Backend        │
                    │  http://127.0.0.1:8000
                    │                     │
                    │ GET  /              │
                    │ GET  /health        │
                    │ POST /predict       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Preprocessing    │
                    │  224 × 224 + MobileNetV2 preprocessing
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     MobileNetV2     │
                    │ ImageNet pretrained │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Prediction      │
                    │  Crop + Confidence  │
                    └─────────────────────┘
```

---

## 📁 Project Structure

```text
CropCNN/
│
├── backend/
│   ├── app/
│   │   └── main.py              # FastAPI application
│   ├── model/                   # trained model (gitignored)
│   │   └── best_mobilenetv2.keras
│   ├── training/
│   │   └── train_model.py       # MobileNetV2 training script
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── docs/
│   └── images/                  # screenshots (training curves, confusion matrix)
│
├── .gitignore
└── README.md
```

---

## 🐍 Running the Backend

### 1. Clone the repository

```bash
git clone https://github.com/subash3650/CropCNN.git
cd CropCNN
```

### 2. Create a virtual environment

Windows:

```powershell
python -m venv .venv
.venv\Scripts\activate
```

### 3. Install dependencies

```powershell
pip install -r backend\requirements.txt
```

### 4. Start FastAPI

From the repository root:

```powershell
uvicorn backend.app.main:app --reload
```

The backend runs at `http://127.0.0.1:8000`.

Swagger UI is available at `http://127.0.0.1:8000/docs`.

---

## ⚛️ Running the Frontend

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env` from the example:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

The frontend is available at `http://localhost:5173`.

Other scripts:

- `npm run build` — production build to `dist/`
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build

---

## 🧪 Testing the API

With the backend running, send a test request with curl:

```bash
curl -X POST http://127.0.0.1:8000/predict -F "file=@wheat.jpg"
```

Expected response:

```json
{
  "crop": "Wheat",
  "confidence": 0.9998,
  "confidence_percent": 99.98
}
```

Or use the Swagger UI at `http://127.0.0.1:8000/docs` to upload an image from the browser.

---

## 🛠️ Technologies Used

### Machine Learning

- Python
- TensorFlow
- Keras
- MobileNetV2
- NumPy

### Backend

- Python
- FastAPI
- Uvicorn
- Pillow
- TensorFlow

### Frontend

- React
- Vite
- JavaScript
- CSS

### Development

- Google Colab
- Git
- GitHub
- VS Code

---

## ⚠️ Limitations

Although the model achieved 98.33% accuracy on the test dataset, it will not necessarily achieve 98.33% accuracy on every real-world agricultural image.

The dataset is relatively small (800 total images) and contains only five crop categories.

Real-world images can have:

- Different lighting and camera qualities
- Different backgrounds and viewpoints
- Different crop growth stages
- Occlusion and multiple plants in one image
- Disease or damage
- Different geographical conditions

Therefore the test accuracy should be interpreted as performance on this prepared test dataset.

---

## 🚀 Future Improvements

1. **Larger dataset** — collect more images per crop category.
2. **More crop classes** — expand beyond Maize, Paddy, Sugarcane, Sunflower, Wheat.
3. **Fine-tuning** — unfreeze selected MobileNetV2 layers and train with a low learning rate.
4. **Real-world data** — collect images from real farms and varied conditions.
5. **Mobile / edge deployment** — convert the model to TensorFlow Lite or ONNX.
6. **Cloud deployment** — deploy the FastAPI backend and host the frontend separately.
7. **Agricultural decision support** — combine classification with disease detection, crop health, soil/weather information, and irrigation recommendations.

---

## 👨‍💻 Author

**Subash**

GitHub: `https://github.com/subash3650`

Project: `https://github.com/subash3650/CropCNN`

---

## 📄 License

Add an appropriate open-source license to the repository if required.

---

## ⭐ Summary

CropCNN is an end-to-end machine learning application for agricultural crop classification:

```text
Dataset
   ↓
Preprocessing
   ↓
Data Augmentation
   ↓
MobileNetV2 Transfer Learning
   ↓
Model Training
   ↓
Evaluation
   ↓
FastAPI REST API
   ↓
React + Vite Frontend
   ↓
Crop Prediction
```

Final test performance: **98.33% accuracy on 120 unseen test images**, classifying **Maize, Paddy, Sugarcane, Sunflower, and Wheat**.