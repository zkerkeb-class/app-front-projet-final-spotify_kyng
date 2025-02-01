'use client';

import React, { useEffect, useState } from 'react';
import AudioPlayer from '@/components/partials/AudioPlayer';
import ArtistCard from '@/components/UI/ArtistCard';
import Container from '@/components/UI/Container';
import HorizontalSlider from '@/components/UI/HorizontalSlider';
import PlaylistCard from '@/components/UI/PlaylistCard';
import { getTopAlbums } from '@/services/album.service';
import { getTopTracks } from '@/services/track.service';
import { getTopArtists } from '@/services/artist.service';
import { useRouter } from 'next/navigation';
import AlbumCard from '@/components/UI/AlbumCard';

const Home = () => {
  const [topAlbums, setTopAlbums] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const albums = await getTopAlbums();
        const tracks = await getTopTracks();
        const artistsResponse = await getTopArtists();
        setTopAlbums(albums.data);
        setTopTracks(tracks);
        setTopArtists(artistsResponse ? artistsResponse.map((item) => item.artist) : []);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (id, type) => {
    if (!id || !type) {
      console.error('Invalid ID or type');
      return;
    }
    if (type === 'track') {
      router.push(`/track/${id}`);
    } else if (type === 'album') {
      router.push(`/album/${id}`);
    } else if (type === 'artist') {
      router.push(`/artist/${id}`);
    } else {
      console.error('Unknown type:', type);
    }
  };

  const handlePlayClick = (id) => {
    if (currentTrackId === id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrackId(id);
      setIsPlaying(true);
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

    return isValidUrl(imagePath) ? imagePath : 'default-image-path'; // Add a default image path
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <span className="text-xl animate-spin">Chargement...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center text-xl py-4">{error}</div>
    );
  }

  return (
    <Container>
      <h2 className="text-4xl mb-10">Les playlists du moment</h2>
      <h3 className="text-2xl">Top 10 des artistes populaires</h3>
      <HorizontalSlider>
        {topArtists &&
          topArtists.length > 0 &&
          topArtists.map((artist, index) => {
            return (
              <ArtistCard
                key={artist._id || `artist-${index}`}
                title={artist.name}
                img={getImage(artist.images[0]?.path)}
                desc={artist.totalListens}
                onCardClick={() => handleCardClick(artist._id, 'artist')}
              />
            );
          })}
      </HorizontalSlider>
      <h3 className="text-2xl mt-10">Top 10 des derniers sons</h3>
      <HorizontalSlider>
        {topTracks &&
          topTracks.map((track, index) => (
            <PlaylistCard
              key={track._id || `track-${index}`}
              title={track.title}
              img={getImage(track.imagePath)}
              desc={track.releaseYear}
              onCardClick={() => handleCardClick(track._id, 'track')}
              onPlayClick={() => handlePlayClick(track._id)}
              isPlaying={isPlaying && currentTrackId === track._id}
            />
          ))}
      </HorizontalSlider>
      <h3 className="text-2xl mt-10">Top 10 des albums récents</h3>
      <HorizontalSlider>
        {topAlbums &&
          topAlbums.map((album, index) => {
            return (
              <AlbumCard
                key={album._id || `album-${index}`}
                title={album.title}
                desc={album.artistId.name}
                img={getImage(album.images[0].path)}
                onCardClick={() => handleCardClick(album._id, 'album')}
              />
            );
          })}
      </HorizontalSlider>
      {currentTrackId && (
        <AudioPlayer
          tracks={topTracks}
          currentTrackId={currentTrackId}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          setCurrentTrackId={setCurrentTrackId}
        />
      )}
    </Container>
  );
};

export default Home;
