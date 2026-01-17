
<!-- IRON DOCUMENTATION BADGE -->
<div align="center">
  <table style="border: 1px solid #333; background: #0A0D12; width: 100%; border-collapse: collapse; font-family: monospace;">
    <tr>
      <td style="border-right: 1px solid #333; padding: 10px; color: #505050; width: 25%;">CLASS</td>
      <td style="border-right: 1px solid #333; padding: 10px; color: #e0e0e0; width: 25%; font-weight: bold;">ARCHITECTURE</td>
      <td style="border-right: 1px solid #333; padding: 10px; color: #505050; width: 25%;">AUTHORITY</td>
      <td style="padding: 10px; color: #5BC0DE; width: 25%; font-weight: bold;">DESCRIPTIVE</td>
    </tr>
    <tr>
      <td style="border-right: 1px solid #333; border-top: 1px solid #333; padding: 10px; color: #505050;">ENFORCEMENT</td>
      <td style="border-right: 1px solid #333; border-top: 1px solid #333; padding: 10px; color: #e0e0e0;">NONE</td>
      <td style="border-right: 1px solid #333; border-top: 1px solid #333; padding: 10px; color: #505050;">STATUS</td>
      <td style="border-top: 1px solid #333; padding: 10px; color: #5BC0DE;">ACTIVE</td>
    </tr>
  </table>
</div>
<!-- END BADGE -->

# ICE RUNTIME SPECIFICATION (ICE-RUNTIME-01)
## The Institutional Core Engine

### 1. STRUCTURAL PRINCIPLE
ICE is the sovereign runtime kernel. It is not a service layer; it is an operating environment.
Hierarchy:
1.  **Intake Layer**: Logic inputs.
2.  **ICE Proper**: Kernel, Logic, Law, State.
3.  **Mandate Layer**: Output translation.
4.  **Experience Layer**: UI Consumers.

### 2. MODULE MANIFEST

#### 2.1 Institutional Kernel (`src/ice/Kernel.js`)
*   **Role**: Sovereign Coordinator.
*   **API**: `ingest()`, `evaluate()`, `getSnapshot()`.
*   **Logic**: Enforces cyclic execution and component boundaries.

#### 2.2 Memory Ledger (`src/ice/MemoryLedger.js`)
*   **Role**: The Source of Truth.
*   **Guarantee**: Append-only, Immutable, Replayable.
*   **Law**: If it's not in the ledger, it didn't happen.

#### 2.3 Standing Engine (`src/ice/StandingEngine.js`)
*   **Role**: Constitutional Interpreter.
*   **Logic**: Computes symbolic standing (Stable, Ascending, Breach) from Ledger history.

#### 2.4 Contract Engine (`src/ice/ContractEngine.js`)
*   **Role**: The Legal System.
*   **Logic**: Tracks modification of obligations and detects violations.

#### 2.5 Institution State (`src/ice/InstitutionState.js`)
*   **Role**: Derived Read-Model.
*   **Constraint**: Fed ONLY by MemoryLedger. No direct writes.

#### 2.6 Institutional Cycle (`src/ice/InstitutionalCycle.js`)
*   **Role**: Loop Enforcer.
*   **Logic**: Orchestrates atomic execution of the Evaluation Pipeline.

### 3. RUNTIME CONTRACT
ICE guarantees that for any Event E + History H, the resulting State S is deterministic.
`ICE(H, E) -> S`
