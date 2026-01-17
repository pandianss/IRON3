# SOVEREIGN ARCHITECTURE
## Topology of the Iron Court

IRON is organized as a hierarchical jurisdiction, separating the authoritative kernel from the non-sovereign runtime and experience layers.

---

### 1. JURISDICTIONAL LAYERS

The system is divided into four concentric layers of authority.

#### Layer 1: The Sovereign Kernel (`src/kernel/`)
- **Definition**: The absolute core. Logic, State, and Law.
- **Authority**: The **IronCourt** orchestrates all transitions.
- **Components**: 
  - **Executive**: Chambers (Standing, Session, Authority, Contract).
  - **Judicial**: Verdict and Audit Engines.
  - **Legislative**: Constitution and Protocol Registry.
- **Constraint**: Zero dependencies on UI or external services.

#### Layer 2: The Interface Pack (`src/interfaces/`)
- **Definition**: The Sealed Public API.
- **Role**: Border control and authorization.
- **Interaction**: The ONLY way for external layers to communicate with the Court.
- **Commands**: `submitEvent(Action)`.
- **Queries**: `createProjection()`, `subscribeToState()`, `getProtocols()`.

#### Layer 3: The Runtime Layer (`src/runtime/`)
- **Definition**: Non-sovereign utilities.
- **Components**: Simulations, development scripts, and legislative tools.
- **Constraint**: Must interact with the kernel exclusively through `@interfaces`.

#### Layer 4: The Experience Layer (`src/ui/` & `src/public/`)
- **Definition**: The visible surface.
- **Role**: Projects state snapshots into ceremonial surfaces.
- **Constraint**: No sovereign logic. Pure consumer of the Interface Pack.

---

### 2. PRINCIPLES OF CONSTRUCTION

1. **Dependency Gravity**: Dependencies point **INWARD**. The UI depends on the Interfaces. The Interfaces depend on the Kernel. The Kernel depends on nothing.
2. **State Sovereignty**: All state is derived from the **Ledger**. No context or local state is "truth".
3. **Unidirectional Flow**: `Action` -> `Interface` -> `Court` -> `Adjudication` -> `Ledger` -> `Snapshot` -> `UI`.

---

### 3. THE AUDIT TRAIL

The **LedgerAuthority** maintains a hash-chained record of every institutional event and its corresponding judicial verdict. This ensures history is tamper-evident and perpetually verifiable.

---

### 4. TECHNICAL STACK
- **Engine**: TypeScript Sovereign Kernel.
- **Orchestration**: IronCourt Engine.
- **State Layer**: Immutable Institutional State Model.
- **Verification**: Adversarial Vitest Suite.
