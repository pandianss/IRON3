/**
 * SIM-FIT-04: Rehabilitation Dominance
 * Purpose: Stress the recovery law.
 */
export const SIM_FIT_04 = {
    scenarioId: "SIM-FIT-04",
    name: "Rehabilitation Dominance (Recovery Stress)",
    description: "Testing institutional healing and stagnation cycles.",
    engineVersion: "ICE-0.1",
    duration: {
        days: 365,
        tick: "DAY"
    },
    randomization: {
        seed: 999,
        deterministic: true
    },
    institutionTemplate: "FITNESS_INSTITUTION_V1",

    weights: {
        wC: 0.1,
        wR: 0.6,    // Recovery is the dominant factor
        wI: 0.2,
        wS: 0.5,    // Stress is very punishing
        wT: 0.1
    },

    thresholds: {
        breached: 0.1,
        degraded: 0.3,
        strained: 0.6,
        ascending: 0.9
    },

    integrityDecayMultiplier: 1.0,

    archetypes: {
        "FRAGILE": {
            "count": 25,
            "physiology": {
                "baseCapacity": [0.2, 0.4],
                "recoveryRate": [0.2, 0.4],
                "strainSensitivity": [0.8, 0.95],
                "injuryThreshold": [0.3, 0.5]
            },
            "behavior": {
                "complianceBias": [0.6, 0.8],
                "motivationVolatility": [0.5, 0.8],
                "honestyFactor": [0.8, 0.9],
                "restAversion": [0.3, 0.6]
            }
        },
        "RECOVERING_HERO": {
            "count": 25,
            "physiology": {
                "baseCapacity": [0.5, 0.7],
                "recoveryRate": [0.6, 0.9],
                "strainSensitivity": [0.4, 0.6],
                "injuryThreshold": [0.6, 0.8]
            },
            "behavior": {
                "complianceBias": [0.9, 1.0],
                "motivationVolatility": [0.1, 0.3],
                "honestyFactor": [0.9, 1.0],
                "restAversion": [0.0, 0.2] // Respects rest, focuses on healing
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
        "REHABILITATING": { minDays: 30 } // Mandatory long rehab
    }
};
