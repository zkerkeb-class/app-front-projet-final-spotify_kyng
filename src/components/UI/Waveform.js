import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const Waveform = ({ audioUrl, audioRef, isFullscreen }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isLoading, setIsLoading] = useState(true); // État pour suivre le chargement

  useEffect(() => {
    // Vérifie que le conteneur de la forme d'onde existe et qu'un audio est fourni
    if (!waveformRef.current || !audioUrl) {
      return;
    }

    // Crée l'instance WaveSurfer
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
      interact: true,
    });

    // Indique que le chargement est en cours
    setIsLoading(true);

    // Charge l'audio dans WaveSurfer
    wavesurfer.current.load(audioUrl);

    // Écoute l'événement "ready" pour enlever l'indicateur de chargement
    wavesurfer.current.on('ready', () => {
      setIsLoading(false);
    });

    // Synchronise la lecture avec l'élément audio HTML5
    if (audioRef?.current) {
      wavesurfer.current.on('seek', (progress) => {
        audioRef.current.currentTime = progress * audioRef.current.duration;
      });

      const syncCurrentTime = () => {
        const currentTime = audioRef.current.currentTime;
        const duration = audioRef.current.duration || 1; // Evite une division par zéro
        const progress = currentTime / duration;
        wavesurfer.current.seekTo(progress);
      };

      audioRef.current.addEventListener('timeupdate', syncCurrentTime);

      // Nettoie les écouteurs
      return () => {
        audioRef.current.removeEventListener('timeupdate', syncCurrentTime);
        wavesurfer.current.destroy();
      };
    }
  }, [audioUrl, audioRef]);

  // Nettoyage complet lors du démontage
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
        <div className="text-center text-gray-500 mb-2">
          Chargement de la forme d'onde...
        </div>
      )}
      <div
        ref={waveformRef}
        className={`w-full rounded-lg bg-[#1f1f1f] p-2 ${
          isLoading ? 'opacity-50' : 'opacity-100'
        }`}
      />
    </div>
  );
};

export default Waveform;
