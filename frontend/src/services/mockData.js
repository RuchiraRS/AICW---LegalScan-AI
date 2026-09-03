export const mockDashboardStats = {
  totalInspections: 1245,
  complianceRate: 87.2,
  activeViolations: 43,
  processingQueue: 12
};

export const mockRecentInspections = [
  { id: 'INS-2023-001', product: 'Industrial Valve X2', status: 'compliant', date: '2023-10-25', confidence: 98 },
  { id: 'INS-2023-002', product: 'Steel Beam Q4', status: 'violation', date: '2023-10-24', confidence: 92 },
  { id: 'INS-2023-003', product: 'Electrical Casing', status: 'warning', date: '2023-10-24', confidence: 85 },
  { id: 'INS-2023-004', product: 'Pneumatic Drill', status: 'compliant', date: '2023-10-23', confidence: 95 },
];

export const mockInspectionResult = {
  id: 'INS-2023-002',
  productName: 'Steel Beam Q4',
  manufacturer: 'Titanium Build Co.',
  date: '2023-10-24',
  status: 'violation',
  confidenceScore: 92,
  summary: 'Product fails to meet structural integrity documentation requirements. Marking missing on primary surface.',
  violations: [
    { ruleId: 'R-104', description: 'Missing mandatory CE marking', severity: 'high' },
    { ruleId: 'R-201', description: 'Documentation incomplete: missing tensile strength cert', severity: 'medium' }
  ],
  evidenceImages: [
    'https://picsum.photos/seed/ev1/400/300',
    'https://picsum.photos/seed/ev2/400/300'
  ]
};
