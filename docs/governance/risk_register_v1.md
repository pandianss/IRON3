# Governance Risk Register
## Version: IRON3 v1.0 (The Constitutional Kernel)

### 1. Technical Risks
| Risk ID | Description | Impact | Mitigation |
| :--- | :--- | :--- | :--- |
| **TR-01** | **Memory Volatility** | Low | MITIGATED: Audit Ledger now persists to `localStorage`. |
| **TR-02** | **Logic Deadlock** | Medium | A contradictory set of rules could block all institution progress. | Implement a "Safety Hatch" or override mechanism for simulation/admin. |
| **TR-03** | **Performance Overhead** | Low | MITIGATED: Implemented state snapshot caching during governance cycles. |

### 2. Institutional Risks
| Risk ID | Description | Impact | Mitigation |
| :--- | :--- | :--- | :--- |
| **IR-01** | **Stolen Valor (Exploit)** | Medium | Users might find ways to spoof "positive signals" to the engine. | Require multi-vector evidence (e.g., HRV + Session completion) for promotion. |
| **IR-02** | **Recovery Fatigue** | Low | The 4-phase recovery protocol might be too strict, leading to user churn. | Calibrate phase durations based on historical "Success Curve" data. |

### 3. Governance Risks
| Risk ID | Description | Impact | Mitigation |
| :--- | :--- | :--- | :--- |
| **GR-01** | **Bypass Vulnerability** | Critical | A developer could accidentally add an engine that mutates state without the Gate. | Enforce "Sovereignty Checklist" in CI/CD; strictly audit all `state.update` calls. |
| **GR-02** | **Regulatory Misalignment** | Medium | The formal constitution (FC-FIT-01) might drift from the implemented code. | Use the `InvariantEngine` to cross-check documentation against rule logic. |

---
**Status**: ACTIVE
**Owner**: Constitutional Architect
