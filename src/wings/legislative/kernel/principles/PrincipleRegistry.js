/**
 * Principle Registry
 * Canonical repository of principles.
 */
export class PrincipleRegistry {
    constructor() {
        this.principles = new Map();
    }

    register(principle) {
        if (!principle.id) throw new Error("Principle ID required");
        this.principles.set(principle.id, principle);
    }

    /**
     * Load principles from a source (Simulated YAML loader for MVP)
     */
    loadFromYaml(content) {
        // Simple regex-based line parser for the specific schema used in activation.principles.yaml
        const principles = [];
        let current = null;

        content.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;

            if (trimmed.startsWith('- id:')) {
                if (current) principles.push(current);
                current = { id: trimmed.replace('- id:', '').trim() };
            } else if (current && trimmed.includes(':')) {
                const [key, ...val] = trimmed.split(':');
                const value = val.join(':').trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
                current[key.trim()] = isNaN(value) ? value : Number(value);
            }
        });
        if (current) principles.push(current);

        principles.forEach(p => this.register(p));
        console.log(`KERNEL: Registered ${principles.length} Principles.`);
    }

    getActivationRules() {
        return this.getAll().filter(p => p.id.startsWith('P-ACT'));
    }

    getDegradationRules() {
        return this.getAll().filter(p => p.id.startsWith('P-DEG') || p.id.startsWith('P-SHT'));
    }

    getAll() {
        return Array.from(this.principles.values());
    }

    get(id) {
        return this.principles.get(id);
    }
}
