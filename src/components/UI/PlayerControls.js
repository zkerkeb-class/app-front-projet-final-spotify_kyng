'use client';
import React, { useState, useEffect } from 'react';
import {
  FaPlay,
  FaPause,
  FaRandom,
  FaRedo,
  FaExpand,
  FaCompress,
  FaBackward,
  FaForward,
  FaVolumeUp,
  FaVolumeMute,
} from 'react-icons/fa';
import { IoShareOutline } from "react-icons/io5";
import { IoMdPeople } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { setSessionId, setSessionUrl } from '@/lib/features/jam/jamSlice';
import { createJamSession } from '@/services/jam.service';

const PlayerControls = ({
  isPlaying,
  togglePlayPause,
  handlePreviousSong,
  handleNextSong,
  playMode,
  handlePlayModeChange,
  isFullscreen,
  toggleFullscreen,
  isMuted,
  toggleMute,
  volume: initialVolume,
  handleVolumeChange,
  isLoading,
}) => {
  const [localVolume, setLocalVolume] = useState(initialVolume);
  const [prevVolume, setPrevVolume] = useState(initialVolume);
  
  const dispatch = useDispatch();
  const { currentTrack } = useSelector((state) => state.player);
const [isJamming, setIsJamming] = useState(false);
const [isInviting, setIsInviting] = useState(false);
  useEffect(() => {
    setLocalVolume(initialVolume);
  }, [initialVolume, isMuted]);

  const handleMuteClick = () => {
    toggleMute();
    if (isMuted) {
      setLocalVolume(prevVolume);
      handleVolumeChange({ target: { value: prevVolume } });
    } else {
      setPrevVolume(localVolume);
      setLocalVolume(0);
      handleVolumeChange({ target: { value: 0 } });
    }
  };

  const handleVolumeChangeLocal = (event) => {
    const newVolume = event.target.value;
    setLocalVolume(newVolume);
    handleVolumeChange(event);
  };

  const launchJam = async () => {
 try {
  const jamSession = await createJamSession();
  dispatch(setSessionId(jamSession.id));
  dispatch(setSessionUrl(jamSession.shareUrl));
  localStorage.setItem('jamSessionId', jamSession.id);
  
 } catch (error) {
     console.error("Erreur lors de la création de la session de jam :", error);
  
 }
  }

  const handleInviteClick = () => {
    setIsInviting(!isInviting);
  };

  return (
    <div className="flex justify-between pb-2 rounded-lg text-white">
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={handlePlayModeChange}
          className={`${
            playMode === 'shuffle' ? 'text-green-500' : 'text-gray-400'
          } hover:text-white transition-transform transform hover:scale-110`}
          aria-label="Changer le mode de lecture"
        >
          {playMode === 'repeat' ? (
            <FaRedo className="text-green-500" />
          ) : (
            <FaRandom className="text-green-500" />
          )}
        </button>
        <button
          onClick={handlePreviousSong}
          disabled={isLoading}
          className={`text-white hover:text-white transition-transform transform hover:scale-110 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Chanson précédente"
        >
          <FaBackward />
        </button>
        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          className={`bg-green-500 p-3 rounded-full hover:bg-green-600 transition-transform transform hover:scale-110 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label={isPlaying ? 'Pause' : 'Lecture'}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button
          onClick={handleNextSong}
          disabled={isLoading}
          className={`text-white hover:text-white transition-transform transform hover:scale-110 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Chanson suivante"
        >
          <FaForward />
        </button>
     { currentTrack&&    <button className={'text-green-500  hover:text-green-300'} onClick={launchJam}>
          <IoMdPeople />
        </button>}
        {isJamming && (
          <div className="absolute top-0 left-0 bg-gray-900 bg-opacity-75 p-4 rounded-lg w-full">
            <span className="text-white">Inviter des personnes à rejoindre votre Jam</span>
            <button
              onClick={handleInviteClick}
              className="flex items-center gap-1 p-1 rounded-full text-black bg-green-500 hover:bg-green-300"
            >
              <IoShareOutline />
              Partager le lien
            </button>

            {isInviting && (
              <div className="mt-2">
                <input
                  type="text"
                  className="p-2 bg-white rounded-lg"
                  value={inviteLink}
                  readOnly
                />
                <button className="ml-2 p-2 bg-blue-500 text-white rounded-lg">Copier le lien</button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleMuteClick}
            className={`${isMuted ? 'text-gray-400' : 'text-white'} hover:text-white transition-transform transform hover:scale-110`}
            aria-label={isMuted ? 'Désactiver le mute' : 'Muter'}
          >
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={localVolume}
            onChange={handleVolumeChangeLocal}
            className={`w-24 h-1 ${localVolume > 0 ? 'bg-green-500' : 'bg-gray-500'} rounded-full appearance-none cursor-pointer`}
            aria-label="Contrôle du volume"
          />
        </div>
        <button
          onClick={toggleFullscreen}
          className="text-white hover:text-white transition-transform transform hover:scale-110"
          aria-label={isFullscreen ? 'Quitter le plein écran' : 'Activer le plein écran'}
        >
          {isFullscreen ? <FaCompress /> : <FaExpand />}
        </button>
      </div>
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="spinner border-4 border-green-500 border-t-transparent rounded-full w-12 h-12 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default PlayerControls;
