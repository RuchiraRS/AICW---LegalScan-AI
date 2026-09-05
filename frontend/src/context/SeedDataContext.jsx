import React, { createContext, useContext, useState } from 'react';

const SeedDataContext = createContext();

export const useSeedData = () => useContext(SeedDataContext);

export const SeedDataProvider = ({ children }) => {
  const [rules, setRules] = useState([
    { id: 'LMR-01', rule: 'Manufacturer Name & Address', section: 'Rule 6(1)(a) of Legal Metrology (PC) Rules, 2011', status: 'Active' },
    { id: 'LMR-02', rule: 'Generic Name of Commodity', section: 'Rule 6(1)(b) of Legal Metrology (PC) Rules, 2011', status: 'Active' },
    { id: 'LMR-03', rule: 'Net Quantity Declaration', section: 'Rule 6(1)(c) of Legal Metrology (PC) Rules, 2011', status: 'Active' },
    { id: 'LMR-04', rule: 'Month & Year of Manufacture', section: 'Rule 6(1)(d) of Legal Metrology (PC) Rules, 2011', status: 'Active' },
    { id: 'LMR-05', rule: 'MRP (Inclusive of all taxes)', section: 'Rule 6(1)(e) of Legal Metrology (PC) Rules, 2011', status: 'Active' },
    { id: 'LMR-06', rule: 'Consumer Care Details', section: 'Rule 6(1)(f) of Legal Metrology (PC) Rules, 2011', status: 'Active' },
    { id: 'FSSAI-01', rule: 'Veg/Non-Veg Logo', section: 'FSSAI Packaging & Labeling Regulations', status: 'Active' },
    { id: 'FSSAI-02', rule: 'Nutritional Information', section: 'FSSAI Packaging & Labeling Regulations', status: 'Active' },
  ]);

  const [manufacturers, setManufacturers] = useState([
    { id: 'MFG-001', name: 'Mondelez India', location: 'Mumbai, Maharashtra', status: 'Active', complianceScore: 92 },
    { id: 'MFG-002', name: 'Nestle India', location: 'Gurugram, Haryana', status: 'Active', complianceScore: 88 },
    { id: 'MFG-003', name: 'GCMMF (Amul)', location: 'Anand, Gujarat', status: 'Active', complianceScore: 95 },
  ]);

  const [products, setProducts] = useState([
    { id: 'PRD-001', name: 'Oreo Biscuits', weight: '120g', manufacturerId: 'MFG-001', category: 'Food' },
    { id: 'PRD-002', name: 'Maggi Noodles', weight: '70g', manufacturerId: 'MFG-002', category: 'Food' },
    { id: 'PRD-003', name: 'Amul Butter', weight: '500g', manufacturerId: 'MFG-003', category: 'Dairy' },
  ]);

  const [inspections, setInspections] = useState([
    { id: 'INS-2023-001', date: '2023-10-25', productId: 'PRD-001', status: 'Compliant', officer: 'Officer Default' },
    { id: 'INS-2023-002', date: '2023-10-24', productId: 'PRD-002', status: 'Violations Found', officer: 'Officer Default' },
    { id: 'INS-2023-003', date: '2023-10-22', productId: 'PRD-003', status: 'Pending Review', officer: 'Officer Default' },
  ]);

  const [violations, setViolations] = useState([
    {
      _id: 'v1',
      ruleId: 'LMR-03', // Net Quantity
      severity: 'HIGH',
      status: 'AI_DETECTED',
      requirement: 'Net Quantity Declaration Missing',
      detectedValue: 'None',
      expectedValue: 'Clear declaration on front panel',
      explanation: 'The system could not detect any net quantity information on the provided product images.',
      inspectionId: { inspectionId: 'INS-2023-002', _id: 'ins2' },
      confidence: 95
    },
    {
      _id: 'v2',
      ruleId: 'LMR-05', // MRP
      severity: 'MEDIUM',
      status: 'AI_DETECTED',
      requirement: 'MRP Format Incorrect',
      detectedValue: 'Rs 50',
      expectedValue: 'MRP Rs. 50.00 (Incl. of all taxes)',
      explanation: 'MRP is declared but does not include the mandatory "inclusive of all taxes" statement.',
      inspectionId: { inspectionId: 'INS-2023-002', _id: 'ins2' },
      confidence: 88
    },
    {
      _id: 'v3',
      ruleId: 'FSSAI-01', // Veg/Non Veg
      severity: 'HIGH',
      status: 'CONFIRMED',
      requirement: 'Veg/Non-Veg Logo missing',
      detectedValue: 'None',
      expectedValue: 'Green/Brown dot in a square',
      explanation: 'Mandatory vegetarian logo is missing from the principal display panel.',
      inspectionId: { inspectionId: 'INS-2023-003', _id: 'ins3' },
      confidence: 92
    }
  ]);

  const [reports, setReports] = useState([
    { id: 'RPT-OCT23', name: 'Monthly Compliance Report', date: 'Oct 2023', type: 'System', size: '2.4 MB' },
    { id: 'RPT-Q323', name: 'Q3 Quarterly Summary', date: 'Sep 2023', type: 'Custom', size: '5.1 MB' },
  ]);

  const [scheduledInspections, setScheduledInspections] = useState([
    { id: 'SCH-01', target: 'Mondelez India', date: '2023-11-10', officer: 'Officer Default', status: 'Scheduled' },
    { id: 'SCH-02', target: 'Nestle India', date: '2023-11-12', officer: 'Officer Default', status: 'Pending Approval' },
    { id: 'SCH-03', target: 'GCMMF (Amul)', date: '2023-11-15', officer: 'Officer Default', status: 'Scheduled' },
  ]);

  // Actions
  const addReport = (report) => setReports([report, ...reports]);
  const addProduct = (product) => setProducts([...products, product]);
  const addManufacturer = (mfg) => setManufacturers([...manufacturers, mfg]);
  const addRule = (rule) => setRules([...rules, rule]);

  const updateProduct = (id, updatedData) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  // Getters with joins
  const getProductsWithMfg = () => {
    return products.map(p => ({
      ...p,
      manufacturer: manufacturers.find(m => m.id === p.manufacturerId)?.name || 'Unknown'
    }));
  };

  const getInspectionsWithDetails = () => {
    return inspections.map(ins => {
      const product = products.find(p => p.id === ins.productId);
      return {
        ...ins,
        productName: product?.name || 'Unknown',
        manufacturerName: manufacturers.find(m => m.id === product?.manufacturerId)?.name || 'Unknown'
      };
    });
  };

  const getViolationsWithDetails = () => {
    return violations.map(v => {
      const rule = rules.find(r => r.id === v.ruleId);
      const inspection = inspections.find(ins => ins.id === v.inspectionId.inspectionId);
      const product = products.find(p => p.id === inspection?.productId);
      const mfg = manufacturers.find(m => m.id === product?.manufacturerId);

      return {
        ...v,
        ruleDetails: rule,
        productName: product?.name,
        manufacturerName: mfg?.name
      };
    });
  };

  const updateViolationStatus = (id, newStatus) => {
    setViolations(violations.map(v => v._id === id ? { ...v, status: newStatus } : v));
  };

  const value = {
    rules, setRules, addRule,
    manufacturers, setManufacturers, addManufacturer,
    products, setProducts, addProduct, updateProduct, getProductsWithMfg,
    inspections, setInspections, getInspectionsWithDetails,
    violations, setViolations, getViolationsWithDetails, updateViolationStatus,
    reports, setReports, addReport,
    scheduledInspections, setScheduledInspections
  };

  return (
    <SeedDataContext.Provider value={value}>
      {children}
    </SeedDataContext.Provider>
  );
};
