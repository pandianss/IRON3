# One-Slice Constitutional Build Plan
## Feature: [Feature Name]

Use this template to plan a new "Constitutional Slice" (Feature + Governance).

### 1. Framing (The Intent)
- **Objective**: What institutional value does this slice provide?
- **Constitutional Article**: Which article of the Constitution (FC-00, FC-FIT-01) does this operationalize?

### 2. Kernel Surface (The Rules)
- **New Principle**: (Optional) Add to `PrincipleRegistry`.
- **Governing Rules**:
    - `R-[DOMAIN]-01`: Description of the primary invariant.
    - `R-[DOMAIN]-02`: Description of the secondary limit.
- **Action Types**: List the actions to be gated (e.g., `LOG_NEW_WORKOUT`).

### 3. Governed Contract (The Engine)
- **Domain State**: Define the state schema (e.g., `institutionalState.domain`).
- **Logic**: How does the engine calculate its signals?
- **Evidence**: What data will the engine send to the Kernel to prove compliance?

### 4. UI Cockpit (The Visualization)
- **Monitor Component**: What status bars or history logs will be added?
- **Feedback**: How does the UI handle a "Blocked by Constitution" error?

### 5. Verification (The Proof)
- **Test Scenarios**:
    - [ ] **Normal Case**: Valid action is allowed.
    - [ ] **Violation Case**: Invalid action (e.g., 20x load) is blocked.
    - [ ] **Maturity Case**: Action blocked due to Lifecycle stage.

---
### Example Slice: "Cardio Consistency"
1. **Rule**: `R-CRDO-01` - No more than 2 high-intensity cardio sessions per 24h.
2. **Action**: `CARDIO_LOG_SESSION`.
3. **Evidence**: `sessionCountInWindow: 2`.
4. **Result**: Kernel blocks the 3rd session, Audit Ledger records "Biological Overshoot".
