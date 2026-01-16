import {
    attemptKernellessExecution,
    attemptGateBypass,
    attemptDirectStateMutation,
    attemptGovernedActionWithoutAudit
} from '../src/compliance/kernel/tests/sovereigntyHarness.js';

const TIMEOUT_MS = 2000; // Global kill switch

async function runSovereigntyCheck() {
    const startTime = Date.now();
    console.log("--- CONSTITUTIONAL SOVEREIGNTY VERIFICATION ---");
    console.log("Validating Negative Capabilities (The 'Can Not' Doctrines)");

    const probes = [
        { name: "Probe A: Kernel Unavoidability", fn: attemptKernellessExecution, expectedBlocked: true },
        { name: "Probe B: Gate Supremacy", fn: attemptGateBypass, expectedBlocked: true },
        { name: "Probe C: State Write Lock", fn: attemptDirectStateMutation, expectedBlocked: true },
        { name: "Probe D: Audit Mandatory", fn: attemptGovernedActionWithoutAudit, expectedBlocked: true }
    ];

    let passed = 0;
    let failed = 0;

    for (const probe of probes) {
        try {
            const result = await Promise.race([
                probe.fn(),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 200)) // 200ms per probe limit
            ]);

            if (result.blocked === probe.expectedBlocked) {
                console.log(`✅ ${probe.name}: PASS`);
                passed++;
            } else {
                console.log(`\n!!! FAILURE DETECTED !!!`);
                console.log(`❌ ${probe.name}: FAIL`);
                console.log(`   Expected Blocked: ${probe.expectedBlocked}`);
                console.log(`   Actual Blocked: ${result.blocked}`);
                console.log(`   Result/Message: ${JSON.stringify(result)}`);
                console.log(`!!! ---------------- !!!\n`);
                failed++;
            }
        } catch (e) {
            console.log(`\n!!! EXCEPTION IN TEST RUNNER !!!`);
            console.error(`❌ ${probe.name}: ERROR - ${e.message}`);
            failed++;
        }
    }

    const duration = Date.now() - startTime;
    console.log(`\nRESULTS: ${passed}/${probes.length} Passed in ${duration}ms`);

    if (failed > 0) {
        console.error("VERDICT: SOVEREIGNTY BREACHED.");
        process.exit(1);
    } else {
        console.log("VERDICT: SOVEREIGNTY SECURE.");
        process.exit(0);
    }
}

// Kill switch
setTimeout(() => {
    console.error("\n❌ FATAL: Global Timeout Exceeded.");
    process.exit(1);
}, TIMEOUT_MS);

runSovereigntyCheck();
