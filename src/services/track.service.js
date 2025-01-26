export const getTopTracks = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/track/top/10`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching top tracks', error);
    }
}