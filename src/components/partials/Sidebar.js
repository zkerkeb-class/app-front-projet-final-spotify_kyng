'use client';

import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Home, Search, Filter, Clock, TrendingUp, Settings, X } from 'lucide-react';
import NavItem from '@/components/UI/NavItem';

const SideBar = ({ isSidebarOpen, closeSidebar }) => {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <aside
      className={`bg-zinc-800 dark:bg-black py-6 px-5 flex flex-col z-50 fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      <button
        onClick={closeSidebar}
        className="text-gray-400 hover:text-white transition-all duration-200 absolute top-5 right-5 lg:hidden"
        aria-label={t('close')}
      >
        <X className="w-6 h-6" />
      </button>

      <nav className="flex flex-col justify-between h-full">
        <div className="flex flex-col">
          <ul className="">
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
              name={t('search')}
            />
            <NavItem
              url="/filter"
              isActive={pathname === '/filter'}
              icon={<Filter />}
              name={t('filter')}
            />
          </ul>
          <ul className="space-y-3">
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
          <ul className="space-y-3">
            <NavItem
              url="/settings"
              isActive={pathname === '/settings'}
              icon={<Settings />}
              name={t('settings')}
            />
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default SideBar;
