import { InstitutionalKernel } from '../src/ice/Kernel.js';

console.log("--- INTEGRATED COMPLIANCE FRAMEWORK VERIFICATION ---");

// 1. Initialize Integrated Kernel
const kernel = new InstitutionalKernel({ initialEvents: [] });

// Check Initialization
if (kernel.compliance.ael && kernel.compliance.mtl && kernel.compliance.vvl && kernel.compliance.ccl) {
    console.log("PASS: All Compliance Layers Initialized.");
} else {
    console.error("FAIL: Missing Compliance Layers.");
    process.exit(1);
}

// 2. Ingest Event (Should trigger AEL, Cycle, VVL, MTL)
console.log("\n[1] Ingesting 'CONTRACT_CREATED'...");
await kernel.ingest('CONTRACT_CREATED', {}, 'TEST_HOST');

// Check AEL (Audit Log)
const auditHistory = kernel.compliance.ael.logger.chain;
if (auditHistory.length > 1) { // Genesis + 1
    console.log("PASS: Event was Audit Logged.", auditHistory[auditHistory.length - 1].hash);
} else {
    console.error("FAIL: Event was NOT Audit Logged.");
}

// Check MTL (Telemetry)
const metrics = kernel.compliance.mtl.agent.getReport();
// Note: CONTRACT_CREATED is not a Breach, so BreachRate should be 0.
console.log("MTL Metrics:", metrics);

// Check VVL (Invariance)
// The VVL runs automatically after cycle. If we didn't crash and saw "Cycle Success", it passed.
// We can check the history of the harness if we exposed it, or just trust the lack of error output for now.
// But let's check manually if the harness has history.
const vvlHistory = kernel.compliance.vvl.harness.getAuditLog();
if (vvlHistory.length > 0) {
    console.log("PASS: VVL Verification ran after cycle. Status:", vvlHistory[vvlHistory.length - 1].status);
} else {
    console.error("FAIL: VVL did not run.");
}

// 3. Trigger Crisis (CCL)
console.log("\n[2] Simulating Crisis Trigger via Event...");
// We are mimicking a crisis by injecting a mock message, but the Kernel protects itself well.
// To force a CCL response, we need the VVL to fail.
// We'll manually inject a CRISIS trigger to the Orchestrator to verify it *would* respond if called.
const response = await kernel.compliance.ccl.orchestrator.handleTrigger('CONSTITUTIONAL_CRISIS', { details: 'Simulated' });
if (response.action === 'LOCKED') {
    console.log("PASS: CCL Response execution confirmed: LOCKED.");
} else {
    console.error("FAIL: CCL failed to respond.");
}

console.log("\n--- INTEGRATION VERIFICATION COMPLETE ---");
