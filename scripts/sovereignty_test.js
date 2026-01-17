/**
 * sovereignty_test.js
 * VERIFICATION SUITE: Sovereign Kernel & Wings
 * 
 * Verifies:
 * 1. Executive Wing: SovereignKernel boot and state management
 * 2. Legislative Wing: Constitutional compliance checks
 * 3. Judicial Wing: Audit logging
 */

import { SovereignKernel } from '../src/wings/executive/SovereignKernel.js';

async function runTest() {
    console.log("--- STARTING SOVEREIGNTY VERIFICATION ---");

    // TEST 1: KERNEL BOOT
    console.log("\n[TEST 1] Booting Sovereign Kernel...");
    let kernel;
    try {
        kernel = new SovereignKernel({
            initialEvents: []
        });
        console.log("√ PASS: Kernel Instantiated.");
    } catch (e) {
        console.error("! FAIL: Kernel Boot Crashed:", e);
        process.exit(1);
    }

    // TEST 2: SNAPSHOT INTEGRITY
    console.log("\n[TEST 2] Verifying Snapshot Integrity...");
    const snapshot = kernel.getSnapshot();
    if (snapshot.phase && snapshot.compliance) {
        console.log("√ PASS: Snapshot contains structural domains (Phase, Compliance).");
    } else {
        console.error("! FAIL: Malformed Snapshot:", Object.keys(snapshot));
    }

    // TEST 3: INGESTION & AUDIT
    console.log("\n[TEST 3] Testing Ingestion & Judicial Audit...");
    try {
        await kernel.ingest('PROTOCOL_INITIATED', { protocol: 'TEST_PROTOCOL' }, 'TEST_ACTOR');

        // Check Audit Log
        const auditLog = kernel.getSnapshot().compliance.audit;
        const lastEntry = auditLog[auditLog.length - 1];

        if (lastEntry && lastEntry.type === 'PROTOCOL_INITIATED') {
            console.log("√ PASS: Event ingested and audited.");
        } else {
            console.error("! FAIL: Event not found in audit log.");
            console.log("Log:", auditLog);
        }

    } catch (e) {
        console.error("! FAIL: Ingestion Error:", e);
    }

    console.log("\n--- SOVEREIGNTY VERIFICATION COMPLETE ---");
}

runTest().catch(console.error);
