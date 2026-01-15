# IRON Institutional Core Engine (ICE) Specification

**Status**: Sovereign Runtime Kernel
**Philosophy**: Hierarchy is strict. Lower layers never depend on higher layers.

## 0. Structural Principle
ICE is not a service. It is a sovereign runtime kernel.
*   **Experience Layer**: UI, Protocols (Consumers)
*   **Mandate Layer**: Derived Directives (Translation)
*   **ICE**: The Core (Logic, State, Law)
*   **Intake Layer**: Events (Input)

## Module Manifest

### 1. Institutional Kernel (`src/ice/Kernel.js`)
*   **Role**: Sovereign Coordinator.
*   **Responsibilities**: Ingest events, enforces invariants, orchestrates sub-engines, seals cycles.
*   **API**: `ingest(event)`, `evaluate()`, `getSnapshot()`.

### 2. Event Registry (`src/ice/EventRegistry.js`)
*   **Role**: Input Normalization & Validation.
*   **Responsibilities**: Validate structure, normalize taxonomy, issue IDs.
*   **Output**: Canonical `InstitutionalEvent`.

### 3. Institutional Memory Ledger (`src/ice/MemoryLedger.js`)
*   **Role**: The Conscience (Source of Truth).
*   **Guarantees**: Append-only, Immutable, Replayable.
*   **Methods**: `append(event)`, `replay()`, `query()`.

### 4. Institution State Store (`src/ice/InstitutionState.js`)
*   **Role**: Derived Read-Model.
*   **Domains**: Identity, Temporal, Behavioral, Standing, Narrative.
*   **Note**: Fed ONLY by MemoryLedger and Engines. No UI writes.

### 5. Behavioral Contract Engine (`src/ice/ContractEngine.js`)
*   **Role**: The Legal System.
*   **Responsibilities**: Track obligations, detect violations, emit breach events.

### 6. Standing Engine (`src/ice/StandingEngine.js`)
*   **Role**: Constitutional Interpreter.
*   **Responsibilities**: Compute symbolic standing, integrity scores, failure vectors.
*   **Input**: Ledger, Contract State from Kernel.

### 7. Authority & Compliance Engine (`src/ice/AuthorityEngine.js`)
*   **Role**: The Governor (Capability Law).
*   **Responsibilities**: Compute locks, permissions, interaction constraints.

### 8. Mandate Engine (`src/ice/MandateEngine.js`)
*   **Role**: Translator to Experience.
*   **Outputs**: `UI Mandates`, `Motion Mandates`, `Narrative Mandates`.

### 9. Institutional Cycle Controller (`src/ice/InstitutionalCycle.js`)
*   **Role**: Loop Enforcer.
*   **Responsibilities**: Atomic execution of the Evaluation Pipeline.

### 10. Inspection Layer (`src/ice/InstitutionInspector.js`)
*   **Role**: Explainability.
*   **Methods**: `explainStanding()`, `reconstructCycle()`.

## Build Order (Critical Path)
1.  EventRegistry
2.  MemoryLedger
3.  InstitutionalKernel (Skeleton)
4.  InstitutionState
5.  ContractEngine
6.  StandingEngine
7.  AuthorityEngine
8.  MandateEngine
9.  InstitutionalCycle
10. InstitutionInspector
