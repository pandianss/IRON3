/**
 * Verify Compliance PEL
 * Verifies the Rule Engine and Decision Interceptor.
 */

import RuleEngine from '../src/compliance/pel/RuleEngine.js';
import DecisionInterceptor from '../src/compliance/pel/DecisionInterceptor.js';

async function runVerification() {
    console.log('Starting PEL Verification...');

    try {
        // 1. Register Mock Rules
        console.log('1. Registering Mock Rules...');

        RuleEngine.registerRule({
            id: 'R_MUST_BE_MORNING',
            description: 'Action only allowed before noon.',
            logic: (context) => {
                const hour = context.date.getHours();
                return {
                    allowed: hour < 12,
                    reason: hour < 12 ? 'It is morning.' : 'It is past noon.'
                };
            }
        });

        RuleEngine.registerRule({
            id: 'R_STANDING_MUST_BE_HIGH',
            description: 'User standing must be > 5.',
            logic: (context) => context.standing > 5
        });

        console.log('   Rules registered.');

        // 2. Evaluate Rules Directly
        console.log('\n2. Testing Rule Evaluation...');

        const morningContext = { date: new Date('2026-01-16T09:00:00') };
        const afternoonContext = { date: new Date('2026-01-16T14:00:00') };

        const r1 = RuleEngine.evaluate('R_MUST_BE_MORNING', morningContext);
        if (r1.allowed) console.log('   MATCH: Morning rule passed for morning time.');
        else throw new Error('FAILED: Morning rule failed for morning time.');

        const r2 = RuleEngine.evaluate('R_MUST_BE_MORNING', afternoonContext);
        if (!r2.allowed) console.log('   MATCH: Morning rule failed for afternoon time.');
        else throw new Error('FAILED: Morning rule passed for afternoon time.');

        // 3. Test Decision Interceptor
        console.log('\n3. Testing Decision Interceptor...');

        const actionContext = {
            date: new Date('2026-01-16T09:00:00'),
            standing: 3 // Should fail R_STANDING_MUST_BE_HIGH
        };

        const result = DecisionInterceptor.intercept('Critical Action', actionContext, ['R_MUST_BE_MORNING', 'R_STANDING_MUST_BE_HIGH']);

        if (!result.allowed) {
            console.log('   MATCH: Interceptor correctly blocked action.');
            console.log('   Reasons:', result.rejectionReasons);
        } else {
            throw new Error('FAILED: Interceptor allowed action that should have failed.');
        }

        // Test passing case
        const validContext = {
            date: new Date('2026-01-16T09:00:00'),
            standing: 10
        };
        const validResult = DecisionInterceptor.intercept('Critical Action', validContext, ['R_MUST_BE_MORNING', 'R_STANDING_MUST_BE_HIGH']);

        if (validResult.allowed) {
            console.log('   MATCH: Interceptor correctly allowed valid action.');
        } else {
            throw new Error('FAILED: Interceptor blocked valid action.');
        }

        console.log('\n✅ PEL VERIFICATION SUCCESSFUL');

    } catch (error) {
        console.error('\n❌ PEL VERIFICATION FAILED');
        console.error(error);
        process.exit(1);
    }
}

runVerification();
