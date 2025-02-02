'use client';

import React, { useState, useRef, useEffect } from 'react';
import { streamTrack } from '@/services/track.service';
import { getArtistById } from '@/services/artist.service';
import { getAlbumById } from '@/services/album.service';
import PlayerControls from '../UI/PlayerControls';
import SongInfo from '../UI/SongInfo';
import ProgressBar from '../UI/ProgressBar';
import Waveform from '../UI/Waveform';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  setCurrentTrack,
  setCurrentTime,
  setDuration,
  setVolume,
  setIsMuted,
  setIsLoading,
  setIsPlaying,
} from '@/lib/features/player/playerSlice';
const AudioPlayer = ({ socket }) => {
  const [isFullscreen, setIsFullscreen] = useState();
  const [currentSong, setCurrentSong] = useState(undefined);
  const {
    currentTrack,
    currentTime,
    duration,
    volume,
    isMuted,
    playMode,
    isLoading,
    tracks,
    isPlaying,
  } = useAppSelector((state) => state.player);
  const { sessionId } = useAppSelector((state) => state.jam);
  const dispatch = useAppDispatch();

  const playerRef = useRef(null);
  const audioRef = useRef(null);
  
  useEffect(() => {
    if (socket) {
      socket.on('play', () => {
        audioRef.current.play();
        dispatch(setIsPlaying(true));
      });
      socket.on('pause', () => {
        audioRef.current.pause();
        dispatch(setIsPlaying(false));
      });
      socket.on('seek', (time) => {
        audioRef.current.currentTime = time;
        dispatch(setCurrentTime(time));
      });
    }
  }, []);

  useEffect(() => {
    const fetchAudioStream = async () => {
      if (!currentTrack?._id || !tracks?.length) return;

      dispatch(setIsLoading(true));

      try {
        const selectedTrack = tracks.find((track) => track._id === currentTrack?._id);
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

        dispatch(setCurrentTrack(selectedTrack));
        setCurrentSong({
          _id: selectedTrack._id,
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
        dispatch(setIsLoading(false));
      }
    };

    fetchAudioStream();
  }, [currentTrack?._id, tracks]);

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
      if (socket) {
        socket.emit('pause', sessionId);
      }
    } else {
      audioRef.current.play();
      if (socket) {
        socket.emit('play', sessionId);
      }
    }
    dispatch(setIsPlaying(!isPlaying));
  };

  const handleTimeUpdate = () => {
    dispatch(setCurrentTime(audioRef.current.currentTime));
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    audioRef.current.currentTime = seekTime;
    dispatch(setCurrentTime(seekTime));
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    audioRef.current.volume = newVolume;
    dispatch(setVolume(newVolume));
    dispatch(setIsMuted(newVolume === 0));
  };

  const toggleMute = () => {
    dispatch(setIsMuted(!isMuted));
    audioRef.current.muted = !isMuted;
  };

  const handlePlayModeChange = () => {
    const modes = ['normal', 'repeat', 'shuffle'];
    const nextMode = modes[(modes.indexOf(playMode) + 1) % modes.length];
    dispatch(setPlayMode(nextMode));
  };

  const handleNextSong = () => {
    const currentIndex = tracks.findIndex((track) => track._id === currentTrack?._id);
    let nextIndex;
    if (playMode === 'shuffle') {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentIndex + 1) % tracks.length;
    }
    dispatch(setCurrentTrack(tracks[nextIndex]));
  };

  const handlePreviousSong = () => {
    const currentIndex = tracks.findIndex((track) => track._id === currentTrack?._id);
    let prevIndex;
    if (playMode === 'shuffle') {
      prevIndex = Math.floor(Math.random() * tracks.length);
    } else {
      prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    }
    dispatch(setCurrentTrack(tracks[prevIndex]));
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
      <div className={`flex flex-col  ${isFullscreen ? 'h-full p-8' : 'p-4'}`}>
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
              audioUrl={currentSong?.path}
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
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={(e) => dispatch(setDuration(e.target.duration))}
          onEnded={() => {
            dispatch(setIsPlaying(false));
            if (playMode === 'repeat') {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
              dispatch(setIsPlaying(true));
            } else {
              handleNextSong();
            }
          }}
          onPlay={() => dispatch(setIsPlaying(true))}
          onPause={() => dispatch(setIsPlaying(false))}
        >
          Votre navigateur ne supporte pas l'élément audio.
        </audio>
      </div>
    </div>
  );
};

export default AudioPlayer;
