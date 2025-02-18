import React from 'react';

const AudioWave = ({ isPlaying = false }) => {
    const animatedHeights = [12, 24, 12];
    const staticHeight = 10;
    
    return (
      <div className="w-8 h-8 flex items-end text-green-500">
        <svg viewBox="0 0 32 32" className="w-full h-full">
          {animatedHeights.map((height, index) => (
            <rect
              key={index}
              x={index * 11}
              y={32 - (isPlaying ? height : staticHeight)}
              width="8"
              height={isPlaying ? height : staticHeight}
              fill="currentColor"
              className={`transform origin-bottom ${
                isPlaying
                  ? `animate-[wave_1s_ease-in-out_infinite]`
                  : ''
              }`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            />
          ))}
        </svg>
      </div>
    );
  };

export default AudioWave;