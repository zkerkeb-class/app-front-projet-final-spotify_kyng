const searchService = async (query, page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/search?q=${query}&page=${page}&limit=${limit}`
    );
    console.log("Réponse de l'API:", response);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des résultats');
    }

    const data = await response.json();
    console.log('Données retournées:', data);
    return data;
  } catch (error) {
    console.error('Erreur de recherche:', error);
    throw error;
  }
};

export default searchService; // Assure-toi que la fonction est exportée
