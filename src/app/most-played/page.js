'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { getMostPlayedPlaylist } from '@/services/playlist.service';
import Link from 'next/link';
import Container from '@/components/UI/Container';

const MostPlayedPlaylistPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTopEcoutes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMostPlayedPlaylist();
      setPlaylists(response);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopEcoutes();
    const interval = setInterval(() => {
      fetchTopEcoutes();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchTopEcoutes]);

  const sortedPlaylists = useMemo(() => {
    return playlists.sort((a, b) => b.playCount - a.playCount);
  }, [playlists]);

  if (loading) return <p className="text-center text-xl text-gray-500">Chargement...</p>;
  if (error) return <p className="text-center text-xl text-red-500">{error}</p>;

  return (
    <Container>
      <h1 className="text-4xl font-extrabold mb-6 text-center">Playlists les plus écoutées</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.isArray(sortedPlaylists) && sortedPlaylists.length > 0 ? (
          sortedPlaylists.map((playlist, index) => (
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
                <h2 className="text-xl sm:text-lg md:text-xl font-semibold text-white mb-2">
                  {playlist.title}
                </h2>
                <p className="text-sm sm:text-base text-gray-400">{`Nombre d'écoute : ${playlist.numberOfListens}`}</p>
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

export default MostPlayedPlaylistPage;
