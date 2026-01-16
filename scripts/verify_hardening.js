import './mock_storage.js';
import { InstitutionalKernel } from '../src/ice/Kernel.js';

async function runTest() {
    console.log("--- START HARDENING VERIFICATION ---");

    // 1. Persistence Test
    console.log("\n1. TESTING PERSISTENCE...");
    const kernel1 = new InstitutionalKernel();
    await kernel1.ingest('GENESIS_VERDICT_SUBMITTED', { why: 'Verification Plan', consent: true }, 'User');

    const stageBefore = kernel1.state.getDomain('lifecycle').stage;
    console.log(`- State before "restart": ${stageBefore}`);

    // Create a new kernel (simulating reload)
    const kernel2 = new InstitutionalKernel();
    const stageAfter = kernel2.state.getDomain('lifecycle').stage;
    console.log(`- State after "restart" (from persistent storage): ${stageAfter}`);

    if (stageAfter === stageBefore) {
        console.log("PASS: State Persistence Success.");
    } else {
        console.error("FAIL: State Persistence Failed.");
    }

    // 2. Invariant Test (VVL)
    console.log("\n2. TESTING INVARIANTS (VVL)...");
    // Manually break an invariant (monotonicity check)
    // Directly setting state (bypassing gate for testing the monitor)
    kernel2.state.domains.lifecycle.activeDays = 10;
    kernel2.complianceKernel.invariantEngine.verifySnapshot(); // Baseline

    kernel2.state.domains.lifecycle.activeDays = 5; // Violation!
    const report = kernel2.complianceKernel.invariantEngine.verifySnapshot();

    console.log(`- Invariant Status: ${report.status}`);
    const failure = report.details.find(d => d.id === 'INV-LIFE-02');
    if (failure && !failure.passed) {
        console.log("PASS: Invariant Violation Detected (INV-LIFE-02).");
    } else {
        console.error("FAIL: Invariant Violation Not Detected.");
    }

    // 3. Escape Hatch Test (TR-02)
    console.log("\n3. TESTING ESCAPE HATCH (TR-02)...");
    const overrideAction = {
        type: 'MANDATE_UPDATE_BUNDLE',
        payload: { overrideToken: 'SOVEREIGN_RECOVERY', narrative: { tone: 'GUIDANCE' } },
        actor: 'OVERRIDE_ADMIN',
        rules: ['R-SYS-02', 'R-MAND-01'] // R-MAND-01 would normally fail if we weren't in a specific state?
        // Let's actually test it with a rule that would fail.
    };

    // Add a failing rule temporarily
    kernel2.complianceKernel.ruleEngine.registerRule({
        id: 'R-FAILURE',
        description: 'Should always fail.',
        logic: () => ({ allowed: false, reason: 'Manual Failure' })
    });

    const actionWithFailure = {
        type: 'TEST_ACTION',
        payload: { overrideToken: 'SOVEREIGN_RECOVERY' },
        actor: 'OVERRIDE_ADMIN',
        rules: ['R-SYS-02', 'R-FAILURE']
    };

    try {
        await kernel2.complianceKernel.getGate().govern(actionWithFailure, () => {
            console.log("- Operation Executed via Escape Hatch.");
            return true;
        });
        console.log("PASS: Escape Hatch Bypassed R-FAILURE.");
    } catch (e) {
        console.error("FAIL: Escape Hatch Failed to bypass.", e.message);
    }

    console.log("\n--- HARDENING VERIFICATION COMPLETE ---");
}

runTest().catch(console.error);
