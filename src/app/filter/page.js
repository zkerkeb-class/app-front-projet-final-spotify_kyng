'use client';

import { useReducer, useEffect, useCallback, Suspense, lazy } from 'react';
import { advancedFilter } from '@/services/filter.service';
import Container from '@/components/UI/Container';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const ErrorMessage = lazy(() => import('@/components/UI/ErrorMessage'));

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
  const { t } = useTranslation();

  const updateState = (payload) => dispatch({ type: 'UPDATE_STATE', payload });

  const fetchData = useCallback(async () => {
    updateState({ loading: true, error: '' });
    try {
      const data = await advancedFilter(state.filters, state.sortOptions, state.page, state.limit);
      updateState({ tracks: data.data || [] });
    } catch {
      updateState({ error: t('loadError'), tracks: [] });
    } finally {
      updateState({ loading: false });
    }
  }, [JSON.stringify(state.filters), state.sortOptions, state.page, state.limit]);

  useEffect(() => {
    const timeoutId = setTimeout(fetchData, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchData]);

  if (state.error)
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorMessage
          error={state.error}
          onRetry={fetchData}
        />
      </Suspense>
    );

  return (
    <Container>
      <h1 className="text-3xl sm:text-xl font-extrabold mb-6 text-center text-black dark:text-white">
      🔍 Filtres avancés 🔍
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {Object.keys(state.filters).map((key) => (
          <input
            key={key}
            type="text"
            name={key}
            value={state.filters[key]}
            onChange={(e) =>
              updateState({
                filters: { ...state.filters, [e.target.name]: e.target.value },
                page: 1,
              })
            }
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            className="w-full p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500 transition duration-300"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {state.tracks.map((track) => (
          <Link
            href={`/track/${track._id}`}
            key={track._id}
            passHref
          >
            <div className="group bg-gray-800 p-4 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer">
              <h2 className="text-lg font-semibold text-white truncate">
                {track.title || 'Sans titre'}
              </h2>
              <p className="text-sm text-gray-500">{track.artistId?.name || 'Artiste inconnu'}</p>
              <p className="text-xs text-gray-400">{track.albumId?.name || 'Album inconnu'}</p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
};

export default FilterPage;
