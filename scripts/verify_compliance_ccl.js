import { ResponseOrchestrator } from '../src/compliance/ccl/ResponseOrchestrator.js';

console.log("--- CCL VERIFICATION: RESPONSE ORCHESTRATOR ---");

// 1. Setup
const orchestrator = new ResponseOrchestrator({}); // Mock kernel

console.log("\n[1] Testing LOG_ONLY Strategy...");
const res1 = await orchestrator.handleTrigger('OBLIGATION_BREACHED', { id: 'test' });
if (res1 && res1.action === 'LOGGED') {
    console.log("PASS: OBLIGATION_BREACHED -> Logged.");
} else {
    console.error("FAIL: Incorrect response for log-only trigger.");
    process.exit(1);
}

console.log("\n[2] Testing LOCK_AUTHORITY Strategy...");
const res2 = await orchestrator.handleTrigger('CONSTITUTIONAL_CRISIS', { reason: 'Ledger Corruption' });
if (res2 && res2.action === 'LOCKED') {
    console.log("PASS: CONSTITUTIONAL_CRISIS -> System Locked.");
} else {
    console.error("FAIL: System did not lock on crisis.");
    process.exit(1);
}

console.log("\n[3] Testing Unmapped Trigger...");
const res3 = await orchestrator.handleTrigger('RANDOM_EVENT', {});
if (res3 === null || res3 === undefined) {
    console.log("PASS: Unmapped event -> No Action.");
} else {
    console.error("FAIL: Unmapped event triggered an action.");
    process.exit(1);
}

console.log("\n--- CCL VERIFICATION COMPLETED SUCCESSFULLY ---");
