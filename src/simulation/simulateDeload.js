import { InstitutionalKernel } from '../ice/Kernel.js';

/**
 * SIMULATION: FITNESS DELOAD PROTOCOL
 */
async function runDeloadSimulation() {
    console.log("=== STARTING DELOAD PROTOCOL SIMULATION ===");

    const kernel = new InstitutionalKernel();
    await kernel.ingest('CONTRACT_CREATED', {}, 'SIGMA-9');

    // 1. Trigger Deload via exhaustion
    console.log("\n[1] Pushing system to exhaustion...");
    for (let i = 0; i < 3; i++) {
        await kernel.ingest('SESSION_ENDED', { duration: 180, tags: ['BURN'], evidence: [] }, 'SIGMA-9');
        const phys = kernel.getSnapshot().state.physiology;
        console.log(`    -> Status: ${phys.status} | Era: ${phys.era}`);
    }

    // 2. Observe Deload Parameters
    let phys = kernel.getSnapshot().state.physiology;
    console.log(`\n[2] Transition complete. Era: ${phys.era}`);
    console.log(`    Active Parameters: LoadMult: ${phys.params.loadMultiplier} | RecMult: ${phys.params.recoveryMultiplier} | Cap: ${phys.params.durationCap}m`);

    // 3. Test Load Multiplier (Subsidized stress)
    console.log("\n[3] Logging session during Deload (60 mins)...");
    await kernel.ingest('SESSION_ENDED', { duration: 60, tags: ['DELOAD_TEST'], evidence: [] }, 'SIGMA-9');
    phys = kernel.getSnapshot().state.physiology;
    console.log(`    -> Load growth during deload: ${phys.load} (Subsidized by 50%)`);

    // 4. Breach Duration Cap
    console.log("\n[4] Attempting to breach Deload Duration Cap (90 mins session)...");
    await kernel.ingest('SESSION_ENDED', { duration: 90, tags: ['BREACH_TEST'], evidence: [] }, 'SIGMA-9');
    phys = kernel.getSnapshot().state.physiology;

    console.log("\n=== SIMULATION RESULTS ===");
    console.log(`ERA: ${phys.era}`);
    console.log(`AUTHORIZED: ${phys.law.isAuthorized ? 'YES' : 'NO'}`);
    if (!phys.law.isAuthorized) {
        phys.law.mandates.forEach(m => console.log(`  [!] ${m.type}: ${m.message}`));
    }

    console.log(`STANDING INTEGRITY: ${kernel.getSnapshot().state.standing.integrity}`);
    console.log("\n=== SIMULATION ENDED ===");
}

runDeloadSimulation().catch(console.error);
