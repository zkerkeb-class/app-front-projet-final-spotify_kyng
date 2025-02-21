'use client';

import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const Waveform = ({ audioUrl, audioRef }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!waveformRef.current || !audioUrl) {
      return;
    }

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#121212',
      progressColor: '#1db954',
      cursorColor: '#fff',
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 1,
      height: 80,
      barGap: 2,
      responsive: true,
      normalize: true,
      partialRender: true,
      interact: false,
    });

    setIsLoading(true);

    wavesurfer.current.load(audioUrl);

    wavesurfer.current.on('ready', () => {
      setIsLoading(false);
    });

    if (audioRef?.current) {
      wavesurfer.current.on('seek', (progress) => {
        audioRef.current.currentTime = progress * audioRef.current.duration;
      });

      const syncCurrentTime = () => {
        const currentTime = audioRef.current.currentTime;
        const duration = audioRef.current.duration || 1;
        const progress = currentTime / duration;
        wavesurfer.current.seekTo(progress);
      };

      audioRef.current.addEventListener('timeupdate', syncCurrentTime);

      return () => {
        audioRef.current.removeEventListener('timeupdate', syncCurrentTime);
        wavesurfer.current.destroy();
      };
    }
  }, [audioUrl, audioRef]);

  useEffect(() => {
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full px-4 py-2">
      {isLoading && (
        <div
          className="text-center text-gray-500 mb-2"
          role="alert"
          aria-live="assertive"
        >
          Chargement de la forme d'onde...
        </div>
      )}
      <div
        ref={waveformRef}
        className={`w-full rounded-lg bg-[#1f1f1f] p-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden={isLoading}
      />
    </div>
  );
};

export default Waveform;
