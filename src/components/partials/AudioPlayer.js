'use client'

import React, { useState, useRef, useEffect } from 'react';
import Waveform from '../UI/Waveform';
import ProgressBar from '../UI/ProgressBar';
import PlayerControls from '../UI/PlayerControls';
import SongInfo from '../UI/SongInfo';
import { getTrackById } from '@/services/track.service';

const AudioPlayer = ({ tracks }) => {
    const [audioFiles, setAudioFiles] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playMode, setPlayMode] = useState('normal');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showWaveform, setShowWaveform] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);

    const playerRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        if (tracks && tracks.length > 0) {
            // Utilisez l'ID de la première piste comme exemple, vous pouvez remplacer ça par une logique de sélection
            const trackId = tracks[0].id;
            fetchTrackData(trackId);
        }
    }, [tracks]);

    const fetchTrackData = async (trackId) => {
        try {
            const trackData = await getTrackById(trackId);
            console.log('Track data:', trackData); // Débogage pour voir la réponse
            setCurrentTrack(trackData); // Mettez à jour l'état avec les données de la piste
        } catch (error) {
            console.error('Erreur lors de la récupération des informations de la piste:', error);
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
                setShowWaveform(true);  // Afficher la waveform lorsqu'on entre en plein écran
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    await document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    await document.msExitFullscreen();
                }
                setShowWaveform(false);  // Cacher la waveform lorsqu'on sort du plein écran
            }
            setIsFullscreen(!isFullscreen);
        } catch (err) {
            console.error('Erreur lors du changement de mode plein écran:', err);
        }
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
        if (isLoading || !currentSong || !tracks.length) return;
        const currentIndex = tracks.findIndex((track) => track.path === currentSong.path);
        let nextIndex = (currentIndex + 1) % tracks.length;
        handleSongChange(tracks[nextIndex].path);
    };

    const handlePreviousSong = () => {
        if (isLoading || !currentSong || !tracks.length) return;
        const currentIndex = tracks.findIndex((track) => track.path === currentSong.path);
        let prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
        handleSongChange(tracks[prevIndex].path);
    };

    const handlePlayModeChange = () => {
        const modes = ['normal', 'repeat', 'shuffle'];
        const nextMode = modes[(modes.indexOf(playMode) + 1) % modes.length];
        setPlayMode(nextMode);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div ref={playerRef} className={`audio-player ${isFullscreen ? 'fixed inset-0 z-50' : 'relative w-full bg-zinc-950 shadow-lg mt-auto'}`}>
            <div className={`flex flex-col ${isFullscreen ? 'h-full p-8' : 'p-4'}`}>
                {/* Song Info */}
                {currentSong && <SongInfo currentSong={currentSong} isFullscreen={isFullscreen} />}
                {/* Afficher la waveform en mode plein écran */}
                {showWaveform && currentSong && (
                    <div className="flex-grow flex items-center justify-center mb-8">
                        <Waveform audioUrl={currentSong.path} audioRef={audioRef} isFullscreen={isFullscreen} />
                    </div>
                )}

                {/* Progress Bar */}
                <ProgressBar
                    currentTime={currentTime}
                    duration={duration}
                    handleSeek={handleSeek}
                    formatTime={formatTime}
                />

                {/* Player Controls */}
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

                <audio
                    ref={audioRef}
                    src={currentSong?.path}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={(e) => setDuration(e.target.duration)}
                    onEnded={handleNextSong}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />
            </div>
        </div>
    );
};

export default AudioPlayer;
