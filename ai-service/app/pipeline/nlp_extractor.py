import re

def extract_fields(ocr_results: list) -> dict:
    """
    Extracts key fields like MRP, Net Quantity, Manufacturer from OCR results.
    Returns a dict of lists to handle multiple detections across angles.
    """
    full_text = " ".join([item['text'] for item in ocr_results])
    
    extracted = {
        "mrp": [],
        "net_quantity": [],
        "manufacturer": []
    }
    
    # MRP extraction
    mrp_matches = re.finditer(r'(?i)(?:mrp|rs\.?|,1|rupees|₹)\s*[:\.-]?\s*(\d+(?:\.\d{1,2})?)', full_text)
    for match in mrp_matches:
        val = match.group(1).strip()
        if val not in extracted["mrp"]:
            extracted["mrp"].append(val)
        
    # Net Quantity extraction
    qty_matches = re.finditer(r'(?i)(\d+(?:\.\d+)?)\s*(kg|g|ml|l|litre|grams)\b', full_text)
    for match in qty_matches:
        val = f"{match.group(1)}{match.group(2).lower()}"
        if val not in extracted["net_quantity"]:
            extracted["net_quantity"].append(val)
        
    # Manufacturer / Packed by
    mfg_matches = re.finditer(r'(?i)(?:manufactured by|mfg by|pkd by|packed by|marketed by)\s*[:-]?\s*([^,.\n]+)', full_text)
    for match in mfg_matches:
        val = match.group(1).strip()
        if len(val) > 3 and val not in extracted["manufacturer"]:
            extracted["manufacturer"].append(val)
            
    return extracted
