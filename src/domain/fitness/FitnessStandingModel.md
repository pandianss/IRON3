# IRON — Fitness Standing Model v1
## Institutional Condition Specification

### 1. Definition of Standing
Standing is the institution’s computed assessment of the current condition of the subject’s physical conduct. It is a time-weighted, obligation-sensitive, breach-aware representation of training continuity, stress management, and recovery integrity.

Standing is always:
* derived from institutional memory
* updated by institutional cycles
* explainable from events
* authoritative over UX

---

### 2. Components of Standing
Standing = { continuity (C), stress (S), recovery (R), integrity (I), trajectory (T) }
Each vector is normalized to [0,1].

#### 2.1 Continuity Vector (C)
"Is the body–behavior relationship alive?"
* **Influenced by:** frequency of sanctioned sessions, missed obligations, inactivity duration.
* **Properties:** Decays with inactivity, grows slowly with consistency, drops sharply on extended absence.

#### 2.2 Stress Vector (S)
"How close is the system to overload?"
* **Influenced by:** intensity, volume, consecutive load days, self-reported strain, injury signals.
* **Properties:** Rises quickly under load, decays only through recovery events.

#### 2.3 Recovery Vector (R)
"Is restoration being honored?"
* **Influenced by:** rest days, mobility sessions, deload protocols, injury protocol adherence.
* **Properties:** Increases only on validated recovery actions, decays if obligations are skipped.

#### 2.4 Integrity Vector (I)
"Is the institution being respected?"
* **Influenced by:** truthful logging, acknowledgment of misses, breach admissions, protocol obedience.
* **Properties:** Decays on breach, recovers slowly under compliance, amplifies consequences when low.

#### 2.5 Trajectory Vector (T)
"Where is this going?"
* **Computed from:** derivative of continuity, stress, and recovery.
* **Properties:** Directional health of the system (Positive, Negative, Flat).

---

### 3. Standing Scalar (SI)
SI = wC*C + wR*R + wI*I – wS*S + wT*T
* SI determines standing bands and authority changes.
* SI ∈ [0,1]

---

### 4. Standing Bands (Institutional Phases)
1. **STABLE:** High C/I, Moderate S, Sufficient R. Authority: Full spectrum.
2. **ASCENDING:** High C, Rising S, Positive T. Authority: Controlled progression.
3. **STRAINED:** High S, Declining R. Authority: Recovery-first surfaces.
4. **DEGRADED:** Declining C, Impaired I. Authority: Rehabilitation required.
5. **BREACHED:** Low I, repeated non-compliance. Authority: Compressed/Restricted.
6. **REHABILITATING:** Prioritized R, Suppressed S. Authority: Structured re-entry.

---

### 5. Evolution Laws
* **Continuity Law:** C is harder to rebuild than to lose (Asymmetric decay).
* **Stress Law:** Stress may only decrease through recovery-class events.
* **Recovery Law:** Recovery is a governed behavior, not passive.
* **Integrity Law:** Integrity recovers slower than continuity.

---

### 6. Authority Binding
Authority must always follow standing. Never precede it. Standing determines max intensity, session availability, protocol freedom, and UI exposure.
