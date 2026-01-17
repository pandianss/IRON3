# IRON UI Refactor Roadmap

**Objective**: Transform the current UI into an institutional interface starting with the Daily Verdict screen and radiating outward.

## PHASE 0 — System Preparation
*   **0.1 Institutional Core**: `StandingInterpreter`, `StandingThemeAdapter` (Done).
*   **0.2 Tokenize CSS**: Refactor into `core.css`, `standing.css`, `temporal.css`, `motion.css`. Remove literal colors.

## PHASE 1 — Build the Daily Verdict in isolation
*   **1.1 Route**: `/verdict` (or `SurfaceId.LEDGER_CLOSURE`).
*   **1.2 Authority Zone**: `StandingBanner`, `VerdictPanel`.
*   **1.3 Temporal Zone**: `ContinuityBand`, `LedgerRecent`.
*   **1.4 Human Zone**: `ReflectionField`.
*   **1.5 Mandatory Flow**: Redirect to verdict on day close.

## PHASE 2 — Migrate existing screens into jurisdictions
*   **2.1 Home/Dashboard → Obligation Hall**: Authority + Obligation Stack. Remove charts/motivation.
*   **2.2 Action Screens → Compliance Chambers**: Solemn execution.
*   **2.3 History → Ledger Chamber**: Permanent geography.
*   **2.4 Settings → Institutional Registry**: Administration only.

## PHASE 3 — Constitutionalize Layouts
*   Audit every component against proper Jurisdiction.
*   Delete unauthorized UI (motivational quotes, feature menus).

## PHASE 4 — Enforce Institutional Motion
*   Implement categories: Authority Sweep, Verdict Arrival, Temporal Inscription.
*   Bind strictly to `InstitutionEventBus`.

## PHASE 5 — Visual Aging
*   Implement `ageFactor` desaturation and compression.

## PHASE 6 — Lock System
*   Lint rules and regression tests.
