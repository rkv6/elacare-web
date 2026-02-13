"""
ElaCare — Cardamom Leaf Disease Detection API
Flask server that loads a Keras .h5 model and exposes a /api/predict endpoint.
Run with:  py -3.13 ml_server.py
"""

import os, io, json
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS

# ── TensorFlow (import once, suppress info logs) ───────────────────────
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
import tensorflow as tf

# ── Config ──────────────────────────────────────────────────────────────
MODEL_PATH = os.environ.get(
    "MODEL_PATH",
    r"C:\Users\LEGION\Downloads\elacare_cardamom_model.h5",
)
IMG_SIZE = (224, 224)
CLASS_NAMES = ["blight", "healthy", "Phylosticta_LS"]

# Human-readable labels & per-class recommendations
CLASS_INFO = {
    "blight": {
        "label": "Leaf Blight",
        "status": "diseased",
        "recommendations": [
            "Remove and destroy severely affected leaves immediately",
            "Apply copper-based fungicide (Bordeaux mixture 1%)",
            "Improve air circulation by thinning dense canopy",
            "Avoid overhead irrigation — use drip instead",
            "Monitor surrounding plants for early signs of spread",
        ],
    },
    "healthy": {
        "label": "Healthy Leaf",
        "status": "healthy",
        "recommendations": [
            "Plant is in excellent health — no action needed",
            "Continue current watering and fertilization schedule",
            "Monitor regularly for any changes in leaf color or texture",
        ],
    },
    "Phylosticta_LS": {
        "label": "Phyllosticta Leaf Spot",
        "status": "diseased",
        "recommendations": [
            "Prune and remove infected leaves to limit inoculum",
            "Apply Mancozeb 75 WP (2 g/L) or Carbendazim spray",
            "Ensure proper drainage around the plant base",
            "Avoid water-splash on leaves during irrigation",
            "Apply potassium-rich fertilizer to boost leaf resistance",
        ],
    },
}

# ── Load model ──────────────────────────────────────────────────────────
# The .h5 was saved with Keras 3.  Re-create architecture and load weights only.
print(f"[ML] Rebuilding model architecture …")
base = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3), include_top=False, weights=None
)
base.trainable = False

model = tf.keras.Sequential([
    tf.keras.layers.InputLayer(shape=(224, 224, 3)),
    base,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(128, activation="relu"),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(3, activation="softmax"),
])

print(f"[ML] Loading weights from {MODEL_PATH} …")
model.load_weights(MODEL_PATH)
print(f"[ML] Model ready — input {model.input_shape}, output {model.output_shape}")

# ── Flask app ───────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)  # allow requests from Vite dev server (localhost:5173)


def preprocess(image_bytes: bytes) -> np.ndarray:
    """Resize to 224×224, convert to RGB float32 array normalised to [0,1]."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)
    arr = np.array(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)  # (1, 224, 224, 3)


@app.route("/api/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    try:
        image_bytes = file.read()
        tensor = preprocess(image_bytes)
        preds = model.predict(tensor, verbose=0)[0]  # (3,)

        top_idx = int(np.argmax(preds))
        class_key = CLASS_NAMES[top_idx]
        info = CLASS_INFO[class_key]

        return jsonify({
            "class": class_key,
            "label": info["label"],
            "confidence": round(float(preds[top_idx]) * 100, 1),
            "status": info["status"],
            "recommendations": info["recommendations"],
            "all_predictions": {
                CLASS_NAMES[i]: round(float(preds[i]) * 100, 1)
                for i in range(len(CLASS_NAMES))
            },
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": os.path.basename(MODEL_PATH)})


if __name__ == "__main__":
    print("[ML] Starting inference server on http://localhost:5001")
    app.run(host="0.0.0.0", port=5001, debug=False)
