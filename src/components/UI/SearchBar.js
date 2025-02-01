import { Search } from 'lucide-react';
import React from 'react';

const SearchBar = () => {
  return (
    <div className="flex justify-center items-center h-screen divide-x-2">
      <div className="flex items-center bg-zinc-800 rounded-full px-4 py-2 shadow-md max-w-lg w-full">
        <Search className="text-zinc-500" />
        <input
          type="text"
          placeholder="Que souhaitez-vous écouter ou regarder"
          className="flex-1 bg-transparent text-zinc-300 placeholder-zinc-500 focus:outline-none ml-3"
          aria-label="Search"
        />
      </div>
    </div>
  );
};

export default SearchBar;
