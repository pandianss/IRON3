/**
 * SOVEREIGN PROTOCOL COMPILER (SPC-01)
 *
 * Responsibility:
 * 1. Define the Strict JSON Schema for Sovereign Protocols.
 * 2. Compile Visual Nodes (ReactFlow) into Executable Kernel Constraints.
 * 3. Validate imported JSON against the Constitution.
 */

// --- 1. THE SCHEMA --- //

export const PROTOCOL_SCHEMA_VERSION = "1.0.0";

export const NODE_TYPES = {
    TRIGGER: 'TRIGGER',
    CONSTRAINT: 'CONSTRAINT',
    VERDICT: 'VERDICT',
    DECISION: 'DECISION'
};

/**
 * Validates a raw JSON object as a Sovereign Protocol.
 * @param {Object} json 
 * @returns {Object} { valid: boolean, error: string | null }
 */
export const validateProtocolJSON = (json) => {
    if (!json) return { valid: false, error: "Empty Protocol" };
    if (json.version !== PROTOCOL_SCHEMA_VERSION) return { valid: false, error: "Version Mismatch" };
    if (!json.id || !json.title) return { valid: false, error: "Missing Identity" };
    if (!Array.isArray(json.nodes) || !Array.isArray(json.edges)) return { valid: false, error: "Invalid Graph Structure" };

    // Strict Node Validation
    for (const node of json.nodes) {
        if (!Object.values(NODE_TYPES).includes(node.type)) {
            return { valid: false, error: `Unauthorized Node Type: ${node.type}` };
        }
        // Constitutional Check: No "Reward" nodes, only Verdicts
        if (node.data && node.data.label && node.data.label.toLowerCase().includes("reward")) {
            return { valid: false, error: "CONSTITUTIONAL VIOLATION: Rewards are not permitted." };
        }
    }

    return { valid: true, error: null };
};

// --- 2. THE COMPILER --- //

/**
 * Compiles the Visual Graph into an Executable Protocol Definition
 * used by the ProtocolRegistry and SovereignKernel.
 * 
 * @param {Object} graph { nodes, edges }
 * @returns {Object} ExecutableProtocol
 */
export const compileGraphToProtocol = (graph, metadata = {}) => {
    // 1. Find Trigger
    const triggerNode = graph.nodes.find(n => n.type === NODE_TYPES.TRIGGER);
    if (!triggerNode) throw new Error("Manifest requires a Trigger.");

    // 2. Map Constraints & Decisions
    // Note: This MVP Compiler linearizes the graph. Branching not yet supported in runtime.
    // Decisions are converted to Boolean Input Constraints.
    const steps = graph.nodes.filter(n => n.type === NODE_TYPES.CONSTRAINT || n.type === NODE_TYPES.DECISION);

    // Sort steps based on Y-position to approximate flow (since we don't traverse edges yet)
    steps.sort((a, b) => a.position.y - b.position.y);

    const requirements = steps.map(node => {
        if (node.type === NODE_TYPES.DECISION) {
            return {
                id: node.id,
                type: 'INPUT',
                params: { format: 'BOOLEAN' },
                description: node.data.label || 'Decision Point'
            };
        }
        return {
            id: node.id,
            type: node.data.constraintType, // e.g., 'GPS', 'PHOTO', 'INPUT'
            params: {
                ...node.data.params,
                format: node.data.dataFormat || 'TEXT'
            },
            description: node.data.label
        };
    });

    // 3. Map Verdicts (End States)
    // In v1, we assume a linear flow: Trigger -> Constraints -> Verdict(Success)

    return {
        id: `PROT_${Date.now()}`, // Temporary ID assignment
        title: metadata.title || "Custom Protocol",
        label: metadata.title || "Custom Protocol", // For Registry compatibility
        focus: metadata.description || "No description provided.",
        domain: metadata.domain || 'SYSTEM_LOGISTICS',
        version: PROTOCOL_SCHEMA_VERSION, // Required for Validation
        requirements: requirements,
        category: 'PRIVATE',
        userCount: 1,
        nodes: graph.nodes, // Preserve source for re-editing (future)
        edges: graph.edges,
        // The Verification Logic function would be generated here
        // For now, the Kernel interprets 'requirements' array directly
        evaluate: (evidence) => {
            // This is a meta-evaluator that checks provided evidence against requirements
            // Implementation handled by SovereignKernel
            return true;
        }
    };
};
