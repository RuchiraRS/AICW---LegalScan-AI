import tensorflow as tf
import os
import numpy as np

def evaluate_dummy():
    model_path = os.path.join(os.path.dirname(__file__), '../saved_models/cnn_model.keras')
    
    if not os.path.exists(model_path):
        print(f"Model not found at {model_path}. Please run train.py first.")
        return
        
    print(f"Loading model from {model_path}...")
    model = tf.keras.models.load_model(model_path)
    
    print("Generating dummy test data...")
    X_test = np.random.rand(5, 224, 224, 3)
    y_test = np.random.randint(0, 7, size=(5,))
    y_test_cat = tf.keras.utils.to_categorical(y_test, num_classes=7)
    
    print("Evaluating model...")
    loss, accuracy = model.evaluate(X_test, y_test_cat)
    print(f"Evaluation Results - Loss: {loss:.4f}, Accuracy: {accuracy:.4f}")

if __name__ == "__main__":
    evaluate_dummy()
