import React from 'react';
import { InstitutionStatusBar } from './InstitutionStatusBar'
import { SystemMessageLayer } from './SystemMessageLayer'
import { ActiveSurfaceFrame } from './ActiveSurfaceFrame'
import { EnvironmentField } from './EnvironmentField'

export function IronAppShell({ institution }) {
    return (
        <div className="iron-shell" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
            <EnvironmentField institution={institution} />

            <InstitutionStatusBar institution={institution} />

            <SystemMessageLayer institution={institution} />

            <ActiveSurfaceFrame institution={institution} />
        </div>
    )
}
