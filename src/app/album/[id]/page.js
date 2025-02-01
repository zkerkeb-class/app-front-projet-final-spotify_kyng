'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getAlbumById } from '@/services/album.service';
import { getTracksByAlbum } from '@/services/track.service';
import { FaPlay, FaPause, FaClock } from 'react-icons/fa';
import AudioPlayer from '@/components/partials/AudioPlayer';
import Link from 'next/link';
import Container from '@/components/UI/Container';

const img = 'https://placehold.co/200x200/jpeg';

const AlbumDetail = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchAlbum = async () => {
      try {
        setLoading(true);
        const albumData = await getAlbumById(id);
        setAlbum(albumData);

        const albumID = albumData._id;
        const response = await getTracksByAlbum(albumID);
        setTracks(response.tracks || []);
      } catch (err) {
        setError('Erreur lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  useEffect(() => {
    if (currentTrackId) {
      setIsPlaying(true);
    }
  }, [currentTrackId]);

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
      <div className="flex justify-center items-center h-screen text-white">
        <span className="text-xl animate-spin">Chargement...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl py-4">{error}</div>;
  }

  if (!album) {
    return <div className="text-gray-400 text-center text-xl py-4">Album introuvable.</div>;
  }

  return (
    <div className="min-h-screen">
      <div
        className="relative w-full h-[350px] flex items-end bg-gradient-to-b from-gray-900 via-black to-black p-6 rounded-t-lg shadow-lg"
        style={{
          backgroundImage: `url(${getImage(album.images?.[0]?.path)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60 z-0" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-white">
            <img
              src={getImage(album.image || img)}
              alt="Album Cover"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">{album.title}</h2>
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
                          onClick={() => handlePlayClick(track._id)}
                          aria-label={
                            isPlaying && currentTrackId === track._id ? 'Pause' : 'Lecture'
                          }
                        >
                          {isPlaying && currentTrackId === track._id ? <FaPause /> : <FaPlay />}
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
      {currentTrackId && (
        <AudioPlayer
          tracks={tracks}
          currentTrackId={currentTrackId}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          setCurrentTrackId={setCurrentTrackId}
        />
      )}
    </div>
  );
};

export default AlbumDetail;
