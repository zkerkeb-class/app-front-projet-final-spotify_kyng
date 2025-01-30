import React from 'react';

const ProgressBar = ({ currentTime, duration, handleSeek, formatTime }) => (
  <div className="flex items-center space-x-2">
    <span className="text-gray-400 text-sm">{formatTime(currentTime)}</span>
    <input
      type="range"
      min="0"
      max={duration}
      value={currentTime}
      onChange={handleSeek}
      className="flex-grow h-1 bg-gray-700 rounded-full appearance-none cursor-pointer transition-all duration-300 ease-in-out"
      style={{
        background: `linear-gradient(to right, #1db954 ${(currentTime / duration) * 100}%, #4b4b4b 0%)`,
      }}
    />
    <span className="text-gray-400 text-sm">{formatTime(duration)}</span>
  </div>
);

export default ProgressBar;
