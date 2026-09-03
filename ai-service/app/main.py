from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from typing import List
import uvicorn

from app.models.cnn_classifier import classify_image
from app.pipeline.quality_check import check_image_quality
from app.pipeline.ocr_engine import perform_ocr
from app.pipeline.nlp_extractor import extract_fields
from app.pipeline.rule_engine import evaluate_rules
from app.pipeline.evidence_generator import generate_evidence

app = FastAPI(title="LegalScan AI Service", version="1.0.0")

@app.post("/api/analyze/full-pipeline")
async def analyze_full_pipeline(
    inspection_id: str = Form(...),
    images: List[UploadFile] = File(...)
):
    if not images:
        raise HTTPException(status_code=400, detail="No images provided")

    all_extracted_data = {
        "mrp": [],
        "net_quantity": [],
        "manufacturer": []
    }
    all_violations = []
    total_confidence = 0.0
    processed_images_count = 0
    all_evidence = []
    quality_failures = []
    
    for image in images:
        image_bytes = await image.read()
        
        # 1. Quality Check
        quality = check_image_quality(image_bytes)
        if not quality['passed']:
            quality_failures.append(quality['message'])
            
        # 2. CNN Classification
        classification = classify_image(image_bytes)
        total_confidence += classification['confidence']
        
        # 3. OCR
        ocr_results = perform_ocr(image_bytes)
        
        # 4. Evidence Generation
        evidence_paths = generate_evidence(image_bytes, ocr_results, inspection_id)
        all_evidence.extend(evidence_paths)
        
        # 5. NLP Extraction
        fields = extract_fields(ocr_results)
        
        # Merge extracted fields (which are lists now)
        for k, v_list in fields.items():
            for v in v_list:
                if v not in all_extracted_data[k]:
                    all_extracted_data[k].append(v)
                
        processed_images_count += 1

    # 6. Rule Engine Evaluation
    violations = evaluate_rules(all_extracted_data, quality_failures)
    
    overall_confidence = total_confidence / processed_images_count if processed_images_count > 0 else 0.0

    return {
        "inspection_id": inspection_id,
        "declarations": [
            {"field": k, "value": ", ".join(v), "confidence": 90} for k, v in all_extracted_data.items() if v
        ],
        "violations": violations,
        "overall_confidence": overall_confidence,
        "evidence_files": all_evidence
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
