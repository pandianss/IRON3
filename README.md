
# IRON INSTITUTION (Version 3.0)
## Sovereign Behavioral Kernel

> **"IRON is not a fitness application. IRON is a behavioural institution."**

### I. THE CONSTITUTIONAL STACK
This repository is governed by a strict hierarchy of law.
All code, designs, and interfaces must comply with the documents below, in order of supremacy.

#### 1. The Constitution (`docs/01_CONSTITUTION/`)
The supreme law. Defines what IRON is.
*   [**IRON_CONSTITUTION**](docs/01_CONSTITUTION/iron_constitution.md): The definition of Sovereignty, Standing, and Irreversibility.
*   [**INSTITUTION_LIFECYCLE_CODE**](docs/01_CONSTITUTION/INSTITUTION_LIFECYCLE_CODE.md): The physics of institutional existence (Genesis -> Active -> Collapsed).
*   [**IRON_VISUAL_CONSTITUTION**](docs/01_CONSTITUTION/IRON_VISUAL_CONSTITUTION.md): The law of appearance.
*   [**DOCUMENTATION_HIERARCHY_CHARTER**](docs/01_CONSTITUTION/DOCUMENTATION_HIERARCHY_CHARTER.md): The law of documentation itself.

#### 2. The Codes (`docs/02_CODES/`)
Operational laws defined by the Constitution.
*   [**KERNEL_GOVERNANCE_CODE**](docs/02_CODES/KERNEL_GOVERNANCE_CODE.md): Rules for the codebase itself.
*   [**VERDICT_SYSTEM_CODE**](docs/02_CODES/VERDICT_SYSTEM_CODE.md): How daily judgments are rendered.
*   [**BEHAVIOR_EVALUATION_CODE**](docs/02_CODES/BEHAVIOR_EVALUATION_CODE.md): Mapping engine signals to UI.

#### 3. The Architecture (`docs/03_ARCHITECTURE/`)
Technical topology.
*   [**ICE_RUNTIME**](docs/03_ARCHITECTURE/ICE_RUNTIME.md): Specify the Institutional Core Engine.
*   [**KERNEL_PROJECTION_LAYER**](docs/03_ARCHITECTURE/KERNEL_PROJECTION_LAYER.md): (KPL-01) The Read-Only Sovereign Boundary.
*   [**SYSTEM_OVERVIEW**](docs/03_ARCHITECTURE/SYSTEM_OVERVIEW.md): High-level topology.
*   [**DATA_FLOW**](docs/03_ARCHITECTURE/DATA_FLOW.md): The unidirectional flow of truth.

---

### II. CODE SUPREMACY
**Code is the executing arm of the Constitution.**
If documentation says one thing and code enforces another, the code is the *de facto* law (and the documentation is in violation).

**The Kernel (`src/ice/`) is sovereign.**
*   No module may query the Kernel directly (use Projections).
*   No module may write to the Ledger directly (use Events).
*   The UI is a read-only projection of constitutional state.

---

### III. ARCHITECTURAL MANDATES
1.  **Sovereignty of the Ledger**: If it's not in the ledger, it didn't happen.
2.  **Unidirectional Truth**: Event -> Ledger -> Engine -> Snapshot -> Projection -> UI.
3.  **No Simulation**: The UI must never display "happy paths" that do not exist in the Kernel.

---

### IV. RECORD ARCHIVE (`docs/04_RECORDS/`)
All non-binding documents, research, and historical artifacts are stored here. They carry no authority.

---

### V. EXECUTION
*   **Install**: `npm install`
*   **Run**: `npm run dev`
*   **Test**: `npm run test:kernel` (Coming soon)
