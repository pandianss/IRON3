
<!-- IRON DOCUMENTATION BADGE -->
<div align="center">
  <table style="border: 1px solid #333; background: #0A0D12; width: 100%; border-collapse: collapse; font-family: monospace;">
    <tr>
      <td style="border-right: 1px solid #333; padding: 10px; color: #505050; width: 25%;">CLASS</td>
      <td style="border-right: 1px solid #333; padding: 10px; color: #e0e0e0; width: 25%; font-weight: bold;">CODE</td>
      <td style="border-right: 1px solid #333; padding: 10px; color: #505050; width: 25%;">AUTHORITY</td>
      <td style="padding: 10px; color: #5BC0DE; width: 25%; font-weight: bold;">BINDING</td>
    </tr>
    <tr>
      <td style="border-right: 1px solid #333; border-top: 1px solid #333; padding: 10px; color: #505050;">ENFORCEMENT</td>
      <td style="border-right: 1px solid #333; border-top: 1px solid #333; padding: 10px; color: #e0e0e0;">RUNTIME</td>
      <td style="border-right: 1px solid #333; border-top: 1px solid #333; padding: 10px; color: #505050;">STATUS</td>
      <td style="border-top: 1px solid #333; padding: 10px; color: #5BC0DE;">ACTIVE</td>
    </tr>
  </table>
</div>
<!-- END BADGE -->

# SOVEREIGN KERNEL CODE (SKC-01)
## Runtime Authority for Sovereign State

### 1. JURISDICTION
This code governs the `SovereignWindowKernel` located at `src/wings/experiential/kernel/SovereignWindowKernel.js`.
It is the runtime implementation of **ARTICLE II** (Standing) and **ARTICLE IV** (Daily Governance).

### 2. KERNEL RESPONSIBILITIES
The Kernel is responsible for:
1.  **State Synthesis**: Ingesting raw ledger data to compute current `Standing`.
2.  **Validity Verification**: Using the `VisualMachine` (Judicial Wing) to validate evidence.
3.  **Transition Enforcement**: Permitting or denying state transitions based on Constitutional Law.

### 3. VERDICT MACHINE VALIDATION
The Kernel delegates judgment to the `VerdictMachine`.
- **Input**: Evidence object, Protocol Constraints.
- **Output**: `VERDICT_VALID` | `VERDICT_INVALID` | `VERDICT_INCOMPLETE`.

### 4. SOVEREIGN STATE SCHEMA
The Sovereign State is defined by:
```javascript
{
    standing: 'STABLE' | 'ASCENDING' | 'RISK' | 'BREACH' | 'RECOVERY',
    integrity: 0-100, // Computed metric of adherence
    activeProtocol: ProtocolID | null,
    currentDay: DateString,
    obligations: [ObligationObjects]
}
```

### 5. ENFORCEMENT
This code is enforced at runtime. Direct modification of state outside the Kernel is a violation of Sovereignty.
