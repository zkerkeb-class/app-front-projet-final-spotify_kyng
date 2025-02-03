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
      <table
        className="w-full text-sm text-left"
        role="table"
        aria-label="List of Tracks"
      >
        <tbody className="bg-zinc-800 dark:bg-zinc-700 dark:text-white rounded-lg">
          <tr
            key={currentTrack._id}
            className="hover:bg-zinc-500  cursor-pointer relative group"
          >
            <td className="px-6 py-4">
              <AudioWave isPlaying={isPlaying} />
            </td>
            <td className="px-6 py-4">
              <Link
                href={`/track/${currentTrack._id}`}
                className="underline"
                aria-label={`Track ${currentTrack.title}`}
              >
                {currentTrack.title}
              </Link>
            </td>
            <td className="px-6 py-4">
              <Link
                href={`/artist/${currentTrack.artistId ? currentTrack.artistId._id : ''}`}
                className="underline"
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
    setUserId(localUserId);
    if (jamSessionId) {
      dispatch(setSessionId(jamSessionId));

      socket.on('connect', () => {
        socket.emit('join-room', jamSessionId, localUserId);
      });
      socket.on('room-state', (data) => {
        handleRoomState(data);
      });
    }
  }, []);

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

  if (sessionId === '') {
    return null;
  }

  return (
    <div className="bg-zinc-700 dark:bg-zinc-800 rounded-lg py-5 px-2 min-w-60 lg:min-w-80">
      <div className="flex flex-col gap-2 h-full lg:h-screen">
        <h2 className="text-2xl text-white dark:text-gray-100 font-bold">Jam : {sessionId}</h2>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FaUser className="text-white dark:text-gray-100" />
            <span className="text-white dark:text-gray-100">
              {users.length > 0 ? users.length : 0}
            </span>
          </div>
          <button
            onClick={handleShareClick}
            className="px-4 py-2 border text-white rounded-full hover:bg-zinc-700"
          >
            {copied ? 'Lien copié !' : 'Inviter'}
          </button>
          <button
            onClick={handleQuitClick}
            className="px-4 py-2 border text-white rounded-full hover:bg-zinc-700"
          >
            Terminer
          </button>
        </div>
        <div className="flex flex-col gap-5">
          {!currentTrack ? (
            <p className="text-center text-xl text-gray-400">Aucune piste disponible</p>
          ) : (
            <CurrentTrackPlayer
              currentTrack={currentTrack}
              isPlaying={isPlaying}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Jam;
