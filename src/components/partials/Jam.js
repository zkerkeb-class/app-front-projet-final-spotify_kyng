'use client';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { FaPause, FaPlay, FaUser } from 'react-icons/fa';
import Link from 'next/link';
import { io } from "socket.io-client";
import { formatDuration } from '@/utils';

const Jam = () => {
  const [copied, setCopied] = useState(false);
  const [socket, setSocket] = useState(null);
  const { tracks, isPlaying, currentTrack } = useAppSelector((state) => state.player);
  const { users, sessionUrl, sessionId } = useAppSelector((state) => state.jam);
  const dispatch = useAppDispatch();


  useEffect(()=>{
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL);
    setSocket(newSocket);
    newSocket.emit('room-state', { roomId: sessionId, userId: localStorage.getItem('userId') });
 
    return () => {
      newSocket.disconnect();
    }
  },[])

  const copyToClipboard = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Réinitialise après 2 sec
    } catch (err) {
      console.error("Erreur lors de la copie :", err);
    }
  };

  const handleShareClick = () => {
    const shareUrl = `${window.location.origin}/room/${sessionId}`;
    copyToClipboard(shareUrl); 
    console.log('Inviter');

  };
  const handleQuitClick = () => {
    console.log('Quitter');
  };
  const handlePlayClick = (track) => {
    if (currentTrack?._id === track._id) {
      dispatch(setIsPlaying(!isPlaying));
    } else {
      dispatch(setCurrentTrack(track));
      dispatch(setIsPlaying(true));
    }
  };

  console.log('Jam session ID:', sessionId);

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
            {copied ? "Lien copié !" : "Inviter"}
          </button>
          <button
            onClick={handleQuitClick}
            className="px-4 py-2 border text-white rounded-full hover:bg-zinc-700"
          >
            Terminer
          </button>
        </div>
        <div className="flex flex-col gap-5">
          {tracks.length === 0 || !currentTrack ? (
            <p className="text-center text-xl text-gray-400">Aucune piste disponible</p>
          ) : (
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm text-left"
                role="table"
                aria-label="List of Tracks"
              >
                <tbody className="bg-zinc-800 dark:bg-zinc-700 rounded-lg">
                  {tracks.map((track, index) => (
                    <tr
                      key={track._id}
                      className="hover:bg-zinc-500  cursor-pointer relative group"
                    >
                      <td className="px-6 py-4">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full dark:text-white transition-transform transform hover:scale-110"
                          onClick={() => handlePlayClick(track)}
                        >
                          {isPlaying && currentTrack?._id === track ? <FaPause /> : <FaPlay />}
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
      </div>
    </div>
  );
};

export default Jam;
