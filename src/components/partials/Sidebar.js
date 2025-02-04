'use client';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import {
  CirclePlus,
  Home,
  LibraryBig,
  Search,
  Settings,
  Filter,
  Clock,
  TrendingUp,
} from 'lucide-react'; // Ajout des nouvelles icônes
import NavItem from '@/components/UI/NavItem';

const SideBar = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <aside className="bg-zinc-700 dark:bg-zinc-800 rounded-lg py-5 px-2 min-w-60 lg:min-w-80">
      <nav className="flex flex-col justify-between h-full lg:h-screen">
        <div className="flex flex-col gap-5">
          <ul
            className="bg-zinc-800 dark:bg-zinc-700 rounded"
            aria-label="Navigation principale"
          >
            <NavItem
              url="/"
              isActive={pathname === '/'}
              icon={<Home />}
              name={t('home')}
            />
            <NavItem
              url="/search"
              isActive={pathname === '/search'}
              icon={<Search />}
              name={t('search')}            />
            <NavItem
              url="/filter"
              isActive={pathname === '/filter'}
              icon={<Filter />}
              name={t('filter')}
            />
          </ul>
          <ul
            className="bg-zinc-800 dark:bg-zinc-700 rounded"
            aria-label="Bibliothèque et Playlists"
          >
            {/* Nouvelle entrée pour "Dernières playlists écoutées" */}
            <NavItem
              url="/last-played"
              isActive={pathname === '/last-played'}
              icon={<Clock />}
              name={t('lastPlayed')}
            />
            <NavItem
              url="/most-played"
              isActive={pathname === '/most-played'}
              icon={<TrendingUp />}
              name={t('mostPlayed')}
            />
          </ul>
          <ul
            className="bg-zinc-800 dark:bg-zinc-700 rounded"
            aria-label="Paramètres"
          >
            <NavItem
              url="/settings"
              name={t('settings')}
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
