import React from 'react';
import { useGovernance } from '../../../context/GovernanceContext';

/**
 * STANDING BADGE
 * Visualizes the Belt System (R-STND).
 */
export const StandingBadge = () => {
    const { institutionalState } = useGovernance();
    const standing = institutionalState?.standing || { state: 'PRE_INDUCTION', integrity: 100, streak: 0 };

    // Belt Colors
    const getBeltColor = (state) => {
        switch (state) {
            case 'PRE_INDUCTION': return 'bg-gray-800 border-gray-600 text-gray-400';
            case 'GENESIS': return 'bg-gray-200 border-white text-gray-800'; // White Belt
            case 'STABLE': return 'bg-yellow-500 border-yellow-300 text-yellow-900'; // Yellow Belt
            case 'ASCENDING': return 'bg-blue-600 border-blue-400 text-white'; // Blue Belt
            case 'SOVEREIGN': return 'bg-black border-red-500 text-red-500 shadow-red-glow'; // Black Belt
            case 'DEGRADED': return 'bg-orange-900 border-orange-700 text-orange-200'; // Warning
            case 'BREACHED': return 'bg-red-900 border-red-700 text-red-200'; // Danger
            default: return 'bg-slate-800 border-slate-600 text-slate-400';
        }
    };

    const beltClass = getBeltColor(standing.state);

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-xl mt-4">
            <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-3">
                Authority Standing
            </h3>

            <div className={`flex flex-col items-center justify-center p-4 rounded border-2 ${beltClass}`}>
                <div className="text-xl font-black tracking-widest uppercase">
                    {standing.state.replace('_', ' ')}
                </div>
                <div className="text-[10px] mt-1 opacity-75 uppercase font-medium">
                    Institutional Rank
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                <div className="bg-slate-800 rounded p-1">
                    <div className="text-[10px] text-slate-500">Streak</div>
                    <div className="text-white font-mono">{standing.streak} Days</div>
                </div>
                <div className="bg-slate-800 rounded p-1">
                    <div className="text-[10px] text-slate-500">Provenance</div>
                    <div className="text-emerald-400 font-mono">VERIFIED</div>
                </div>
            </div>
        </div>
    );
};
