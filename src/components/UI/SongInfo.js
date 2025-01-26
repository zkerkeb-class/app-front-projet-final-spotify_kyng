import React from 'react';

const SongInfo = ({ currentSong, isFullscreen }) => (
<div className={`flex items-center space-x-4 mb-4 ${isFullscreen ? 'justify-center' : ''}`}>
  <img
    src={currentSong.artwork}
    alt={currentSong.name}
    className={`${isFullscreen ? 'w-32 h-32' : 'w-16 h-16'} rounded-md`}
  />

      <div>
        <h2 className="text-white font-semibold">{currentSong.name}</h2>
        <p className="text-gray-400">{currentSong.artist}</p>
      </div>
    </div>
  );
  
  export default SongInfo;