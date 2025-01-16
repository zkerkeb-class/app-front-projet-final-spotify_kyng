'use client';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { CirclePlus, Home, LibraryBig, Search } from 'lucide-react';
import NavItem from '@/components/UI/NavItem';
const SideBar = () => {
  const pathname = usePathname();

  return (
    <aside className="bg-zinc-950 py-5 px-2 min-w-60">
      <nav className="flex flex-col gap-5">
        <ul className="bg-zinc-800 rounded">
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
        <ul className="bg-zinc-800 rounded">
          <li className="text-zinc-400 flex items-center p-3 gap-3">
            <LibraryBig />
            Bibliothèque
            <button className="text-zinc-400 hover:text-white">
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
      </nav>
    </aside>
  );
};

export default SideBar;
