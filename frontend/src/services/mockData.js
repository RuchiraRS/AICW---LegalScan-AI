export const MOCK_DASHBOARD_STATS = {
  totalInspections: 12450,
  compliantCount: 11200,
  potentialViolationsCount: 850,
  pendingReviewsCount: 400
};

export const MOCK_RECENT_INSPECTIONS = [
  {
    _id: "60d5ec49c1231",
    inspectionId: "INS-2026-8901",
    productId: { productName: "Premium Basmati Rice 5kg", manufacturer: "AgroFarms Ltd." },
    inspectionDate: new Date().toISOString(),
    complianceStatus: "COMPLIANT",
    overallConfidence: 98.5
  },
  {
    _id: "60d5ec49c1232",
    inspectionId: "INS-2026-8902",
    productId: { productName: "Alkaline Water 1L", manufacturer: "AquaLife Beverages" },
    inspectionDate: new Date(Date.now() - 86400000).toISOString(),
    complianceStatus: "REQUIRES_REVIEW",
    overallConfidence: 74.2
  },
  {
    _id: "60d5ec49c1233",
    inspectionId: "INS-2026-8903",
    productId: { productName: "Organic Honey 500g", manufacturer: "NatureSweet" },
    inspectionDate: new Date(Date.now() - 172800000).toISOString(),
    complianceStatus: "NON_COMPLIANT",
    overallConfidence: 92.1
  }
];

export const MOCK_CHART_DATA = [
  { name: 'Mon', compliant: 120, violations: 12 },
  { name: 'Tue', compliant: 150, violations: 18 },
  { name: 'Wed', compliant: 180, violations: 8 },
  { name: 'Thu', compliant: 140, violations: 20 },
  { name: 'Fri', compliant: 200, violations: 15 },
  { name: 'Sat', compliant: 90, violations: 5 },
  { name: 'Sun', compliant: 110, violations: 7 },
];
