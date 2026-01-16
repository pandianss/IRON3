export const INVARIANTS = [
    {
        id: 'INV-STND-01',
        description: 'Integrity must be a valid numeral [0-100].',
        severity: 'HIGH',
        check: (context) => {
            const integrity = context.state?.standing?.integrity;
            return typeof integrity === 'number' && integrity >= 0 && integrity <= 100;
        }
    },
    {
        id: 'INV-LIFE-01',
        description: 'Lifecycle stage must be a valid constitutional stage.',
        severity: 'CRITICAL',
        check: (context) => {
            const stage = context.state?.lifecycle?.stage;
            const validStages = ['GENESIS', 'PROBATION', 'ACTIVE', 'DEGRADABLE', 'COLLAPSED'];
            return validStages.includes(stage);
        }
    },
    {
        id: 'INV-LIFE-02',
        description: 'Lifecycle activeDays must be monotonic (non-decreasing).',
        severity: 'HIGH',
        check: (context) => {
            if (!context.previousSnapshot) return true;
            const currentDays = context.state?.lifecycle?.activeDays || 0;
            const previousDays = context.previousSnapshot.state?.lifecycle?.activeDays || 0;
            return currentDays >= previousDays;
        }
    },
    {
        id: 'INV-PHYS-01',
        description: 'Physiological Load cannot be negative.',
        severity: 'MEDIUM',
        check: (context) => {
            const load = context.state?.physiology?.load || 0;
            return load >= 0;
        }
    },
    {
        id: 'INV-ACT-01',
        description: 'Activated institutions must have nonzero health.',
        severity: 'SUPREME',
        check: (context) => {
            const stage = context.state?.lifecycle?.stage;
            const health = context.state?.physiology?.health || 0;
            if (stage === 'ACTIVE' && health <= 0) return false;
            return true;
        }
    },
    {
        id: 'INV-DEG-01',
        description: 'Degraded institutions cannot escalate privileges.',
        severity: 'HIGH',
        check: (context) => {
            const health = context.state?.physiology?.health || 0;
            const action = context.action || {};
            if (health < 40 && action.type === 'AUTHORITY_PROMOTE') return false;
            return true;
        }
    },
    {
        id: 'INV-DEG-02',
        description: 'Critical degradation triggers enforcement protocols.',
        severity: 'SUPREME',
        check: (context) => {
            const health = context.state?.physiology?.health || 0;
            // If health is below 10, it MUST be in CRITICAL or COLLAPSED band
            const band = context.state?.physiology?.status;
            if (health < 10 && band !== 'CRITICAL' && band !== 'COLLAPSED') return false;
            return true;
        }
    }
];
