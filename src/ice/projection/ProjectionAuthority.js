/**
 * PROJECTION AUTHORITY LAYER (PAL)
 * 
 * The Read-Only Boundary of the Sovereign Kernel.
 * Exposes strictly filtered views of the Institutional State.
 * 
 * CONSTRAINT: Returns *copies* of snapshots. Never live references.
 * AUTHORITY: KPL-01
 */

import { SnapshotEngine } from './SnapshotEngine';
import { validateInstitutionProjection } from './schemas/InstitutionProjection.schema';
import { validateSovereigntyProjection } from './schemas/SovereigntyProjection.schema';

// Internal Cache (The "Buffer")
let _currentSnapshot = null;

// Temporary Mock State Injector (Until Kernel is fully wired)
// In production, this would subscribe to the EventBus.
const bootstrapMockState = () => {
    return {
        lifecycle: { state: 'ACTIVE', age: 42 },
        standing: { class: 'SOVEREIGN', streak: 12, focus: 'DEEP WORK' },
        integrity: { status: 'INTACT' },
        compliance: { isSovereign: true, obligationsMet: true, activeModules: ['DISCIPLINE_DEEP_WORK'] },
        verdict: { last: 'PASS' },
        system: { health: 'NOMINAL' }
    };
};

// Initialize with a mock snapshot for now
_currentSnapshot = SnapshotEngine.sealSnapshot(bootstrapMockState());

export const ProjectionAuthority = {

    /**
     * Get the current Institutional Projection.
     * @returns {Object} Validated InstitutionProjection
     */
    getInstitutionProjection: () => {
        if (!_currentSnapshot) return validateInstitutionProjection({}); // Return safe default

        // Return validated copy
        return validateInstitutionProjection(_currentSnapshot.institution);
    },

    /**
     * Get the current Sovereignty Projection.
     * @returns {Object} Validated SovereigntyProjection
     */
    getSovereigntyProjection: () => {
        if (!_currentSnapshot) return validateSovereigntyProjection({});

        return validateSovereigntyProjection(_currentSnapshot.sovereignty);
    },

    /**
     * Force a Snapshot Refresh (Called by Kernel Cycle)
     * @param {Object} rawKernelState 
     */
    updateProjection: (rawKernelState) => {
        try {
            _currentSnapshot = SnapshotEngine.sealSnapshot(rawKernelState);
            console.log("PAL: Projection Updated", _currentSnapshot.meta.timestamp);
        } catch (e) {
            console.error("PAL: Update Failed", e);
        }
    }
};
