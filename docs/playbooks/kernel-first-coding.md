# IRON3 — Kernel-First Coding Playbook

**Status:** Binding engineering practice  
**Authority:** Constitutional Kernel  
**Scope:** All system, institutional, simulation, and service code

---

## 1. Core Rule

In IRON3, you never start by writing features.

**You start by extending or invoking the Constitutional Kernel.**

If a piece of code does not touch the kernel, it is not institutional code.

---

## 2. The Kernel-First Workflow

Every feature follows this exact sequence.

### Step 1 — Constitutional Framing

Before writing code, produce a one-page framing note:

*   What institutional capability is being added?
*   Which principles are involved?
*   What state transitions occur?
*   What could degrade?

**No framing → no coding.**

### Step 2 — Kernel Surface Definition

Define or update one or more of:

*   Principles
*   Rules
*   Invariants
*   State fields
*   Verdict types

This happens in: `"src/compliance/kernel/"`

**If no kernel file changes, the feature is not real.**

### Step 3 — Governed Contract Design

Design the governed operation:

*   Action name
*   Required context
*   Pre-conditions
*   Post-conditions
*   Possible verdicts

This becomes the governed contract the rest of the system must obey.

### Step 4 — Compliance Gate Integration

Wrap the institutional operation:

```javascript
ComplianceGate.govern("ACTION_NAME", context, () => {
   // domain logic
})
```

**All domain code executes inside governance.**

### Step 5 — State Authority Binding

All institutional state mutation must occur through:

```javascript
StateMonitor.applyEvent(...)
```

**No service, script, or UI layer may author institutional truth.**

### Step 6 — Audit and Evidence Wiring

Before implementing business logic, wire:

*   decision logging
*   state transition recording
*   violation emission

**If it cannot be audited, it cannot be merged.**

### Step 7 — Invariant and Violation Tests

Write tests that:

*   prove the happy path
*   trigger at least one violation
*   demonstrate kernel enforcement

**The test suite is part of the feature.**

### Step 8 — Only then write feature logic

Domain logic is last.

**Not first.**

---

## 3. The Four Mandatory Code Changes

A legitimate IRON3 feature always modifies at least one file in each group:

1.  **Kernel principles/rules/invariants**
2.  **Kernel engine/state/gate**
3.  **Institutional or domain layer**
4.  **Compliance tests**

If any group is missing, the feature is incomplete.

---

## 4. Standard Code Patterns

### 4.1 Creating a New Institutional Capability

**Always start here:** `src/compliance/kernel/principles/`

Add or extend a principle.

**Then:** `engine/RuleEngine.js`, `engine/invariantEngine.js`

**Only after this:** `/institution/`, `/services/`, `/simulations/`

### 4.2 Governing an Operation

Canonical pattern:

```javascript
kernel.gate.govern("INSTITUTION_ACTIVATION", context, async () => {

   kernel.rules.evaluate(...)

   kernel.state.applyEvent(...)

   return result
})
```

**No direct service call is permitted.**

### 4.3 Handling Degradation

Degradation logic must live in:

*   `state/degradationModel.js` (or similar)
*   `engine/invariantEngine.js`
*   `enforcement/`

**Never in UI, never in services.**

### 4.4 Responding to Violations

Domain code never decides enforcement. It raises events.

**Only:** `enforcement/ResponseOrchestrator.js` acts.

---

## 5. Developer Checklists

### 5.1 Before You Code

*   [ ] Framing note written
*   [ ] Principles identified
*   [ ] Kernel touchpoints listed
*   [ ] Degradation risks named

### 5.2 Before You Commit

*   [ ] Kernel updated
*   [ ] Operation governed
*   [ ] State mutations mediated
*   [ ] Audit logs wired
*   [ ] Invariant tests written

### 5.3 Before You Merge

*   [ ] Can a rule block this feature?
*   [ ] Can the kernel halt it?
*   [ ] Can degradation be detected?
*   [ ] Can the run be reconstructed?

**If any answer is “no,” it is not IRON3 code.**

---

## 6. Forbidden Practices

The following are constitutional violations:

*   Direct lifecycle transitions
*   Silent state mutation
*   Ungoverned simulations
*   Feature-first design
*   Compliance added after logic
*   Degradation handled in UI or services
*   Hard-coding institutional authority

**These should fail review.**

---

## 7. Debugging in a Kernel-First System

When something breaks, you do not ask: **“Which service failed?”**

You ask:

*   Which invariant fired?
*   Which principle was violated?
*   What verdict was issued?
*   What state transition occurred?

**Logs and replays come from the kernel, not from print statements.**

---

## 8. How Progress Is Measured

You do not measure progress by:

*   number of features
*   number of services
*   number of screens

You measure progress by:

*   governed flows
*   enforced invariants
*   compliance coverage
*   degradation intelligence

---

## 9. Cultural Standard

In IRON3 engineering culture:

**The kernel is the product.**

Everything else is an interface to it.

If it bypasses governance, it is legacy.
