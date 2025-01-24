import { CircleArrowDown, Home, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import SearchBar from '../UI/SearchBar';

const Header = () => {
  return (
    <header className="h-16 w-screen text-zinc-400 flex items-center justify-between px-4">
      <Image
        src="/spotify_logo.png"
        alt="Spotify Logo"
        width={24}
        height={24}
      />

      <SearchBar />

      <Link
        href="#"
        className="flex items-center gap-2 font-bold transition-all dark:hover:text-white hover:text-black hover:font-bold hover:text-lg"
      >
        <CircleArrowDown />
        <span>Installer l'appli</span>
      </Link>
    </header>
  );
};

export default Header;
