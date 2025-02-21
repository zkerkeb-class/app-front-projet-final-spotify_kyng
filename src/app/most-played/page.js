'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { getMostPlayedPlaylist } from '@/services/playlist.service';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/UI/Container';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import ErrorMessage from '@/components/UI/ErrorMessage';
import { useTranslation } from 'react-i18next';

const MostPlayedPlaylistPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const fetchTopEcoutes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMostPlayedPlaylist();

      if (!Array.isArray(response)) {
        throw new Error('Données incorrectes');
      }

      setPlaylists(response);
    } catch (err) {
      setError(t('loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchTopEcoutes(); //
    const interval = setInterval(fetchTopEcoutes, 60000);
    return () => clearInterval(interval);
  }, [fetchTopEcoutes]);

  const sortedPlaylists = useMemo(
    () => [...playlists].sort((a, b) => b.playCount - a.playCount),
    [playlists]
  );

  const retryFetchData = () => {
    setError(null);
    fetchTopEcoutes();
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <ErrorMessage
        error={error}
        onRetry={retryFetchData}
      />
    );

  return (
    <Container>
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-black dark:text-white">
        🔥 {t('mostPlayedPlaylists')} 🔥
      </h1>

      {Array.isArray(sortedPlaylists) && sortedPlaylists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {sortedPlaylists.map((playlist, index) => (
            <Link
              href={`/track/${playlist._id}`}
              key={playlist._id || `playlist-${index}`}
              passHref
            >
              <div className="group bg-gray-800 p-4 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer">
                <div className="relative w-full h-48">
                  <Image
                    src="/playlist.png"
                    alt={playlist.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <h2 className="mt-3 text-lg font-semibold text-white truncate">{playlist.title}</h2>
                <p className="text-sm text-gray-400">
                  🎧 {t('playCount')}: {playlist.numberOfListens}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-xl text-gray-500">
          <p>{t('noPlaylistsAvailable')} 😔</p>
        </div>
      )}
    </Container>
  );
};

export default MostPlayedPlaylistPage;
