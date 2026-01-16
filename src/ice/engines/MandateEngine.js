/**
 * ICE Module 8: Mandate Engine
 * Role: The Translator.
 * Responsibilities:
 * - Convert Institutional Condition into Executable Mandates.
 * - Produce UI, Motion, and Narrative Directives.
 * - UI never reads State directly; it reads Mandates.
 */
export class MandateEngine {
    constructor(kernel) {
        this.kernel = kernel;
    }

    /**
     * cycle() step: Generate mandates based on resolved Authority and Standing.
     * @returns {object} The Mandate Bundle
     */
    generateMandates() {
        const standing = this.kernel.state.getDomain('standing');
        const authority = this.kernel.state.getDomain('authority');

        const timestamp = new Date().toISOString();

        // 1. Surface Mandates (Where can I go?)
        const surfaceMandates = Object.entries(authority.surfaces).map(([surfaceId, access]) => ({
            type: 'SURFACE_MANDATE',
            surfaceId,
            access, // VISIBLE, HIDDEN, etc.
            timestamp
        }));

        // 2. Motion Mandates (How do things move?)
        // Derived from Standing Entropy/Stability
        const motionProfile = this.deriveMotionProfile(standing);
        const motionMandate = {
            type: 'MOTION_MANDATE',
            profile: motionProfile,
            timestamp
        };

        // 3. Narrative Mandates (What does it say?)
        const narrativeMandate = {
            type: 'NARRATIVE_MANDATE',
            tone: this.deriveNarrativeTone(standing),
            message: this.deriveCoreMessage(standing),
            timestamp
        };

        const bundle = {
            surfaces: surfaceMandates,
            motion: motionMandate,
            narrative: narrativeMandate
        };

        // 4. Update State (Governed)
        const action = {
            type: 'MANDATE_UPDATE_BUNDLE',
            payload: bundle,
            actor: 'MandateEngine',
            rules: ['R-MAND-01']
        };

        this.kernel.complianceKernel.getGate().govern(action, () => {
            this.kernel.setState('mandates', bundle);
            console.log("ICE: Mandates Issued & Governed", bundle);
        }).catch(e => {
            console.error("ICE: Mandate Issuance Blocked by Constitution", e.message);
        });

        return bundle;
    }

    deriveMotionProfile(standing) {
        // High Entropy = Glitch / Noise
        // High Integrity = Smooth / Precision
        if (standing.state === 'VIOLATED') return 'GLITCH_HEAVY';
        if (standing.state === 'STRAINED') return 'JITTER';
        if (standing.state === 'INSTITUTIONAL') return 'MONOLITHIC';
        return 'FLUID'; // Default
    }

    deriveNarrativeTone(standing) {
        if (standing.state === 'VIOLATED') return 'ALARM';
        if (standing.state === 'STRAINED') return 'WARNING';
        if (standing.state === 'INSTITUTIONAL') return 'AUTHORITY';
        return 'GUIDANCE';
    }

    deriveCoreMessage(standing) {
        // MVP logic
        switch (standing.state) {
            case 'VIOLATED': return "FRACTURE DETECTED. RECOVERY REQUIRED.";
            case 'STRAINED': return "INTEGRITY CRITICAL. COMPLY IMMEDIATELY.";
            case 'INDUCTED': return "WELCOME TO THE IRON.";
            default: return "MAINTAIN THE STANDARD.";
        }
    }
}
