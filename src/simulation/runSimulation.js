import { evaluateInstitution } from '../institution/standing-engine/evaluateInstitution.js';
import { StandingState } from '../institution/standing-engine/types.js';

// Simulation Config
const USER_COUNT = 100;
const SIMULATION_DAYS = 365;

// Archetypes
const ARCHETYPES = [
    { name: 'IRON_WILL', count: 10, discipline: 0.95, recoverySkill: 0.9 },
    { name: 'CONSISTENT', count: 40, discipline: 0.8, recoverySkill: 0.7 },
    { name: 'STRUGGLING', count: 30, discipline: 0.5, recoverySkill: 0.4 },
    { name: 'TOURIST', count: 20, discipline: 0.2, recoverySkill: 0.1 }
];

// Data Stats
let totalEvents = 0;
let churnedUsers = 0;
let standingHistory = []; // [day][state] -> count

// Helper: Generate Random Users
const users = [];
ARCHETYPES.forEach(arch => {
    for (let i = 0; i < arch.count; i++) {
        users.push({
            id: `${arch.name}_${i}`,
            type: arch.name,
            discipline: arch.discipline,
            recoverySkill: arch.recoverySkill,
            ledger: [], // History of events
            currentState: StandingState.PRE_INDUCTION,
            active: true
        });
    }
});

console.log(`Starting Simulation: ${USER_COUNT} Users, ${SIMULATION_DAYS} Days...`);

// Run Simulation
for (let day = 1; day <= SIMULATION_DAYS; day++) {
    const date = new Date(2025, 0, day).toISOString(); // 2025-01-01 start
    const dayStandingCounts = {};

    users.forEach(user => {
        if (!user.active) {
            incrementStats(dayStandingCounts, 'CHURNED');
            return;
        }

        // 0. Auto-Induct on Day 1 Logic
        if (day === 1 && user.currentState === StandingState.PRE_INDUCTION) {
            // Force induction
            user.ledger.push({ type: 'CONTRACT_CREATED', timestamp: date, payload: {} });
            totalEvents++;
        }

        // 1. Current State Evaluation (Morning)
        const evaluation = evaluateInstitution(user.ledger, date);
        user.currentState = evaluation.standing.state;

        // Special Handling for VIOLATED (The Pit)
        if (user.currentState === StandingState.VIOLATED) {
            // Decision: Quit or Recover?
            if (Math.random() < user.recoverySkill) {
                // RECOVER
                user.ledger.push({ type: 'ENTER_RECOVERY', timestamp: date, payload: {} });
                user.ledger.push({ type: 'CONTINUE_CYCLE', timestamp: date, payload: {} }); // Acknowledge
                totalEvents += 2;
                // Next day they will be in RECOVERY state
            } else {
                // CHURN
                user.active = false;
                churnedUsers++;
            }

            incrementStats(dayStandingCounts, user.currentState);
            return; // Day ends
        }

        // 2. Decide Action based on Discipline & State
        const decision = makeDailyDecision(user, evaluation.obligations);

        // 3. Generate Events
        if (decision.action === 'PRACTICE') {
            // Full Sequence
            const events = [
                { type: 'SESSION_STARTED', timestamp: date, payload: { venue: 'SIM_GYM' } },
                { type: 'EVIDENCE_SUBMITTED', timestamp: date, payload: { evidenceType: 'PHOTO' } },
                { type: 'SESSION_ENDED', timestamp: date, payload: { duration: '01:00:00' } },
                { type: 'CONTINUE_CYCLE', timestamp: date, payload: {} } // Acknowledge verdict
            ];
            user.ledger.push(...events);
            totalEvents += events.length;
        } else if (decision.action === 'REST') {
            const events = [
                { type: 'REST_TAKEN', timestamp: date, payload: { reason: 'REST_DAY' } },
                { type: 'CONTINUE_CYCLE', timestamp: date, payload: {} }
            ];
            user.ledger.push(...events);
            totalEvents += events.length;
        } else {
            // Missed / Fail
            // Emulate System Check generating the Violation
            const events = [
                { type: 'PRACTICE_MISSED', timestamp: date, payload: { reason: 'SIMULATED_MISS' } }
            ];
            user.ledger.push(...events);
            totalEvents += events.length;
        }

        // 4. Check Churn (Terminal State?)
        // If user is in VIOLATED state for > 7 days? Or just VIOLATED?
        // Let's assume VIOLATED is "Churn Risk". 
        // Real Churn = user stops generating events.
        if (user.currentState === 'VIOLATED') {
            // Chance to quit entirely
            if (Math.random() > user.recoverySkill) {
                user.active = false;
                churnedUsers++;
            }
        }

        incrementStats(dayStandingCounts, user.currentState);
    });

    standingHistory.push(dayStandingCounts);
}

// Analysis
console.log(`\n--- SIMULATION RESULTS ---`);
console.log(`Total Events Generated: ${totalEvents}`);
console.log(`Avg Events/User/Year: ${totalEvents / USER_COUNT}`);
console.log(`Churn Rate: ${(churnedUsers / USER_COUNT) * 100}%`);

// Final Standing Dist
const finalDay = standingHistory[SIMULATION_DAYS - 1];
console.log(`Final Standing Distribution:`, finalDay);

// Helper Functions
function makeDailyDecision(user, obligations) {
    if (obligations.length === 0) return { action: 'NONE' };

    // Base probability
    let p = user.discipline;

    // Momentum modifiers
    if (user.currentState === 'COMPLIANT') p += 0.05;
    if (user.currentState === 'RECOVERY') p += 0.1; // "Urgency"
    if (user.currentState === 'VIOLATED') p -= 0.2; // "Discouragement"

    // Obligation Type
    if (obligations.includes('DAILY_PRACTICE')) {
        if (Math.random() < p) return { action: 'PRACTICE' };
    }

    if (obligations.includes('REDUCED_PRACTICE')) {
        // Easier to do?
        if (Math.random() < (p + 0.2)) return { action: 'PRACTICE' };
    }

    return { action: 'MISS' };
}

function incrementStats(stats, key) {
    stats[key] = (stats[key] || 0) + 1;
}
