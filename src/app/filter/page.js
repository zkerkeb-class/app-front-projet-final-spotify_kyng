'use client';

import { useReducer, useEffect, useCallback } from 'react';
import { advancedFilter } from '@/services/filter.service';
import Container from '@/components/UI/Container';
import Link from 'next/link';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import ErrorMessage from '@/components/UI/ErrorMessage';

const initialState = {
  filters: {
    artist: '',
    album: '',
    genre: '',
    year: '',
    duration: '',
    popularity: '',
  },
  sortOptions: { field: 'popularity', order: 'desc' },
  page: 1,
  limit: 10,
  tracks: [],
  loading: false,
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const FilterPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const updateState = (payload) => dispatch({ type: 'UPDATE_STATE', payload });

  const fetchData = useCallback(async () => {
    updateState({ loading: true, error: '' });
    try {
      const data = await advancedFilter(state.filters, state.sortOptions, state.page, state.limit);
      updateState({ tracks: data.data || [] });
    } catch {
      updateState({ error: 'Erreur lors de la récupération des données', tracks: [] });
    } finally {
      updateState({ loading: false });
    }
  }, [JSON.stringify(state.filters), state.sortOptions, state.page, state.limit]);

  useEffect(() => {
    const timeoutId = setTimeout(fetchData, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchData]);

  const handleChange = (e) => {
    updateState({
      filters: { ...state.filters, [e.target.name]: e.target.value },
      page: 1,
    });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    const [field, order] = value.includes('-') ? value.split('-') : ['popularity', 'desc'];
    updateState({ sortOptions: { field, order }, page: 1 });
  };

  if (state.error)
    return (
      <ErrorMessage
        error={state.error}
        onRetry={fetchData}
      />
    );

  return (
    <Container>
      <h1 className="text-4xl font-extrabold mb-6 text-center">Filtrer les pistes</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Filtres avancés</h2>
          {Object.keys(state.filters).map((key) => (
            <input
              key={key}
              type="text"
              name={key}
              value={state.filters[key]}
              onChange={handleChange}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              className="w-full p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500 transition duration-300"
            />
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Options de tri</h2>
          <select
            onChange={handleSortChange}
            className="w-full p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500 transition duration-300"
            value={`${state.sortOptions.field}-${state.sortOptions.order}`}
          >
            <option value="duration-asc">Durée croissante</option>
            <option value="duration-desc">Durée décroissante</option>
            <option value="releaseDate-asc">Date de sortie (ancien → récent)</option>
            <option value="releaseDate-desc">Date de sortie (récent → ancien)</option>
            <option value="title-asc">Ordre alphabétique (A-Z)</option>
            <option value="title-desc">Ordre alphabétique (Z-A)</option>
            <option value="popularity-asc">Popularité croissante</option>
            <option value="popularity-desc">Popularité décroissante</option>
            <option value="playCount-asc">Écoutes croissantes</option>
            <option value="playCount-desc">Écoutes décroissantes</option>
          </select>
        </div>
      </div>
      
      <div>
        <ul className="space-y-4">
          {state.tracks.map((track) => (
            <li
              key={track._id}
              className="p-4 bg-gray-800 rounded-lg shadow-lg"
            >
              <Link
                href={`/track/${track._id}`}
                className="block"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold underline text-white">
                    {track.title || 'Sans titre'}
                  </span>
                  <span className="text-sm text-gray-400">
                    {track.albumId?.name || 'Album inconnu'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {track.artistId?.name || 'Artiste inconnu'}
                </div>
                <div className="text-xs text-gray-400">
                  {track.artistId?.genres || 'Genre non spécifié'} - {track.releaseYear}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
};

export default FilterPage;
