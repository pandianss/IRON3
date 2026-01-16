export const FITNESS_LIFECYCLE = Object.freeze({
    GENESIS: 'GENESIS',
    PROBATION: 'PROBATION',
    ACTIVE: 'ACTIVE',
    DEGRADABLE: 'DEGRADABLE',
    COLLAPSED: 'COLLAPSED'
});

export const FITNESS_LIFECYCLE_CONTRACT = {
    description: 'Constitutional lifecycle of the Fitness Institution',

    invariants: [
        'No institution may degrade before it is DEGRADABLE',
        'No institution may be degradable before it has been ACTIVE',
        'Degradation requires historical breach, not instantaneous score'
    ],

    entryConditions: {
        GENESIS: (inst) => inst.foundation?.why, // Basic check if genesis verdict submitted

        PROBATION: (inst, signals) =>
            signals.commitmentEvents >= 1,

        ACTIVE: (inst, signals) =>
            signals.positiveContinuityEvents >= 3 &&
            signals.activeDays >= 7,

        DEGRADABLE: (inst, signals) =>
            signals.activeDays >= 21 &&
            signals.continuityIndex >= 0.55,

        COLLAPSED: (inst, signals) =>
            signals.degradedDays >= 30 &&
            signals.continuityIndex < 0.2
    }
};
