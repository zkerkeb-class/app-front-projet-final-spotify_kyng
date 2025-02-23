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
  const [artistImageUrl, setArtistImageUrl] = useState(imagePlaceholder); // Image de l'artiste
  const [albumImageUrl, setAlbumImageUrl] = useState(imagePlaceholder); // Image de l'album

  const fetchArtistData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const artistData = await getArtistById(id);
      console.log('artistData : ', JSON.stringify(artistData, null, 2));
      setArtist(artistData);

      const artistID = id;
      console.log('artistID:', artistID);

      const imageArtist = artistData.imageUrls;
      console.log('imageArtist :', imageArtist);

      const getImageArtist = (imageType) => {
        if (imageType === 'cloudfront' && imageArtist?.cloudfront) {
          return getImageUrl(imageArtist.cloudfront);
        } else if (imageType === 'local' && imageArtist?.local) {
          return getImageUrl(imageArtist.local);
        }
        return getImageUrl('');
      };

      const artistImage = getImageArtist('local');
      setArtistImageUrl(artistImage);

      const response = await getAlbumsByArtist(artistID);
      console.log('Album titles:', response.albums);

      // // Corrigé : accès aux images d'album
      // const imageAlbums = response.albums?.map((album) => album.images).flat() || [];
      // console.log('Image albums:', imageAlbums);

      // const getImageAlbums = (imageType) => {
      //   if (imageAlbums?.length > 0) {
      //     if (imageType === 'cloudfront') {
      //       return getImageUrl(imageAlbums[0]?.path || '');
      //     }
      //     else if (imageType === 'local') {
      //       return getImageUrl(imageAlbums[0]?.path || '');
      //     }
      //   }
      //   return getImageUrl('');
      // };
      

      // const albumImage = getImageAlbums('local');
      // setAlbumImageUrl(albumImage);

      const imageAlbums = response.albums?.map((album) => ({
        ...album,
        images: album.images || [],
      })) || [];
      console.log('Image albums:', imageAlbums);
      
      // Fonction pour récupérer l'image d'un album spécifique en fonction de l'ID
      const getImageAlbums = (albumId, imageType) => {
        const album = imageAlbums.find((album) => album._id === albumId); // Trouver l'album par ID
        if (album?.images?.length > 0) {
          // Vérifier le type d'image
          if (imageType === 'cloudfront') {
            return getImageUrl(album.images[0]?.path || ''); // Retourner l'image Cloudfront
          } else if (imageType === 'local') {
            return getImageUrl(album.images[0]?.path || ''); // Retourner l'image locale
          }
        }
        return getImageUrl(''); // Si aucune image n'est trouvée, retourner une URL vide
      };
      
      // Récupérer l'image pour chaque album en fonction de l'ID de l'album
      const albumImages = response.albums.map((album) => {
        const albumImage = getImageAlbums(album._id, 'local'); // Utilisation dynamique de l'ID de chaque album
        console.log(`albumImage for ${album.title}: ${albumImage}`);
        return { ...album, albumImage };
      });

      setAlbums(albumImages);
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
                src={artistImageUrl}
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
                    <Image
                    src={album.albumImage}
                    alt={`Image de ${album.title}`}
                    className="w-full h-[250px] object-cover"
                    width={144}
                    height={144}
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
