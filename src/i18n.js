import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import enTranslation from './locales/en/translation.json';
import hiTranslation from './locales/hi/translation.json';
import taTranslation from './locales/ta/translation.json';
import koTranslation from './locales/ko/translation.json';
import jaTranslation from './locales/ja/translation.json';

// For MVP, we can bundle translations directly to avoid async loading issues on local dev
// In production, we might want to load them via HTTP Backend
const resources = {
    en: { translation: enTranslation },
    hi: { translation: hiTranslation },
    ta: { translation: taTranslation },
    ko: { translation: koTranslation },
    ja: { translation: jaTranslation }
};

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        resources, // Bundle resources for now
        lng: 'en', // Default language
        fallbackLng: 'en',
        debug: true,

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    });

export default i18n;
