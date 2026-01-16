import React from 'react';
import { useGovernance } from '../../../context/GovernanceContext';

/**
 * CONSTITUTIONAL STATUS
 * Displays the current Lifecycle Stage and Institutional Integrity.
 */
export const ConstitutionalStatus = () => {
    // 1. Hook into the Sovereign Kernel
    const { institutionalState, loading } = useGovernance();

    if (loading || !institutionalState) return <div className="p-4 text-gray-500">Checking Sovereignty...</div>;

    // 2. Extract Domains
    const lifecycle = institutionalState.lifecycle || { stage: 'UNKNOWN' };
    const standing = institutionalState.standing || { integrity: 0, state: 'VOID' };
    const phase = institutionalState.phase || { label: 'INIT' };

    // 3. Derived Visuals
    const isDegraded = lifecycle.stage === 'DEGRADABLE' || lifecycle.stage === 'COLLAPSED';
    const integrityColor = standing.integrity >= 90 ? 'text-green-400' : standing.integrity >= 50 ? 'text-yellow-400' : 'text-red-500';

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-xl">
            <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-800 pb-1">
                Constitutional Status
            </h3>

            <div className="grid grid-cols-2 gap-4">
                {/* Lifecycle Stage */}
                <div>
                    <div className="text-[10px] text-slate-500 uppercase">Lifecycle Stage</div>
                    <div className={`text-sm font-bold tracking-wider ${isDegraded ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                        {lifecycle.stage}
                    </div>
                </div>

                {/* Integrity Score */}
                <div>
                    <div className="text-[10px] text-slate-500 uppercase">Integrity</div>
                    <div className={`text-xl font-mono font-bold ${integrityColor}`}>
                        {standing.integrity}%
                    </div>
                </div>

                {/* Standing / Belt */}
                <div className="col-span-2 mt-2 pt-2 border-t border-slate-800 flex justify-between items-center">
                    <div className="text-[10px] text-slate-500 uppercase">Current Standing</div>
                    <div className="bg-slate-800 px-2 py-1 rounded text-xs text-white font-medium border border-slate-600">
                        {standing.state}
                    </div>
                </div>
            </div>
        </div>
    );
};
