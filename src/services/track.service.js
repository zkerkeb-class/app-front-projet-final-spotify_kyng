// Fonction pour récupérer les 10 premières pistes
export const getTopTracks = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/track/top/10`);
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des pistes: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur de récupération des top tracks:', error);
        // Retourner une erreur ou une valeur par défaut en cas de problème
        return { error: 'Impossible de récupérer les pistes populaires.' };
    }
}

// Fonction pour récupérer les données d'une piste par son ID
export const getTrackById = async (trackId) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/track/${trackId}`);
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des données de la piste: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur de fetch pour la piste:', error);
        // Retourner une erreur ou une valeur par défaut en cas de problème
        return { error: 'Impossible de récupérer les détails de la piste.' };
    }
};
