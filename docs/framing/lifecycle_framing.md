# Framing Note: Constitutional Lifecycle (FC-FIT-01)

## 1. Institutional Capability
**What is being added?**
A formal **Institutional Lifecycle Engine** that governs the transition of the institution through defined metamorphic stages (`GENESIS` -> `PROBATION` -> `ACTIVE` -> `DEGRADABLE` -> `COLLAPSED`).

This capability ensures that the institution is not static; it evolves based on *proven* consistency and degrades based on *proven* neglect.

## 2. Principles Involved
*   **FC-00 (Genesis)**: "Sovereignty at Birth" - Adherence to the initial contract.
*   **FC-FIT-01 (Lifecycle)**:
    *   *Principle of Provenance*: "Authority is earned, not granted." (PROBATION check)
    *   *Principle of Entropy*: "Anything not maintained degrades." (ACTIVE to DEGRADABLE logic)
    *   *Principle of Termination*: "An institution without integrity ceases to exist." (COLLAPSED state)

## 3. State Transitions (Governed)
The following transitions are strictly governed by the Constitutional Kernel:
*   `GENESIS` -> `PROBATION`: Triggered by `GENESIS_VERDICT_SUBMITTED`.
*   `PROBATION` -> `ACTIVE`: Triggered by `STABILIZED` signal (7 days compliance).
*   `ACTIVE` -> `DEGRADABLE`: Triggered by `integrity < 30%` or time-based neglect.
*   `DEGRADABLE` -> `COLLAPSED`: Triggered by `integrity < 10%`.
*   `DEGRADABLE` -> `ACTIVE`: Triggered by `RESTORED` signal (Recovery protocol).

**Invariant**: Monotonicity (mostly). You cannot jump from GENESIS to ACTIVE. You cannot return to GENESIS.

## 4. Degradation Risks
*   **Silent Stagnation**: System fails to degrade despite inaction (e.g., user does nothing for 30 days, but stays ACTIVE).
    *   *Mitigation*: `PhysiologicalEngine` must emit `TIME_DECAY` signals that the Lifecycle Engine consumes.
*   **Illegal Promotion**: User bypasses PROBATION by hacking state.
    *   *Mitigation*: Compliance Gate validates `state.lifecycle.history` against audit log.
*   **Zombie State**: System is COLLAPSED but still accepts `SESSION_COMPLETE` events.
    *   *Mitigation*: Kernel Rule `R-LIFE-05` blocks all non-remedial events when in `COLLAPSED` state.
