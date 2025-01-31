'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getArtistById } from '@/services/artist.service';
import { getAlbumsByArtist } from '@/services/album.service';
import { useRouter } from 'next/navigation';
import Container from '@/components/UI/Container';

const img = 'https://placehold.co/200x200/jpeg';

const ArtistDetail = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchArtist = async () => {
      try {
        setLoading(true);
        const artistData = await getArtistById(id);
        setArtist(artistData);

        const artistID = artistData._id;
        const response = await getAlbumsByArtist(artistID);
        setAlbums(response.albums || []);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <span className="text-xl">Chargement...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl">{error}</div>;
  }

  if (!artist) {
    return <div className="text-gray-400 text-center">Artiste introuvable.</div>;
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
        <div className="absolute inset-0 bg-black opacity-50 z-0" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={artist.image || img}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-6xl font-bold text-white">{artist.name}</h2>
            <p className="text-lg mt-2">{artist.genres}</p>
          </div>
        </div>
      </div>
      <Container>
        {/* Albums */}
        <div className="p-6">
          <h3 className="text-3xl font-semibold mb-6">Albums</h3>

          {albums.length === 0 ? (
            <p className="text-center text-xl">Aucun album disponible</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 cursor-pointer">
              {albums.map((album) => (
                <div
                  key={album._id}
                  className="max-w-xs mx-auto hover:scale-105 transform transition-all duration-300"
                  onClick={() => handleCardClick(album._id, 'album')}
                >
                  <div className="relative rounded-lg overflow-hidden bg-gray-800">
                    <img
                      src={getImage(album.images?.[0]?.path || album.image)}
                      alt={album.title}
                      className="w-full h-[250px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gray-800 opacity-50 z-10" />
                    <div className="absolute bottom-0 left-0 p-4 z-20">
                      <h4 className="text-lg font-semibold text-white">{album.title} </h4>
                      <p className="text-sm text-zinc-500"></p>
                      <p className="text-sm text-zinc-400">
                        {album.genre || 'Genre inconnu'} • {new Date(album.releaseDate).toLocaleDateString()}
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
