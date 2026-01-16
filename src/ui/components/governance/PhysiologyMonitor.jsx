import React from 'react';
import { useGovernance } from '../../../context/GovernanceContext';

/**
 * PHYSIOLOGY MONITOR
 * Visualizes R-PHYS-01 (Capacity vs Load).
 */
export const PhysiologyMonitor = () => {
    const { institutionalState } = useGovernance();
    const phys = institutionalState?.physiology || { capacity: 100, load: 0, status: 'OPTIMAL' };

    // Math for Bar
    const capacity = phys.capacity || 100;
    const load = phys.load || 0;

    // R-PHYS-01 Threshold: 150% of Capacity is Constitutionally Illegal.
    // We visualize this limit.
    const maxBar = capacity * 1.5;
    const loadPct = Math.min(100, (load / maxBar) * 100);
    const capacityPct = (capacity / maxBar) * 100;

    // Status Logic
    const isOverload = load > capacity;
    const isIllegal = load > (capacity * 1.5); // Should be blocked by Kernel, but if it happens, show critical.

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-xl mt-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs uppercase tracking-widest text-slate-400">
                    Biological Reality
                </h3>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${phys.status === 'INJURED' ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                    {phys.status}
                </span>
            </div>

            {/* The Bar */}
            <div className="relative h-6 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                {/* Capacity Marker (The "Safe" Limit) */}
                <div
                    className="absolute top-0 bottom-0 border-r-2 border-dashed border-slate-500 opacity-50 z-10"
                    style={{ left: `${capacityPct}%` }}
                ></div>
                <div
                    className="absolute top-0 right-0 text-[9px] text-slate-500 p-1 leading-none"
                    style={{ right: `${100 - capacityPct}%` }}
                >
                    Cap
                </div>

                {/* Load Fill */}
                <div
                    className={`h-full transition-all duration-500 ease-out ${isIllegal ? 'bg-red-600' : isOverload ? 'bg-orange-500' : 'bg-cyan-500'}`}
                    style={{ width: `${loadPct}%` }}
                ></div>
            </div>

            {/* Stats */}
            <div className="flex justify-between text-xs mt-2 font-mono text-slate-300">
                <span>Load: {Math.round(load)}</span>
                <span className="text-slate-500">Max: {Math.round(maxBar)}</span>
                <span>Cap: {Math.round(capacity)}</span>
            </div>

            {isOverload && !isIllegal && <div className="text-[10px] text-orange-400 mt-1">Warning: Exceeding Capacity strains recovery.</div>}
        </div>
    );
};
