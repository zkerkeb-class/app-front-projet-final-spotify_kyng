'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { getLastPlayedPlaylist } from '@/services/playlist.service';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/UI/Container';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import ErrorMessage from '@/components/UI/ErrorMessage';
import { useTranslation } from 'react-i18next';

const LastPlayedPlaylistPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const fetchLastEcoutes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getLastPlayedPlaylist();
      const sortedPlaylists = response
        .sort((a, b) => new Date(b.lastPlayedDate) - new Date(a.lastPlayedDate))
        .slice(0, 20);
      setPlaylists(sortedPlaylists);
    } catch (err) {
      setError(t('loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const memoizedPlaylists = useMemo(() => playlists, [playlists]);

  useEffect(() => {
    fetchLastEcoutes();
    const interval = setInterval(fetchLastEcoutes, 60000);
    return () => clearInterval(interval);
  }, [fetchLastEcoutes]);

  const retryFetchData = () => {
    setError(null);
    fetchLastEcoutes();
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
        🎵 {t('lastPlayedPlaylists')} 🎵
      </h1>

      {Array.isArray(memoizedPlaylists) && memoizedPlaylists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {memoizedPlaylists.map((playlist, index) => (
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
                <p className="text-sm text-gray-400">{playlist.releaseYear}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-xl text-gray-500">
          <p>😔 {t('noPlaylistsAvailable')}</p>
        </div>
      )}
    </Container>
  );
};

export default LastPlayedPlaylistPage;
