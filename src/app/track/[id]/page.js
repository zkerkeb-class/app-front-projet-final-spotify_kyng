'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getTrackById } from '@/services/track.service';
import { getAlbumById } from '@/services/album.service';
import { getArtistById } from '@/services/artist.service';
import { FaPlay, FaPause } from 'react-icons/fa';
import AudioPlayer from '@/components/partials/AudioPlayer';
import Container from '@/components/UI/Container';

const placeholderImage = 'https://placehold.co/200x200/jpeg';

const TrackDetail = () => {
  const { id } = useParams();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState(null);

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
        setError('Erreur lors du chargement du morceau');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
  }, [id]);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayClick = (id) => {
    if (currentTrackId === id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrackId(id);
      setIsPlaying(true);
    }
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

  if (!track) {
    return <div className="text-gray-400 text-center">Piste introuvable.</div>;
  }

  return (
    <Container>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-6 flex flex-col">
        {/* Header avec effet flou progressif */}
        <div className="relative w-full h-[400px] flex items-end">
          <div
            className="absolute inset-0 bg-cover bg-center blur-xl opacity-40"
            style={{
              backgroundImage: `url(${track.albumId?.image || placeholderImage})`,
            }}
          />
          <div className="relative z-10 flex items-center gap-6 p-6 bg-gradient-to-b from-transparent to-white dark:to-black">
            <img
              src={track.albumId?.image || placeholderImage}
              alt="Album Cover"
              className="w-40 h-40 rounded-lg shadow-lg"
            />
            <div>
              <h2 className="text-5xl font-bold">{track.title}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                {track.artistId?.name || 'Artiste inconnu'} •{' '}
                {track.albumId?.title || 'Album inconnu'}
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                {track.releaseYear} • {track.albumId?.genre || 'Genre inconnu'}
              </p>
            </div>
          </div>
        </div>

        {/* Bouton Play/Pause centré */}
        <div className="flex justify-start my-6">
          <button
            className="bg-green-500 p-3 rounded-full hover:bg-green-600 transition-transform transform hover:scale-110 shadow-xl text-white"
            onClick={() => handlePlayClick(track._id)}
          >
            {isPlaying && currentTrackId === track._id ? (
              <FaPause size={20} />
            ) : (
              <FaPlay size={20} />
            )}
          </button>
        </div>

        {/* Détails du morceau */}
        <div className="mt-6 p-6 bg-gray-100 dark:bg-zinc-800 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Détails</h3>
          <div className="text-gray-600 dark:text-gray-300 flex justify-between">
            <p>
              <strong>Durée :</strong> {formatDuration(track.duration)}
            </p>
            <p>
              <strong>Popularité :</strong> {track.popularity}
            </p>
            <p>
              <strong>Explicite :</strong> {track.isExplicit ? 'Oui' : 'Non'}
            </p>
          </div>
        </div>

        {/* Paroles */}
        <div className="mt-6 p-6 bg-gray-100 dark:bg-zinc-800 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Paroles</h3>
          <p className="italic text-gray-500 dark:text-gray-400">
            {track.lyrics ? track.lyrics : 'Paroles indisponibles'}
          </p>
        </div>

        {/* Crédits */}
        <div className="mt-6 p-6 bg-gray-100 dark:bg-zinc-800 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Crédits</h3>
          <div className="text-gray-600 dark:text-gray-300 space-y-2">
            <p>
              <strong>Producteur :</strong> {track.credits?.producer || 'Inconnu'}
            </p>
            <p>
              <strong>Auteur :</strong> {track.credits?.songwriter || 'Inconnu'}
            </p>
          </div>
        </div>

        {/* Lecteur Audio en bas */}
        {currentTrackId && (
          <div className="mt-8">
            <AudioPlayer
              tracks={[track]}
              currentTrackId={currentTrackId}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              setCurrentTrackId={setCurrentTrackId}
            />
          </div>
        )}
      </div>
    </Container>
  );
};

export default TrackDetail;
