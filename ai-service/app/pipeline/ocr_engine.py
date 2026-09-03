import easyocr
import numpy as np
import cv2

reader = easyocr.Reader(['en'], gpu=False) # initialize once

def perform_ocr(image_bytes: bytes) -> list:
    """
    Extracts text and bounding boxes from an image using EasyOCR.
    Returns a list of dicts: [{'text': str, 'bbox': [[x,y], [x,y], [x,y], [x,y]], 'confidence': float}]
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        return []
        
    results = reader.readtext(img)
    
    extracted_data = []
    for bbox, text, prob in results:
        # bbox is a list of 4 points: [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]
        extracted_data.append({
            "text": text,
            "bbox": [[int(coord[0]), int(coord[1])] for coord in bbox],
            "confidence": float(prob)
        })
        
    return extracted_data
