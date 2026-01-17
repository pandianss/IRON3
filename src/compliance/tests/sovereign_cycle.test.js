
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ProtocolRegistry, registerProtocol, getProtocol } from '../../wings/legislative/ProtocolRegistry';
import { LawArchive } from '../../wings/legislative/LawArchive';
import { ConstraintVerifier } from '../kernel/ConstraintVerifier';

describe('Protocol Sovereignty Cycle (Import & Execution)', () => {

    // Test Data: A Valid "Deep Work" Protocol
    // Mock localStorage for Node Environment
    const localStorageMock = (function () {
        let store = {};
        return {
            getItem: vi.fn((key) => store[key] || null),
            setItem: vi.fn((key, value) => {
                store[key] = value.toString();
            }),
            removeItem: vi.fn((key) => {
                delete store[key];
            }),
            clear: vi.fn(() => {
                store = {};
            })
        };
    })();

    Object.defineProperty(global, 'localStorage', {
        value: localStorageMock
    });

    const mockProtocol = {
        id: 'TEST_PROTOCOL_001',
        title: 'SOVEREIGN TEST PROTOCOL',
        description: 'A test law for the sovereign cycle.',
        domain: 'COGNITIVE_SECURITY',
        requirements: [
            { type: 'INPUT', value: 'Session Log' },
            { type: 'TIME', value: '10:00' } // Should be before 10:00
        ]
    };

    beforeEach(() => {
        // Clear Archive before test
        LawArchive.burnArchive();
        // Reset Registry state if necessary (Registry reloads from localStorage on module load, 
        // but our test environment might share state, so we force a reload if we could, 
        // but burnArchive + register is enough context).
    });

    afterEach(() => {
        LawArchive.burnArchive();
    });

    it('Cycle Step 1: Import & Persistence (Legislature)', () => {
        // 1. Simulate Import (Register Protocol)
        const success = registerProtocol(mockProtocol);
        expect(success).toBe(true);

        // 2. Verify Persistence (Law Archive)
        const laws = LawArchive.loadLaws();
        expect(laws['TEST_PROTOCOL_001']).toBeDefined();
        expect(laws['TEST_PROTOCOL_001'].title).toBe('SOVEREIGN TEST PROTOCOL');
        expect(laws['TEST_PROTOCOL_001'].isCustom).toBe(true);
    });

    it('Cycle Step 2: Retrieval (Registry)', () => {
        // 1. Register
        registerProtocol(mockProtocol);

        // 2. Retrieve via Registry API
        const retrieved = getProtocol('TEST_PROTOCOL_001');

        expect(retrieved).toBeDefined();
        expect(retrieved.id).toBe('TEST_PROTOCOL_001');
        expect(retrieved.domain).toBe('COGNITIVE_SECURITY');
    });

    it('Cycle Step 3: Execution (Constraint Verifier)', () => {
        // 1. Register Law
        registerProtocol(mockProtocol);
        const law = getProtocol('TEST_PROTOCOL_001');

        // 2. Define Contexts
        const validContext = {
            inputData: 'This is a valid session log entry.',
            timestamp: '09:00' // Before 10:00
        };

        const invalidContext = {
            inputData: 'Tin', // Too short
            timestamp: '11:00' // Late
        };

        // 3. Verify Success Case
        const resultPass = ConstraintVerifier.verify(law, validContext);
        expect(resultPass.passed).toBe(true);
        expect(resultPass.failures.length).toBe(0);

        // 4. Verify Failure Case
        const resultFail = ConstraintVerifier.verify(law, invalidContext);
        expect(resultFail.passed).toBe(false);
        // Should fail on Input AND Time (technically Time check is stubbed to pass if exists, 
        // but Input check < 5 chars fails logic in ConstraintVerifier)

        // Let's check specific failures based on ConstraintVerifier implementation
        // Input < 5 chars -> Fail
        expect(resultFail.failures).toContain('Insufficient Input: Session Log');
    });
});
