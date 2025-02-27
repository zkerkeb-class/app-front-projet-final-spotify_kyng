'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { getAlbumById } from '@/services/album.service';
import { getTracksByAlbum } from '@/services/track.service';
import { FaPlay, FaPause, FaClock } from 'react-icons/fa';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setTracks, setIsPlaying, setCurrentTrack } from '@/lib/features/player/playerSlice';
import { useTranslation } from 'react-i18next';
import Container from '@/components/UI/Container';
import { getImageUrl } from '@/services/image.service';
import Image from 'next/image';

const LoadingSpinner = React.lazy(() => import('@/components/UI/LoadingSpinner'));
const ErrorMessage = React.lazy(() => import('@/components/UI/ErrorMessage'));

const imagePlaceholder =
  'https://sternbergclinic.com.au/wp-content/uploads/2020/03/placeholder.png';

const AlbumDetail = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const { isPlaying, currentTrack, tracks } = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState(imagePlaceholder);
  const [audio, setAudio] = useState(null);

  const fetchAlbum = useCallback(async () => {
    if (!id || isRetrying) return;

    try {
      setLoading(true);
      setError(null);
      const albumData = await getAlbumById(id);
      setAlbum(albumData);

      const albumID = albumData._id;
      const imageAlbum = albumData.coverImageUrls;
      console.log('imageAlbum :', imageAlbum);

      const getImage = (imageType) => {
        if (imageType === 'cloudfront') {
          return getImageUrl(imageAlbum.cloudfront);
        } else if (imageType === 'local') {
          return getImageUrl(imageAlbum.local);
        }
        return getImageUrl('');
      };

      const url = getImage('local');
      setImageUrl(url);
      console.log(url);

      const response = await getTracksByAlbum(albumID);
      dispatch(setTracks(response.tracks || []));
    } catch (err) {
      setError(t('loadError'));
    } finally {
      setLoading(false);
    }
  }, [id, dispatch, isRetrying, t]);

  useEffect(() => {
    fetchAlbum();
  }, [fetchAlbum]);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayClick = (track) => {
    if (!track.audioLink) {
      console.error("Erreur : L'URL de la piste est introuvable.", track);
      return;
    }
  
    if (currentTrack?._id === track._id) {
      if (isPlaying) {
        audio?.pause();
      } else {
        audio?.play();
      }
      dispatch(setIsPlaying(!isPlaying));
    } else {
      if (audio) {
        audio.pause();
      }
  
      const newAudio = new Audio(track.audioLink);
      newAudio.onerror = () => console.error("Erreur de chargement de l'audio :", track.audioUrl);
  
      setAudio(newAudio);
      dispatch(setCurrentTrack(track));
      dispatch(setIsPlaying(true));
      newAudio.play();
    }
  };

  const retryFetchData = () => {
    setIsRetrying(true);
    fetchAlbum();
    setIsRetrying(false);
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

  if (!album) {
    return <div className="text-gray-400 text-center text-xl py-4">Album introuvable.</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="relative w-full h-[350px] flex items-end bg-gradient-to-b from-white via-white to-gray-900 dark:from-gray-900 dark:via-black  dark:to-black p-6 rounded-t-lg shadow-lg">
        <div className="absolute inset-0 bg-black opacity-40 dark:opacity-60 z-0" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-32 h-32 rounded-lg overflow-hidden">
            <Suspense fallback={<div className="text-center p-6">Chargement de l'image...</div>}>
              <Image
                src={imageUrl}
                alt={`Image de ${album.title}`}
                className="w-full h-full object-cover rounded-lg"
                width={144}
                height={144}
              />
            </Suspense>
          </div>
          <div className="text-center sm:text-left text-white">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold">{album.title}</h2>
            <p className="text-lg text-gray-300">{album.artistId.name}</p>
            <p className="text-sm text-gray-400">
              {new Date(album.releaseDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <Container>
        <div className="p-6 flex-grow">
          <h3 className="text-3xl font-semibold mb-6">Pistes</h3>
          {tracks.length === 0 ? (
            <p className="text-center text-xl text-gray-400">Aucune piste disponible</p>
          ) : (
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm text-left"
                role="table"
                aria-label="List of Tracks"
              >
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b border-gray-700">#</th>
                    <th className="px-6 py-3 border-b border-gray-700">Titre</th>
                    <th className="px-6 py-3 border-b border-gray-700">Artiste</th>
                    <th className="px-6 py-3 border-b border-gray-700">
                      <FaClock
                        className="mr-2"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Durée</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.map((track, index) => (
                    <tr
                      key={track._id}
                      className="hover:bg-zinc-500 dark:hover:bg-zinc-800 cursor-pointer relative group"
                    >
                      <td className="px-6 py-4">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full dark:text-white transition-transform transform hover:scale-110"
                          onClick={() => handlePlayClick(track)}
                        >
                          {isPlaying && currentTrack?._id === track._id ? <FaPause /> : <FaPlay />}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/track/${track._id}`}
                          className="underline"
                          aria-label={`Track ${track.title}`}
                        >
                          {track.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/artist/${track.artistId ? track.artistId._id : ''}`}
                          className="underline"
                          aria-label={`Artist ${track.artistId ? track.artistId.name : 'Inconnu'}`}
                        >
                          {track.artistId ? track.artistId.name : 'Inconnu'}
                        </Link>
                      </td>
                      <td className="px-6 py-4">{formatDuration(track.duration)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default AlbumDetail;
