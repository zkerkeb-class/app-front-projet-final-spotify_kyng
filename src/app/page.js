import ArtistCard from '@/components/UI/ArtistCard';
import Container from '@/components/UI/Container';
import HorizontalSlider from '@/components/UI/HorizontalSlider';
import PlaylistCard from '@/components/UI/PlaylistCard';

const img = 'https://placehold.co/200x200/jpeg';
const topArtists = [
  {
    id: 'artist1',
    title: 'Artist 1',
  },
  {
    id: 'artist2',
    title: 'Artist 2',
  },
  {
    id: 'artist3',
    title: 'Artist 3',
  },
  {
    id: 'artist4',
    title: 'Artist 4',
  },
  {
    id: 'artist5',
    title: 'Artist 5',
  },
  {
    id: 'artist6',
    title: 'Artist 6',
  },
  {
    id: 'artist7',
    title: 'Artist 7',
  },
  {
    id: 'artist8',
    title: 'Artist 8',
  },
  {
    id: 'artist9',
    title: 'Artist 9',
  },
  {
    id: 'artist10',
    title: 'Artist 10',
  },
];

const topAlbums = [
  {
    id: 'album1',
    title: 'Album 1',
  },
  {
    id: 'album2',
    title: 'Album 2',
  },
  {
    id: 'album3',
    title: 'Album 3',
  },
  {
    id: 'album4',
    title: 'Album 4',
  },
  {
    id: 'album5',
    title: 'Album 5',
  },
  {
    id: 'album6',
    title: 'Album 6',
  },
  {
    id: 'album7',
    title: 'Album 7',
  },
  {
    id: 'album8',
    title: 'Album 8',
  },
  {
    id: 'album9',
    title: 'Album 9',
  },
  {
    id: 'album10',
    title: 'Album 10',
  },
];

const topSongs = [
  {
    id: 'song1',
    title: 'Song 1',
    img: 'https://placehold.co/200x200',
  },
  {
    id: 'song2',
    title: 'Song 2',
    img: 'https://placehold.co/200x200',
  },
  {
    id: 'song3',
    title: 'Song 3',
    img: 'https://placehold.co/200x200',
  },
  {
    id: 'song4',
    title: 'Song 4',
    img: 'https://placehold.co/200x200',
  },
  {
    id: 'song5',
    title: 'Song 5',
    img: 'https://placehold.co/200x200',
  },
  {
    id: 'song6',
    title: 'Song 6',
    img: 'https://placehold.co/200x200',
  },
  {
    id: 'song7',
    title: 'Song 7',
    img: 'https://placehold.co/200x200',
  },
  {
    id: 'song8',
    title: 'Song 8',
    img: 'https://placehold.co/200x200',
  },
  {
    id: 'song9',
    title: 'Song 9',
    img: 'https://placehold.co/200x200',
  },
  {
    id: 'song10',
    title: 'Song 10',
    img: 'https://placehold.co/200x200',
  },
];

const Home = () => {
  return (
    <Container>
      <h2 className="text-black dark:text-white text-4xl mb-10">Les playlists du moments</h2>
      <h3 className="text-black dark:text-white text-2xl ">Top 10 des artistes populaires</h3>
      <HorizontalSlider>
        {topArtists.map((artist) => (
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
        {topSongs.map((song) => (
          <PlaylistCard
            key={song.id}
            title={song.title}
            img={img}
            desc={song.desc}
          />
        ))}
      </HorizontalSlider>

      <h3 className="text-white text-2xl ">Top 10 des albums récents</h3>

      <HorizontalSlider>
        {topAlbums.map((album) => (
          <PlaylistCard
            key={album.id}
            title={album.title}
            img={img}
            desc={album.desc}
          />
        ))}
      </HorizontalSlider>
    </Container>
  );
};

export default Home;
