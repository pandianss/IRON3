import { useContext, useMemo } from 'react';
// We might need a Context to hold the interpreted state if we want to avoid recalculating it everywhere.
// For now, assuming the Architecture:
// Engine -> InstitutionalShell -> StandingThemeAdapter -> [Context?] -> Components.
// Actually, Subscription means we likely want a specific Context.

// Let's create a "StandingContext" that the Adapter populates?
// No, the Adapter is for Theme.
// Let's make a "StandingProvider" distinct from Theme?
// UseGovernance has raw state.

import { useGovernance } from '../../context/GovernanceContext'; // Access raw
import { interpretStanding } from '../../institution/StandingInterpreter';

export const useStanding = () => {
    const { institutionalState } = useGovernance();

    // Normalize on every call? Or memoize?
    // Given React render cycles, memoization inside the hook is good.
    const interpretation = useMemo(() => {
        return interpretStanding(institutionalState);
    }, [institutionalState]);

    return interpretation;
};
