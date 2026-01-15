/**
 * SIM-FIT-03: Adversarial Pressure
 * Purpose: Test whether the institution resists gaming.
 */
export const SIM_FIT_03 = {
    scenarioId: "SIM-FIT-03",
    name: "Adversarial Pressure (Gaming Resistance)",
    description: "Testing institutional resistance to bad-faith actors.",
    engineVersion: "ICE-0.1",
    duration: {
        days: 365,
        tick: "DAY"
    },
    randomization: {
        seed: 1337,
        deterministic: true
    },
    institutionTemplate: "FITNESS_INSTITUTION_V1",

    weights: {
        wC: 0.4,    // High continuity focus (hard to fake)
        wR: 0.1,
        wI: 0.5,    // Extreme Integrity focus (catches liars)
        wS: 0.3,
        wT: 0.1
    },

    thresholds: {
        breached: 0.3,
        degraded: 0.6,
        strained: 0.8,
        ascending: 0.9
    },

    integrityDecayMultiplier: 4.0, // Zero tolerance for dishonesty

    archetypes: {
        "MINIMALIST": {
            "count": 10,
            "physiology": {
                "baseCapacity": [0.5, 0.6],
                "recoveryRate": [0.5, 0.6],
                "strainSensitivity": [0.4, 0.5],
                "injuryThreshold": [0.6, 0.7]
            },
            "behavior": {
                "complianceBias": [0.1, 0.2], // Does bare minimum
                "motivationVolatility": [0.05, 0.1],
                "honestyFactor": [0.9, 1.0],
                "restAversion": [0.0, 0.1]
            }
        },
        "OPTIMIZER": {
            "count": 10,
            "physiology": {
                "baseCapacity": [0.6, 0.8],
                "recoveryRate": [0.6, 0.8],
                "strainSensitivity": [0.3, 0.5],
                "injuryThreshold": [0.7, 0.8]
            },
            "behavior": {
                "complianceBias": [0.9, 1.0],
                "motivationVolatility": [0.1, 0.2],
                "honestyFactor": [0.5, 0.7], // Fakes just enough to look good
                "restAversion": [0.4, 0.6]
            }
        },
        "LIAR": {
            "count": 10,
            "physiology": {
                "baseCapacity": [0.3, 0.4],
                "recoveryRate": [0.3, 0.4],
                "strainSensitivity": [0.7, 0.9],
                "injuryThreshold": [0.3, 0.5]
            },
            "behavior": {
                "complianceBias": [0.95, 1.0], // Claims high compliance
                "motivationVolatility": [0.1, 0.2],
                "honestyFactor": [0.0, 0.1], // Systematic dishonesty
                "restAversion": [0.5, 0.9]
            }
        },
        "OVERFITTER": {
            "count": 10,
            "physiology": {
                "baseCapacity": [0.8, 0.9],
                "recoveryRate": [0.2, 0.4],
                "strainSensitivity": [0.8, 0.9],
                "injuryThreshold": [0.5, 0.6]
            },
            "behavior": {
                "complianceBias": [1.0, 1.0],
                "motivationVolatility": [0.0, 0.1],
                "honestyFactor": [0.9, 1.0],
                "restAversion": [0.9, 1.0] // Never rests, always maximizes load
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
        "PROBATION": { minDays: 14 }, // Longer probation to detect gaming
        "ACTIVE": {},
        "DEGRADED": {},
        "REHABILITATING": { minDays: 21 }
    }
};
