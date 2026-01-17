
import { describe, it, expect } from 'vitest';
import { SnapshotEngine } from '../projection/SnapshotEngine';
import { ProjectionAuthority } from '../projection/ProjectionAuthority';
import { validateInstitutionProjection } from '../projection/schemas/InstitutionProjection.schema';

describe('KPL-01: Internal Projection Layer', () => {

    it('Snapshot Engine: Should seal and hash state', () => {
        const rawState = {
            lifecycle: { state: 'ACTIVE', age: 100 },
            standing: { class: 'ELITE', streak: 50, focus: 'FASTING' },
            compliance: { isSovereign: true, activeModules: ['A', 'B'] }
        };

        const snapshot = SnapshotEngine.sealSnapshot(rawState);

        expect(snapshot.meta.hash).toBeDefined();
        expect(snapshot.institution.lifecycleState).toBe('ACTIVE');
        expect(snapshot.sovereignty.activeLaws).toEqual(['A', 'B']);
        expect(Object.isFrozen(snapshot)).toBe(true);
    });

    it('Projection Authority: Should return validated copies', () => {
        // Mocking Internal State implicitly via the static initialization in ProjectionAuthority
        // Note: Ideally we would inject state, but PAL uses singleton pattern for now.

        const projection = ProjectionAuthority.getInstitutionProjection();

        // Check Logic
        expect(projection.lifecycleState).toBeDefined();

        // Validation check
        const invalidData = { lifecycleState: 'INVALID_STATE', randomField: 123 };
        const sanitized = validateInstitutionProjection(invalidData);

        expect(sanitized.lifecycleState).toBe('GENESIS'); // Fallback
        expect(sanitized.randomField).toBeUndefined(); // Stripped
    });

    it('Projection Authority: Should handle Sovereignty Projection with Active Laws', () => {
        const sovProj = ProjectionAuthority.getSovereigntyProjection();

        expect(sovProj.sovereign).toBeDefined();
        expect(Array.isArray(sovProj.activeLaws)).toBe(true);
    });

});
