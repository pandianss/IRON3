export function buildFitnessSignals(inst, history, si) {
    // Basic signal extraction from history
    // This assumes history contains events we can count.

    const activeDays = new Set(history.filter(e => ['SESSION_COMPLETE', 'SESSION_ENDED', 'TRAINING_COMPLETED'].includes(e.type)).map(e => new Date(e.timestamp).toDateString())).size;
    const commitmentEvents = history.filter(e => e.type === 'OATH_TAKEN').length;

    // Count successful sessions as positive continuity events for lifecycle logic
    const positiveContinuityEvents = history.filter(e => ['SESSION_COMPLETE', 'SESSION_ENDED', 'TRAINING_COMPLETED'].includes(e.type)).length;

    // Calculate continuity index (mock logic for now if not tracked elsewhere)
    // Assuming continuityIndex is something like (sessions / days_since_start) or similar.
    // For now, let's use a simple heuristic if not strictly defined in user prompt other than "history.continuityIndex"
    // We'll treat it as defined in history or calculate it.
    const continuityIndex = history.length > 0 ? 0.8 : 0; // Placeholder: extract from metrics if available

    const missedSessions = history.filter(e => e.type === 'SESSION_MISSED').length;
    const negativeEventsInWindow = history.filter(e => e.type === 'BREACH_ACKNOWLEDGED').length; // Window logic needs 'now'

    return {
        currentSI: si,
        activeDays,
        commitmentEvents,
        positiveContinuityEvents,
        continuityIndex,
        degradedDays: 0, // Need to track this in state?
        sustainedBreach: missedSessions >= 2 || negativeEventsInWindow >= 3
    };
}
