import { IronCourt } from '../kernel/engine/IronCourt';
import { Action, Verdict, InstitutionalState } from '../kernel/types';
import { ProtocolRegistry, SOVEREIGN_DOMAINS } from '../kernel/constitution/ProtocolRegistry';

// ... existing code ...

let courtInstance: IronCourt | null = null;

/**
 * Retrieves the list of available institutional protocols.
 */
export function getProtocols() {
    return ProtocolRegistry.getAll();
}

/**
 * Retrieves the authoritative set of sovereign domains.
 */
export function getDomains() {
    return SOVEREIGN_DOMAINS;
}

export function initializeCourt(initialEvents: any[] = []) {
    if (!courtInstance) {
        courtInstance = new IronCourt(initialEvents);
    }
    return courtInstance;
}

export function getCourt() {
    if (!courtInstance) {
        throw new Error("IRON: Court not initialized.");
    }
    return courtInstance;
}

/**
 * Authoritative way to submit an event to the institutional core.
 */
export async function submitEvent(action: Action): Promise<Verdict> {
    return await getCourt().ingest(action);
}

/**
 * Creates a read-only projection of the current institutional state.
 */
export function createProjection(): InstitutionalState {
    return getCourt().getSnapshot();
}

/**
 * Convenience method to get current standing.
 */
export function getStanding() {
    return getCourt().getSnapshot().domains.standing;
}

/**
 * Convenience method to get recent verdicts from history.
 */
export function getVerdicts() {
    return getCourt().getSnapshot().history; // Events are linked to verdicts in ledger
}

/**
 * Subscribe to institutional state changes.
 */
export function subscribeToState(callback: (state: InstitutionalState) => void) {
    return getCourt().subscribe(callback);
}
