# IRON — Daily Verdict Screen Blueprint

**Version**: 1.0
**Purpose**: The Daily Verdict is the institutional ceremony. It is where time closes, standing is judged, and continuity is either extended or fractured.

## 1. Institutional Role of This Screen

The Daily Verdict is not a dashboard. **It is the moment of jurisdiction.**

It answers four questions in strict order:
1.  What day has closed?
2.  What is my standing now?
3.  What was earned or lost?
4.  What condition am I entering?

*No other actions dominate this screen.*

## 2. Authorized Components

This screen may contain only:
*   **Authority Layer**: `StandingBanner`, `VerdictPanel`, `InstitutionalSeal`
*   **Temporal Layer**: `ContinuityBand`, `InstitutionalLedger` (last N entries), `ScarMarkers`
*   **Human Layer**: `ReflectionField` (conditional), `GuidancePanel` (secondary)

*No Obligation Stack appears here. This is judgment, not labor.*

## 3. Screen Composition (Spatial Law)

Vertical structure is fixed. Scrolling down = descending into time.

1.  **AUTHORITY ZONE** (Fully visible on entry)
    *   Standing Banner
    *   VerdictPanel
2.  **CONTINUITY ZONE**
    *   Continuity Band
    *   (optional Scar overlays)
3.  **TEMPORAL ZONE**
    *   Institutional Ledger (recent)
4.  **HUMAN ZONE**
    *   Reflection Field (if breach/risk)
    *   Guidance Panel

## 4. State Inputs Required
Subscribes to: `standingBand`, `standingLevel`, `standingDelta`, `scanSet`, `temporalPhase`, `motionIntensity`.

## 5. Entry Sequence (Mandatory Ceremony)

**Phase 1 — Institutional Arrival (Authority Claim)**
*   Triggered by: `INSTITUTION_EVALUATED`
*   Actions: Background retint, Ambient motion halt, Authority zone fade-in.
*   Perception: *“Something has been judged.”*

**Phase 2 — Verdict Declaration**
*   Triggered by: `STANDING_CHANGED`
*   Standing Banner: Re-renders, Value animates.
*   Verdict Panel: Appears from above.
*   Perception: *“This is my current institutional condition.”*

**Phase 3 — Temporal Consequence**
*   Triggered by: `LEDGER_APPENDED`
*   Continuity Band: Grows or Fractures.
*   Ledger: New entry stamps in.
*   Perception: *“Today is now part of my permanent record.”*

**Phase 4 — Human Integration**
*   Triggered after authority motion.
*   Reflection Field: Slides in if Breach/Recovery.
*   Perception: *“I am inside the institution, not outside it.”*

## 6. Component Behavior on This Screen

*   **Standing Banner**: Numeric authority dominates. If breach: Framing becomes severe.
*   **Verdict Panel**: Exists only during this ceremony. Defines emotional character.
*   **Continuity Band**: Physically grows or fractures. Break must be unmistakable.
*   **Institutional Ledger**: Shows last N days. Current day highlighted initially.

## 7. Motion Doctrine (This Screen Only)

*   **Authority Sweep**: Global, slow, chromatic.
*   **Verdict Arrival**: Vertical, controlled, dominant.
*   **Temporal Inscription**: Horizontal growth, background embedding.
*   **Reconstruction**: Slow contrast return (recovery only).
*   *No loops. No bounce. No celebration.*

## 8. Exit Conditions

User may not leave until:
1.  Authority and temporal phases complete.
2.  Reflection completed if breach.
3.  Verdict acknowledged.

## 9. Engineering Acceptance Criteria

Screen is invalid if:
*   Standing is not perceptible without reading.
*   Today does not visually join history.
*   Breach does not leave a visible mark.
*   Motion triggers without evaluation.
