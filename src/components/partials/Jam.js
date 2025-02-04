'use client';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { FaPause, FaPlay, FaUser } from 'react-icons/fa';
import Link from 'next/link';
import { formatDuration } from '@/utils';
import { setSessionId, setUsers } from '@/lib/features/jam/jamSlice';
import { setCurrentTime, setCurrentTrack, setIsPlaying } from '@/lib/features/player/playerSlice';
import AudioWave from '../UI/AudioWave';

const CurrentTrackPlayer = (props) => {
  const { currentTrack, isPlaying } = props;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left" role="table" aria-label="List of Tracks">
        <tbody className="bg-black dark:bg-black rounded-lg">
          <tr key={currentTrack._id} className="hover:bg-gray-800 cursor-pointer relative group">
            <td className="px-6 py-4">
              <AudioWave isPlaying={isPlaying} />
            </td>
            <td className="px-6 py-4 text-white">
              <Link href={`/track/${currentTrack._id}`} className="underline hover:text-green-500" aria-label={`Track ${currentTrack.title}`}>
                {currentTrack.title}
              </Link>
            </td>
            <td className="px-6 py-4 text-gray-400">
              <Link href={`/artist/${currentTrack.artistId ? currentTrack.artistId._id : ''}`} className="underline hover:text-green-500" aria-label={`Artist ${currentTrack.artistId ? currentTrack.artistId.name : 'Inconnu'}`}>
                {currentTrack.artistId ? currentTrack.artistId.name : 'Inconnu'}
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const Jam = ({ socket }) => {
  const [copied, setCopied] = useState(false);
  const { isPlaying, currentTrack } = useAppSelector((state) => state.player);
  const { users, sessionId } = useAppSelector((state) => state.jam);
  const dispatch = useAppDispatch();
  const [userId, setUserId] = useState('');

  const handleRoomState = (data) => {
    dispatch(setUsers(data.participants));
    dispatch(setCurrentTrack(data.currentTrack));
    dispatch(setCurrentTime(data.state.position));
    dispatch(setIsPlaying(Boolean(data.state.playing)));
  };

  useEffect(() => {
    const jamSessionId = localStorage.getItem('jamSessionId');
    const localUserId = localStorage.getItem('userId');
  
    if (jamSessionId && localUserId) {
      setUserId(localUserId);
      dispatch(setSessionId(jamSessionId));
  
      socket.on('connect', () => {
        socket.emit('join-room', jamSessionId, localUserId);
      });
      socket.on('room-state', (data) => {
        handleRoomState(data);
      });
    }
  }, [dispatch, socket]);
  
  if (!userId || !sessionId) {
    return <div>Chargement...</div>;  // Affiche un loader ou un message d'erreur
  }  

  const copyToClipboard = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Réinitialise après 2 sec
    } catch (err) {
      console.error('Erreur lors de la copie :', err);
    }
  };

  const handleShareClick = () => {
    const shareUrl = `${window.location.origin}/room/${sessionId}`;
    copyToClipboard(shareUrl);
  };

  const handleQuitClick = () => {
    socket.emit('leave-room', sessionId, userId);
    dispatch(setSessionId(''));
    dispatch(setUsers([]));
    localStorage.removeItem('jamSessionId');
    localStorage.removeItem('userId');
  };

  const handlePlayClick = (track) => {
    if (currentTrack?._id === track._id) {
      dispatch(setIsPlaying(!isPlaying));
    } else {
      dispatch(setCurrentTrack(track));
      dispatch(setIsPlaying(true));
    }
  };

  if (userId === null) {
    return null;  // Vous pouvez choisir d'afficher un loader ici ou un message d'erreur
  }

  return (
    <div className="bg-zinc-700 dark:bg-zinc-800 rounded-lg py-5 px-2 min-w-60 lg:min-w-80">
      <div className="flex flex-col gap-4 h-full lg:h-screen">
        <h2 className="text-3xl text-white dark:text-gray-100 text-center">Jam</h2>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FaUser className="text-white dark:text-gray-100" />
            <span className="text-white dark:text-gray-100">{users.length > 0 ? users.length : 0}</span>
          </div>
          <button onClick={handleShareClick} className="px-5 py-2 border-2 border-green-500 text-green-500 rounded-full hover:bg-green-500 hover:text-white transition-colors duration-200">
            {copied ? 'Lien copié !' : 'Inviter'}
          </button>
          <button onClick={handleQuitClick} className="px-5 py-2 border-2 border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-200">
            Terminer
          </button>
        </div>
        <div className="flex flex-col gap-6">
          {!currentTrack ? (
            <p className="text-center text-xl text-gray-400">Aucune piste disponible</p>
          ) : (
            <CurrentTrackPlayer currentTrack={currentTrack} isPlaying={isPlaying} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Jam;
