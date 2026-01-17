
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

# SYSTEM OVERVIEW
## Topology of the Sovereign Kernel

### 1. HIGH LEVEL TOPOLOGY
IRON is organized not as a set of features, but as a hierarchical jurisdiction.
The system is divided into four concentric layers of authority.

#### Layer 1: The Sovereign Kernel (ICE)
*   **Definition**: The absolute core. Logic, State, and Law.
*   **Constraint**: Zero dependencies on UI or Services.
*   **Role**: Adjudicates all truth.

#### Layer 2: The Compliance Gate
*   **Definition**: The border control.
*   **Role**: Validates inputs, enforces invariants, rejects unconstitutional actions.

#### Layer 2.5: The Kernel Projection Layer (KPL)
*   **Definition**: The Read-Only Boundary.
*   **Role**: Projects immutable snapshots to public surfaces. Prevents unauthorized queries.

#### Layer 3: The Mandate Layer
*   **Definition**: The output translator.
*   **Role**: Converts internal verdicts (Breach, Pass) into experience directives (UI colors, Navigation locks).

#### Layer 4: The Experience Layer (UI)
*   **Definition**: The visible surface.
*   **Constraint**: No sovereign logic allowed. Pure consumer of Mandates.

### 2. PRINCIPLES OF CONSTRUCTION
1.  **Dependency Gravity**: Dependencies point **INWARD**. The UI depends on the Kernel. The Kernel depends on nothing.
2.  **State Sovereignty**: All state is derived from the **Memory Ledger**. No local state is "truth".
3.  **Cyclic Execution**: The system moves in discrete, atomic **Institutional Cycles**.

### 3. TECHNICAL STACK
*   **Runtime**: React / JavaScript (Client-Side Kernel).
*   **Persistence**: IndexedDB (Sovereign Local Storage).
*   **State**: Custom Event Sourcing Engine.
