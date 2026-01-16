# Kernel Sovereignty Checklist
## v1.0 Governance Standard

This checklist ensures that any engine, module, or logic slice is "Constitutional" and respects the Sovereignty of the Kernel.

### 1. Interception & Gating
- [ ] **Non-Bypassable Entry**: Is the engine's primary entry point (e.g., `ingest`, `process`) wrapped in the `ComplianceGate`?
- [ ] **Action Definitions**: Does the engine use formal Action types (e.g., `STANDING_UPDATE_STATUS`) rather than raw state mutation?
- [ ] **Rule Registration**: Are the invariants enforced by a rule in the `ConstitutionalKernel` rather than hardcoded in the engine?

### 2. Evidentiary Standards
- [ ] **Evidence Packaging**: For critical transitions (Promotion, Degradation), does the engine provide a rich `evidence` object?
- [ ] **Verifiable Vectors**: Can the Kernel verify the logic using only the provided `evidence` and internal `stateMonitor`?
- [ ] **Zero-Judgment Genesis**: Does the engine block judgments while in the `GENESIS` or `PRE_INDUCTION` stages?

### 3. State Authority
- [ ] **Unilateral State Update**: Does the engine wait for the `govern()` callback before updating the `InstitutionalState`?
- [ ] **Audit Provenance**: Is every state change linked to a `reason` or `linkedEvent` for the Audit Ledger?
- [ ] **State Monitor Usage**: Does the engine use the Kernel's `StateMonitor` to read cross-domain dependencies (e.g., Standing checking Physiology)?

### 4. UI & Transparency
- [ ] **Governor Visualization**: Does the slice provide a UI component (Monitor/Badge) to explain its governed state to the user?
- [ ] **Audit Exposure**: Are violations or rejections from this slice visible in the central `AuditLog`?

---
> [!IMPORTANT]
> Failure to satisfy ANY item in sections 1 or 3 results in a **Sovereignty Breach**. The engine is considered "Rebel Code" and must be refactored before integration.
