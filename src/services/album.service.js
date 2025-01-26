export const getTopAlbums = async () =>  {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/album/top/10-recent-albums`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching top albums', error);
    }
}

export const getAlbumById = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/album/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching album by id', error);
    }
}