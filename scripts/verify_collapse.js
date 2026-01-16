
import { ConstitutionalKernel } from '../src/compliance/kernel/kernel.js';

// Mock Institutional Kernel
const mockKernel = {
    state: {
        lifecycle: { stage: 'DEGRADABLE' },
        foundation: { why: 'Because.' },
        getSnapshot: () => ({ lifecycle: mockKernel.state.lifecycle }),
        getDomain: (d) => mockKernel.state[d]
    },
    subscribe: () => { }
};

const constitution = new ConstitutionalKernel().initialize({}, mockKernel);

// --- Test 1: Premature Collapse (Duration) ---
console.log("\n--- Test 1: Premature Collapse (Duration < 30) ---");
const durationFailAction = {
    type: 'LIFECYCLE_PROMOTE',
    payload: {
        targetStage: 'COLLAPSED',
        evidence: { degradedDays: 5, continuityIndex: 0.1 }
    },
    actor: 'TestRunner',
    rules: ['R-LIFE-04']
};

constitution.getGate().govern(durationFailAction, () => {
    console.log("FAIL: Premature Collapse Allowed");
}).catch(e => {
    console.log("PASS: Premature Collapse Blocked:", e.message);
});

// --- Test 2: Alive Collapse (High Continuity) ---
console.log("\n--- Test 2: Alive Collapse (Continuity > 0.2) ---");
const continuityFailAction = {
    type: 'LIFECYCLE_PROMOTE',
    payload: {
        targetStage: 'COLLAPSED',
        evidence: { degradedDays: 35, continuityIndex: 0.8 }
    },
    actor: 'TestRunner',
    rules: ['R-LIFE-04']
};

constitution.getGate().govern(continuityFailAction, () => {
    console.log("FAIL: Alive Collapse Allowed");
}).catch(e => {
    console.log("PASS: Alive Collapse Blocked:", e.message);
});

// --- Test 3: Ontological Death (Valid) ---
console.log("\n--- Test 3: Ontological Death (Valid) ---");
const deathAction = {
    type: 'LIFECYCLE_PROMOTE',
    payload: {
        targetStage: 'COLLAPSED',
        evidence: { degradedDays: 35, continuityIndex: 0.1 }
    },
    actor: 'TestRunner',
    rules: ['R-LIFE-04']
};

constitution.getGate().govern(deathAction, () => {
    console.log("PASS: Death Allowed (RIP)");
}).catch(e => {
    console.log("FAIL: Death Blocked:", e.message);
});
