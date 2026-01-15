import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './ui/styles/InstitutionalTheme.css'

import { IronAppShell } from './shell/IronAppShell'
import { FailureSurface } from './surfaces/FailureSurface'

/**
 * TOP-LEVEL ERROR BOUNDARY
 * Protects the ultimate user experience from total blankness.
 */
class GlobalSpineGuard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("CRITICAL SPINE BREACH:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Even when EVERYTHING fails, we render a Spine with a Failure Surface
            return (
                <IronAppShell institution={{ status: 'DEGRADED' }}>
                    <FailureSurface error={this.state.error} />
                </IronAppShell>
            );
        }
        return this.props.children;
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GlobalSpineGuard>
            <App />
        </GlobalSpineGuard>
    </React.StrictMode>,
)
