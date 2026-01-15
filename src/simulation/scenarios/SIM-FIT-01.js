/**
 * SIM-FIT-01: Machine-Typed Scenario Schema
 * Institutional Simulation Definition
 */
export const SIM_FIT_01 = {
    scenarioId: "SIM-FIT-01",
    name: "100-Person Fitness Institution (1 Year)",
    description: "Multi-institution simulation of Fitness Institution across 100 individuals over 365 days.",
    engineVersion: "ICE-0.1",
    duration: {
        days: 365,
        tick: "DAY"
    },
    randomization: {
        seed: 889133,
        deterministic: true
    },
    institutionTemplate: "FITNESS_INSTITUTION_V1",
    phases: ["GENESIS", "PROBATION", "ACTIVE", "DEGRADED", "REHABILITATING"],

    archetypes: {
        "CONSISTENT": {
            "count": 20,
            "physiology": {
                "baseCapacity": [0.55, 0.75],
                "recoveryRate": [0.65, 0.85],
                "strainSensitivity": [0.3, 0.45],
                "injuryThreshold": [0.75, 0.9]
            },
            "behavior": {
                "complianceBias": [0.75, 0.9],
                "motivationVolatility": [0.1, 0.25],
                "honestyFactor": [0.85, 0.95],
                "restAversion": [0.2, 0.4]
            }
        },

        "INTENSE": {
            "count": 20,
            "physiology": {
                "baseCapacity": [0.65, 0.85],
                "recoveryRate": [0.4, 0.6],
                "strainSensitivity": [0.55, 0.75],
                "injuryThreshold": [0.6, 0.75]
            },
            "behavior": {
                "complianceBias": [0.8, 0.95],
                "motivationVolatility": [0.4, 0.7],
                "honestyFactor": [0.6, 0.8],
                "restAversion": [0.6, 0.85]
            }
        },

        "FRAGILE_STARTER": {
            "count": 20,
            "physiology": {
                "baseCapacity": [0.3, 0.5],
                "recoveryRate": [0.4, 0.6],
                "strainSensitivity": [0.6, 0.8],
                "injuryThreshold": [0.45, 0.65]
            },
            "behavior": {
                "complianceBias": [0.4, 0.65],
                "motivationVolatility": [0.5, 0.8],
                "honestyFactor": [0.75, 0.9],
                "restAversion": [0.4, 0.6]
            }
        },

        "DISHONEST_OPTIMIST": {
            "count": 20,
            "physiology": {
                "baseCapacity": [0.5, 0.7],
                "recoveryRate": [0.45, 0.65],
                "strainSensitivity": [0.45, 0.65],
                "injuryThreshold": [0.55, 0.75]
            },
            "behavior": {
                "complianceBias": [0.6, 0.8],
                "motivationVolatility": [0.3, 0.6],
                "honestyFactor": [0.3, 0.55],
                "restAversion": [0.5, 0.7]
            }
        },

        "CYCLIC": {
            "count": 20,
            "physiology": {
                "baseCapacity": [0.55, 0.75],
                "recoveryRate": [0.5, 0.7],
                "strainSensitivity": [0.45, 0.65],
                "injuryThreshold": [0.6, 0.8]
            },
            "behavior": {
                "complianceBias": [0.5, 0.8],
                "motivationVolatility": [0.6, 0.9],
                "honestyFactor": [0.7, 0.9],
                "restAversion": [0.45, 0.7]
            }
        }
    },

    decisionEngines: {
        "FITNESS_DAILY_DECISION_V1": {
            "inputs": [
                "standing",
                "phase",
                "physiology",
                "behavior",
                "memoryWindow",
                "authority"
            ],

            "outputs": [
                "TRAINING_COMPLETED",
                "RECOVERY_COMPLETED",
                "REST_OBSERVED",
                "STRAIN_REPORTED",
                "INJURY_DECLARED",
                "SESSION_MISSED",
                "DISHONEST_LOG",
                "NO_EVENT"
            ]
        }
    },

    phaseModel: {
        "GENESIS": {
            "maxDays": 7,
            "contractsActive": ["FC-00"],
            "standingPolicy": "NO_NEGATIVE",
            "breachPolicy": "SUPPRESSED"
        },

        "PROBATION": {
            "minDays": 7,
            "contractsActive": ["FC-00", "FC-01", "FC-02", "FC-03"],
            "standingPolicy": "SOFT_NEGATIVE",
            "breachPolicy": "OBSERVE_ONLY"
        },

        "ACTIVE": {
            "contractsActive": ["FC-01", "FC-02", "FC-03", "FC-04", "FC-05", "FC-06"],
            "standingPolicy": "FULL",
            "breachPolicy": "FULL"
        },

        "DEGRADED": {
            "contractsActive": ["FC-01", "FC-02", "FC-04", "FC-05", "FC-06"],
            "standingPolicy": "AMPLIFIED",
            "breachPolicy": "ESCALATED"
        },

        "REHABILITATING": {
            "contractsActive": ["FC-02", "FC-04", "FC-05", "FC-06"],
            "standingPolicy": "RECOVERY_DOMINANT",
            "breachPolicy": "TRANSFORMED"
        }
    },

    metrics: [
        "standing.daily",
        "phase.timeline",
        "contract.breaches",
        "authority.restrictions",
        "rehabilitation.cycles",
        "continuity.streaks",
        "dishonesty.events",
        "injury.events"
    ],

    outputs: {
        "artifacts": [
            "standing_timelines.json",
            "phase_transitions.json",
            "contract_breach_matrix.json",
            "authority_map.json",
            "institutional_outcomes.json"
        ],

        "visualizations": [
            "standing_surfaces",
            "rehabilitation_maps",
            "archetype_comparisons",
            "integrity_decay_charts"
        ]
    },

    invariants: [
        "No institution may enter DEGRADED in GENESIS",
        "No standing vector may be negative",
        "Stress may not decay without recovery",
        "Rehabilitation must be reachable",
        "Integrity decay must amplify other deltas",
        "Different archetypes must diverge by day 90"
    ]
};
