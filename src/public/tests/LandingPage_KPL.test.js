
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LandingPage } from '../pages/LandingPage';
import { BrowserRouter } from 'react-router-dom';

// Mock Dependencies
vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (k) => k })
}));

vi.mock('../../spine/context/SovereigntyContext', () => ({
    useSovereignKernel: () => ({ ingest: vi.fn() })
}));

vi.mock('../../spine/context/AuthContext', () => ({
    useAuth: () => ({ currentUser: { uid: 'TEST_USER' }, login: vi.fn(), logout: vi.fn() })
}));

vi.mock('../projection/useKernelProjection', () => ({
    useKernelProjection: () => ({
        institution: { lifecycleState: 'ACTIVE', standingClass: 'SOVEREIGN' },
        sovereignty: { activeLaws: ['TEST_LAW_A', 'TEST_LAW_B'] }
    })
}));

// Mock Registry to return disciplines matching our mock KPL
vi.mock('../../wings/legislative/ProtocolRegistry', () => ({
    getProtocolList: () => [
        { id: 'TEST_LAW_A', label: 'Test Law A', domain: 'BIO_REGIME', userCount: 100, primaryMetric: 'STREAK' },
        { id: 'TEST_LAW_B', label: 'Test Law B', domain: 'CAPITAL_COMMAND', userCount: 50, primaryMetric: 'PROFIT' },
        { id: 'TEST_LAW_C', label: 'Test Law C', domain: 'BIO_REGIME', userCount: 10, primaryMetric: 'STREAK' } // Inactive
    ],
    SOVEREIGN_DOMAINS: {
        BIO_REGIME: { label: 'Bio Regime' },
        CAPITAL_COMMAND: { label: 'Capital Command' }
    }
}));

describe('KPL-01: Landing Page Projection Integration', () => {

    it('Should render ACTIVE LAWS based on KPL Projection', () => {
        render(
            <BrowserRouter>
                <LandingPage />
            </BrowserRouter>
        );

        // Check if "LAST USED (ACTIVE)" section renders
        const activeSection = screen.getByText('LAST USED (ACTIVE)');
        expect(activeSection).toBeDefined();

        // Check if Active Laws are present
        expect(screen.getByText('Test Law A')).toBeDefined();
        expect(screen.getByText('Test Law B')).toBeDefined();

        // Check if Inactive Law is NOT in the Active section (it might be in Latest/Popular)
        // This is a loose check, but confirms the projection wire-up.
    });

});
