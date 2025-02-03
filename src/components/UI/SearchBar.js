import { Search } from 'lucide-react';
import React from 'react';

const SearchBar = () => {
    return (
        <div className="flex justify-center items-center h-screen divide-x-2">
          <div className="  flex items-center bg-zinc-800 rounded-full px-4 py-2 shadow-md w-[500px]">
            <Search />

            <input
              type="text"
              placeholder="Que souhaitez-vous écouter ou regarder"
              className="flex-1 bg-transparent text-zinc-300 placeholder-zinc-500 focus:outline-none ml-3"
            />
          </div>
        </div>
      );
};

export default SearchBar;