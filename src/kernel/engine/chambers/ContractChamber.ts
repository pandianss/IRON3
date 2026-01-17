import { SovereignEvent } from '../../types';

export interface ContractFindings {
    activeContracts?: string[];
    obligations?: Array<{ id: string, contractId: string, status: string }>;
    federation?: any;
}

export class ContractChamber {
    /**
     * Pure function to derive contract findings.
     * In the MVP, it handles basic activation/deactivation signals.
     */
    public static investigate(current: { activeContracts: string[], obligations: any[], federation?: any }, event: SovereignEvent): ContractFindings | null {
        const type = event.type;
        const payload = event.payload;

        if (type === 'MODULE_ACTIVATED' || type === 'CONTRACT_CREATED') {
            const contractId = payload.moduleId || payload.contractId;
            if (contractId && !current.activeContracts.includes(contractId)) {
                return {
                    activeContracts: [...current.activeContracts, contractId]
                };
            }
        } else if (type === 'MODULE_DEACTIVATED') {
            const contractId = payload.moduleId;
            if (contractId && current.activeContracts.includes(contractId)) {
                return {
                    activeContracts: current.activeContracts.filter(id => id !== contractId),
                };
            }
        } else if (type === 'CHARTER_ISSUED') {
            // Enterprise issues a task (Charter)
            const license = payload;
            // Add to federation.licenses
            const newLicenses = [...(current.federation?.licenses || []), license];
            return {
                federation: {
                    ...current.federation,
                    licenses: newLicenses
                }
            } as any;
        } else if (type === 'OBLIGATION_MET') {
            // Update license status
            const licenses = current.federation?.licenses || [];
            const targetId = payload.id || payload.contractId; // flexible payload

            const updatedLicenses = licenses.map((l: any) => {
                if (l.id === targetId) {
                    return { ...l, status: 'COMPLETED', completedAt: new Date().toISOString() };
                }
                return l;
            });

            return {
                federation: {
                    ...current.federation,
                    licenses: updatedLicenses
                }
            } as any;
        }

        return null;
    }
}
