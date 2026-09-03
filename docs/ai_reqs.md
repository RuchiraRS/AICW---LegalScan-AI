The original requirements for the project are saved here for subagents.
See `C:\Users\RuchiRS22\.gemini\antigravity\brain\99315f90-ce7e-4369-a822-ccb17006138a\task.md` for current progress.

AI SERVICE REQ:
- Python FastAPI application inside `c:\Ruchira\AICW Project - LegalScan AI\LegalScan-AI\ai-service`.
- Needs to implement endpoints for full pipeline analysis.
- The pipeline: Image Quality -> CNN -> OCR -> NLP -> Rule Engine -> Evidence.
- **CNN (Phase 6)**: Implement a basic Keras/TensorFlow model for classification (FRONT, BACK, LEFT, RIGHT, TOP, BOTTOM, UNCLEAR). Use a lightweight model like MobileNetV2 or a custom CNN. Create dummy training scripts (`train.py`, `evaluate.py`) in `training/` that show how one would train it.
- **Image Quality (Phase 7)**: OpenCV based blur/brightness/glare detection.
- **OCR (Phase 8)**: Use `easyocr` to extract text and bounding boxes.
- **NLP (Phase 9)**: Extract fields (MRP, Net Quantity, Manufacturer, etc.) using regex and basic text processing.
- **Rule Engine (Phase 10)**: Create a JSON-based rule engine (`rules/default_rules.json`) and logic to evaluate extracted NLP fields against conditions (e.g. "mrp must exist").
- **Evidence (Phase 11)**: Generate crop images for detected text using bounding boxes and save to `../evidence/`.
- **FastAPI (Phase 12)**: `app/main.py` should expose POST `/api/analyze/full-pipeline`. It takes `inspection_id` and multiple `images` files. It returns a JSON with `declarations`, `violations`, `overall_confidence`.
