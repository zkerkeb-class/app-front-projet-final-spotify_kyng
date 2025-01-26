import React from 'react';
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
  volume,
  handleVolumeChange,
  isLoading,
}) => {
  // Fonction pour obtenir l'icône correcte selon le mode
  const getPlayModeIcon = () => {
    switch (playMode) {
      case 'repeat':
        return <FaRedo className="text-blue-500" title="Répétition de playlist" />;
      case 'repeat-one':
        return <FaRedo className="text-blue-500" title="Répétition d'une chanson" />;
      case 'shuffle':
        return <FaRandom className="text-blue-500" title="Lecture aléatoire" />;
      default:
        return <FaRedo />;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
      {/* Section gauche : Modes de lecture et navigation */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handlePlayModeChange}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Changer le mode de lecture"
        >
          {getPlayModeIcon()}
        </button>
        <button
          onClick={handlePreviousSong}
          disabled={isLoading}
          className={`text-gray-400 hover:text-white transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Chanson précédente"
        >
          <FaBackward />
        </button>
        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          className={`bg-green-500 p-3 rounded-full hover:bg-green-600 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label={isPlaying ? 'Pause' : 'Lecture'}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button
          onClick={handleNextSong}
          disabled={isLoading}
          className={`text-gray-400 hover:text-white transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Chanson suivante"
        >
          <FaForward />
        </button>
      </div>

      {/* Section droite : Contrôles de volume et plein écran */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label={isMuted ? 'Désactiver le mute' : 'Muter'}
          >
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            aria-label="Contrôle du volume"
          />
        </div>
        <button
          onClick={toggleFullscreen}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label={isFullscreen ? 'Quitter le plein écran' : 'Activer le plein écran'}
        >
          {isFullscreen ? <FaCompress /> : <FaExpand />}
        </button>
      </div>

      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="spinner border-4 border-green-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default PlayerControls;
