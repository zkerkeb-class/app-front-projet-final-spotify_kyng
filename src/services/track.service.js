export const getTopTracks = async () => {
  try {
    const apiUrl = 'http://localhost:8000/api' || process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/track/top/10`);

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des pistes: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top tracks', error);
  }
};

export const streamTrack = async (audioLink) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/track/stream/${audioLink}`);

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
