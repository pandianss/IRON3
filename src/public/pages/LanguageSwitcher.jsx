import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'en', label: 'ENG' },
        { code: 'hi', label: 'HIN' }, // Hindi
        { code: 'ta', label: 'TAM' }, // Tamil
        { code: 'ko', label: 'KOR' }, // Korean
        { code: 'ja', label: 'JPN' }  // Japanese
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div style={containerStyle}>
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    style={{
                        ...buttonStyle,
                        opacity: i18n.language === lang.code ? 1 : 0.4,
                        borderBottom: i18n.language === lang.code ? '1px solid var(--iron-brand-stable)' : '1px solid transparent'
                    }}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );
};

const containerStyle = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem'
};

const buttonStyle = {
    background: 'transparent',
    border: 'none',
    color: 'var(--iron-text-secondary)',
    cursor: 'pointer',
    padding: '4px 0',
    transition: 'all 0.2s ease',
    letterSpacing: '1px'
};
