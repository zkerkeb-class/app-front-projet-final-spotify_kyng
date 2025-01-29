'use client';
import Container from '@/components/UI/Container';
import React, { useEffect, useState } from 'react';

const Settings = () => {
  const [currentLang, setCurrentLang] = useState('fr');
  useEffect(() => {
    // Check for user’s previous dark mode preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      if (JSON.parse(savedMode)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      // Set the  language
      setCurrentLang(savedLang);
    } else {
      localStorage.setItem('lang', currentLang);
    }
  }, []);

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('lang', lang);
  };
  return (
    <Container>
      <div className="dark:text-white text-black">
        <h1 className="text-3xl font-bold  dark:text-white">Paramètres</h1>

        <div className="mt-8 space-y-6">
          {/* Language Selector */}
          <div>
            <h2 className="text-xl font-semibold  dark:text-white">Langue</h2>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-4 py-2 border text-white rounded-full hover:bg-zinc-700 ${currentLang === 'en' ? 'bg-zinc-600' : ''}`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange('fr')}
                className={`px-4 py-2 border text-white rounded-full hover:bg-zinc-700 ${currentLang === 'fr' ? 'bg-zinc-600' : ''}`}
              >
                Français
              </button>
              <button
                onClick={() => handleLanguageChange('ar')}
                className={`px-4 py-2 border text-white rounded-full hover:bg-zinc-700 ${currentLang === 'ar' ? 'bg-zinc-600' : ''}`}
              >
                العربية
              </button>
            </div>
          </div>

          {/* Dark Mode Switch */}
          <div>
            <h2 className="text-xl font-semibold  dark:text-white">Thème</h2>
            <div className="mt-4 flex items-center space-x-4">
              <button
                onClick={() => {
                  document.documentElement.classList.remove('dark');
                  localStorage.setItem('darkMode', false);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
              >
                Jour
              </button>
              <button
                onClick={() => {
                  document.documentElement.classList.add('dark');
                  localStorage.setItem('darkMode', true);
                }}
                className="px-4 py-2 bg-zinc-600 text-white rounded-full hover:bg-zinc-700"
              >
                Nuit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Settings;
