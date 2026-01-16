import { InstitutionalKernel } from '../src/ice/Kernel.js';
import { ConstitutionalTestHarness } from '../src/compliance/vvl/ConstitutionalTestHarness.js';

console.log("--- VVL VERIFICATION: CONSTITUTIONAL TEST HARNESS ---");

// 1. Setup Kernel
const kernel = new InstitutionalKernel({ initialEvents: [] });
const harness = new ConstitutionalTestHarness(kernel);

console.log("\n[1] Initial State Verification...");
const report1 = harness.verifySnapshot();
if (report1.status === 'NOMINAL') {
    console.log("PASS: Initial state is Constitutionally Valid.");
} else {
    console.error("FAIL: Initial state invalid.", report1.details);
    process.exit(1);
}

// 2. State Evolution (Valid)
console.log("\n[2] Legal State Evolution...");
await kernel.ingest('CONTRACT_CREATED', {}, 'TEST_HOST');
const report2 = harness.verifySnapshot();
if (report2.status === 'NOMINAL') {
    console.log("PASS: Evolved state is Valid.");
} else {
    console.error("FAIL: Evolved state invalid.", report2.details);
    process.exit(1);
}

// 3. Forced Corruption (Simulating a Crisis)
console.log("\n[3] Simulating Constitutional Crisis (Corruption)...");
try {
    // FORCE-BREAK INVARIANT 1: Monotonicity (Truncate the ledger manually)
    // In a real scenario, the MemoryLedger is immutable/sealed, but for this test we force access if possible
    // Since MemoryLedger._log is internal, we might have to mock a snapshot or force-break the kernel's ledger ref for testing

    // Let's attempt to corrupt the Test Harness's context by mocking a "shrink" in history for the NEXT check
    // We can't easily corrupt the Kernel itself (which is good design), so we will manually trigger a check against a bad context
    // or we can simulate a bug by forcefully splicing the ledger array if we can access it.

    // Accessing private _log for testing purpose (Unsafe in Prod)
    if (kernel.ledger._log) {
        kernel.ledger._log.pop(); // Remove the event we just added
    }

    const report3 = harness.verifySnapshot();

    const monotonicityCheck = report3.details.find(d => d.id === 'INV_001_LEDGER_MONOTONICITY');

    if (!monotonicityCheck.passed) {
        console.log("PASS: Harness successfully detected Ledger Corruption (Monotonicity Violation).");
        console.log(`      Status: ${report3.status}`);
    } else {
        console.error("FAIL: Harness failed to detect corruption.");
        console.log(report3);
        process.exit(1);
    }

} catch (e) {
    console.error("TEST SCRIPT ERROR:", e);
}

console.log("\n--- VVL VERIFICATION COMPLETED SUCCESSFULLY ---");
