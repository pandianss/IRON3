export const ConsequenceHall = ({ reason, scars }) => {
    const { declare } = useGovernance();
    const [acknowledged, setAcknowledged] = useState(false);

    const fractureCount = (scars?.fractures || 0) + 1; // Current one is represented as +1 if not yet fully scarred? 
    // Actually evaluateInstitution increments fractures immediately on entry to Violated.
    // So scars.fractures is the correct current count.
    const count = scars?.fractures || 1;

    const handleAcknowledge = async () => {
        setAcknowledged(true);
    };

    const handleEnterRecovery = async () => {
        await declare('ENTER_RECOVERY');
    };

    return (
        <div style={{
            height: '100vh',
            background: 'var(--civil-bg)',
            color: 'var(--civil-accent-alert)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            textAlign: 'center'
        }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '300', marginBottom: '10px' }}>
                {NarrativeRegistry.FRACTURE.TITLE}
            </h1>

            <div style={{
                fontSize: '1rem',
                letterSpacing: '4px',
                color: 'var(--civil-text-secondary)',
                marginBottom: '40px'
            }}>
                INCIDENT #{count}
            </div>

            <p style={{ fontSize: '1.2rem', maxWidth: '600px', marginBottom: '60px', lineHeight: '1.6' }}>
                {NarrativeRegistry.FRACTURE.CONTENT}
            </p>

            {!acknowledged ? (
                <button
                    className="civil-button alert"
                    onClick={handleAcknowledge}
                >
                    ACKNOWLEDGE VIOLATION
                </button>
            ) : (
                <div className="recovery-contract" style={{ animation: 'fadeIn 1s' }}>
                    <p style={{ marginBottom: '20px', color: 'var(--civil-text-primary)' }}>
                        Recovery Protocol Available.
                    </p>
                    <button
                        className="civil-button"
                        onClick={handleEnterRecovery}
                    >
                        INITIATE RECOVERY
                    </button>
                </div>
            )}
        </div>
    );
};
