import os
import tensorflow as tf
import numpy as np
import cv2

CLASSES = ["FRONT", "BACK", "LEFT", "RIGHT", "TOP", "BOTTOM", "UNCLEAR"]

class ImageClassifier:
    def __init__(self, model_path: str = None):
        self.model = None
        if model_path and os.path.exists(model_path):
            try:
                self.model = tf.keras.models.load_model(model_path)
            except Exception as e:
                print(f"Failed to load model from {model_path}: {e}")
                
    def classify(self, image_bytes: bytes) -> dict:
        """
        Classifies the image into one of the sides.
        """
        if self.model is None:
            # Dummy fallback if no model loaded
            return {"predicted_class": "UNCLEAR", "confidence": 0.0}
            
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return {"predicted_class": "UNCLEAR", "confidence": 0.0, "error": "Invalid image"}
            
        # Resize to expected input shape, e.g., 224x224 for MobileNetV2
        img = cv2.resize(img, (224, 224))
        img = img / 255.0
        img = np.expand_dims(img, axis=0)
        
        predictions = self.model.predict(img)
        pred_index = np.argmax(predictions[0])
        confidence = float(predictions[0][pred_index])
        
        return {
            "predicted_class": CLASSES[pred_index],
            "confidence": confidence
        }

# Singleton instance
classifier = ImageClassifier(model_path=os.path.join(os.path.dirname(__file__), '../../saved_models/cnn_model.keras'))

def classify_image(image_bytes: bytes) -> dict:
    return classifier.classify(image_bytes)
