import PrincipleRegistry from './principles/PrincipleRegistry.js';
import RuleEngine from './engine/RuleEngine.js';
import { FC00_CONTRACT } from '../ice/contract/definitions/FC-00.js';
import { FITNESS_LIFECYCLE_CONTRACT } from '../core/contracts/FC-FIT-01-LIFECYCLE.js';

// 1. Register Principles from Contracts
// FC-00
try {
    const fc00Principles = FC00_CONTRACT.invariants?.map((text, idx) => ({
        id: `P-FC00-${idx + 1}`,
        text: text,
        source: 'FC-00-GENESIS',
        level: 'supreme'
    })) || [];

    fc00Principles.forEach(p => PrincipleRegistry.register(p));
    console.log(`COMPLIANCE: Registered ${fc00Principles.length} principles from FC-00.`);
} catch (e) {
    console.warn("COMPLIANCE: Failed to register FC-00 principles", e);
}

// FC-FIT-01
try {
    const fit01Principles = FITNESS_LIFECYCLE_CONTRACT.invariants?.map((text, idx) => ({
        id: `P-FIT01-${idx + 1}`,
        text: text,
        source: 'FC-FIT-01-LIFECYCLE',
        level: 'derived'
    })) || [];

    fit01Principles.forEach(p => PrincipleRegistry.register(p));
    console.log(`COMPLIANCE: Registered ${fit01Principles.length} principles from FC-FIT-01.`);
} catch (e) {
    console.warn("COMPLIANCE: Failed to register FC-FIT-01 principles", e);
}

// 2. Register Rules (PEL)
// Example Rule: Enforce Cycle Integrity
RuleEngine.registerRule({
    id: 'R-CYCLE-01',
    description: 'Ensure generic cycle integrity',
    logic: (context) => {
        // Example logic
        return true;
    }
});

console.log("COMPLIANCE: Bootstrap Complete.");
