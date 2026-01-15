import React from 'react';
import { InstitutionStatusBar } from './InstitutionStatusBar'
import { SystemMessageLayer } from './SystemMessageLayer'
import { ActiveSurfaceFrame } from './ActiveSurfaceFrame'
import { EnvironmentField } from './EnvironmentField'

/**
 * THE GUARANTEED RENDER SPINE (FINAL COMPLIANT VERSION)
 * 
 * Rules obeyed:
 * 1. Spine above providers
 * 2. No conditional null returns
 * 3. Always-on status bar
 * 4. Always-on active surface
 * 5. Error boundary wrapping spine (handled in main.jsx)
 */
export function IronAppShell({ institution, children }) {
    return (
        <div className="iron-shell" style={{
            position: 'relative',
            minHeight: '100vh',
            overflow: 'hidden',
            background: '#000' // Base void
        }}>
            {/* Layer 4: Environment Field (Permanent) */}
            <EnvironmentField institution={institution} />

            {/* Layer 1: Institutional Status Bar (Permanent) */}
            <InstitutionStatusBar institution={institution} />

            {/* Layer 2: System Message Layer (Sovereign) */}
            <SystemMessageLayer institution={institution} />

            {/* Layer 3: Active Surface Frame (Permanent) */}
            <ActiveSurfaceFrame institution={institution}>
                {/*
            Providers and inner content mount here.
            Even if children fail, the Frame itself remains and renders fallback Surfaces.
        */}
                {children}
            </ActiveSurfaceFrame>
        </div>
    )
}
