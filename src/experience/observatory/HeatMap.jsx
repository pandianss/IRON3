import React from 'react';

/**
 * HEAT MAP: The Visual Record of Resolve
 * Replaces traditional streaks with a thermal visualization.
 */
export const HeatMap = ({ history = [], streak = 0 }) => {
    // Generate 30 days of "temperature"
    // In a real app, this would be derived from the actual 30-day ledger.
    // For now, we simulate a recent push for the visualization.
    const days = Array.from({ length: 30 }, (_, i) => {
        const isCurrentStreak = i >= (30 - streak);
        return {
            id: i,
            intensity: isCurrentStreak ? 1 : (Math.random() > 0.7 ? 0.3 : 0.1)
        };
    });

    return (
        <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '0.6rem', opacity: 0.5, letterSpacing: '2px', marginBottom: '10px' }}>THERMAL CONTINUITY</div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(15, 1fr)',
                gap: '4px',
                background: 'rgba(0,0,0,0.2)',
                padding: '10px',
                border: '1px solid var(--iron-border)'
            }}>
                {days.map(day => {
                    const color = day.intensity === 1
                        ? '#ff4d00' // Molten
                        : (day.intensity > 0.2 ? '#442211' : '#111');

                    return (
                        <div
                            key={day.id}
                            style={{
                                height: '12px',
                                background: color,
                                transition: 'background 1s ease',
                                boxShadow: day.intensity === 1 ? '0 0 5px #ff4d00' : 'none'
                            }}
                        />
                    );
                })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '0.5rem', opacity: 0.4 }}>
                <span>D-30</span>
                <span>FORGE_STATE: {streak > 7 ? 'TEMPERED' : 'COOL'}</span>
                <span>NOW</span>
            </div>
        </div>
    );
};
