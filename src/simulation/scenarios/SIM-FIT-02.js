/**
 * SIM-FIT-02: Outcome Differentiation
 * Purpose: Test whether the institution actually creates stratification.
 */
export const SIM_FIT_02 = {
    scenarioId: "SIM-FIT-02",
    name: "Outcome Differentiation (Stratification)",
    description: "Amplified integrity effects and increased breach penalties to force divergence.",
    engineVersion: "ICE-0.1",
    duration: {
        days: 365,
        tick: "DAY"
    },
    randomization: {
        seed: 424242,
        deterministic: true
    },
    institutionTemplate: "FITNESS_INSTITUTION_V1",

    // SCENARIO PARAMETERS (Consumed by parameterized engines)
    weights: {
        wC: 0.2,
        wR: 0.15,
        wI: 0.45,   // Heavy Integrity focus
        wS: 0.4,    // Higher Stress penalty
        wT: 0.1
    },

    thresholds: {
        breached: 0.25,
        degraded: 0.5,
        strained: 0.75,
        ascending: 0.85
    },

    integrityDecayMultiplier: 2.5, // Heavier recovery cost/penalty

    archetypes: {
        "ELITE": {
            "count": 10,
            "physiology": {
                "baseCapacity": [0.7, 0.85],
                "recoveryRate": [0.75, 0.95],
                "strainSensitivity": [0.2, 0.35],
                "injuryThreshold": [0.85, 0.95]
            },
            "behavior": {
                "complianceBias": [0.85, 0.98],
                "motivationVolatility": [0.05, 0.15],
                "honestyFactor": [0.95, 0.99],
                "restAversion": [0.1, 0.3]
            }
        },
        "STRUGGLING": {
            "count": 10,
            "physiology": {
                "baseCapacity": [0.3, 0.5],
                "recoveryRate": [0.3, 0.5],
                "strainSensitivity": [0.6, 0.8],
                "injuryThreshold": [0.4, 0.6]
            },
            "behavior": {
                "complianceBias": [0.4, 0.6],
                "motivationVolatility": [0.4, 0.7],
                "honestyFactor": [0.5, 0.8],
                "restAversion": [0.5, 0.8]
            }
        },
        "CHAOTIC_SENDER": {
            "count": 10,
            "physiology": {
                "baseCapacity": [0.6, 0.8],
                "recoveryRate": [0.4, 0.6],
                "strainSensitivity": [0.5, 0.7],
                "injuryThreshold": [0.6, 0.8]
            },
            "behavior": {
                "complianceBias": [0.7, 0.9],
                "motivationVolatility": [0.7, 0.9],
                "honestyFactor": [0.3, 0.6],
                "restAversion": [0.6, 0.9]
            }
        }
    },

    decisionEngines: {
        "FITNESS_DAILY_DECISION_V1": {
            "inputs": ["standing", "phase", "physiology", "behavior", "history"],
            "outputs": ["TRAINING_COMPLETED", "RECOVERY_COMPLETED", "REST_OBSERVED", "INJURY_DECLARED", "SESSION_MISSED", "DISHONEST_LOG"]
        }
    },

    phaseModel: {
        "GENESIS": { maxDays: 7 },
        "PROBATION": { minDays: 7 },
        "ACTIVE": {},
        "DEGRADED": {},
        "REHABILITATING": { minDays: 14 }
    }
};
