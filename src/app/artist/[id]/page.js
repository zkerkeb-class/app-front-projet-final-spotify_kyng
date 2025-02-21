'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { getArtistById } from '@/services/artist.service';
import { getAlbumsByArtist } from '@/services/album.service';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Container from '@/components/UI/Container';
import { getImageUrl } from '@/services/image.service';
import Image from 'next/image';

const LoadingSpinner = React.lazy(() => import('@/components/UI/LoadingSpinner'));
const ErrorMessage = React.lazy(() => import('@/components/UI/ErrorMessage'));

const imagePlaceholder =
  'https://sternbergclinic.com.au/wp-content/uploads/2020/03/placeholder.png';

const ArtistDetail = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState(imagePlaceholder);

  const fetchArtistData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const artistData = await getArtistById(id);
      console.log('artistData : ', JSON.stringify(artistData, null, 2));
      setArtist(artistData);

      const artistID = artistData._id;

      const imageArtist = artistData.imageUrls;
      console.log('imageArtist :', imageArtist);

      const getImage = (imageType) => {
        if (imageType === 'cloudfront') {
          return getImageUrl(imageArtist.cloudfront);
        } else if (imageType === 'local') {
          return getImageUrl(imageArtist.local);
        }
        return getImageUrl('');
      };

      const imageUrl = getImage('local');
      setImageUrl(imageUrl);

      const response = await getAlbumsByArtist(artistID);
      setAlbums(response.albums || []);
    } catch (err) {
      setError(t('loadError'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    if (id) {
      fetchArtistData();
    }
  }, [id, fetchArtistData]);

  const handleCardClick = (id) => {
    if (!id) {
      console.error('Invalid ID');
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

    return isValidUrl(imagePath) ? imagePath : imagePlaceholder;
  };

  const retryFetchData = () => {
    fetchArtistData();
  };

  if (loading)
    return (
      <Suspense fallback={<div className="text-center p-6">Chargement de l'album...</div>}>
        <LoadingSpinner />
      </Suspense>
    );
  if (error)
    return (
      <Suspense fallback={<div className="text-center p-6">Chargement des données...</div>}>
        <ErrorMessage
          error={error}
          onRetry={retryFetchData}
        />
      </Suspense>
    );

  if (!artist) {
    return <div className="text-gray-400 text-center text-xl py-4">{t('artistNotFound')}</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="relative w-full h-[350px] flex items-end bg-gradient-to-b from-white via-white to-gray-900 dark:from-gray-900 dark:via-black  dark:to-black p-6 rounded-t-lg shadow-lg">
        <div className="absolute inset-0 bg-black opacity-60 z-0" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-white">
            <Suspense fallback={<div>Loading image...</div>}>
              <Image
                src={imageUrl}
                alt={`Image de ${artist.name}`}
                className="w-full h-full object-cover rounded-lg"
                width={144}
                height={144}
              />
            </Suspense>
          </div>
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">{artist.name}</h2>
            <p className="text-lg text-gray-300">{artist.genres}</p>
          </div>
        </div>
      </div>
      <Container>
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
                  onClick={() => handleCardClick(album._id)}
                  role="button"
                  aria-label={`Album ${album.title}`}
                >
                  <div className="relative rounded-lg overflow-hidden bg-gray-800">
                    <img
                      src={getImage(album.images?.[0]?.path || album.image)}
                      alt={album.title}
                      className="w-full h-[250px] object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gray-800 opacity-50 z-10" />
                    <div className="absolute bottom-0 left-0 p-4 z-20">
                      <h4 className="text-lg font-semibold text-white">{album.title}</h4>
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
