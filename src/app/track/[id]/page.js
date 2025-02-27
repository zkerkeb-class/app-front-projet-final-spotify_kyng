'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { getTrackById } from '@/services/track.service';
import { getAlbumById } from '@/services/album.service';
import { getArtistById } from '@/services/artist.service';
import { FaPlay, FaPause } from 'react-icons/fa';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { setIsPlaying, setCurrentTrack } from '@/lib/features/player/playerSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Container from '@/components/UI/Container';

const LoadingSpinner = React.lazy(() => import('@/components/UI/LoadingSpinner'));

const TrackDetail = () => {
  const { id } = useParams();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isPlaying, currentTrack } = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (!id) return;

    const fetchTrack = async () => {
      try {
        setLoading(true);
        const trackData = await getTrackById(id);

        const artist =
          typeof trackData.artistId === 'string'
            ? await getArtistById(trackData.artistId)
            : trackData.artistId;

        const album =
          typeof trackData.albumId === 'string'
            ? await getAlbumById(trackData.albumId)
            : trackData.albumId;

        setTrack({ ...trackData, artistId: artist, albumId: album });
      } catch (err) {
        setError(t('loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
  }, [id, t]);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayClick = (track) => {
    if (currentTrack?.id === track._id) {
      dispatch(setIsPlaying(!isPlaying));
    } else {
      dispatch(setCurrentTrack(track));
      dispatch(setIsPlaying(true));
    }
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

  if (!track) {
    return <div className="text-gray-400 text-center text-xl py-4">{t('trackNotFound')}</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="relative w-full h-[350px] flex items-end bg-gradient-to-b from-white via-white to-gray-900 dark:from-gray-900 dark:via-black  dark:to-black p-6 rounded-t-lg shadow-lg">
        <div className="flex items-center gap-6 relative z-10">
          <div className="text-center sm:text-left">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">{track.title}</h2>
            <p className="text-lg text-gray-300 mt-2">
              <Link
                href={track.artistId ? `/artist/${track.artistId._id}` : '#'}
                className="underline"
              >
                {track.artistId?.name || 'Artiste inconnu'}
              </Link>
              •
              <Link
                href={track.albumId ? `/album/${track.albumId._id}` : '#'}
                className="underline"
              >
                {track.albumId?.title || 'Album inconnu'}
              </Link>
            </p>

            <p className="text-sm text-gray-400">
              {track.releaseYear} • {track.albumId?.genre || 'Genre inconnu'}
            </p>
          </div>
        </div>
      </div>
      <Container>
        <div className="flex justify-start mt-8 ps-0.5">
          <button
            className="bg-green-500 p-4 rounded-full hover:bg-green-600 transition-all transform hover:scale-110 shadow-xl text-white"
            onClick={() => handlePlayClick(track)}
          >
            {isPlaying && currentTrack?._id === track._id ? <FaPause /> : <FaPlay />}
          </button>
        </div>
        <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-white mb-4">Détails</h3>
          <div className="text-gray-300 flex justify-between">
            <p>
              <strong>Durée :</strong> {formatDuration(track.duration)}
            </p>
            <p>
              <strong>Popularité :</strong> {track.popularity}
            </p>
            <p>
              <strong>Nombre d'écoute :</strong> {track?.numberOfListens}
            </p>
          </div>
        </div>
        <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-white mb-4">Paroles</h3>
          <p className="italic text-gray-400">
            {track.lyrics ? track.lyrics : 'Paroles indisponibles'}
          </p>
        </div>
        <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-white mb-4">Crédits</h3>
          <div className="text-gray-300 space-y-2">
            <p>
              <strong>Producteur :</strong> {track.credits?.producer || 'Inconnu'}
            </p>
            <p>
              <strong>Auteur :</strong> {track.credits?.songwriter || 'Inconnu'}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TrackDetail;
