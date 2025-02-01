'use client';
import React from 'react';
import Image from 'next/image';
import useNetwork from '@/hooks/useNetwork';
import SearchBar from '../UI/SearchBar';
import { Wifi, WifiOff } from 'lucide-react';

const Header = () => {
  const isOnline = useNetwork();

  return (
    <header className="h-16 w-full text-zinc-400 flex items-center justify-between px-4 lg:px-8">
      <a href="/" aria-label="Retour à l'accueil">
        <Image
          src="/spotify_logo.png"
          alt="Spotify Logo"
          width={24}
          height={24}
        />
      </a>
      <SearchBar aria-label="Barre de recherche" />
      {isOnline ? (
        <div className="bg-green-500 text-white rounded-full p-1" role="status" aria-label="Connecté">
          <Wifi />
        </div>
      ) : (
        <div className="bg-red-500 text-white rounded-full p-1" role="status" aria-label="Déconnecté">
          <WifiOff />
        </div>
      )}
    </header>
  );
};

export default Header;
