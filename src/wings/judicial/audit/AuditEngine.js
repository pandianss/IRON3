/**
 * JUDICIAL WING: AUDIT ENGINE
 * Role: Formally witness and archive all sovereign acts for posterity and audit.
 */

const auditTrail = [];

/**
 * Witnesses a sovereign act and records it in the judicial audit trail.
 */
export function witnessAct(event, payload, actorId) {
    const entry = {
        auditId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        event,
        payload,
        actorId,
        jurisdiction: 'SOVEREIGN_SPINE'
    };

    auditTrail.push(entry);

    // In a real system, we would also persist this to cold storage.
    console.log(`JUDICIAL AUDIT: Act Witnessed - ${event}`, entry);

    return entry;
}

/**
 * Retrieves the full audit trail.
 */
export function getAuditTrail() {
    return [...auditTrail];
}

export const AuditEngine = {
    witnessAct,
    getAuditTrail
};
