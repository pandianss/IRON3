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

    // Test 6: Illegal Surface Blocked by Phase
    console.log("\nTEST 6: Illegal Surface Blocked by Phase...");
    const boundSnapshot = mockSnapshot({ authority: { level: 2 }, lifecycle: { stage: 'BOUND' } });
    try {
        ExperienceKernel.authorizeSurface("Archive", boundSnapshot);
        console.error("! FAIL: Archive access allowed in BOUND phase.");
    } catch (e) {
        console.log(`√ PASS: Illegal access blocked: ${e.message}`);
    }

    // Test 7: Verdict Pending Blocks Non-Verdict Surfaces
    console.log("\nTEST 7: Verdict Pending Blocks Non-Verdict Surfaces...");
    const verdictPendingSnapshot = mockSnapshot({ verdictPending: true });
    try {
        ExperienceKernel.authorizeSurface("Standing", verdictPendingSnapshot);
        console.error("! FAIL: Standing access allowed with verdict pending.");
    } catch (e) {
        console.log(`√ PASS: Blocked by pending verdict: ${e.message}`);
    }

    // Test 8: Failed Phase Cannot Access Active Surfaces
    console.log("\nTEST 8: Failed Phase Cannot Access Active Surfaces...");
    const failedSnapshot = mockSnapshot({ lifecycle: { stage: 'COLLAPSED' } });
    try {
        ExperienceKernel.authorizeSurface("Standing", failedSnapshot);
        console.error("! FAIL: Standing access allowed in FAILED phase.");
    } catch (e) {
        console.log(`√ PASS: FAILED phase restriction enforced: ${e.message}`);
    }

    // Test 9: Standing Object Integrity
    console.log("\nTEST 9: Standing Object Integrity...");
    const standing = sovCtx.standing;
    if (standing && standing.integrity && standing.health && standing.continuity) {
        console.log("√ PASS: Standing object contains mandatory fields.");
    } else {
        console.error("! FAIL: Standing object is incomplete.");
    }

    // Test 10: Surface Contract Violation (Unsupported Phase)
    console.log("\nTEST 10: Surface Contract Violation (Unsupported Phase)...");
    const activeSnapshotForContract = mockSnapshot({ authority: { level: 3 }, lifecycle: { stage: 'ACTIVE' } });
    const inductionContract = { supportedPhases: ['initiated'], authorityRange: [0, 1] };
    try {
        ExperienceKernel.validateSurfaceContract("Induction", inductionContract, activeSnapshotForContract);
        console.error("! FAIL: Induction allowed in ACTIVE phase via contract.");
    } catch (e) {
        console.log(`√ PASS: Contract violation blocked: ${e.message}`);
    }

    // Test 11: Surface Contract Violation (Authority Range)
    console.log("\nTEST 11: Surface Contract Violation (Authority Range)...");
    const lowAuthSnapshot = mockSnapshot({ authority: { level: 1 }, lifecycle: { stage: 'ACTIVE' } });
    const activeContract = { supportedPhases: ['active'], authorityRange: [3, 5] };
    try {
        ExperienceKernel.validateSurfaceContract("Dashboard", activeContract, lowAuthSnapshot);
        console.error("! FAIL: Dashboard allowed with low authority via contract.");
    } catch (e) {
        console.log(`√ PASS: Authority violation blocked: ${e.message}`);
    }

    // Test 12: Missing Contract Assertion
    console.log("\nTEST 12: Missing Contract Assertion...");
    try {
        ExperienceKernel.validateSurfaceContract("OrphanSurface", null, activeSnapshotForContract);
        console.error("! FAIL: Surface without contract allowed.");
    } catch (e) {
        console.log(`√ PASS: Missing contract blocked: ${e.message}`);
    }

    console.log("\n--- EXPERIENCE COMPLIANCE TESTS COMPLETE ---");
}

runTests().catch(console.error);
