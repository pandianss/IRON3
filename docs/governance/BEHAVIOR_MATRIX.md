# IRON — Standing-to-Component Behavior Matrix

**Version**: 1.0
**Scope**: Defines how every authorized UI primitive must behave under each institutional standing and engine signal.

## 1. Canonical Standing States

All engine outputs must collapse into one primary standing band:
*   **STABLE**
*   **ASCENDING**
*   **RISK**
*   **BREACH**
*   **RECOVERY**

*Secondary flags may exist, but UI dominance always belongs to exactly one band.*

## 2. Global System Reactions (all screens)

| Engine Output | Mandatory Global UI Response |
| :--- | :--- |
| **Standing change** | Full-app chromatic retint via Standing Theme Adapter |
| **Daily evaluation triggered** | Standing Banner re-renders + Institutional motion sweep |
| **Risk delta detected** | Peripheral decay indicators activate |
| **Breach recorded** | Motion interruption + contrast shift + ledger stamp |
| **Recovery initiated** | Contrast softening + reconstruction transitions |
| **Ledger append** | Temporal surfaces update + subtle persistence cue |

## 3. Component Behavior by Standing

### 3.1 Standing Banner (Authority Layer)
| Standing | Visual State | Motion | Content Shift |
| :--- | :--- | :--- | :--- |
| **STABLE** | Cool accent, low glow, controlled contrast | Slow ambient drift | “Institution holds” |
| **ASCENDING** | Brighter accent, upward gradients | Gentle expansion | “Standing improving” |
| **RISK** | Heated edges, subtle instability | Low-frequency pulse | “Standing at risk” |
| **BREACH** | High contrast, fractured framing | Sharp snap-in | “Breach registered” |
| **RECOVERY** | Dimmed accent, muted saturation | Slow fade reconstruction | “Re-entry phase” |

### 3.2 Verdict Panel
| Trigger | Mandatory Behavior |
| :--- | :--- |
| **Daily pass** | Slides in from above, confirms continuity |
| **Positive delta** | Displays earned advancement |
| **Risk escalation** | Introduces warning language |
| **Breach** | Replaces current authority surface, requires acknowledgement |
| **Recovery** | Appears with conditions and limits |

*The Verdict Panel is event-driven only. It must never exist statically.*

### 3.3 Obligation Stack
| Standing | Visual Pressure | Ordering | Interaction |
| :--- | :--- | :--- | :--- |
| **STABLE** | Balanced, structured | Priority-sorted | Calm compliance |
| **ASCENDING** | Lightened, open spacing | Progress-weighted | Momentum cues |
| **RISK** | Compressed, dense | Consequence-weighted | Heightened affordance |
| **BREACH** | Disabled or collapsed | Historical only | No fulfillment allowed |
| **RECOVERY** | Narrowed, gated | System-assigned only | Limited actions |

### 3.4 Contract Card
| Engine Signal | Required UI Reaction |
| :--- | :--- |
| **Created** | Enters from below with time stamp |
| **Progress** | Visual fill tied to decay curve |
| **Completion** | Contract collapse + ledger write cue |
| **Approaching decay** | Edge destabilization + decay indicator |
| **Failure** | Scar imprint + removal |
| **Recovery contract** | Distinct geometry + time-boxed styling |

### 3.5 Compliance Control
| Standing | Interaction Character |
| :--- | :--- |
| **STABLE** | Deliberate, confirmational |
| **ASCENDING** | Slightly eased, momentum preserving |
| **RISK** | Heavier, more resistant |
| **BREACH** | Locked or reflective only |
| **RECOVERY** | Condition-gated, explicit acceptance |

*Completion always triggers: Institutional acknowledgment, Ledger append, Temporal surface update.*

### 3.6 Continuity Band
| Engine Output | UI Transformation |
| :--- | :--- |
| **Streak continues** | New segment physically added |
| **Streak accelerates** | Band thickens or brightens |
| **Risk on streak** | Segment instability introduced |
| **Breach** | Band fracture + visible discontinuity |
| **Recovery** | New band begins, old remains visible |

*The band is never reset. It only extends, fractures, or becomes background.*

### 3.7 Institutional Ledger
| Event | UI Action |
| :--- | :--- |
| **Daily closure** | New ledger row appended |
| **Breach** | Seal stamp + scar marker |
| **Milestone** | Permanent mark added |
| **Recovery** | Linked to prior breach |
| **Completion** | Reference only, never highlight |

*Ledger surfaces must: Desaturate with age, Compress into background strata, Resist scrolling acceleration.*

### 3.8 Scar Marker
| Standing | Visual Treatment |
| :--- | :--- |
| **Any** | Always visible |
| **STABLE** | Subdued, embedded |
| **ASCENDING** | Further backgrounded |
| **RISK** | Slightly re-emphasized |
| **BREACH** | Foregrounded and connected |
| **RECOVERY** | Framed but muted |

*Scars are never decorative. They are permanent geography.*

### 3.9 Decay Indicator
| Engine Output | Mandatory Behavior |
| :--- | :--- |
| **Decay active** | Subtle instability motion |
| **Decay accelerating** | Color destabilization |
| **Decay reversed** | Visual calming |
| **Decay expired** | Contract auto-collapse + ledger write |

### 3.10 Reflection Field (Human Layer)
| Standing | Behavior |
| :--- | :--- |
| **STABLE** | Optional, minimized |
| **ASCENDING** | Prompted but not foregrounded |
| **RISK** | Contextual nudges |
| **BREACH** | Required before re-entry |
| **RECOVERY** | Always present, limited scope |

### 3.11 Guidance Panel
| Standing | Content Role |
| :--- | :--- |
| **STABLE** | System reminders |
| **ASCENDING** | Reinforcement logic |
| **RISK** | Explanatory warnings |
| **BREACH** | System explanation + next conditions |
| **RECOVERY** | Re-entry education |

## 4. Engine Signal → UI Event Table

| Engine Output | UI Event |
| :--- | :--- |
| **onDailyEvaluation()** | Authority sweep + Verdict Panel + Standing Banner refresh |
| **standingDelta(+/-)** | Chromatic drift + numeric authority animation |
| **riskThresholdCrossed()** | Decay indicators activate + Obligation compression |
| **contractCompleted()** | Contract collapse + ledger append + continuity update |
| **contractFailed()** | Scar imprint + obligation removal + standing recalculation |
| **breachDeclared()** | Motion interruption + ledger seal + authority takeover |
| **recoveryOpened()** | UI desaturation + gated obligations + guidance injection |
| **recoveryClosed()** | Standing reassessment + chromatic re-entry |
| **ledgerAppend()** | Temporal surfaces age shift |

## 5. Non-Negotiable UI Guarantees

Whenever the engine reports:
*   **Improvement** → the UI must expand
*   **Risk** → the UI must tense
*   **Failure** → the UI must rupture
*   **Recovery** → the UI must reconstruct
*   **Time** → the UI must age

*If any of these are not perceptible without reading, the mapping is incorrect.*
