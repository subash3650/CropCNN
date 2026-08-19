"""
CropCNN - Crop Classification Model Training

Model:
    MobileNetV2 Transfer Learning

Classes:
    Maize
    Paddy
    Sugarcane
    Sunflower
    Wheat

Dataset:
    800 balanced images
    160 images per class

Split:
    Training    : 560 images
    Validation  : 120 images
    Testing     : 120 images

Input:
    224 x 224 RGB images

Training:
    Optimizer   : Adam
    Learning Rate: 0.001
    Epochs      : 20
    Batch Size  : 32

Final test accuracy:
    98.33%
"""

import os
import json
import random
import numpy as np
import tensorflow as tf

from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from tensorflow.keras.optimizers import Adam


# ============================================================
# Configuration
# ============================================================

SEED = 42

random.seed(SEED)
np.random.seed(SEED)
tf.random.set_seed(SEED)

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 20

NUM_CLASSES = 5

CLASS_NAMES = [
    "Maize",
    "Paddy",
    "Sugarcane",
    "Sunflower",
    "Wheat"
]

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

DATASET_DIR = os.path.join(
    BASE_DIR,
    "dataset"
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "model"
)

os.makedirs(MODEL_DIR, exist_ok=True)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "best_mobilenetv2.keras"
)


# ============================================================
# Load Dataset
# ============================================================

train_dir = os.path.join(
    DATASET_DIR,
    "train"
)

validation_dir = os.path.join(
    DATASET_DIR,
    "validation"
)

test_dir = os.path.join(
    DATASET_DIR,
    "test"
)


train_ds = tf.keras.utils.image_dataset_from_directory(
    train_dir,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=True,
    seed=SEED
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    validation_dir,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False
)

test_ds = tf.keras.utils.image_dataset_from_directory(
    test_dir,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False
)


print("Classes:", train_ds.class_names)


# ============================================================
# Data Augmentation
# ============================================================

data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1)
])


# ============================================================
# Preprocessing
# ============================================================

train_ds = train_ds.map(
    lambda x, y: (
        preprocess_input(
            data_augmentation(x, training=True)
        ),
        y
    ),
    num_parallel_calls=tf.data.AUTOTUNE
)

val_ds = val_ds.map(
    lambda x, y: (
        preprocess_input(x),
        y
    ),
    num_parallel_calls=tf.data.AUTOTUNE
)

test_ds = test_ds.map(
    lambda x, y: (
        preprocess_input(x),
        y
    ),
    num_parallel_calls=tf.data.AUTOTUNE
)


train_ds = train_ds.prefetch(
    tf.data.AUTOTUNE
)

val_ds = val_ds.prefetch(
    tf.data.AUTOTUNE
)

test_ds = test_ds.prefetch(
    tf.data.AUTOTUNE
)


# ============================================================
# MobileNetV2 Base Model
# ============================================================

base_model = MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet"
)

# Freeze pretrained layers
base_model.trainable = False


# ============================================================
# Classification Head
# ============================================================

model = models.Sequential([
    base_model,

    layers.GlobalAveragePooling2D(),

    layers.Dropout(0.2),

    layers.Dense(
        128,
        activation="relu"
    ),

    layers.Dropout(0.2),

    layers.Dense(
        NUM_CLASSES,
        activation="softmax"
    )
])


# ============================================================
# Compile
# ============================================================

model.compile(
    optimizer=Adam(
        learning_rate=0.001
    ),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)


model.summary()


# ============================================================
# Callbacks
# ============================================================

early_stopping = EarlyStopping(
    monitor="val_loss",
    patience=5,
    restore_best_weights=True
)

checkpoint = ModelCheckpoint(
    MODEL_PATH,
    monitor="val_loss",
    save_best_only=True,
    mode="min"
)


# ============================================================
# Training
# ============================================================

history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    callbacks=[
        early_stopping,
        checkpoint
    ]
)


# ============================================================
# Test Evaluation
# ============================================================

test_loss, test_accuracy = model.evaluate(
    test_ds,
    verbose=1
)

print()
print("Final Test Loss:", test_loss)
print("Final Test Accuracy:", test_accuracy)


# ============================================================
# Save Training History
# ============================================================

history_path = os.path.join(
    MODEL_DIR,
    "training_history.json"
)

with open(
    history_path,
    "w"
) as file:

    json.dump(
        history.history,
        file,
        indent=4
    )


# ============================================================
# Save Configuration
# ============================================================

config = {
    "model": "MobileNetV2",
    "pretrained_weights": "ImageNet",
    "input_size": "224x224",
    "classes": CLASS_NAMES,
    "dataset_size": 800,
    "images_per_class": 160,
    "train_images": 560,
    "validation_images": 120,
    "test_images": 120,
    "batch_size": BATCH_SIZE,
    "epochs": EPOCHS,
    "optimizer": "Adam",
    "learning_rate": 0.001,
    "augmentation": [
        "Random horizontal flip",
        "Random rotation",
        "Random zoom"
    ],
    "test_accuracy": float(test_accuracy)
}

config_path = os.path.join(
    MODEL_DIR,
    "training_config.json"
)

with open(
    config_path,
    "w"
) as file:

    json.dump(
        config,
        file,
        indent=4
    )


print()
print("Training completed.")
print("Best model:", MODEL_PATH)
print("Training history:", history_path)
print("Configuration:", config_path)