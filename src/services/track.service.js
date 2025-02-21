export const getTopTracks = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/track/top/10-recent-tracks`);

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des pistes: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top tracks', error);
  }
};

export const streamTrack = async (id) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/track/stream/${id}`);

    if (!response.ok) {
      throw new Error(`Error fetching track: ${response.statusText}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error streaming track:', error);
    throw error;
  }
};

export const getTrackById = async (id) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/track/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching track by id', error);
  }
};

export const getTracksByAlbum = async (albumId) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/track/album/${albumId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching artist by ID', error);
  }
};

export const getTracksByArtist = async (artistID) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/track/artist/${artistID}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching artist by ID', error);
  }
};
