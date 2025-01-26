import React from 'react';

const ProgressBar = ({ currentTime, duration, handleSeek, formatTime }) => (
  <div className="flex items-center space-x-2">
    <span className="text-gray-400 text-sm">{formatTime(currentTime)}</span>
    <input
      type="range"
      min="0"
      max={duration || 100}
      value={currentTime}
      onChange={handleSeek}
      className="flex-grow h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
    />
    <span className="text-gray-400 text-sm">{formatTime(duration)}</span>
  </div>
);

export default ProgressBar;