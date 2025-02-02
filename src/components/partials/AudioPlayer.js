'use client';
import React, { useState, useRef, useEffect } from 'react';
import { streamTrack } from '@/services/track.service';
import { getArtistById } from '@/services/artist.service';
import { getAlbumById } from '@/services/album.service';
import PlayerControls from '../UI/PlayerControls';
import SongInfo from '../UI/SongInfo';
import ProgressBar from '../UI/ProgressBar';
import Waveform from '../UI/Waveform';

const AudioPlayer = ({ tracks, currentTrackId, isPlaying, setIsPlaying, setCurrentTrackId }) => {
  const imgPlaceholder = 'https://placehold.co/200x200/jpeg';

  const [currentSong, setCurrentSong] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playMode, setPlayMode] = useState('normal');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const playerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Erreur de lecture automatique:', error);
            setError('Impossible de lire l’audio. Vérifiez votre connexion.');
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    const fetchAudioStream = async (retryCount = 0) => {
      if (!currentTrackId || !tracks || tracks.length === 0) return;
      setIsLoading(true);
      setError(null);

      try {
        const selectedTrack = tracks.find((track) => track._id === currentTrackId);
        if (!selectedTrack) throw new Error('Track not found');

        const audioUrl = await streamTrack(selectedTrack.audioLink);
        const artist =
          typeof selectedTrack.artistId === 'string'
            ? await getArtistById(selectedTrack.artistId)
            : selectedTrack.artistId;
        const album =
          typeof selectedTrack.albumId === 'string'
            ? await getAlbumById(selectedTrack.albumId)
            : selectedTrack.albumId;

        setCurrentSong({
          name: selectedTrack.title,
          path: audioUrl,
          duration: formatTime(selectedTrack.duration),
          artist: artist?.name || ' Artist inconnu',
          album: album?.title || 'Album inconnu',
          artwork: selectedTrack.albumId?.images?.[0]?.path || imgPlaceholder,
        });
      } catch (error) {
        console.error('Error fetching audio stream:', error);
        setError('Erreur de chargement de la piste. Réessayez plus tard.');
        if (retryCount < 3) {
          setTimeout(() => fetchAudioStream(retryCount + 1), 5000);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudioStream();
  }, [currentTrackId, tracks]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        await playerRef.current.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch (err) {
      console.error('Erreur lors du changement de mode plein écran:', err);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  const handlePlayModeChange = () => {
    const modes = ['normal', 'repeat', 'shuffle'];
    const nextMode = modes[(modes.indexOf(playMode) + 1) % modes.length];
    setPlayMode(nextMode);
  };

  const handleNextSong = () => {
    const currentIndex = tracks.findIndex((track) => track._id === currentTrackId);
    let nextIndex;
    if (playMode === 'shuffle') {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentIndex + 1) % tracks.length;
    }
    setCurrentTrackId(tracks[nextIndex]._id);
  };

  const handlePreviousSong = () => {
    const currentIndex = tracks.findIndex((track) => track._id === currentTrackId);
    let prevIndex;
    if (playMode === 'shuffle') {
      prevIndex = Math.floor(Math.random() * tracks.length);
    } else {
      prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    }
    setCurrentTrackId(tracks[prevIndex]._id);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={playerRef}
      className={`audio-player ${isFullscreen ? 'fixed inset-0 z-50' : 'relative w-full shadow-md mt-auto'}`}
      role="region"
      aria-label="Lecteur audio"
    >
      <div className={`flex flex-col ${isFullscreen ? 'h-full p-8' : 'p-4'}`}>
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="text-red-500"
          >
            {error}
          </div>
        )}
        {currentSong && (
          <SongInfo
            currentSong={currentSong}
            isFullscreen={isFullscreen}
          />
        )}
        {isFullscreen && currentSong && (
          <div className="flex-grow flex items-center justify-center mb-8">
            <Waveform
              audioUrl={currentSong.path}
              audioRef={audioRef}
              isFullscreen={isFullscreen}
            />
          </div>
        )}
        <PlayerControls
          isPlaying={isPlaying}
          togglePlayPause={() => setIsPlaying(!isPlaying)}
          handlePreviousSong={handlePreviousSong}
          handleNextSong={handleNextSong}
          playMode={playMode}
          handlePlayModeChange={handlePlayModeChange}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          isMuted={isMuted}
          toggleMute={() => setIsMuted(!isMuted)}
          volume={volume}
          handleVolumeChange={(e) => setVolume(parseFloat(e.target.value))}
          isLoading={isLoading}
        />
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          handleSeek={(e) => setCurrentTime(parseFloat(e.target.value))}
        />
        <audio
          ref={audioRef}
          src={currentSong?.path}
          crossOrigin="anonymous"
          onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.target.duration)}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          Votre navigateur ne supporte pas l'élément audio.
        </audio>
      </div>
    </div>
  );
};

export default AudioPlayer;
