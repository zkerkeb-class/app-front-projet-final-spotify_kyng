import { Search } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const SearchBar = () => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center items-center w-full px-4">
      <div className="flex items-center bg-zinc-800 rounded-full px-4 py-2 shadow-md w-full max-w-[500px] sm:max-w-full md:max-w-[350px] lg:max-w-[500px]">
        <Search className="text-zinc-400" />

        <input
          type="text"
          placeholder={t('placeholderSearch')}
          className="flex-1 bg-transparent text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 ml-3"
          aria-label={t('search')}
        />
      </div>
    </div>
  );
};

export default SearchBar;
