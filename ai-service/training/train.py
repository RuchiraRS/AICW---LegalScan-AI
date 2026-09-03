import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os
import numpy as np
import cv2

CLASSES = ['FRONT', 'BACK', 'LEFT', 'RIGHT', 'TOP', 'BOTTOM', 'GLARE']
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 5

def create_model(num_classes=len(CLASSES)):
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(IMG_SIZE, IMG_SIZE, 3))
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    predictions = Dense(num_classes, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    
    for layer in base_model.layers:
        layer.trainable = False
        
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    return model

def generate_synthetic_dataset(base_dir):
    """Generate synthetic images if real dataset is not present."""
    print("Generating synthetic dataset for multi-angle and glare scenarios...")
    for cls in CLASSES:
        cls_dir = os.path.join(base_dir, cls)
        os.makedirs(cls_dir, exist_ok=True)
        # Create 10 dummy images per class
        for i in range(10):
            img = np.random.randint(0, 255, (IMG_SIZE, IMG_SIZE, 3), dtype=np.uint8)
            if cls == 'GLARE':
                # Add a bright spot to simulate glare
                cv2.circle(img, (IMG_SIZE//2, IMG_SIZE//2), 50, (255, 255, 255), -1)
            else:
                # Add text to simulate product panels
                cv2.putText(img, cls, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 2)
            cv2.imwrite(os.path.join(cls_dir, f'img_{i}.png'), img)

def train_model(dataset_dir):
    print("Initializing training for LegalScan Multi-Angle CNN...")
    
    # Check if dataset exists, if not generate synthetic data
    if not os.path.exists(dataset_dir) or len(os.listdir(dataset_dir)) == 0:
        generate_synthetic_dataset(dataset_dir)
        
    datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        validation_split=0.2
    )
    
    train_generator = datagen.flow_from_directory(
        dataset_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )
    
    val_generator = datagen.flow_from_directory(
        dataset_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )
    
    model = create_model()
    
    print("Starting training...")
    model.fit(
        train_generator,
        epochs=EPOCHS,
        validation_data=val_generator
    )
    
    save_dir = os.path.join(os.path.dirname(__file__), '../app/models/saved_models')
    os.makedirs(save_dir, exist_ok=True)
        
    model_path = os.path.join(save_dir, 'cnn_model.keras')
    model.save(model_path)
    print(f"Training Complete! Model saved to {model_path}")

if __name__ == "__main__":
    dataset_path = os.path.join(os.path.dirname(__file__), 'synthetic_dataset')
    train_model(dataset_path)
