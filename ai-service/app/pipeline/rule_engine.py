import json
import os

def evaluate_rules(extracted_data: dict, quality_failures: list = None) -> list:
    """
    Evaluates extracted fields against predefined rules for the 5 scenarios.
    """
    violations = []
    
    # Check 1: Image Quality (Scenario 5)
    if quality_failures and len(quality_failures) > 0:
        for failure in quality_failures:
            violations.append({
                "rule_id": "IQA-001",
                "field": "image_quality",
                "requirement": "Clear image without severe blur or glare",
                "detected_value": "Blur/Glare Detected",
                "expected_value": "Clear Image",
                "severity": "HIGH",
                "confidence": 99.0,
                "explanation": failure
            })
    
    # Extract lists safely
    mrp_list = extracted_data.get("mrp", [])
    mfg_list = extracted_data.get("manufacturer", [])
    
    # Check 2: Missing MRP (Scenario 2)
    if len(mrp_list) == 0:
        violations.append({
            "rule_id": "LM-PC-MRP-001",
            "field": "mrp",
            "requirement": "Maximum Retail Price (MRP) must be declared",
            "detected_value": "Not Found",
            "expected_value": "Valid MRP",
            "severity": "HIGH",
            "confidence": 85.0,
            "explanation": "No MRP declaration found on the analyzed panels."
        })
        
    # Check 3: Conflicting MRP (Scenario 4)
    elif len(mrp_list) > 1:
        # Check if they are actually different values
        unique_mrps = list(set([float(x) for x in mrp_list if x.replace('.', '', 1).isdigit()]))
        if len(unique_mrps) > 1:
            violations.append({
                "rule_id": "LM-PC-MRP-002",
                "field": "mrp",
                "requirement": "MRP must be unambiguous and non-conflicting",
                "detected_value": f"Multiple: {mrp_list}",
                "expected_value": "Single MRP",
                "severity": "HIGH",
                "confidence": 95.0,
                "explanation": "Conflicting MRP declarations found across different panels."
            })
            
    # Check 4: Missing Manufacturer (Scenario 3)
    if len(mfg_list) == 0:
        violations.append({
            "rule_id": "LM-PC-MFG-001",
            "field": "manufacturer",
            "requirement": "Name and address of manufacturer/packer must be declared",
            "detected_value": "Not Found",
            "expected_value": "Manufacturer Details",
            "severity": "MEDIUM",
            "confidence": 80.0,
            "explanation": "Manufacturer or packer details are missing or unreadable."
        })
        
    return violations
