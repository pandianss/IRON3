# IRON — Design-to-Code Handoff Specification

**Version**: 1.0
**Audience**: Frontend engineers, UI systems architects
**Scope**: CSS architecture, state adapters, animation law, and enforcement rules

## 1. Architectural Mandate

The UI must not “query” institutional state.
It must **subscriptions** to it.

All visual change originates from a single institutional adapter.

> Institution Engine → Standing Interpreter → Standing Theme Adapter → CSS Variables + Motion Signals → Authorized UI Components

*No component may style itself independently of this chain.*

## 2. Core System Objects (Mandatory)

### 2.1 Standing Interpreter
*   **Purpose**: Normalize raw engine outputs into canonical UI state.
*   **Input examples**: `riskScore`, `streakState`, `breachFlag`.
*   **Output contract**:
    *   `standingBand`: STABLE | ASCENDING | RISK | BREACH | RECOVERY
    *   `standingLevel`: number
    *   `riskPressure`: 0–1
    *   `motionIntensity`: 0–1
    *   `temporalPhase`: OPEN | CLOSING | FRACTURED | REBUILDING

### 2.2 Standing Theme Adapter
*   **Purpose**: Translate interpreted standing into visual system values.
*   **Outputs**:
    *   App color variables
    *   Motion multipliers
    *   Surface contrast values

### 2.3 Institutional Clock
*   **Purpose**: Centralized time authority.
*   **Controls**: Daily evaluation triggers, Decay progression, Ledger aging.
*   *No UI component may use `Date.now()` for behavior.*

## 3. CSS Variable Constitution

### 3.1 Core Infrastructure Variables
Always present.
*   `--iron-bg-primary`, `--iron-bg-secondary`, `--iron-surface`
*   `--iron-text-primary`, `--iron-text-secondary`, `--iron-text-muted`

### 3.2 Standing Overlay Variables
Injected by Standing Theme Adapter.
*   `--iron-accent`, `--iron-accent-soft`, `--iron-accent-contrast`
*   `--iron-glow-level`, `--iron-risk-tint`, `--iron-breach-tint`

### 3.3 Temporal Variables
*   `--iron-decay-level`, `--iron-age-factor`
*   `--iron-continuity-strength`, `--iron-scar-opacity`

### 3.4 Motion Variables
*   `--iron-motion-intensity`, `--iron-motion-duration-base`
*   `--iron-motion-ease-*`

## 4. Animation Trigger Law

Animations are illegal unless triggered by institutional events.
**Global Motion Bus** events: `INSTITUTION_EVALUATED`, `STANDING_CHANGED`, `RISK_ESCALATED`, `BREACH_DECLARED`, etc.

## 5. Component Implementation Contract

Each authorized component must expose:
*   `<StandingConsumer>`
*   `<TemporalConsumer>`

No component may import theme files directly or define its own palette.

## 6. Mandatory Hook Layer
*   `useStanding()`
*   `useStandingTheme()`
*   `useInstitutionClock()`
*   `useInstitutionEvents()`

## 7. Styling Enforcement

**Prohibited**: Inline colors, Fixed animation durations, Component-scoped theme logic.
**Required**: Tokenized spacing, Variable-driven contrast, Standing-reactive borders.

## 8. Visual Aging Implementation
All temporal surfaces must subscribe to `ageFactor` (0 → 1) and apply it to saturation/contrast.

## 9. Event-to-UI Execution Flow
InstitutionClock → Engine → Interpreter → ThemeAdapter → EventBus → Authority Layer → Motion System → Ledger → UI Mutation.
