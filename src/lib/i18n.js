// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '@/locales/en/translation';
import frTranslation from '@/locales/fr/translation';
import arTranslation from '@/locales/ar/translation';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    fr: { translation: frTranslation },
    ar: { translation: arTranslation },
  },
  lng: 'fr', // Langue par défaut
  fallbackLng: 'en', // Langue de secours
  interpolation: {
    escapeValue: false, // Pas d'échappement pour éviter les problèmes avec React
  },
});

export default i18n;
