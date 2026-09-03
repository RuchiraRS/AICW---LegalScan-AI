import cv2
import numpy as np
import os
import uuid

EVIDENCE_DIR = os.path.join(os.path.dirname(__file__), '../../../evidence')

def generate_evidence(image_bytes: bytes, ocr_results: list, inspection_id: str) -> list:
    """
    Generates cropped images for extracted text to serve as evidence.
    Returns list of paths to evidence files.
    """
    if not os.path.exists(EVIDENCE_DIR):
        os.makedirs(EVIDENCE_DIR)
        
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        return []
        
    evidence_paths = []
    
    for idx, result in enumerate(ocr_results):
        bbox = result['bbox']
        # bbox points: [tl, tr, br, bl]
        xs = [pt[0] for pt in bbox]
        ys = [pt[1] for pt in bbox]
        
        x_min, x_max = max(0, min(xs)), min(img.shape[1], max(xs))
        y_min, y_max = max(0, min(ys)), min(img.shape[0], max(ys))
        
        # Crop the image
        if y_max > y_min and x_max > x_min:
            crop = img[y_min:y_max, x_min:x_max]
            
            filename = f"evidence_{inspection_id}_{uuid.uuid4().hex[:8]}.jpg"
            filepath = os.path.join(EVIDENCE_DIR, filename)
            
            cv2.imwrite(filepath, crop)
            evidence_paths.append(filepath)
            
    return evidence_paths
