# API Documentation

## Authentication
### `POST /api/auth/register`
Body: `name`, `email`, `password`, `employeeId`, `department`
Returns: JWT Token + User Data

### `POST /api/auth/login`
Body: `email`, `password`
Returns: JWT Token + User Data

## Inspections
### `GET /api/inspections`
Returns: List of inspections

### `GET /api/inspections/:id`
Returns: Detailed inspection data with images and violations.

### `POST /api/inspections`
Body: `productData` (object), `location`, `officerRemarks`
Returns: Created Inspection object

### `POST /api/inspections/:id/images`
Body: `multipart/form-data` with `image` and `angle`
Returns: Created ProductImage object

### `POST /api/inspections/:id/analyze`
Triggers AI pipeline on the python backend.
Returns: Inspection with updated AI status.

## Analytics
### `GET /api/analytics/dashboard`
Returns: Overall metrics

## Reports
### `POST /api/reports/:inspectionId/generate`
Generates a PDF report.
Returns: `{ pdfUrl: "/reports/Report-XYZ.pdf" }`
