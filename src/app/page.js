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

const img = 'https://placehold.co/200x200/jpeg';

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
        setError('Error fetching data');
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
    // Si on clique sur la même piste
    if (currentTrackId === id) {
      setIsPlaying(!isPlaying); // Inverse l'état de lecture
    } else {
      // Si on clique sur une nouvelle piste
      setCurrentTrackId(id);
      setIsPlaying(true); // Démarre automatiquement la lecture
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

    return isValidUrl(imagePath) ? imagePath : img;
  };

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="error-message">Oups, une erreur s'est produite. Réessayez plus tard.</div>
    );
  }

  return (
    <Container>
      <h2 className="text-black dark:text-white text-4xl mb-10">Les playlists du moment</h2>
      <h3 className="text-black dark:text-white text-2xl">Top 10 des artistes populaires</h3>
      <HorizontalSlider>
        {topArtists &&
          topArtists.length > 0 &&
          topArtists.map((artist, index) => {
            const artistId = artist._id || `artist-${index}`;
            return (
              <li
                key={artistId}
                className="flex-none"
              >
                <ArtistCard
                  title={artist.name}
                  img={getImage(artist.images[0]?.path)}
                  onCardClick={() => handleCardClick(artist._id, 'artist')}
                />
              </li>
            );
          })}
      </HorizontalSlider>

      <h3 className="text-black dark:text-white text-2xl mt-10">Top 10 des titres populaires</h3>
      <HorizontalSlider>
        {topTracks &&
          topTracks.map((track, index) => (
            <PlaylistCard
              key={track._id || `track-${index}`}
              title={track.title}
              img={getImage(track.imagePath)}
              desc={track.desc}
              onCardClick={() => handleCardClick(track._id, 'track')}
              onPlayClick={() => handlePlayClick(track._id)}
              isPlaying={isPlaying && currentTrackId === track._id}
            />
          ))}
      </HorizontalSlider>

      <h3 className="text-black dark:text-white text-2xl mt-10">Top 10 des albums populaires</h3>
      <HorizontalSlider>
        {topAlbums &&
          topAlbums.map((album, index) => {
            const albumId = album._id || `album-${index}`;
            return (
              <AlbumCard
                key={albumId}
                title={album.title}
                img={getImage(album.imagePath)}
                desc={album.desc}
                onCardClick={() => handleCardClick(album._id, 'album')}
              />
            );
          })}
      </HorizontalSlider>

      {currentTrackId && (
        <AudioPlayer
          tracks={topTracks} // On passe toutes les pistes au lieu d'une seule
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