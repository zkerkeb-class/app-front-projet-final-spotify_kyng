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
  const [currentSong, setCurrentSong] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playMode, setPlayMode] = useState('normal');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const playerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Erreur de lecture automatique:', error);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    const fetchAudioStream = async () => {
      if (!currentTrackId || !tracks || tracks.length === 0) return;

      setIsLoading(true);

      try {
        const selectedTrack = tracks.find((track) => track._id === currentTrackId);

        console.log('selectedTrack : ' + selectedTrack);
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
          artist: artist?.name || 'Unknown Artist',
          album: album?.title || 'Unknown Album',
          artwork: selectedTrack.albumId?.images?.[0]?.path || '/images/default-artwork.webp',
        });
      } catch (error) {
        console.error('Error fetching audio stream:', error);
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
        if (playerRef.current.requestFullscreen) {
          await playerRef.current.requestFullscreen();
        } else if (playerRef.current.webkitRequestFullscreen) {
          await playerRef.current.webkitRequestFullscreen();
        } else if (playerRef.current.msRequestFullscreen) {
          await playerRef.current.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
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
      aria-label="Audio Player"
    >
      <div className={`flex flex-col ${isFullscreen ? 'h-full p-8' : 'p-4'}`}>
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
          togglePlayPause={togglePlayPause}
          handlePreviousSong={handlePreviousSong}
          handleNextSong={handleNextSong}
          playMode={playMode}
          handlePlayModeChange={handlePlayModeChange}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          isMuted={isMuted}
          toggleMute={toggleMute}
          volume={volume}
          handleVolumeChange={handleVolumeChange}
          isLoading={isLoading}
        />
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          handleSeek={handleSeek}
          formatTime={formatTime}
        />
        <audio
          ref={audioRef}
          src={currentSong?.path}
          crossOrigin="anonymous"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={(e) => setDuration(e.target.duration)}
          onEnded={() => {
            setIsPlaying(false);
            if (playMode === 'repeat') {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
              setIsPlaying(true);
            } else {
              handleNextSong();
            }
          }}
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
