/******************************************************************************************
 * DISCIPLINE WINDOW COMPLIANCE TEST
 * 
 * Verifies the Discipline Window State Machine and Validity Logic.
 ******************************************************************************************/

import { DisciplineWindowKernel } from '../kernel/disciplineWindowKernel.js';
import { WINDOW_STATES, VALIDITY_STATUS, WINDOW_CONSTRAINTS } from '../kernel/DisciplineWindow.schema.js';

async function runTests() {
    console.log("--- STARTING DISCIPLINE WINDOW TESTS ---");

    // Test 1: Canonical Flow
    console.log("\nTEST 1: Canonical Flow (IDLE -> SEALED)...");
    let window = DisciplineWindowKernel.createDisciplineWindow();

    window = DisciplineWindowKernel.transition(window, WINDOW_STATES.PRIMED);
    window = DisciplineWindowKernel.transition(window, WINDOW_STATES.OPEN);
    window = DisciplineWindowKernel.transition(window, WINDOW_STATES.ACTIVE);

    // Simulate 10 minutes of discipline
    window.openedAt -= 600 * 1000;

    window = DisciplineWindowKernel.transition(window, WINDOW_STATES.CLOSED_VALID);
    const validity = DisciplineWindowKernel.computeValidity(window);

    if (validity.valid && validity.status === VALIDITY_STATUS.SUSTAINED) {
        console.log("√ PASS: Canonical flow recognized as SUSTAINED.");
    } else {
        console.error("! FAIL: Canonical flow failed validity check.", validity);
    }

    // Test 2: Interruption Degradation
    console.log("\nTEST 2: Interruption Degradation...");
    let intWindow = DisciplineWindowKernel.createDisciplineWindow();
    intWindow = DisciplineWindowKernel.transition(intWindow, WINDOW_STATES.PRIMED);
    intWindow = DisciplineWindowKernel.transition(intWindow, WINDOW_STATES.OPEN);
    intWindow = DisciplineWindowKernel.transition(intWindow, WINDOW_STATES.ACTIVE);

    // 4 interruptions (Max is 3)
    for (let i = 0; i < 4; i++) {
        intWindow = DisciplineWindowKernel.transition(intWindow, WINDOW_STATES.INTERRUPTED);
        intWindow = DisciplineWindowKernel.transition(intWindow, WINDOW_STATES.ACTIVE);
    }

    intWindow.openedAt -= 600 * 1000;
    intWindow = DisciplineWindowKernel.transition(intWindow, WINDOW_STATES.CLOSED_VALID);
    const intValidity = DisciplineWindowKernel.computeValidity(intWindow);

    if (intValidity.status === VALIDITY_STATUS.DEGRADED && !intValidity.valid) {
        console.log("√ PASS: Excessive interruptions correctly degraded validity.");
    } else {
        console.error("! FAIL: Excessive interruptions not correctly handled.", intValidity);
    }

    // Test 3: Insufficient Duration
    console.log("\nTEST 3: Insufficient Duration...");
    let shortWindow = DisciplineWindowKernel.createDisciplineWindow();
    shortWindow = DisciplineWindowKernel.transition(shortWindow, WINDOW_STATES.PRIMED);
    shortWindow = DisciplineWindowKernel.transition(shortWindow, WINDOW_STATES.OPEN);
    shortWindow = DisciplineWindowKernel.transition(shortWindow, WINDOW_STATES.ACTIVE);

    // Only 2 minutes (Min is 5)
    shortWindow.openedAt -= 120 * 1000;
    shortWindow = DisciplineWindowKernel.transition(shortWindow, WINDOW_STATES.CLOSED_VALID);
    const shortValidity = DisciplineWindowKernel.computeValidity(shortWindow);

    if (shortValidity.status === VALIDITY_STATUS.INSUFFICIENT) {
        console.log("√ PASS: Insufficient duration correctly identified.");
    } else {
        console.error("! FAIL: Insufficient duration not identified.", shortValidity);
    }

    // Test 4: Invalid Transitions
    console.log("\nTEST 4: Invalid Transition Protection...");
    let protWindow = DisciplineWindowKernel.createDisciplineWindow();
    try {
        DisciplineWindowKernel.transition(protWindow, WINDOW_STATES.ACTIVE);
        console.error("! FAIL: Allowed transition to ACTIVE from IDLE.");
    } catch (e) {
        console.log(`√ PASS: Illegal transition blocked: ${e.message}`);
    }

    // Test 5: Expiration
    console.log("\nTEST 5: Window Expiration...");
    let expWindow = DisciplineWindowKernel.createDisciplineWindow();
    expWindow = DisciplineWindowKernel.transition(expWindow, WINDOW_STATES.PRIMED);
    expWindow = DisciplineWindowKernel.transition(expWindow, WINDOW_STATES.OPEN);
    expWindow = DisciplineWindowKernel.transition(expWindow, WINDOW_STATES.ACTIVE);

    expWindow = DisciplineWindowKernel.transition(expWindow, WINDOW_STATES.EXPIRED);
    const expValidity = DisciplineWindowKernel.computeValidity(expWindow);

    if (expValidity.status === VALIDITY_STATUS.EXPIRED) {
        console.log("√ PASS: Window expiration correctly handled.");
    } else {
        console.error("! FAIL: Window expiration not handled correctly.");
    }

    console.log("\n--- DISCIPLINE WINDOW TESTS COMPLETE ---");
}

runTests().catch(console.error);
