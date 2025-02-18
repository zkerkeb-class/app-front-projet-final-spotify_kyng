'use client';
import Container from '@/components/UI/Container';
import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import '../../lib/i18n';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState('fr');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleLanguageChange = useCallback((lang) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [i18n]);

  const handleThemeChange = useCallback((isDark) => {
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, []);

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') || 'fr';
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';

    i18n.changeLanguage(storedLang);
    setCurrentLang(storedLang);
    
    document.documentElement.lang = storedLang;
    document.documentElement.dir = storedLang === 'ar' ? 'rtl' : 'ltr';

    setIsDarkMode(storedDarkMode);
    if (storedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [i18n]);

  const getButtonClass = (isActive) => {
    return `px-4 py-2 border text-white rounded-full hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${isActive ? 'bg-green-500' : 'bg-zinc-600'}`;
  };

  return (
    <Container>
      <div className="dark:text-white text-black">
        <h1 className="text-3xl font-bold dark:text-white">{t('settings')}</h1>

        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold dark:text-white">{t('language')}</h2>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleLanguageChange('en')}
                className={getButtonClass(currentLang === 'en')}
                aria-label={t('english')}
              >
                {t('english')}
              </button>
              <button
                onClick={() => handleLanguageChange('fr')}
                className={getButtonClass(currentLang === 'fr')}
                aria-label={t('french')}
              >
                {t('french')}
              </button>
              <button
                onClick={() => handleLanguageChange('ar')}
                className={getButtonClass(currentLang === 'ar')}
                aria-label={t('arabic')}
              >
                {t('arabic')}
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold dark:text-white">{t('theme')}</h2>
            <div className="mt-4 flex items-center space-x-4">
              <button
                onClick={() => handleThemeChange(false)}
                className={getButtonClass(!isDarkMode)}
                aria-label={t('dayMode')}
              >
                {t('dayMode')}
              </button>
              <button
                onClick={() => handleThemeChange(true)}
                className={getButtonClass(isDarkMode)}
                aria-label={t('nightMode')}
              >
                {t('nightMode')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Settings;
