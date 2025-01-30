'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getArtistById } from '@/services/artist.service';
import { getAlbumsByArtist } from '@/services/album.service';
import { useRouter } from 'next/navigation';
import AlbumCard from '@/components/UI/AlbumCard';
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
    <Container>
      <div className="min-h-screen bg-black text-white">
        {/* Header Artist avec background dynamique */}
        <div
          className="relative w-full h-[350px] flex items-end bg-gradient-to-b from-gray-900 via-black to-black p-6"
          style={{
            backgroundImage: `url(${getImage(artist.images?.[0])})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'multiply',
          }}
        >
          <div className="flex items-center gap-6">
            <div>
              <h2 className="text-6xl font-bold">{artist.name}</h2>
              <p className="text-gray-400 text-lg">{artist.genres}</p>
            </div>
          </div>
        </div>

        {/* Albums */}
        <div className="p-6">
          <h3 className="text-3xl font-semibold mb-6">Albums</h3>

          {albums.length === 0 ? (
            <p className="text-center text-xl text-gray-400">Aucun album disponible</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {albums.map((album) => (
                <AlbumCard
                  key={album._id}
                  title={album.title}
                  img={getImage(album.imagePath)}
                  desc={album.desc}
                  onCardClick={() => handleCardClick(album._id, 'album')}
                  className="max-w-xs mx-auto" // Ajoute une classe pour contrôler la taille des cartes
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ArtistDetail;
