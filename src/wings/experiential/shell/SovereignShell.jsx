import { useGovernance } from '../../../spine/context/GovernanceContext';
import { GenesisSurface } from '../surfaces/GenesisSurface';
import { SovereignView } from '../surfaces/SovereignView';

/**
 * SOVEREIGN SHELL
 * The pure functional shell for the Sovereign Governance Spine.
 * Bypasses all legacy layers.
 */
export const SovereignShell = () => {
    const { institutionalState, loading } = useGovernance();

    // Default to BOOTING if loading or no state
    const status = loading || !institutionalState ? 'BOOTING' : 'ACTIVE';
    const phase = institutionalState?.phase?.id || 'GENESIS';

    if (status === 'BOOTING' || phase === 'GENESIS') {
        return <GenesisSurface status={status} />;
    }

    // ACTIVE STATE
    return <SovereignView state={institutionalState} />;
};
