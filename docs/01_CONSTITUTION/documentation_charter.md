
<!-- IRON DOCUMENTATION BADGE -->
<div align="center">
  <table style="border: 1px solid #333; background: #0A0D12; width: 100%; border-collapse: collapse; font-family: monospace;">
    <tr>
      <td style="border-right: 1px solid #333; padding: 10px; color: #505050; width: 25%;">CLASS</td>
      <td style="border-right: 1px solid #333; padding: 10px; color: #e0e0e0; width: 25%; font-weight: bold;">CONSTITUTION</td>
      <td style="border-right: 1px solid #333; padding: 10px; color: #505050; width: 25%;">AUTHORITY</td>
      <td style="padding: 10px; color: #5BC0DE; width: 25%; font-weight: bold;">SUPREME</td>
    </tr>
    <tr>
      <td style="border-right: 1px solid #333; border-top: 1px solid #333; padding: 10px; color: #505050;">ENFORCEMENT</td>
      <td style="border-right: 1px solid #333; border-top: 1px solid #333; padding: 10px; color: #e0e0e0;">PROCEDURAL</td>
      <td style="border-right: 1px solid #333; border-top: 1px solid #333; padding: 10px; color: #505050;">STATUS</td>
      <td style="border-top: 1px solid #333; padding: 10px; color: #5BC0DE;">ACTIVE</td>
    </tr>
  </table>
</div>
<!-- END BADGE -->

# IRON DOCUMENTATION HIERARCHY CHARTER (IDHC-01)
## Law of Institutional Documentation

### PREAMBLE
Documentation within IRON is not narrative. It is institutional memory and binding law.
Uncontrolled documentation creates false sovereignty, conceptual drift, and unenforceable authority.
This Charter establishes a strict hierarchy of documentation classes, their authority, their permitted content, and their relationship to code.
No document may exist outside this structure.

### ARTICLE I — SUPREMACY OF CODE
**I.1** — Code is the final executing authority of IRON.
**I.2** — Documentation derives authority only insofar as it is:
*   a) enforced by runtime mechanisms,
*   b) validated by tests, or
*   c) required for institutional continuity.
**I.3** — Any document whose rules are not enforceable must not claim constitutional or code authority.
**I.4** — No document may override runtime enforcement.

### ARTICLE II — THE FOUR DOCUMENT CLASSES
All documentation must belong to exactly one of the following classes. No document may span classes. No class may be skipped.

#### CLASS I — CONSTITUTION
*   **Path**: `/docs/01_CONSTITUTION/`
*   **Definition**: Binding institutional law defining what IRON is and is permitted to be.
*   **Authority**: Supreme. All other documents, code, and interfaces are subordinate.
*   **Permitted Content**: Institutional identity, Sovereignty definitions, System obligations, Lifecycle law, Visual and interaction law, Structural prohibitions, Enforcement requirements.
*   **Prohibited Content**: Implementation details, Design exploration, Roadmaps, Hypotheses, Philosophical essays, Feature descriptions.
*   **Cardinality Law**: There may be only one IRON Constitution. No parallel "charters" or "visions".
*   **Enforcement**: Every article must be enforced in code OR explicitly marked as normative institutional law.

#### CLASS II — CODES
*   **Path**: `/docs/02_CODES/`
*   **Definition**: Operational law describing how the Constitution is executed.
*   **Authority**: Binding within their declared jurisdiction. Subordinate to Constitution. Superior to architecture.
*   **Permitted Content**: Behavioral evaluation logic, Degradation mechanics, Compliance protocols, Kernel coding law, Verdict structures, Audit rules.
*   **Prohibited Content**: Institutional identity, Philosophical framing, Future vision, Speculative design, Motivational language.
*   **Style Law**: Must be operational, reference constitutional articles, testable, and falsifiable.

#### CLASS III — ARCHITECTURE
*   **Path**: `/docs/03_ARCHITECTURE/`
*   **Definition**: Technical documentation describing how the system is built.
*   **Authority**: Descriptive, not legislative.
*   **Permitted Content**: System topology, Kernel layering, Data flow, Module responsibility, Runtime contracts, Infrastructure explanation.
*   **Prohibited Content**: Institutional law, Behavioral rules, Philosophy, Product positioning.

#### CLASS IV — RECORDS
*   **Path**: `/docs/04_RECORDS/`
*   **Definition**: Non-binding institutional memory.
*   **Authority**: None.
*   **Permitted Content**: Research papers, Risk registers, Planning documents, Experimental notes, Design explorations, Historical artifacts.
*   **Mandatory Label**: "This document is a non-binding institutional record."

### ARTICLE III — DOCUMENT CREATION LAW
**III.1** — Every new document must declare: Class, Jurisdiction, Constitutional dependencies, Enforcement status.
**III.2** — Any document that duplicates higher law, restates constitutional identity, or introduces new authority is invalid.
**III.3** — No document may self-elevate. Only the Constitution may grant authority.

### ARTICLE IV — AUTHORITY TAGGING
Every document must contain a header block identifying its Class, Authority, Enforcement, and Status.
Documents lacking this are unconstitutional.

### ARTICLE V — SOVEREIGNTY CONSERVATION
IRON may not accumulate law.
If a new constitutional rule is added: an old one must be amended, merged, or removed.
If a new code is created: an existing code must be evaluated for redundancy.
Institutional clarity outranks completeness.

### ARTICLE VI — DEGRADATION OF DOCUMENTS
Any document may be downgraded, archived, merged, or revoked when it no longer reflects enforced reality.
Historical value does not confer authority.

### ARTICLE VII — REVIEW & AUDIT
Quarterly institutional audit must enumerate all documents, classify them, identifying unenforced law.
Any contributor may file a documentation sovereignty violation.

### ARTICLE VIII — PROHIBITIONS
Forbidden: Parallel constitutions, Inspirational manifestos, Design theater documents, Unbounded frameworks, Speculative governance texts.

### CLOSING STATEMENT
Documentation within IRON is law, code, record, or nothing.
Anything that claims more than it enforces degrades the institution.
Sovereignty is maintained by reduction, not accumulation.
