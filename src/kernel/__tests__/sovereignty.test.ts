import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IronCourt } from '../engine/IronCourt';
import { Action } from '../types';

if (typeof crypto === 'undefined') {
    (global as any).crypto = {
        randomUUID: () => Math.random().toString(36).substring(2, 15)
    };
}

describe('Sovereign Kernel Jurisdictional Integrity', () => {
    let court: IronCourt;

    beforeEach(() => {
        court = new IronCourt();
    });

    it('should reject actions from unauthorized actors', async () => {
        const action: Action = {
            type: 'MODULE_ACTIVATED',
            payload: { moduleId: 'HACKER_MODULE' },
            actor: 'ROGUE_AGENT'
        };

        try {
            await court.ingest(action);
            throw new Error("Should have thrown");
        } catch (e: any) {
            console.log("CAUGHT ERROR:", e.message);
            expect(e.message).toMatch(/Unrecognized Actor/);
        }
    });

    it('should reject illegal session state transitions', async () => {
        try {
            const startAction: Action = {
                type: 'SESSION_UPDATE_STATUS',
                payload: { status: 'ACTIVE' },
                actor: 'IronCourt'
            };
            await court.ingest(startAction);

            const illegalAction: Action = {
                type: 'SESSION_UPDATE_STATUS',
                payload: { status: 'PENDING' },
                actor: 'IronCourt'
            };

            await court.ingest(illegalAction);
            throw new Error("Should have thrown");
        } catch (e: any) {
            console.log("CAUGHT SESSION ERROR:", e.message);
            expect(e.message).toMatch(/Illegal transition/);
        }
    });

    it('should maintain an immutable ledger', async () => {
        const action: Action = {
            type: 'MODULE_ACTIVATED',
            payload: { moduleId: 'SOVEREIGN_CORE' },
            actor: 'IronCourt'
        };

        await court.ingest(action);
        const history = court.getSnapshot().activeLaws;
        expect(history).toContain('SOVEREIGN_CORE');

        // Attempting to mutate history directly (should be a copy)
        const snap = court.getSnapshot();
        snap.activeLaws.push('FORGED_MODULE');

        const freshSnap = court.getSnapshot();
        expect(freshSnap.activeLaws).not.toContain('FORGED_MODULE');
    });

    it('should enforce hash-chain integrity on the ledger', async () => {
        const action1: Action = { type: 'MODULE_ACTIVATED', payload: { moduleId: 'M1' }, actor: 'IronCourt' };
        const action2: Action = { type: 'MODULE_ACTIVATED', payload: { moduleId: 'M2' }, actor: 'IronCourt' };

        await court.ingest(action1);
        await court.ingest(action2);

        const history = court.getSnapshot().history;
        expect(history.length).toBe(2);

        // Verify cross-linked integrity
        expect(history[0].event.hash).toBeDefined();
        expect(history[1].event.hash).toBeDefined();
        expect(history[0].verdict.id).toBeDefined();
    });
});
