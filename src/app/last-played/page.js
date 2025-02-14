'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { getLastPlayedPlaylist } from '@/services/playlist.service';
import Link from 'next/link';
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
      setError(t('albumLoadError'));
    } finally {
      setLoading(false);
    }
  }, []);

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
      <h1 className="text-4xl font-extrabold mb-6 text-center">Dernières playlists écoutées</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.isArray(memoizedPlaylists) && memoizedPlaylists.length > 0 ? (
          memoizedPlaylists.map((playlist, index) => (
            <Link
              href={`/track/${playlist._id}`}
              key={playlist._id || `playlist-${index}`}
              passHref
            >
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl">
                <img
                  src={playlist.imagePath}
                  alt={playlist.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold text-white mb-2">{playlist.title}</h2>
                <p className="text-sm text-gray-400">{playlist.releaseYear}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-xl text-gray-500">Aucune playlist disponible.</p>
        )}
      </div>
    </Container>
  );
};

export default LastPlayedPlaylistPage;
