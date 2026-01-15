import React from 'react';

/**
 * Layer 3: Active Surface Frame
 * Where all product experiences live.
 * Must always render exactly ONE surface.
 * Never nothing.
 */
export const ActiveSurfaceFrame = ({ children, status }) => {
    // If no children provided, we MUST render a fallback here 
    // to strictly adhere to "Never Nothing".
    // However, the IronAppShell should control the fallback. 
    // This frame acts as the rigorous layout container.

    return (
        <div style={{
            position: 'relative',
            zIndex: 1, // Above Environment, Below Status/Message
            width: '100%',
            minHeight: '100vh',
            paddingTop: '48px', // Clear Status Bar
            display: 'flex',
            flexDirection: 'column'
        }}>
            {children || (
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    opacity: 0.5
                }}>
                    [CRITICAL VOID: NO SURFACE MOUNTED]
                </div>
            )}
        </div>
    );
};
