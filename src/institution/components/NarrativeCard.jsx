import React from 'react';
import { FileText, AlertTriangle, Shield, CheckCircle2 } from 'lucide-react';

const NarrativeCard = ({ type = 'NOTICE', content, date }) => {
    const getStyle = () => {
        switch (type) {
            case 'ORDER':
                return {
                    borderColor: 'var(--civil-accent-alert)',
                    icon: <AlertTriangle size={20} color="var(--civil-accent-alert)" />,
                    title: 'SYSTEM ORDER'
                };
            case 'RECORD':
                return {
                    borderColor: 'var(--civil-accent-success)',
                    icon: <CheckCircle2 size={20} color="var(--civil-accent-success)" />,
                    title: 'PERMANENT RECORD'
                };
            case 'NOTICE':
            default:
                return {
                    borderColor: 'var(--civil-border-strong)',
                    icon: <FileText size={20} color="var(--civil-text-secondary)" />,
                    title: 'SYSTEM NOTICE'
                };
        }
    };

    const style = getStyle();

    return (
        <div className="civil-card" style={{
            borderLeft: `4px solid ${style.borderColor}`,
            marginBottom: '16px',
            fontFamily: 'var(--font-sans)',
            backgroundColor: 'var(--civil-paper)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                {style.icon}
                <div style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    color: 'var(--civil-text-muted)',
                    textTransform: 'uppercase'
                }}>
                    {style.title} &bull; {date}
                </div>
            </div>

            <div style={{
                fontSize: '0.95rem',
                lineHeight: '1.6',
                color: 'var(--civil-text-primary)',
                whiteSpace: 'pre-line'
            }}>
                {content}
            </div>
        </div>
    );
};

export default NarrativeCard;
