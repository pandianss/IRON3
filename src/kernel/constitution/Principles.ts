export interface Principle {
    id: string;
    text: string;
    source: string;
    level: 'supreme' | 'derived' | 'policy';
    threshold?: number;
}

export class PrincipleRegistry {
    private principles: Map<string, Principle> = new Map();

    public register(principle: Principle): void {
        if (this.principles.has(principle.id)) {
            throw new Error(`Principle with ID ${principle.id} already exists.`);
        }
        this.principles.set(principle.id, principle);
    }

    public get(id: string): Principle | undefined {
        return this.principles.get(id);
    }

    public getAll(): Principle[] {
        return Array.from(this.principles.values());
    }
}
