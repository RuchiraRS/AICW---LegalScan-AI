# Audit Trail Architecture

The audit trail is natively integrated into the data models:

1. **Timestamps**: All documents (Inspections, Declarations, Violations) have `createdAt` and `updatedAt` tracked automatically by Mongoose.
2. **Review Status**: Findings start as `AI_DETECTED` and transition to `CONFIRMED`, `REJECTED`, or `EDITED`.
3. **Officer Remarks**: Each violation captures `officerRemark` with changes.
4. **Declarations**: Captures original AI `value` alongside `officerCorrectedValue`.

This ensures full explainability and human-in-the-loop control, fulfilling the project requirements for field-enforcement audibility.
