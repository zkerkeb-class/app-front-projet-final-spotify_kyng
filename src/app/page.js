'use client';

import React, { useEffect, useState, useCallback } from 'react';
import ArtistCard from '@/components/UI/ArtistCard';
import Container from '@/components/UI/Container';
import HorizontalSlider from '@/components/UI/HorizontalSlider';
import PlaylistCard from '@/components/UI/PlaylistCard';
import { getTopAlbums } from '@/services/album.service';
import { getTopTracks } from '@/services/track.service';
import { getTopArtists } from '@/services/artist.service';
import { useRouter } from 'next/navigation';
import AlbumCard from '@/components/UI/AlbumCard';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setTracks, setIsPlaying, setCurrentTrack } from '@/lib/features/player/playerSlice';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import ErrorMessage from '@/components/UI/ErrorMessage';

const Home = () => {
  const [topAlbums, setTopAlbums] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { isPlaying, currentTrack, tracks } = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [albums, tracks, artistsResponse] = await Promise.all([
        getTopAlbums(),
        getTopTracks(),
        getTopArtists(),
      ]);
      dispatch(setTracks(tracks));
      setTopAlbums(albums.data);
      setTopArtists(artistsResponse ? artistsResponse.map((item) => item.artist) : []);
    } catch (err) {
      setError('Erreur lors du chargement des données.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCardClick = (id, type) => {
    if (!id || !type) {
      console.error('Invalid ID or type');
      return;
    }
    router.push(`/${type}/${id}`);
  };

  const handlePlayClick = (track) => {
    if (currentTrack?.id === track._id) {
      dispatch(setIsPlaying(!isPlaying));
    } else {
      dispatch(setCurrentTrack(track));
      dispatch(setIsPlaying(true));
    }
  };

  const getImage = (imagePath) => {
    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };
    return isValidUrl(imagePath) ? imagePath : 'default-image-path'
  };

  const retryFetchData = () => {
    setError(null);
    fetchData();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={retryFetchData} />;

  return (
    <Container>
      <h2 className="text-4xl mb-10">Les playlists du moment</h2>
      <h3 className="text-2xl">Top 10 des artistes populaires</h3>
      <HorizontalSlider>
        {topArtists?.map((artist, index) => (
          <ArtistCard
            key={artist._id || `artist-${index}`}
            title={artist.name}
            img={getImage(artist.images[0]?.path)}
            desc={artist.totalListens}
            onCardClick={() => handleCardClick(artist._id, 'artist')}
          />
        ))}
      </HorizontalSlider>
      <h3 className="text-2xl mt-10">Top 10 des derniers sons</h3>
      <HorizontalSlider>
        {tracks?.map((track, index) => (
          <PlaylistCard
            key={track._id || `track-${index}`}
            title={track.title}
            desc={track.releaseYear}
            onCardClick={() => handleCardClick(track._id, 'track')}
            onPlayClick={() => handlePlayClick(track)}
            isPlaying={isPlaying && currentTrack?.id === track._id}
          />
        ))}
      </HorizontalSlider>
      <h3 className="text-2xl mt-10">Top 10 des albums récents</h3>
      <HorizontalSlider>
        {topAlbums?.map((album, index) => (
          <AlbumCard
            key={album._id || `album-${index}`}
            title={album.title}
            desc={album.artistId.name}
            img={getImage(album.images?.[0]?.path)}
            onCardClick={() => handleCardClick(album._id, 'album')}
          />
        ))}
      </HorizontalSlider>
    </Container>
  );
};

export default Home;
