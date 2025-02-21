'use client';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { FaShareAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import Link from 'next/link';
import { setSessionId, setUsers } from '@/lib/features/jam/jamSlice';
import { setCurrentTime, setCurrentTrack, setIsPlaying } from '@/lib/features/player/playerSlice';
import AudioWave from '../UI/AudioWave';

const CurrentTrackPlayer = (props) => {
  const { currentTrack, isPlaying } = props;

  return (
    <div className="overflow-x-auto">
      <table
        className="w-full text-sm text-left"
        role="table"
        aria-label="List of Tracks"
      >
        <tbody className="bg-black dark:bg-black rounded-lg">
          <tr
            key={currentTrack._id}
            className="hover:bg-gray-800 cursor-pointer relative group"
          >
            <td className="px-6 py-4">
              <AudioWave isPlaying={isPlaying} />
            </td>
            <td className="px-6 py-4 text-white">
              <Link
                href={`/track/${currentTrack._id}`}
                className="underline hover:text-green-500"
                aria-label={`Track ${currentTrack.title}`}
              >
                {currentTrack.title}
              </Link>
            </td>
            <td className="px-6 py-4 text-gray-400">
              <Link
                href={`/artist/${currentTrack.artistId ? currentTrack.artistId._id : ''}`}
                className="underline hover:text-green-500"
                aria-label={`Artist ${currentTrack.artistId ? currentTrack.artistId.name : 'Inconnu'}`}
              >
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
    return <div>Chargement...</div>;
  }

  const copyToClipboard = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie :', err);
    }
  };

  const handleShareClick = () => {
    const shareUrl = `${window.location.origin}/room/${sessionId}`;
    copyToClipboard(shareUrl);
  };

  const handleQuitClick = () => {
    const confirmLeave = window.confirm('Êtes-vous sûr de vouloir quitter la session de jam ?');
    if (confirmLeave) {
      socket.emit('leave-room', sessionId, userId);
      dispatch(setSessionId(''));
      dispatch(setUsers([]));
      localStorage.removeItem('jamSessionId');
      localStorage.removeItem('userId');

      window.location.reload();
    }
  };

  if (userId === null) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 p-4 w-full max-w-xl mx-auto text-white">
      <h2 className="text-3xl font-bold text-center text-black dark:text-white">Jam Session</h2>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <FaUser className="text-gray-400" />
          <span>{users.length}</span>
        </div>

        <div className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
          <button
            onClick={handleShareClick}
            className="flex items-center gap-2 text-green-500 hover:text-green-300"
          >
            <FaShareAlt /> {copied ? 'Lien copié !' : 'Partager'}
          </button>
          <button
            onClick={handleQuitClick}
            className="flex items-center gap-2 text-red-500 hover:text-red-300"
          >
            <FaSignOutAlt /> Quitter
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 mt-6">
        {!currentTrack ? (
          <p className="text-center text-gray-400">Aucune piste disponible</p>
        ) : (
          <CurrentTrackPlayer
            currentTrack={currentTrack}
            isPlaying={isPlaying}
          />
        )}
      </div>
    </div>
  );
};

export default Jam;
