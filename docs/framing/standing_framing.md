# Framing Note: Constitutional Standing (Belts & Integrity)

## 1. Institutional Capability
**What is being added?**
Governance over the **Honor System** (Standing). The Institution must ensure that status (Belts/Bands) is strictly consistent with Conduct (History).

We are governing:
*   **Promotion**: The elevation of status (e.g., White Belt -> Yellow Belt).
*   **Demotion**: The loss of status due to Integrity failure.
*   **Integrity Mutation**: Any change to the core Integrity Score.

## 2. Principles Involved
*   **FC-00 (Genesis)**: "Sovereignty at Birth" (Defines Initial Integrity = 100).
*   **FC-STND-01 (New/Implied)**: *Principle of Consistency*.
    *   "Status follows Conduct." (No fake promotions).
    *   "Integrity is the currency of Authority."

## 3. State Transitions (Governed)
*   `PRE_INDUCTION` -> `ACTIVE` (White Belt): Triggered by Lifecycle `PROBATION` exit? Or explicit Standing induction.
*   `WHITE` -> `YELLOW`: Triggered by `Integrity > 90` + `Time in Grade`.
*   Any Band -> `DEGRADED`: Triggered by `Integrity penalty`.

## 4. Degradation Risks
*   **Stolen Valor**: Manual database edit grants Black Belt.
    *   *Mitigation*: `R-STND-01` verifies `Provenance` (Calculated SI matches Band).
*   **Erasure of Shame**: Deleting a `SESSION_MISSED` event restoring Integrity.
    *   *Mitigation*: Audit Ledger is append-only. Re-computation ensures Consistency.

## 5. Governed Operations
*   `STANDING_UPDATE` -> Must pass `ConsistencyCheck` (Proposed Band matches Calculated SI).
