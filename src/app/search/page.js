'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import searchService from '@/services/search.service';
import Fuse from 'fuse.js';
import Container from '@/components/UI/Container';
import Link from 'next/link';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const DEBOUNCE_DELAY = 500;

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    albums: [],
    artists: [],
    tracks: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimeout = useRef(null);
  const fuse = useRef(null);
  const cache = useRef(new Map());
  const [retryCount, setRetryCount] = useState(0);

  const fetchSearchResults = useCallback(
    async (query) => {
      if (!query.trim()) return;

      setLoading(true);
      setError(null);

      if (cache.current.has(query)) {
        setResults(cache.current.get(query));
        setLoading(false);
        return;
      }

      try {
        const data = await searchService(query);
        console.log('Données de recherche:', data);

        const groupedResults = data.results.reduce(
          (acc, item) => {
            if (item.type === 'album') acc.albums.push(item);
            if (item.type === 'artist') acc.artists.push(item);
            if (item.type === 'track') acc.tracks.push(item);
            return acc;
          },
          { albums: [], artists: [], tracks: [] }
        );

        cache.current.set(query, groupedResults);
        setResults(groupedResults);
      } catch (err) {
        if (retryCount < MAX_RETRIES) {
          setRetryCount((prev) => prev + 1);
          setTimeout(() => fetchSearchResults(query), RETRY_DELAY);
        } else {
          setError('Une erreur est survenue lors de la recherche. Veuillez réessayer plus tard.');
        }
      } finally {
        setLoading(false);
      }
    },
    [retryCount]
  );

  const handleSuggestions = () => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const matches = fuse.current.search(query).map(({ item }) => item);
    setSuggestions(matches);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.data.title || suggestion.data.name || suggestion.data.artistId.name);
    fetchSearchResults(
      suggestion.data.title || suggestion.data.name || suggestion.data.artistId.name
    );
  };

  useEffect(() => {
    const allResults = [...results.albums, ...results.artists, ...results.tracks];
    fuse.current = new Fuse(allResults, {
      keys: ['data.title', 'data.name', 'data.artistId.name'],
      threshold: 0.3,
    });
  }, [results]);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      fetchSearchResults(query);
      handleSuggestions();
    }, DEBOUNCE_DELAY);
  }, [query, fetchSearchResults]);

  return (
    <Container>
      <h1 className="text-4xl font-extrabold mb-6 text-center">Rechercher</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher un album, un artiste, une piste..."
        aria-label="Champ de recherche"
        className="w-full p-3 bg-gray-800 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
      />

      {loading && <p className="mt-4 text-center text-gray-400">Chargement des résultats...</p>}
      {error && <p className="mt-4 text-center text-red-500">{error}</p>}

      {suggestions.length > 0 && (
        <div className="mt-4 p-4 bg-gray-700 rounded-lg shadow-md">
          <h3 className="text-white text-xl mb-2">Suggestions :</h3>
          <ul>
            {suggestions.map((item, index) => (
              <li
                key={index}
                className="text-gray-300 hover:text-white cursor-pointer"
                onClick={() => handleSuggestionClick(item)}
              >
                {item.data.title || item.data.name || item.data.artistId.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.albums.length > 0 && (
        <div className="mt-6">
          <h2 className="text-green-500 text-2xl font-bold mb-4">Albums</h2>
          <ul className="space-y-4">
            {results.albums.map((item) => (
              <li
                key={item.data._id}
                className="p-4 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600"
              >
                <Link
                  href={`/album/${item.data._id}`}
                  className="no-underline"
                >
                  <div className="text-white font-semibold">{item.data.title}</div>
                  <div className="text-gray-400">Année: {item.data.releaseDate}</div>
                  <div className="text-gray-400">Artiste: {item.data.artistId.name}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.artists.length > 0 && (
        <div className="mt-6">
          <h2 className="text-green-500 text-2xl font-bold mb-4">Artistes</h2>
          <ul className="space-y-4">
            {results.artists.map((item) => (
              <li
                key={item.data._id}
                className="p-4 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600"
              >
                <Link
                  href={`/artist/${item.data._id}`}
                  className="no-underline"
                >
                  <div className="text-white font-semibold">{item.data.name}</div>
                  <div className="text-gray-400">Genre: {item.data.genres}</div>
                  {item.data.images && item.data.images[0] && (
                    <img
                      src={item.data.images[0].path}
                      alt={item.data.name}
                      className="mt-2 w-16 h-16 rounded-full object-cover"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.tracks.length > 0 && (
        <div className="mt-6">
          <h2 className="text-green-500 text-2xl font-bold mb-4">Pistes</h2>
          <ul className="space-y-4">
            {results.tracks.map((item) => (
              <li
                key={item.data._id}
                className="p-4 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600"
              >
                <Link
                  href={`/track/${item.data._id}`}
                  className="no-underline"
                >
                  <div className="text-white font-semibold">{item.data.title}</div>
                  <div className="text-gray-400">Durée: {item.data.duration} secondes</div>
                  <div className="text-gray-400">
                    Gros mots: {item.data.isExplicit ? 'Oui' : 'Non'}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.albums.length === 0 &&
        results.artists.length === 0 &&
        results.tracks.length === 0 && (
          <p className="mt-4 text-center text-gray-400">Aucun résultat trouvé.</p>
        )}
    </Container>
  );
};

export default SearchPage;
