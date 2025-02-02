import React from 'react';

const ProgressBar = ({ currentTime, duration, handleSeek, error }) => {
  const formatTime = (time) => {
    if (isNaN(time) || time < 0) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  
  if (error) {
    return (
      <div role="alert" aria-live="assertive" className="text-red-500">
        <p>Erreur : {error}</p>
        <p>Veuillez réessayer plus tard.</p>
      </div>
    );
  }

  if (duration === 0 || isNaN(currentTime) || isNaN(duration)) {
    return (
      <div role="alert" aria-live="assertive" className="text-red-500">
        <p>Erreur de lecture des données audio. Veuillez vérifier la source.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span
        className="text-gray-400 text-sm"
        aria-label="Current time"
      >
        {formatTime(currentTime)}
      </span>
      
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleSeek}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            handleSeek({ target: { value: currentTime - 10 } });
          } else if (e.key === 'ArrowRight') {
            handleSeek({ target: { value: currentTime + 10 } });
          }
        }}
        className="flex-grow h-1 bg-gray-700 rounded-full appearance-none cursor-pointer transition-all duration-300 ease-in-out focus:ring-2 focus:ring-green-500"
        style={{
          background: `linear-gradient(to right, #1db954 ${(currentTime / duration) * 100}%, #4b4b4b 0%)`,
        }}
        aria-label={`Audio progress bar. Current position is ${formatTime(currentTime)}. Total duration is ${formatTime(duration)}`}
        aria-valuenow={currentTime}
        aria-valuemax={duration}
        aria-valuemin="0"
        aria-valuetext={`${formatTime(currentTime)} / ${formatTime(duration)}`}
      />
      
      <span
        className="text-gray-400 text-sm"
        aria-label="Duration"
      >
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default ProgressBar;
