'use client';
import React, { useState, useRef, useEffect } from 'react';
import { streamTrack } from '@/services/track.service';
import { getArtistById } from '@/services/artist.service';
import PlayerControls from '../UI/PlayerControls';
import SongInfo from '../UI/SongInfo';
import ProgressBar from '../UI/ProgressBar';
import Waveform from '../UI/Waveform';

const AudioPlayer = ({ tracks }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
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
    const fetchAudioStream = async () => {
      if (tracks && tracks.length > 0) {
        const firstTrack = tracks[0];

        if (!firstTrack.audioLink) {
          console.error('Audio link is missing for the first track');
          return;
        }

        try {
          const audioUrl = await streamTrack(firstTrack.audioLink);

          const artistID = firstTrack.artistId;

          if (!artistID) {
            console.error('Artist ID is missing');
            return;
          }

          const artist = await getArtistById(artistID);
          const artistName = artist?.name || 'Unknown Artist';

          console.log('Artist Name: ', artistName);

          setCurrentSong({
            name: firstTrack.title,
            path: audioUrl,
            duration: formatTime(firstTrack.duration),
            artist: artistName,
            album: firstTrack.albumId?.title || 'Unknown Album',
            artwork: firstTrack.albumId?.images?.[0]?.path || '/images/default-artwork.webp',
          });
        } catch (error) {
          console.error('Error fetching audio stream:', error);
        }
      } else {
        console.error('No tracks available');
      }
    };

    fetchAudioStream();
  }, [tracks]);

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

  const handleSongChange = async (path) => {
    setIsLoading(true);
    const song = {
      name: path.split('/').pop(),
      path,
      duration: '0:00',
      artist: 'Unknown Artist',
      album: 'Unknown Album',
      artwork: '/images/default-artwork.webp',
    };
    setCurrentSong(song);
    setIsPlaying(false);
    setCurrentTime(0);

    if (audioRef.current) {
      audioRef.current.src = song.path;
      await audioRef.current.load();
    }
    setIsLoading(false);
  };

  const handleNextSong = () => {
    if (isLoading || !currentSong || !audioFiles.length) return;
    const currentIndex = audioFiles.indexOf(currentSong.path);
    let nextIndex;

    if (playMode === 'shuffle') {
      nextIndex = Math.floor(Math.random() * audioFiles.length);
    } else {
      nextIndex = (currentIndex + 1) % audioFiles.length;
    }
    handleSongChange(audioFiles[nextIndex]);
  };

  const handlePreviousSong = () => {
    if (isLoading || !currentSong || !audioFiles.length) return;
    const currentIndex = audioFiles.indexOf(currentSong.path);
    let prevIndex;

    if (playMode === 'shuffle') {
      prevIndex = Math.floor(Math.random() * audioFiles.length);
    } else {
      prevIndex = currentIndex === 0 ? audioFiles.length - 1 : currentIndex - 1;
    }
    handleSongChange(audioFiles[prevIndex]);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={playerRef}
      className={`audio-player ${isFullscreen ? 'fixed inset-0 z-50' : 'relative w-full shadow-lg mt-auto'}`}
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
