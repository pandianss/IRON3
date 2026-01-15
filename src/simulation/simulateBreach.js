import { InstitutionalKernel } from '../ice/Kernel.js';

/**
 * SIMULATION: BREACH OF REST PROTOCOL
 * 
 * Demonstrates:
 * 1. Load Accumulation (Capacity burn)
 * 2. Recovery Law Enforcement
 * 3. Standing Integrity Penalty for unauthorized intent
 */
async function runBreachSimulation() {
    console.log("=== STARTING BREACH OF REST SIMULATION ===");

    const kernel = new InstitutionalKernel();

    // 1. Enter Operational State
    console.log("\n[1] Initializing Institution...");
    await kernel.ingest('INDUCTION_COMPLETED', { level: 'COMMENCEMENT' }, 'SIGMA-9');

    // 2. Accumulate Extreme Load (Burn Capacity)
    console.log("\n[2] Accumulating Physiological Load (Simulating 12 hours of training)...");
    for (let i = 0; i < 4; i++) {
        await kernel.ingest('SESSION_ENDED', { duration: 180 }, 'SIGMA-9'); // 3 hours per session
        const snapshot = kernel.getSnapshot();
        console.log(`    -> Load: ${snapshot.state.physiology.load} | Capacity: ${snapshot.state.physiology.capacity}% | Status: ${snapshot.state.physiology.status}`);
    }

    // 3. Attempt Unauthorized Session (The Breach)
    console.log("\n[3] Attempting to start session during Physiological Exhaustion...");
    await kernel.ingest('SESSION_INTENT', { focus: 'INTENSE_TRAINING' }, 'SIGMA-9');

    const finalSnapshot = kernel.getSnapshot();
    const physiology = finalSnapshot.state.physiology;
    const standing = finalSnapshot.state.standing;

    console.log("\n=== SIMULATION RESULTS ===");
    console.log(`PHASE: ${finalSnapshot.state.status}`);
    console.log(`CAPACITY: ${physiology.capacity}% (${physiology.status})`);
    console.log(`AUTHORIZED: ${physiology.law.isAuthorized ? 'YES' : 'NO'}`);

    if (!physiology.law.isAuthorized) {
        console.log("MANDATES DETECTED:");
        physiology.law.mandates.forEach(m => console.log(`  [!] ${m.type}: ${m.message}`));
    }

    console.log(`\nSTANDING INTEGRITY: ${standing.integrity}`);
    if (standing.integrity < 100) {
        console.log("[-] SYSTEM REACTION: Standing Integrity degraded due to Law Breach.");
    }

    console.log("\n=== SIMULATION ENDED ===");
}

runBreachSimulation().catch(console.error);
