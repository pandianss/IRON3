# IRON Simulation Harness (ISH) Specification

**Status**: Institutional Laboratory Runtime
**Purpose**: Host ICE as a black-box, generate events, capture outcomes.

## 1. High-Level Architecture
*   **Simulation Scenario**: Declarative definition (World, Actors, Timeline).
*   **Event Orchestrator**: "Nervous System" (Injects events).
*   **Institutional Interface**: Strict Adapter to ICE.
*   **ICE**: The Real Runtime.
*   **Institutional Recorder**: Black-box flight recorder.
*   **Analysis & Inspector**: Reconstructs truth.

## 2. Core Modules

### 3.1 SimulationKernel (Orchestrator)
*   **Role**: Sovereign controller.
*   **Methods**: `run()`, `pause()`, `resume()`, `rewind()`, `terminate()`.

### 3.2 SimulationScenario
*   **Role**: Declarative experiment definition.
*   **Contains**: Initial state, active contracts, time model, generators, assertion invariants.

### 3.3 Event Orchestrator
*   **Role**: Schedule and inject events.
*   **Guarantees**: Reproducibility, Controlled Randomness, Clock Authority.

### 3.4 Institutional Interface
*   **Role**: Translation layer. Prevents test pollution in ICE.

### 3.5 Institutional Recorder
*   **Role**: Capture every event and state change.
*   **Emits**: Ledger, Standing Timeline, Authority Map.

### 3.6 Analysis & Inspector
*   **Role**: Human readability. Dashboarding.

## 3. Data Contracts

### 4.1 Simulation Run Artifact
```typescript
interface SimulationRun {
  runId: string;
  scenarioId: string;
  seed: number;
  startTime: number;
  endTime: number;
  eventStream: InstitutionalEvent[];
  standingTimeline: StandingState[];
  mandateTimeline: Mandate[];
  invariantResults: ValidationResult[];
}
```

## 4. Control Models
*   **Time Control**: Harness owns time. ICE reads Harness time.
*   **Determinism**: Same seed + same scenario = identical evolution.
*   **Invariants**: "Standing never increases during breach", etc.

## 5. Implementation Phases
1.  **Phase 1 — Viability**: Kernel, Interface, Recorder, Scripted Scenario.
2.  **Phase 2 — Pressure**: Generators, Invariants, Replay.
3.  **Phase 3 — Institutional Science**: Dashboards, Regression Engine.
