import cv2
import numpy as np

def check_image_quality(image_bytes: bytes) -> dict:
    """
    Analyzes image for blur (Laplacian variance) and glare (brightness threshold).
    Returns a dict with 'passed', 'blur_detected', 'glare_detected', and 'message'.
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        return {"passed": False, "message": "Invalid image format."}
        
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 1. Blur Detection using Laplacian Variance
    variance = cv2.Laplacian(gray, cv2.CV_64F).var()
    blur_threshold = 100.0  # Adjust based on camera/testing
    is_blurred = variance < blur_threshold
    
    # 2. Glare Detection using Brightness Histogram / Thresholding
    # Check if a significant percentage of pixels are fully blown out (white)
    _, thresholded = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY)
    white_pixels = cv2.countNonZero(thresholded)
    total_pixels = gray.shape[0] * gray.shape[1]
    glare_ratio = white_pixels / total_pixels
    glare_threshold = 0.05 # If >5% of image is pure white
    is_glare = glare_ratio > glare_threshold
    
    # Check for extreme overall brightness/darkness as a fallback
    mean_brightness = np.mean(gray)
    if mean_brightness > 220:
        is_glare = True
        
    passed = not (is_blurred or is_glare)
    
    message = "Image quality acceptable."
    if is_blurred and is_glare:
        message = "Image is blurred and contains significant glare. Please capture a clearer image."
    elif is_blurred:
        message = "Image is too blurred. Please capture a clearer image."
    elif is_glare:
        message = "Image contains significant glare. Please capture a clearer image without direct reflections."
        
    return {
        "passed": bool(passed),
        "blur_detected": bool(is_blurred),
        "glare_detected": bool(is_glare),
        "message": message,
        "variance": float(variance),
        "glare_ratio": float(glare_ratio)
    }
