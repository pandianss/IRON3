import { AuditLogger } from '../src/compliance/ael/AuditLogger.js';
import { EvidenceManager } from '../src/compliance/ael/EvidenceManager.js';

console.log("--- AEL VERIFICATION: AUDIT & EVIDENCE ---");

// 1. Setup
const logger = new AuditLogger();
const archivist = new EvidenceManager();

console.log("\n[1] Logging Events...");
// Log some events
const hash1 = logger.log({ type: 'CONTRACT_CREATED', id: 'con_123' });
console.log(`Logged Block 1: ${hash1}`);
const hash2 = logger.log({ type: 'OBLIGATION_MET', id: 'obl_999' });
console.log(`Logged Block 2: ${hash2}`);

// 2. Verify Integrity (Valid)
console.log("\n[2] Verifying Integrity (Clean Chain)...");
const isValid = logger.verifyIntegrity();
if (isValid) {
    console.log("PASS: Audit Chain is valid.");
} else {
    console.error("FAIL: Audit Chain reporting invalid on clean state.");
    process.exit(1);
}

// 3. Attach Evidence
console.log("\n[3] Attaching Evidence...");
archivist.attach(hash2, "screenshot_of_success.png", { format: 'png' });
const evidence = archivist.getEvidence(hash2);
if (evidence.length === 1 && evidence[0].blob === "screenshot_of_success.png") {
    console.log("PASS: Evidence correctly attached and retrieved.");
} else {
    console.error("FAIL: Evidence retrieval failed.");
    process.exit(1);
}

// 4. Tamper Test
console.log("\n[4] Simulating Tampering Attack...");
// Attack: Modify the data of Block 1
const block1 = logger.chain[1]; // Index 1 (0 is Genesis)
block1.data = { type: 'CONTRACT_CREATED', id: 'con_HACKED' };
console.log(" > Block 1 data modified in memory.");

const isTampered = logger.verifyIntegrity();
if (!isTampered) {
    console.log("PASS: Tampering successfully detected.");
} else {
    console.error("FAIL: Tampering NOT detected. Chain reported as valid.");
    process.exit(1);
}

console.log("\n--- AEL VERIFICATION COMPLETED SUCCESSFULLY ---");
