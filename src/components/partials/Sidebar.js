'use client';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { CirclePlus, Home, LibraryBig, Search, Settings } from 'lucide-react';
import NavItem from '@/components/UI/NavItem';

const SideBar = () => {
  const pathname = usePathname();

  return (
    <aside className="bg-zinc-700 dark:bg-zinc-800 rounded-lg py-5 px-2 min-w-60 lg:min-w-80">
      <nav className="flex flex-col justify-between h-full lg:h-screen">
        <div className="flex flex-col gap-5">
          <ul className="bg-zinc-800 dark:bg-zinc-700 rounded" aria-label="Navigation principale">
            <NavItem
              url="/"
              isActive={pathname === '/'}
              icon={<Home />}
              name="Accueil"
            />
            <NavItem
              url="/search"
              isActive={pathname === '/search'}
              icon={<Search />}
              name="Rechercher"
            />
          </ul>
          <ul className="bg-zinc-800 dark:bg-zinc-700 rounded" aria-label="Bibliothèque et Playlists">
            <li className="text-zinc-400 dark:text-zinc-300 flex items-center p-3 gap-3">
              <LibraryBig />
              Bibliothèque
              <button className="text-zinc-400 dark:text-zinc-300 hover:text-white" aria-label="Ajouter à la bibliothèque">
                <CirclePlus />
              </button>
            </li>
            <NavItem
              url="/playlist/liked"
              name="Titres likés"
              icon={
                <Image
                  src="/spotify_liked_playlist.jpg"
                  alt="Titres likés"
                  width={24}
                  height={24}
                />
              }
            />
          </ul>
          <ul className="bg-zinc-800 dark:bg-zinc-700 rounded" aria-label="Paramètres">
            <NavItem
              url="/settings"
              name="Paramètres"
              isActive={pathname === '/settings'}
              icon={<Settings />}
            />
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default SideBar;
