import { SimulationKernel } from '../src/simulation/harness/SimulationKernel.js';
import { SIM_FIT_03 } from '../src/simulation/scenarios/SIM-FIT-03.js';
import { initializeKernel } from '../src/compliance/bootstrap.js';
import { ConstitutionalKernel } from '../src/compliance/kernel/kernel.js';

async function verifySovereignty() {
    console.log("--- KERNEL SOVEREIGNTY RUNTIME VERIFICATION ---");

    // 1. Initialize Simulation and Kernel
    const sim = new SimulationKernel(SIM_FIT_03);
    const kernel = await initializeKernel(sim);

    // --- TEST 1: Bypass Attempt (Direct ICE Ingest without Gate) ---
    // In our implementation, ICE ingest IS gated. 
    // But let's verify that a "SUPREME" violation triggers an enforcer response.
    console.log("\nTEST 1: supreme Violation Enforcement (Automatic Suspension)");
    try {
        await sim.kernel.ingest('ACTIVATE_INSTITUTION', {
            health: 50, // Below P-ACT-01 threshold (80)
            foundation: { why: "Test Purpose" }
        }, "UnauthorizedActor"); // R-SYS-01 should also trigger

        console.error("FAIL: Supreme Violation allowed through ICE.ingest");
    } catch (e) {
        console.log("PASS: Supreme Violation Blocked:", e.message);

        // Verify Enforcement: Stage should be SUSPENDED
        const snapshot = sim.kernel.getSnapshot();
        if (snapshot.state.lifecycle.stage === 'SUSPENDED') {
            console.log("PASS: Institution automatically SUSPENDED by CCL.");
        } else {
            console.error("FAIL: Institution NOT suspended. Current Stage:", snapshot.state.lifecycle.stage);
        }
    }

    // --- TEST 2: Pre-Bootstrap Guard ---
    // We can't really test this easily without a new process, 
    // but initializeKernel ensures only one instance exists.

    // --- TEST 3: Action Provenance (R-SYS-01) ---
    console.log("\nTEST 2: Actor Provenance Verification (R-SYS-01)");
    try {
        await kernel.getGate().govern({
            type: "AUTHORITY_PROMOTE",
            actor: "MaliciousScript",
            payload: {}
        }, () => {
            console.error("FAIL: Malicious Actor allowed.");
        });
    } catch (e) {
        console.log("PASS: Malicious Actor Blocked:", e.message);
    }

    // --- TEST 4: Emergency Override (R-SYS-02) ---
    console.log("\nTEST 3: Sovereign Recovery Override (Escape Hatch)");
    const recoveryResult = await kernel.getGate().govern({
        type: "EMERGENCY_RESET",
        actor: "OVERRIDE_ADMIN",
        payload: { overrideToken: "SOVEREIGN_RECOVERY" }
    }, async () => {
        return "RECOVERY_SUCCESS";
    });

    if (recoveryResult === "RECOVERY_SUCCESS") {
        console.log("PASS: Sovereign Recovery Override Successful.");
    } else {
        console.error("FAIL: Sovereign Recovery Blocked or Failed.");
    }

    console.log("\n--- VERIFICATION COMPLETE ---");
}

verifySovereignty().catch(console.error);
