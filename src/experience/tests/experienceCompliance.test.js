/******************************************************************************************
 * EXPERIENCE COMPLIANCE TEST
 * 
 * Verifies the Experience Kernel's enforcement of phase and surface logic.
 ******************************************************************************************/

import { ExperienceKernel } from '../kernel/experienceKernel.js';

const mockSnapshot = (overrides = {}) => {
    return {
        state: {
            standing: { integrity: 100, streak: 5 },
            physiology: { health: 100, status: 'OPTIMAL' },
            lifecycle: { stage: 'ACTIVE' },
            authority: { level: 3 },
            rituals: { todayCompleted: true },
            ...overrides
        },
        compliance: {
            riskLevel: 'LOW'
        }
    };
};

async function runTests() {
    console.log("--- STARTING EXPERIENCE COMPLIANCE TESTS ---");

    // Test 1: Phase Resolution
    console.log("\nTEST 1: Phase Resolution...");
    const activeSnapshot = mockSnapshot();
    const ctx = ExperienceKernel.authorizeSurface("Standing", activeSnapshot);
    if (ctx.phase === 'active') {
        console.log("√ PASS: Correctly identified ACTIVE phase.");
    } else {
        console.error(`! FAIL: Identified phase as ${ctx.phase}`);
    }

    // Test 2: Surface Authorization (Success)
    console.log("\nTEST 2: Surface Authorization (Allowed)...");
    try {
        ExperienceKernel.authorizeSurface("Archive", activeSnapshot);
        console.log("√ PASS: Archive access allowed in ACTIVE phase.");
    } catch (e) {
        console.error(`! FAIL: Archive access denied: ${e.message}`);
    }

    // Test 3: Surface Authorization (Failure)
    console.log("\nTEST 3: Surface Authorization (Prohibited)...");
    const restrictedSnapshot = mockSnapshot({ authority: { level: 1 }, lifecycle: { stage: 'INITIATED' } });
    try {
        ExperienceKernel.authorizeSurface("Archive", restrictedSnapshot);
        console.error("! FAIL: Archive access allowed in INITIATED phase.");
    } catch (e) {
        console.log(`√ PASS: Archive access blocked as expected: ${e.message}`);
    }

    // Test 4: Ritual Enforcement
    console.log("\nTEST 4: Ritual Enforcement...");
    const ritualPendingSnapshot = mockSnapshot({ rituals: { todayCompleted: false } });
    const ritualGate = ExperienceKernel.requireDailyRitual(ritualPendingSnapshot);
    if (ritualGate.required) {
        console.log("√ PASS: Ritual correctly required.");
    } else {
        console.error("! FAIL: Ritual not required when pending.");
    }

    // Test 5: Sovereign Access
    console.log("\nTEST 5: Sovereign Access...");
    const sovereignSnapshot = mockSnapshot({ authority: { level: 5 } });
    const sovCtx = ExperienceKernel.authorizeSurface("Governance", sovereignSnapshot);
    if (sovCtx.phase === 'sovereign') {
        console.log("√ PASS: Governance access granted in SOVEREIGN phase.");
    } else {
        console.error(`! FAIL: Phase should be sovereign, got ${sovCtx.phase}`);
    }

    console.log("\n--- EXPERIENCE COMPLIANCE TESTS COMPLETE ---");
}

runTests().catch(console.error);
