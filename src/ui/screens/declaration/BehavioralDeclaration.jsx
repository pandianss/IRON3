import React, { useState } from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import '../../styles/InstitutionalTheme.css';

const BehavioralDeclaration = ({ onComplete }) => {
    const { declarePractice } = useGovernance();
    const [section, setSection] = useState('BODY'); // BODY, INITIATION, COMMITMENT
    const [formData, setFormData] = useState({
        body_practice: '',
        minimum_action: '',
        initiation_struggle: '',
        avoidance_trigger: '',
        commitment_time: '07:00'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitDeclaration = async () => {
        // Log declaration to ledger
        await declarePractice('DECLARATION_SUBMITTED', formData);
        onComplete();
    };

    const renderSection = () => {
        switch (section) {
            case 'BODY':
                return (
                    <div>
                        <h2 className="section-title">SECTION A: BODY PRACTICE</h2>
                        <p className="section-desc">Define the physical discipline you wish to govern.</p>

                        <div className="form-group">
                            <label>WHAT IS THE PRACTICE?</label>
                            <input
                                type="text"
                                name="body_practice"
                                placeholder="e.g., Strength Training, Running, Yoga"
                                value={formData.body_practice}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>MINIMUM NON-NEGOTIABLE ACTION</label>
                            <input
                                type="text"
                                name="minimum_action"
                                placeholder="e.g., 10 minutes, 1 set, 1 mile"
                                value={formData.minimum_action}
                                onChange={handleChange}
                            />
                        </div>

                        <button className="civil-button" onClick={() => setSection('INITIATION')}>
                            PROCEED TO SECTION B
                        </button>
                    </div>
                );

            case 'INITIATION':
                return (
                    <div>
                        <h2 className="section-title">SECTION B: INITIATION STRUGGLE</h2>
                        <p className="section-desc">Identify where your discipline typically fractures.</p>

                        <div className="form-group">
                            <label>WHERE DO YOU FREEZE?</label>
                            <input
                                type="text"
                                name="initiation_struggle"
                                placeholder="e.g., Before getting out of bed, putting on shoes"
                                value={formData.initiation_struggle}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>WHAT DRAINS ATTENTION?</label>
                            <input
                                type="text"
                                name="avoidance_trigger"
                                placeholder="e.g., Social media scrolling, email"
                                value={formData.avoidance_trigger}
                                onChange={handleChange}
                            />
                        </div>

                        <button className="civil-button" onClick={() => setSection('COMMITMENT')}>
                            PROCEED TO SECTION C
                        </button>
                    </div>
                );

            case 'COMMITMENT':
                return (
                    <div>
                        <h2 className="section-title">SECTION C: COMMITMENT SHAPE</h2>
                        <p className="section-desc">Establish the temporal boundaries of your practice.</p>

                        <div className="form-group">
                            <label>PREFERRED PRACTICE TIME</label>
                            <input
                                type="time"
                                name="commitment_time"
                                value={formData.commitment_time}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="declaration-statement">
                            "I DECLARE THIS INTENT FOR GOVERNANCE."
                        </div>

                        <button className="civil-button primary" onClick={submitDeclaration}>
                            SEAL DECLARATION
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="declaration-screen civil-form-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px', fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--civil-text-muted)' }}>
                FORM 101: DECLARATION OF PRACTICE
            </div>
            {renderSection()}
        </div>
    );
};

export default BehavioralDeclaration;
