'use client'
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
import { getImageUrl } from '@/services/image.service';

const Home = () => {
  const [topAlbums, setTopAlbums] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const router = useRouter();
  const { isPlaying, currentTrack, tracks } = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();

  const imgPlaceholder = 'https://sternbergclinic.com.au/wp-content/uploads/2020/03/placeholder.png';


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

  const fetchImageUrls = useCallback(async () => {
    try {
      const newImageUrls = {};
  
      const artistImagePromises = topArtists.map(async (artist) => {
        if (artist.images[0]?.path) {
          newImageUrls[artist._id] = await getImageUrl(artist.images[0]?.path);
        }
      });
  
      const albumImagePromises = topAlbums.map(async (album) => {
        if (album.images?.[0]?.path) {
          newImageUrls[album._id] = await getImageUrl(album.images?.[0]?.path);
        }
      });
  
      await Promise.all([...artistImagePromises, ...albumImagePromises]);
  
      setImageUrls(newImageUrls);
    } catch (err) {
      console.error('Erreur lors du chargement des images', err);
    }
  }, [topArtists, topAlbums]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (topArtists.length && topAlbums.length) {
      fetchImageUrls();
    }
  }, [topArtists, topAlbums, fetchImageUrls]);

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
        {topArtists?.map((artist) => (
          <ArtistCard
            key={artist._id}
            title={artist.name}
            img={imageUrls[artist._id] || imgPlaceholder}
            desc={artist.totalListens}
            onCardClick={() => handleCardClick(artist._id, 'artist')}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
          />
        ))}
      </HorizontalSlider>

      <h3 className="text-2xl mt-10">Top 10 des derniers sons</h3>
      <HorizontalSlider>
        {tracks?.map((track) => (
          <PlaylistCard
            key={track._id}
            title={track.title}
            desc={track.releaseYear}
            onCardClick={() => handleCardClick(track._id, 'track')}
            onPlayClick={() => handlePlayClick(track)}
            isPlaying={isPlaying && currentTrack?.id === track._id}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
          />
        ))}
      </HorizontalSlider>

      <h3 className="text-2xl mt-10">Top 10 des albums récents</h3>
      <HorizontalSlider>
        {topAlbums?.map((album) => (
          <AlbumCard
            key={album._id}
            title={album.title}
            desc={album.artistId.name}
            img={imageUrls[album._id] || imgPlaceholder}
            onCardClick={() => handleCardClick(album._id, 'album')}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
          />
        ))}
      </HorizontalSlider>
    </Container>
  );
};

export default Home;
