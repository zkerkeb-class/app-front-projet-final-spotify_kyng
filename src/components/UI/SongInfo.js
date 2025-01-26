import React from 'react';

const SongInfo = ({ currentSong, isFullscreen }) => (
  <div className={`flex items-center space-x-4 mb-4 ${isFullscreen ? 'justify-center' : ''}`}>
    <img
      src={currentSong.artwork || '/images/default-artwork.webp'}
      alt={`Artwork for ${currentSong.name} by ${currentSong.artist}`}
      className={`${isFullscreen ? 'w-32 h-32' : 'w-16 h-16'} rounded-md`}
    />
    <div>
      <h2 className="text-white font-semibold text-lg">{currentSong.name || 'Unknown Song'}</h2>
      <p className="text-gray-400">{currentSong.artist || 'Unknown Artist'}</p>
    </div>
  </div>
);

export default SongInfo;
