export const getLastPlayedPlaylist = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/playlist/last-played`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching playlist', error);
  }
};

export const getMostPlayedPlaylist = async (id) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/playlist/most-played`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching playlist', error);
  }
};
