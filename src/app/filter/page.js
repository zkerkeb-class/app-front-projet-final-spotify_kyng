'use client';

import { useReducer, useEffect, useCallback } from 'react';
import { advancedFilter } from '@/services/filter.service';
import Container from '@/components/UI/Container';
import Link from 'next/link';

const initialState = {
  filters: {
    artist: '',
    album: '',
    genre: '',
    year: '',
    duration: '',
    popularity: '',
  },
  sortOptions: {
    field: 'popularity',
    order: 'desc',
  },
  page: 1,
  limit: 10,
  tracks: [],
  loading: false,
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.name]: action.payload.value,
        },
        page: 1,
      };
    case 'SET_SORT':
      return {
        ...state,
        sortOptions: action.payload,
        page: 1,
      };
    case 'SET_PAGE':
      return {
        ...state,
        page: action.payload,
      };
    case 'SET_LIMIT':
      return {
        ...state,
        limit: action.payload,
      };
    case 'SET_TRACKS':
      return {
        ...state,
        tracks: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}

const FilterPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleFilterChange = (e) => {
    dispatch({
      type: 'SET_FILTER',
      payload: {
        name: e.target.name,
        value: e.target.value,
      },
    });
  };

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split('-');
    dispatch({
      type: 'SET_SORT',
      payload: { field, order },
    });
  };

  const fetchData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: '' });
    try {
      const data = await advancedFilter(state.filters, state.sortOptions, state.page, state.limit);
      dispatch({ type: 'SET_TRACKS', payload: data.data || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la récupération des données' });
      dispatch({ type: 'SET_TRACKS', payload: [] });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.filters, state.sortOptions, state.page, state.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Container>
      {state.error && <p className="text-red-500">{state.error}</p>}
      <h1 className="text-3xl font-bold mb-8 text-center">Filtrer les pistes</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Filtres avancés</h2>
          <input
            type="text"
            name="artist"
            value={state.filters.artist}
            onChange={handleFilterChange}
            placeholder="Artiste (nom entier)"
            className="w-full p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500 transition duration-300"
          />
          <input
            type="text"
            name="album"
            value={state.filters.album}
            onChange={handleFilterChange}
            placeholder="Album (nom entier)"
            className="w-full p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500 transition duration-300"
          />
          <input
            type="text"
            name="genre"
            value={state.filters.genre}
            onChange={handleFilterChange}
            placeholder="Genre musical"
            className="w-full p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500 transition duration-300"
          />
          <input
            type="number"
            name="year"
            value={state.filters.year}
            onChange={handleFilterChange}
            placeholder="Année de sortie"
            className="w-full p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500 transition duration-300"
          />
          <input
            type="number"
            name="duration"
            value={state.filters.duration}
            onChange={handleFilterChange}
            placeholder="Durée en secondes"
            className="w-full p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500 transition duration-300"
          />
          <input
            type="number"
            name="popularity"
            value={state.filters.popularity}
            onChange={handleFilterChange}
            placeholder="Popularité (0-100)"
            className="w-full p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500 transition duration-300"
          />
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
        {state.loading && <p className="text-center">Chargement...</p>}
        <ul>
          {state.tracks.map((track) => (
            <li
              key={track._id}
              className="p-4 bg-gray-800 rounded-lg mb-4 shadow-lg"
            >
              <Link
                href={`/track/${track._id}`}
                className="no-underline"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold underline">{track.title || 'Sans titre'}</span>

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
                <div className="text-xs text-gray-400">{formatDuration(track.duration)}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
};

export default FilterPage;
