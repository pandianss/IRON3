
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

# KERNEL ARCHITECTURE
## Internal Structure of ICE

### 1. KERNEL LAYERING
The Kernel is composed of three internal strata:

#### Strata 1: The Law (Compliance)
*   **Components**: `RuleEngine`, `InvariantEngine`.
*   **Function**: Contains the executable version of the Constitution.
*   **Process**: Evaluates every potential state change against the Law.

#### Strata 2: The Memory (Ledger)
*   **Components**: `MemoryLedger`, `EventRegistry`.
*   **Function**: Stores the immutable sequence of facts.
*   **Process**: Appends valid events, rejects invalid ones.

#### Strata 3: The Logic (Engines)
*   **Components**: `StandingEngine`, `ContractEngine`, `RiskEngine`.
*   **Function**: Derives "State" from "Memory".
*   **Process**: Re-computes scores, standings, and flags based on the Ledger.

### 2. EXECUTION FLOW
Every Kernel operation follows the **G.P.S. Protocol**:
1.  **G**ATE: Input is validated by the Compliance Gate.
2.  **P**ROCESS: Event is appended to the Ledger.
3.  **S**TATE: State is re-derived by the Engines.
