
import { ConstitutionalKernel } from '../src/compliance/kernel/kernel.js';

// Mock Institutional Kernel
const mockKernel = {
    state: {
        lifecycle: { stage: 'DEGRADABLE', baselineSI: 0.8 },
        standing: { state: 'DEGRADED', integrity: 40 }, // Currently Degraded
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

// --- Test 1: Premature Escape (Still in Stabilization) ---
console.log("\n--- Test 1: Premature Escape (Stabilization) ---");
const prematureAction = {
    type: 'STANDING_UPDATE_STATUS',
    payload: {
        state: 'STABLE', // Trying to escape
        integrity: 60,
        recoveryPhase: 'STABILIZATION', // Not done
        evidence: {}
    },
    actor: 'TestRunner',
    rules: ['R-STND-04']
};

constitution.getGate().govern(prematureAction, () => {
    console.log("FAIL: Premature Escape Allowed (Should be Blocked)");
}).catch(e => {
    console.log("PASS: Premature Escape Blocked:", e.message);
});


// --- Test 2: Valid Reinstatement (Recovery Completed) ---
console.log("\n--- Test 2: Valid Reinstatement (Completed) ---");
const validAction = {
    type: 'STANDING_UPDATE_STATUS',
    payload: {
        state: 'STABLE',
        integrity: 85,
        recoveryPhase: 'COMPLETED', // Done!
        evidence: {}
    },
    actor: 'TestRunner',
    rules: ['R-STND-04']
};

constitution.getGate().govern(validAction, () => {
    console.log("PASS: Valid Reinstatement Allowed");
}).catch(e => {
    console.log("FAIL: Valid Reinstatement Blocked:", e.message);
});
