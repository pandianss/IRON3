
import { ConstitutionalKernel } from '../src/compliance/kernel/kernel.js';

// Mock Institutional Kernel
const mockKernel = {
    state: {
        lifecycle: { stage: 'DEGRADABLE', baselineSI: 0.8 },
        standing: { state: 'STABLE', integrity: 100 },
        foundation: { why: 'Because.' },
        getSnapshot: () => ({
            lifecycle: mockKernel.state.lifecycle,
            standing: mockKernel.state.standing
        }),
        getDomain: (d) => mockKernel.state[d]
    },
    subscribe: () => { }
};
const constitution = new ConstitutionalKernel().initialize({}, mockKernel);

// --- Test 1: Degradation with Insufficient Evidence (1 Vector) ---
console.log("\n--- Test 1: Degradation - Insufficient Evidence (1 Vector) ---");
const weakAction = {
    type: 'STANDING_UPDATE_STATUS',
    payload: {
        state: 'DEGRADED',
        integrity: 60,
        evidence: {
            continuityBreach: { detected: true },
            stressDominance: { detected: false },
            standingLoss: { detected: false },
            integrityFailure: { detected: false },
            adjudicativeConfirmation: { detected: false } // Should fail
        }
    },
    actor: 'TestRunner',
    rules: ['R-STND-03']
};

constitution.getGate().govern(weakAction, () => {
    console.log("FAIL: Weak Degradation Allowed (Should be Blocked)");
}).catch(e => {
    console.log("PASS: Weak Degradation Blocked:", e.message);
});


// --- Test 2: Degradation with Convergent Evidence (2 Vectors) ---
console.log("\n--- Test 2: Degradation - Convergent Evidence (2 Vectors) ---");
const strongAction = {
    type: 'STANDING_UPDATE_STATUS',
    payload: {
        state: 'DEGRADED',
        integrity: 60,
        evidence: {
            continuityBreach: { detected: true },
            stressDominance: { detected: true }, // 2nd Vector
            standingLoss: { detected: false },
            integrityFailure: { detected: false },
            adjudicativeConfirmation: { detected: false }
        }
    },
    actor: 'TestRunner',
    rules: ['R-STND-03']
};

constitution.getGate().govern(strongAction, () => {
    console.log("PASS: Strong Degradation Allowed");
}).catch(e => {
    console.log("FAIL: Strong Degradation Blocked:", e.message);
});

// --- Test 3: Degradation in ACTIVE Lifecycle (Illegal) ---
console.log("\n--- Test 3: Degradation in ACTIVE Lifecycle ---");
mockKernel.state.lifecycle.stage = 'ACTIVE';

const illegalAction = {
    type: 'STANDING_UPDATE_STATUS',
    payload: {
        state: 'DEGRADED',
        integrity: 60,
        evidence: {
            continuityBreach: { detected: true },
            stressDominance: { detected: true }
        }
    },
    actor: 'TestRunner',
    rules: ['R-STND-03']
};

constitution.getGate().govern(illegalAction, () => {
    console.log("FAIL: Active Degradation Allowed (Should be Blocked)");
}).catch(e => {
    console.log("PASS: Active Degradation Blocked:", e.message);
});
