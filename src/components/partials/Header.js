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
    </header>
  );
};

export default Header;
