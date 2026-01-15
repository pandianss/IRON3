import React from 'react';
import { ContractCard } from './ContractCard';
import '../../styles/InstitutionalTheme.css';

/**
 * B1. Obligation Stack
 * Role: Displays today’s active behavioral contracts.
 * Visual Law: Vertical pressure, Ordered by consequence.
 */
export const ObligationStack = ({ contracts = [], onSelect }) => {
    // contracts: Array of { id, title, type, status, riskWeight }

    if (!contracts || contracts.length === 0) {
        return (
            <div className="surface-obligation" style={{ opacity: 0.5, textAlign: 'center', padding: 'var(--iron-space-xl)' }}>
                <div className="text-sm-caps">NO ACTIVE CONTRACTS</div>
            </div>
        );
    }

    return (
        <div className="space-y-md">
            {contracts.map((contract, index) => (
                <div
                    key={contract.id || index}
                    style={{
                        opacity: 1 - (index * 0.1), // Visual Law: visual pressure/stacking
                        transform: `scale(${1 - (index * 0.02)})`,
                        transformOrigin: 'top center'
                    }}
                >
                    <ContractCard
                        title={contract.title}
                        type={contract.type}
                        mode={contract.riskWeight > 0.5 ? 'RISK' : 'STANDARD'}
                        // In "Stack" view, we might not show the full controls, 
                        // or we might just link to the Compliance Chamber.
                        // For MVP, passing completion handlers directly if provided, or selection.
                        onComplete={onSelect ? () => onSelect(contract) : undefined}
                    />
                </div>
            ))}
        </div>
    );
};
