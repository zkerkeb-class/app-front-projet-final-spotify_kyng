import AudioPlayer from '@/components/partials/AudioPlayer';
import ArtistCard from '@/components/UI/ArtistCard';
import Container from '@/components/UI/Container';
import HorizontalSlider from '@/components/UI/HorizontalSlider';
import PlaylistCard from '@/components/UI/PlaylistCard';
import { getTopAlbums } from '@/services/album.service';
import { getTopArtists } from '@/services/artist.service';
import { getTopTracks } from '@/services/track.service';

const img = 'https://placehold.co/200x200/jpeg';

const Home = async () => {
  const topAlbums = await getTopAlbums().then((data) => data.data);
  const topTracks = await getTopTracks();
  const topArtists = await getTopArtists();

  return (
    <Container>
      <h2 className="text-black dark:text-white text-4xl mb-10">Les playlists du moments</h2>
      <h3 className="text-black dark:text-white text-2xl ">Top 10 des artistes populaires</h3>
      <HorizontalSlider>
        {topArtists &&
          topArtists.map((artist) => (
            <li
              key={artist.id}
              className="flex-none"
            >
              <ArtistCard
                title={artist.title}
                img={img}
              />
            </li>
          ))}
      </HorizontalSlider>

      <h3 className="text-white text-2xl ">Top 10 des derniers sons</h3>

      <HorizontalSlider>
        {topTracks &&
          topTracks.map((track) => (
            <PlaylistCard
              key={track.id}
              title={track.title}
              img={img}
              desc={track.desc}
            />
          ))}
      </HorizontalSlider>

      <h3 className="text-white text-2xl ">Top 10 des albums récents</h3>

      <HorizontalSlider>
        {topAlbums &&
          topAlbums.map((album) => (
            <PlaylistCard
              key={album.id}
              title={album.title}
              img={img}
              desc={album.desc}
            />
          ))}
      </HorizontalSlider>
      <AudioPlayer tracks={topTracks} />
    </Container>
  );
};

export default Home;
