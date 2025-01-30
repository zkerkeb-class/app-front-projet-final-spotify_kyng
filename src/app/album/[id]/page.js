'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getAlbumById } from '@/services/album.service';
import { getTracksByAlbum } from '@/services/track.service';
import { FaPlay, FaPause, FaClock } from 'react-icons/fa'; // Importer les icônes
import AudioPlayer from '@/components/partials/AudioPlayer';
import { Container } from 'lucide-react';

const img = 'https://placehold.co/200x200/jpeg';

const AlbumDetail = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // Etat pour savoir si la chanson est en lecture
  const [currentTrackId, setCurrentTrackId] = useState(null); // Piste actuelle
  const [profileBgColor, setProfileBgColor] = useState('black'); // Couleur de fond dynamique

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
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayClick = (id) => {
    if (currentTrackId === id) {
      // Si la chanson en lecture est déjà celle sur laquelle on a cliqué, on la met en pause
      setIsPlaying(!isPlaying);
    } else {
      // Sinon, on change la chanson en lecture
      setCurrentTrackId(id);
      setIsPlaying(true); // On commence la lecture
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

  if (!album) {
    return <div className="text-gray-400 text-center">Album introuvable.</div>;
  }

  return (
    <Container>
      <div className="min-h-screen bg-black text-white p-6 flex flex-col">
        {/* Header avec photo de profil et fond dynamique */}
        <div
          className="relative w-full h-[350px] flex items-end bg-gradient-to-b from-gray-900 via-black to-black p-6"
          style={{
            backgroundColor: profileBgColor, // Applique la couleur extraite comme fond
          }}
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white">
              <img
                src={album.image || img}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-6xl font-bold">{album.title}</h2>
              <p className="text-lg text-gray-300">By {album.artistId.name}</p>
              <p className="text-lg text-gray-400">
                Release Date: {new Date(album.releaseDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Pistes */}
        <div className="p-6 flex-grow">
          <h3 className="text-3xl font-semibold mb-6">Pistes</h3>

          {tracks.length === 0 ? (
            <p className="text-center text-xl text-gray-400">Aucune piste disponible</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-zinc-400">
                  <tr>
                    <th className="px-6 py-3 border-b border-gray-700">#</th>
                    <th className="px-6 py-3 border-b border-gray-700">Titre</th>
                    <th className="px-6 py-3 border-b border-gray-700">Artiste</th>
                    <th className="px-6 py-3 border-b border-gray-700">
                      <FaClock className="mr-2" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.map((track, index) => (
                    <tr
                      key={track._id}
                      className="hover:bg-zinc-800 cursor-pointer relative group"
                    >
                      {/* Bouton de lecture / pause à la place de l'index */}
                      <td className="px-6 py-4">
                        <button
                          className="bg-green-500 p-3 rounded-full hover:bg-green-600 transition-transform transform hover:scale-110"
                          onClick={() => handlePlayClick(track._id)} // Remplacer onPlayClick par onClick
                        >
                          {isPlaying && currentTrackId === track._id ? <FaPause /> : <FaPlay />}
                        </button>
                      </td>
                      {/* Titre de la piste */}
                      <td className="px-6 py-4">{track.title}</td>
                      {/* Artiste */}
                      <td className="px-6 py-4">
                        {track.artistId ? track.artistId.name : 'Inconnu'}
                      </td>
                      {/* Durée */}
                      <td className="px-6 py-4 flex items-center">
                        {formatDuration(track.duration)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Audio Player en bas de la page */}
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
    </Container>
  );
};

export default AlbumDetail;
