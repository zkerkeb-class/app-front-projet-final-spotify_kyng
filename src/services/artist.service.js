export const getTopArtists = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/artist/top/10-popular-artists`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching top artists', error);
    }
}