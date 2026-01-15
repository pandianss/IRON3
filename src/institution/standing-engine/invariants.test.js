import { evaluateInstitution } from './evaluateInstitution.js';
import { StandingState } from './types.js';

// Simple Test Runner
const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

function run() {
    let passed = 0;
    console.log("Running Standing Engine Invariants...");

    tests.forEach(({ name, fn }) => {
        try {
            fn();
            console.log(`✅ ${name}`);
            passed++;
        } catch (e) {
            console.error(`❌ ${name}`);
            console.error(e);
        }
    });

    console.log(`\nResult: ${passed}/${tests.length} passed.`);
}

const assert = (condition, msg) => { if (!condition) throw new Error(msg); };

// --- TESTS ---

test("Invariant: Induction -> Compliant after First Practice", () => {
    // Note: Starts at PRE_INDUCTION by default in new engine.
    // Need CONTRACT_CREATED to get to INDUCTED first.
    const ledger = [
        { type: 'CONTRACT_CREATED', timestamp: '2026-01-01T08:00:00Z' },
        { type: 'PRACTICE_COMPLETE', timestamp: '2026-01-01T10:00:00Z' }
    ];
    const result = evaluateInstitution(ledger, '2026-01-01T12:00:00Z');

    assert(result.standing.state === StandingState.COMPLIANT, `Should be COMPLIANT, got ${result.standing.state}`);
    assert(result.standing.streak === 1, "Streak should appear");
});

test("Invariant: Promotion - 30 days of Compliant promotes to Institutional", () => {
    // Generate 30 days
    const ledger = [{ type: 'CONTRACT_CREATED', timestamp: '2026-01-01' }];

    // Day 1 (First Compliance -> Compliant)
    // Days 2-30 (Compliant -> Compliant)
    for (let i = 1; i <= 30; i++) {
        ledger.push({
            type: 'PRACTICE_COMPLETE',
            timestamp: `2026-01-${String(i).padStart(2, '0')}T10:00:00Z`
        });
    }

    const result = evaluateInstitution(ledger, '2026-02-01');
    assert(result.standing.state === StandingState.INSTITUTIONAL, `Should be INSTITUTIONAL, got ${result.standing.state}`);
});

test("Invariant: The Fall - Practice Missed in Compliant causes Violation", () => {
    // Setup: Contract + 1 Practice (Compliant) + 1 Miss
    const ledger = [
        { type: 'CONTRACT_CREATED', timestamp: '2026-01-01' },
        { type: 'PRACTICE_COMPLETE', timestamp: '2026-01-01' },
        { type: 'PRACTICE_MISSED', timestamp: '2026-01-02' }
    ];

    const result = evaluateInstitution(ledger, '2026-01-03');

    assert(result.standing.state === StandingState.VIOLATED, `Should be VIOLATED, got ${result.standing.state}`);
    assert(result.standing.streak === 0, "Streak should be reset/frozen to 0");
    assert(result.scars.fractures === 1, "Should have 1 fracture scar");
});

test("Invariant: Recovery - Must enter recovery and practice to Reconstitute", () => {
    // 1. Fracture the user (Violated)
    const ledger = [
        { type: 'CONTRACT_CREATED', timestamp: '2026-01-01' },
        { type: 'PRACTICE_COMPLETE', timestamp: '2026-01-01' },
        { type: 'PRACTICE_MISSED', timestamp: '2026-01-02' }
    ];

    // 2. Enter Recovery
    ledger.push({ type: 'ENTER_RECOVERY', timestamp: '2026-01-03' });

    // 3. Practice 3 times (Recovery Rule: 3rd makes Reconstituted)
    ledger.push({ type: 'PRACTICE_COMPLETE', timestamp: '2026-01-03' });
    ledger.push({ type: 'PRACTICE_COMPLETE', timestamp: '2026-01-04' });
    ledger.push({ type: 'PRACTICE_COMPLETE', timestamp: '2026-01-05' });

    const result = evaluateInstitution(ledger, '2026-01-05');
    assert(result.standing.state === StandingState.RECONSTITUTED, `Should be RECONSTITUTED, got ${result.standing.state}`);
    assert(result.scars.recoveries === 1, "Should have 1 recovery scar");
});

run();
