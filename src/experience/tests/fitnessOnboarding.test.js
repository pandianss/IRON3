import { InstitutionalKernel } from '../../ice/InstitutionalKernel.js';

async function runOnboardingSimulation() {
    console.log("--- STARTING FITNESS ONBOARDING SIMULATION ---");

    const kernel = new InstitutionalKernel({
        scenario: {
            weights: { wC: 0.3, wI: 0.3, wR: 0.2, wS: 0.3, wT: 0.1 }
        }
    });

    // ACT 1: Activation from Void
    console.log("\nACT 1: Induction Initiation");
    await kernel.ingest('INIT_INDUCTION', { timestamp: new Date().toISOString() }, 'USER_HOST');

    // ACT 2: Complete Induction
    console.log("\nACT 2: Induction Completion");
    await kernel.ingest('GENESIS_VERDICT_SUBMITTED', { consent: true, why: "To maintain my sovereign body." }, 'USER_HOST');
    await kernel.ingest('MODULE_ACTIVATED', { moduleId: 'FITNESS_RECOVERY' }, 'USER_HOST');

    let snapshot = kernel.getSnapshot();
    console.log("Phase:", snapshot.phase);
    console.log("Standing State:", snapshot.state.standing.state);

    if (snapshot.state.standing.state !== 'INDUCTED' && snapshot.state.standing.state !== 'COMPLIANT') {
        throw new Error("FAILED: Induction did not transition standing state correctly.");
    }

    // ACT 3: Initiate Ritual
    console.log("\nACT 3: Threshold Entry -> Initiate Ritual");
    await kernel.ingest('INIT_RITUAL', { timestamp: new Date().toISOString() }, 'USER_HOST');

    snapshot = kernel.getSnapshot();
    console.log("Session Status:", snapshot.state.session.status);
    if (snapshot.state.session.status !== 'PENDING') {
        throw new Error(`FAILED: INIT_RITUAL did not set session to PENDING. Got ${snapshot.state.session.status}`);
    }

    // ACT 4: Start Session
    console.log("\nACT 4: Ritual Acts -> Session Started");
    await kernel.ingest('SESSION_STARTED', {
        timestamp: new Date().toISOString(),
        venue: 'HOME GYM',
        dayType: 'STRENGTH'
    }, 'USER_HOST');

    snapshot = kernel.getSnapshot();
    console.log("Session Status:", snapshot.state.session.status);
    if (snapshot.state.session.status !== 'ACTIVE') {
        throw new Error("FAILED: SESSION_STARTED did not set session to ACTIVE.");
    }

    // ACT 5: End Session
    console.log("\nACT 5: Protocol Closure -> Session Ended");
    await kernel.ingest('SESSION_ENDED', {
        timestamp: new Date().toISOString(),
        tags: ['LEGS', 'VOLUME'],
        window: { validity: { valid: true, status: 'sustained' } }
    }, 'USER_HOST');

    snapshot = kernel.getSnapshot();
    console.log("Session Status:", snapshot.state.session.status);
    console.log("Ritual Today Completed:", snapshot.state.rituals.todayCompleted);
    console.log("Streak:", snapshot.state.standing.streak);

    if (snapshot.state.session.status !== 'IDLE') {
        throw new Error("FAILED: SESSION_ENDED did not reset session to IDLE.");
    }
    if (!snapshot.state.rituals.todayCompleted) {
        throw new Error("FAILED: Ritual completion not recorded.");
    }
    if (snapshot.state.standing.streak !== 1) {
        throw new Error(`FAILED: Streak increment failed. Got ${snapshot.state.standing.streak}`);
    }

    console.log("\n--- FITNESS ONBOARDING SIMULATION SUCCESSFUL ---");
}

runOnboardingSimulation().catch(err => {
    console.error("\n!!! SIMULATION FAILED !!!");
    console.error(err.message);
    process.exit(1);
});
