'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getArtistById } from '@/services/artist.service';
import { getAlbumsByArtist } from '@/services/album.service';
import { useRouter } from 'next/navigation';
import Container from '@/components/UI/Container';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import ErrorMessage from '@/components/UI/ErrorMessage';

const img = 'https://placehold.co/200x200/jpeg';

const ArtistDetail = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fonction pour récupérer les données de l'artiste et ses albums
  const fetchArtistData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Réinitialise l'erreur
      const artistData = await getArtistById(id);
      setArtist(artistData);

      const artistID = artistData._id;
      const response = await getAlbumsByArtist(artistID);
      setAlbums(response.albums || []);
    } catch (err) {
      setError('Erreur lors du chargement des données.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchArtistData();
    }
  }, [id, fetchArtistData]);

  const handleCardClick = (id, type) => {
    if (!id || !type) {
      console.error('Invalid ID or type');
      return;
    }

    router.push(`/album/${id}`);
  };

  const getImage = (imagePath) => {
    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    return isValidUrl(imagePath) ? imagePath : img;
  };

  const retryFetchData = () => {
    fetchArtistData();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={retryFetchData} />;

  if (!artist) {
    return <div className="text-gray-400 text-center text-xl py-4">Artiste introuvable.</div>;
  }

  return (
    <div className="min-h-screen">
      <div
        className="relative w-full h-[350px] flex items-end bg-gradient-to-b from-gray-900 via-black to-black p-6 rounded-t-lg shadow-lg"
        style={{
          backgroundImage: `url(${getImage(artist.images?.[0])})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60 z-0" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-white">
            <img
              src={artist.image || img}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">{artist.name}</h2>
            <p className="text-lg text-gray-300">{artist.genres}</p>
          </div>
        </div>
      </div>
      <Container>
        {/* Albums */}
        <div className="p-6">
          <h3 className="text-3xl font-semibold mb-6">Albums</h3>

          {albums.length === 0 ? (
            <p className="text-center text-xl text-gray-400">Aucun album disponible</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 cursor-pointer">
              {albums.map((album) => (
                <div
                  key={album._id}
                  className="max-w-xs mx-auto hover:scale-105 transform transition-all duration-300"
                  onClick={() => handleCardClick(album._id, 'album')}
                  role="button"
                  aria-label={`Album ${album.title}`}
                >
                  <div className="relative rounded-lg overflow-hidden bg-gray-800">
                    <img
                      src={getImage(album.images?.[0]?.path || album.image)}
                      alt={album.title}
                      className="w-full h-[250px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gray-800 opacity-50 z-10" />
                    <div className="absolute bottom-0 left-0 p-4 z-20">
                      <h4 className="text-lg font-semibold text-white">{album.title}</h4>
                      <p className="text-sm text-zinc-500"></p>
                      <p className="text-sm text-zinc-400">
                        {album.genre || 'Genre inconnu'} •{' '}
                        {new Date(album.releaseDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ArtistDetail;
