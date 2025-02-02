import { Search } from 'lucide-react';
import React, { useState } from 'react';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setError(null); // Réinitialisation des erreurs à chaque nouvelle saisie
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (query.trim() === '') {
      setError('Veuillez entrer un terme de recherche.');
      return;
    }

    // Effectuer la recherche ici (simulation)
    console.log('Recherche:', query);
  };

  return (
    <div className="flex justify-center items-center h-screen divide-x-2">
      <form
        className="flex items-center bg-zinc-800 rounded-full px-4 py-2 shadow-md max-w-lg w-full"
        onSubmit={handleSearch}
        aria-live="assertive" // Annonce les erreurs de recherche
      >
        <Search className="text-zinc-500" />
        <input
          type="text"
          placeholder="Que souhaitez-vous écouter ou regarder"
          className="flex-1 bg-transparent text-zinc-300 placeholder-zinc-500 focus:outline-none ml-3"
          aria-label="Search"
          value={query}
          onChange={handleSearchChange}
          aria-describedby="search-error" // Associe l'erreur au champ de recherche
        />
        <button
          type="submit"
          className="sr-only" // Masqué à l'affichage, mais accessible au clavier et aux lecteurs d'écran
        >
          Rechercher
        </button>
      </form>

      {/* Affichage des messages d'erreur contextuels */}
      {error && (
        <div
          id="search-error"
          role="alert"
          aria-live="assertive"
          className="text-red-500 mt-2 text-sm"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
