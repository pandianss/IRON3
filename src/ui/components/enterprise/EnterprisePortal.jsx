import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../spine/context/AuthContext';
import { useGovernance } from '../../../spine/context/GovernanceContext';
import { useNavigate } from 'react-router-dom';
import { CertificateAuthority } from '../../../kernel/services/CertificateAuthority';
import styles from './EnterprisePortal.module.css';

/**
 * ENTERPRISE PORTAL
 * Restricted View for Chartered Users.
 */
export const EnterprisePortal = () => {
    const { currentUser, logout } = useAuth();
    const { institutionalState, declare, loading: govLoading } = useGovernance();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);


    // Redirect if not enterprise user
    useEffect(() => {
        if (!currentUser) navigate('/');
        if (currentUser && currentUser.role !== 'ENTERPRISE_USER') navigate('/app');
    }, [currentUser, navigate]);

    useEffect(() => {
        if (institutionalState?.domains?.federation) {
            // Fetch Chartered Contracts (Licenses) from Federated State
            const licenses = institutionalState.domains.federation.licenses || [];

            const myContracts = licenses.filter(c =>
                c.assignee === currentUser.uid &&
                c.issuer === currentUser.enterpriseId
            );

            console.log("PORTAL: Found contracts", myContracts);
            setTasks(myContracts);
        }
    }, [institutionalState, currentUser]);

    const handleCompleteTask = async (task) => {
        // Declare Completion
        await declare('OBLIGATION_MET', { id: task.id, contractId: task.id });
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDownloadCertificate = async (task) => {
        if (task.status !== 'COMPLETED') return;
        const blob = await CertificateAuthority.generateCertificate(
            { name: currentUser.displayName || 'Authorized User' },
            { name: 'IRON INSTITUTION', id: task.issuer },
            task
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Sovereign_Credential_${task.id}.pdf`;
        a.click();
    };

    if (govLoading) return <div className={styles.container}>Loading Portal...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Enterprise Portal</h1>
                    <span className={styles.subTitle}>Authorized Access: {currentUser?.displayName}</span>
                </div>
                <button onClick={handleLogout} className={styles.disconnectBtn}>Disconnect</button>
            </header>

            <section>
                <h2 className={styles.sectionTitle}>Assigned Mandates</h2>
                {tasks.length === 0 ? (
                    <p style={{ color: 'var(--iron-text-secondary)' }}>No active mandates assigned.</p>
                ) : (
                    <div className={styles.grid}>
                        {tasks.map(task => (
                            <div key={task.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <h3 className={styles.cardTitle}>{task.title}</h3>
                                    <span className={`${styles.statusBadge} ${task.status === 'COMPLETED' ? styles.statusCompleted : styles.statusPending}`}>
                                        {task.status || 'PENDING'}
                                    </span>
                                </div>
                                <p className={styles.cardDescription}>{task.description}</p>
                                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {task.status !== 'COMPLETED' ? (
                                        <button
                                            onClick={() => handleCompleteTask(task)}
                                            className={styles.actionBtn}
                                        >
                                            Submit Completion
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleDownloadCertificate(task)}
                                            className={styles.completedBtn}
                                            style={{ cursor: 'pointer', opacity: 1, background: 'var(--iron-signal-integrity)' }}
                                        >
                                            Download Credential
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* DEV TOOLS FOR PROTOTYPE */}
            {import.meta.env.DEV && tasks.length === 0 && (
                <section className={styles.simulationSection}>
                    <h3 className={styles.simulationTitle}>⚠️ Simulation Tools (Dev Only)</h3>
                    <p style={{ color: 'var(--iron-text-tertiary)', marginBottom: '1rem' }}>No mandates found via Charter Engine. Use this to simulate an assignment.</p>
                    <button
                        onClick={() => {
                            // Declare Charter Issued
                            declare('CHARTER_ISSUED', {
                                id: crypto.randomUUID(),
                                title: "Information Security Basics",
                                description: "Mandatory training for all restricted operators. Complete by EOD.",
                                assignee: currentUser.uid,
                                issuer: currentUser.enterpriseId,
                                status: 'PENDING'
                            });
                        }}
                        className={styles.simBtn}
                    >
                        + Assign 'Infosec Basics' Mandate
                    </button>
                </section>
            )}
        </div>
    );
};
