import React from 'react';
import { EnvironmentField } from './EnvironmentField';
import { InstitutionStatusBar } from './InstitutionStatusBar';
import { SystemMessageLayer } from './SystemMessageLayer';
import { ActiveSurfaceFrame } from './ActiveSurfaceFrame';

/**
 * The Guaranteed Render Spine
 * 
 * Composition:
 * 1. Environment Field (Bottom)
 * 2. Active Surface Frame (Content)
 * 3. System Message Layer (Overlay)
 * 4. Institution Status Bar (Top)
 */
export const IronAppShell = ({
    children,
    phase,
    standing,
    connected,
    systemMessage
}) => {
    return (
        <div className="iron-spine" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
            {/* Layer 4: Environment */}
            <EnvironmentField />

            {/* Layer 3: Active Surface */}
            <ActiveSurfaceFrame>
                {children}
            </ActiveSurfaceFrame>

            {/* Layer 2: System Messages */}
            <SystemMessageLayer
                message={systemMessage?.text}
                type={systemMessage?.type}
            />

            {/* Layer 1: Status Bar */}
            <InstitutionStatusBar
                phase={phase}
                standing={standing}
                connected={connected}
            />
        </div>
    );
};
