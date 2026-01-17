/******************************************************************************************
 * SOVEREIGN UX KERNEL
 * UX-KERNEL-01 Binding Reference Implementation
 *
 * Authority:
 * - Translates sovereign state into experiential truth
 * - Enforces phase constraints
 * - Generates standing objects
 * - Regulates ritual, verdict, and surface access
 *
 * No UI surface may render without a context issued by this kernel.
 ******************************************************************************************/

import { EXPERIENCE_PHASES, PHASE_RULES } from "./SovereignJourney.schema.js";
import { buildStandingViewModel } from "./standingViewModel.js";

/* -------------------------------------------------------------------------- */
/*  Phase Resolution                                                          */
/* -------------------------------------------------------------------------- */

function resolveExperiencePhase(snapshot) {
    const { state, history } = snapshot;

    // If we have no history and no identity, we are in the void
    if (!history || history.length === 0) {
        if (!state?.identity) return EXPERIENCE_PHASES.PRE_INSTITUTIONAL;
    }

    const lifecycle = state?.lifecycle || {};

    if (lifecycle.stage === 'COLLAPSED') return EXPERIENCE_PHASES.FAILED;
    if (lifecycle.stage === 'RECOVERING') return EXPERIENCE_PHASES.RECOVERING;
    if (lifecycle.stage === 'DEGRADING') return EXPERIENCE_PHASES.DEGRADING;

    // Authority levels (0-5)
    const authorityLevel = state?.authority?.level || 0;

    if (authorityLevel >= 5) return EXPERIENCE_PHASES.SOVEREIGN;
    if (authorityLevel >= 3) return EXPERIENCE_PHASES.ACTIVE;
    if (authorityLevel >= 2) return EXPERIENCE_PHASES.BOUND;

    // Default to INITIATED if we have history but haven't reached BOUND
    return EXPERIENCE_PHASES.INITIATED;
}

/* -------------------------------------------------------------------------- */
/*  Standing Object                                                           */
/* -------------------------------------------------------------------------- */

function buildStanding(snapshot, phase) {
    return buildStandingViewModel(snapshot);
}

/* -------------------------------------------------------------------------- */
/*  Ritual Enforcement                                                        */
/* -------------------------------------------------------------------------- */

function ritualStatus(snapshot) {
    const { state } = snapshot;
    return {
        dailyRitualCompleted: state.rituals?.todayCompleted ?? false,
        lastRitualAt: state.rituals?.lastRitualAt ?? null,
        verdictPending: state.verdictPending ?? false
    };
}

/* -------------------------------------------------------------------------- */
/*  Experience Context                                                        */
/* -------------------------------------------------------------------------- */

function buildExperienceContext(snapshot) {
    if (!snapshot) {
        throw new Error("[UX-KERNEL] Cannot build experience context without institutional snapshot.");
    }

    const phase = resolveExperiencePhase(snapshot);
    const standing = buildStanding(snapshot, phase);
    const ritual = ritualStatus(snapshot);
    const rules = PHASE_RULES[phase];

    return Object.freeze({
        issuedAt: Date.now(),

        phase,
        rules,
        standing,
        ritual,

        institutionalTruth: snapshot
    });
}

/* -------------------------------------------------------------------------- */
/*  Surface Authorization                                                     */
/* -------------------------------------------------------------------------- */

export function validateSurfaceContract(surfaceName, contract, snapshot) {
    const ctx = buildExperienceContext(snapshot);

    if (!contract) {
        throw new Error(`[UX-KERNEL] Surface "${surfaceName}" is missing a Standing Supremacy Contract.`);
    }

    if (contract.supportedPhases && !contract.supportedPhases.includes(ctx.phase)) {
        throw new Error(`[UX-KERNEL] Surface "${surfaceName}" does not support phase "${ctx.phase}".`);
    }

    const authorityLevel = snapshot.state?.authority?.level || 0;
    if (contract.authorityRange) {
        const [min, max] = contract.authorityRange;
        if (authorityLevel < min || authorityLevel > max) {
            throw new Error(`[UX-KERNEL] Surface "${surfaceName}" requires authority [${min}-${max}], current is ${authorityLevel}.`);
        }
    }

    return true;
}

export function authorizeSurface(surfaceName, snapshot) {
    const ctx = buildExperienceContext(snapshot);

    if (!ctx.rules.allowedSurfaces.includes(surfaceName)) {
        throw new Error(
            `[UX-KERNEL] Surface "${surfaceName}" is prohibited during phase "${ctx.phase}".`
        );
    }

    if (ctx.rules.ritualRequired && ctx.ritual.verdictPending) {
        throw new Error(
            `[UX-KERNEL] Verdict ritual unresolved. Surface access denied.`
        );
    }

    return ctx;
}

/* -------------------------------------------------------------------------- */
/*  Verdict Interface                                                         */
/* -------------------------------------------------------------------------- */

export function issueVerdict(verdictObject) {
    if (!verdictObject || !verdictObject.type || !verdictObject.consequence) {
        throw new Error("[UX-KERNEL] Invalid verdict object.");
    }

    return Object.freeze({
        ...verdictObject,
        issuedAt: Date.now(),
        constitutional: true
    });
}

/* -------------------------------------------------------------------------- */
/*  Ritual Gate                                                               */
/* -------------------------------------------------------------------------- */

export function requireDailyRitual(snapshot) {
    const ctx = buildExperienceContext(snapshot);

    if (ctx.rules.ritualRequired && !ctx.ritual.dailyRitualCompleted) {
        return Object.freeze({
            required: true,
            phase: ctx.phase,
            standing: ctx.standing,
            directive: "Daily institutional ritual pending."
        });
    }

    return Object.freeze({ required: false });
}

/* -------------------------------------------------------------------------- */
/*  Experience Entry                                                          */
/* -------------------------------------------------------------------------- */

export function enterExperience(surfaceName, snapshot, contract = null) {
    const ctx = authorizeSurface(surfaceName, snapshot);

    // CHOKE-POINT: Standing Supremacy Contract Validation
    if (contract) {
        validateSurfaceContract(surfaceName, contract, snapshot);
    }

    return Object.freeze({
        surface: surfaceName,
        context: ctx,
        orientation: {
            phase: ctx.phase,
            standing: ctx.standing,
            tone: ctx.rules.tone,
            authorityCeiling: ctx.rules.authorityCeiling
        }
    });
}

/* -------------------------------------------------------------------------- */
/*  Public Kernel Interface                                                   */
/* -------------------------------------------------------------------------- */

export const SovereignUXKernel = Object.freeze({
    enterExperience,
    authorizeSurface,
    validateSurfaceContract,
    issueVerdict,
    requireDailyRitual,
    EXPERIENCE_PHASES
});
