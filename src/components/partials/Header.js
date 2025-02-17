'use client';
import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import '../../lib/i18n';
import useNetwork from '@/hooks/useNetwork';
import SearchBar from '../UI/SearchBar';
import { Wifi, WifiOff, Menu, X } from 'lucide-react';
import SideBar from './Sidebar';

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const { i18n } = useTranslation();
  const isOnline = useNetwork();

  const getLocalizedDate = () => {
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date());
  };

  return (
    <header className="h-16 w-full text-zinc-400 flex items-center justify-between p-2 md:px-4">
      {/* Logo et date */}
      <div className="flex items-center gap-2 px-2">
        <a
          href="/"
          aria-label="Retour à l'accueil"
        >
          <Image
            src="/spotify_logo.png"
            alt="Spotify Logo"
            width={24}
            height={24}
          />
        </a>
        <p className="text-black dark:text-white text-sm hidden sm:block">{getLocalizedDate()}</p>
      </div>

      {/* Bouton hamburger pour ouvrir la sidebar */}
      <button
        onClick={onToggleSidebar} // Ouvre ou ferme la sidebar
        className="lg:hidden"
        aria-label="Ouvrir la sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Barre de recherche */}
      <SearchBar
        aria-label="Barre de recherche"
        className="hidden sm:flex"
      />

      {/* Statut réseau */}
      {isOnline ? (
        <div
          className="bg-green-500 text-white rounded-full p-1"
          role="status"
          aria-label="Connecté"
        >
          <Wifi />
        </div>
      ) : (
        <div
          className="bg-red-500 text-white rounded-full p-1"
          role="status"
          aria-label="Déconnecté"
        >
          <WifiOff />
        </div>
      )}
    </header>
  );
};

export default Header;
