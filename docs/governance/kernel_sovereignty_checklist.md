# IRON3 — Kernel-Sovereignty Enforcement Checklist

**Authority**: Constitutional Kernel
**Scope**: Entire IRON3 runtime, simulations, and institutional logic

## I. Structural Sovereignty (Repo-Level)
These items establish the kernel as a bounded and dominant subsystem.

- [x] **1. Single Sovereign Entry Point**
    - All governed execution flows import from: `src/compliance/kernel/index.js`
    - No institutional code initializes its own governance logic.
    - *Pass condition*: Exactly one kernel bootstrap path.
- [x] **2. Kernel Non-Dependency Rule**
    - Kernel modules do NOT import from: `institution`, `services`, `experience`, `ui`.
    - Kernel only imports from: `its own submodules`, `core primitives`.
    - *Pass condition*: The kernel can run in isolation.
- [x] **3. Bounded Authority**
    - Only kernel owns: institutional truth, lifecycle legality, degradation classification, enforcement authority.
    - *Pass condition*: No other folder exports these responsibilities.

## II. Execution Sovereignty (Runtime)
These items make governance unavoidable at runtime.

- [ ] **4. Mandatory Kernel Bootstrap**
    - All simulations (runSimFit*.js) must: initialize the kernel, fail if kernel is not initialized.
    - *Pass condition*: Running a simulation without kernel initialization throws.
- [x] **5. Compliance Gate Enforcement**
    - All institutional actions are wrapped in: `ComplianceGate.govern(...)`
    - *Pass condition*: No lifecycle or fitness mutation exists outside a governed call.
- [ ] **6. State Write Lock**
    - All writes to institutional state go through: `InstitutionalStateMonitor.applyEvent(...)`
    - *Pass condition*: Direct state mutation is impossible or fails tests.
- [x] **7. Verdict Authority**
    - Only the kernel can return: `allow`, `deny`, `escalate`, `halt`.
    - *Pass condition*: Domain code never issues governance outcomes.

## III. Behavioral Sovereignty (System Dynamics)
These items ensure the system actually obeys the kernel.

- [x] **8. Invariant Enforcement**
    - At least 3 core invariants exist in: `kernel/engine/invariantEngine`
    - They are evaluated on: lifecycle transitions, degradation events, simulation ticks.
    - *Pass condition*: Violating an invariant stops or alters execution.
- [x] **9. Degradation Authority**
    - Degradation scores originate only from: `kernel/state/HealthModel` (V7 alignment pending).
    - *Pass condition*: No other layer computes institutional health.
- [ ] **10. Enforcement Response Paths**
    - Violation events trigger: mitigation, slowdown, suspension, restoration from: `kernel/enforcement/`
    - *Pass condition*: There is at least one automated correction flow.

## IV. Evidence Sovereignty (Audit)
These items ensure the kernel produces institutional artifacts.

- [x] **11. Decision Ledger**
    - Every governed operation produces: context, rule evaluation, verdict, state delta.
    - *Pass condition*: Audit log can reconstruct institutional behavior.
- [ ] **12. Simulation Registration**
    - All simulation runs must register with: `auditLedger.registerSimulation(runId)`
    - *Pass condition*: Every run produces a compliance trail.
- [x] **13. Exportable Compliance Artifact**
    - The kernel can output at least one of: audit report, health certificate, degradation profile.
    - *Pass condition*: There is a tangible compliance artifact.

## V. Verification Sovereignty (CI & Scripts)
These items prevent sovereignty erosion.

- [x] **14. Structural Guards**
    - `scripts/verify_*` fail if: kernel folders missing, kernel bypass paths exist.
    - *Pass condition*: Repo cannot pass verification without kernel.
- [x] **15. Runtime Guards**
    - Add at least one verification script that: runs a simulation, forces a violation, asserts kernel intervention.
    - *Pass condition*: CI fails if governance cannot stop the system.

## VI. Cultural Sovereignty (Process)
These items keep sovereignty permanent.

- [ ] **16. Kernel-Touch Rule**
    - No PR accepted that does not: touch kernel, or explicitly justify exemption.
    - *Pass condition*: Kernel is development gravity.
- [ ] **17. Authority Review**
    - Any change under kernel/ requires: explicit review, version note, impact log.
    - *Pass condition*: Constitutional changes are rare and visible.

---

## VII. The Sovereignty Test
When you believe the kernel is sovereign, attempt this:
1. Bypass `ComplianceGate`.
2. Mutate institutional state directly.
3. Simulate degradation externally.
4. Run without kernel bootstrap.
*If any of these succeed without error, the kernel is not sovereign.*

## VIII. Minimum “Sovereign” Definition
IRON3 may claim kernel sovereignty only when:
- Simulations fail without kernel
- Institutions cannot mutate without governance
- Violations trigger enforcement
- Runs produce audit artifacts
*Until all four are true, sovereignty is incomplete.*
