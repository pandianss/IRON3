export const INVARIANTS = [
    {
        id: 'inv-001',
        description: 'Standing Integrity must be monotonic within a day (mock)',
        severity: 'HIGH',
        check: (context) => {
            return true; // Placeholder
        }
    },
    {
        id: 'inv-002',
        description: 'No orphan mandates allowed',
        severity: 'MEDIUM',
        check: (context) => {
            return true; // Placeholder
        }
    }
];
