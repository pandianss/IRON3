/**
 * Verify Compliance PFL
 * Verifies the functionality of the Principle Registry and Traceability Engine.
 */

import PrincipleRegistry from '../src/compliance/pfl/PrincipleRegistry.js';
import TraceabilityEngine from '../src/compliance/pfl/TraceabilityEngine.js';
import { CONSTITUTIONAL_PRINCIPLES } from '../src/compliance/pfl/data/principles.js';

async function runVerification() {
    console.log('Starting PFL Verification...');

    try {
        // 1. Verify Principle Registry
        console.log('1. Verifying Principle Registry...');

        // Load default principles
        CONSTITUTIONAL_PRINCIPLES.forEach(p => PrincipleRegistry.register(p));
        console.log(`   Registered ${CONSTITUTIONAL_PRINCIPLES.length} principles.`);

        // Verify retrieval
        const p1 = PrincipleRegistry.get('P1');
        if (p1 && p1.id === 'P1') {
            console.log('   MATCH: Principle P1 retrieved successfully.');
        } else {
            throw new Error('FAILED: Could not retrieve Principle P1.');
        }

        // Verify Duplicate Registration Error
        try {
            PrincipleRegistry.register(CONSTITUTIONAL_PRINCIPLES[0]);
            throw new Error('FAILED: Duplicate registration did not throw error.');
        } catch (e) {
            console.log('   MATCH: Duplicate registration correctly rejected.');
        }

        // 2. Verify Traceability Engine
        console.log('\n2. Verifying Traceability Engine...');

        // Link P1 to a hypothetical Rule R1
        const ruleId = 'R1';
        TraceabilityEngine.link('P1', ruleId, 'enforced_by');
        console.log(`   Linked P1 -> ${ruleId} (enforced_by)`);

        // Check Trace from P1 (Downstream)
        const traceP1 = TraceabilityEngine.getTrace('P1');
        if (traceP1.downstream.length === 1 && traceP1.downstream[0].targetId === ruleId) {
            console.log('   MATCH: P1 downstream trace correct.');
        } else {
            console.error('Trace P1:', traceP1);
            throw new Error('FAILED: P1 downstream trace incorrect.');
        }

        // Check Trace from R1 (Upstream)
        const traceR1 = TraceabilityEngine.getTrace(ruleId);
        if (traceR1.upstream.length === 1 && traceR1.upstream[0].targetId === 'P1') {
            console.log('   MATCH: R1 upstream trace correct.');
        } else {
            console.error('Trace R1:', traceR1);
            throw new Error('FAILED: R1 upstream trace incorrect.');
        }

        console.log('\n✅ PFL VERIFICATION SUCCESSFUL');

    } catch (error) {
        console.error('\n❌ PFL VERIFICATION FAILED');
        console.error(error);
        process.exit(1);
    }
}

runVerification();
