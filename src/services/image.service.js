export const getImageUrl = (imagePath) => {
  const imgPlaceholder = 'https://sternbergclinic.com.au/wp-content/uploads/2020/03/placeholder.png';
  
  console.log('1. Image Path reçu:', imagePath);

  if (!imagePath || typeof imagePath !== 'string') {
    console.log('2. Pas de chemin d\'image valide, retour du placeholder');
    return imgPlaceholder;
  }

  try {
    const normalizedPath = imagePath.replace(/\\/g, '/');
    
    // Si c'est une URL CloudFront
    if (normalizedPath.includes('cloudfront.net')) {
      const filename = normalizedPath.split('/').pop();
      const apiUrl = `https://back-end-projet-final-spotify-kyng.onrender.com/api/images/image/${filename}`;
      console.log('3. URL convertie de CloudFront vers API:', apiUrl);
      return apiUrl;
    }

    // Si c'est déjà une URL de l'API, la retourner telle quelle
    if (normalizedPath.includes('back-end-projet-final-spotify-kyng.onrender.com')) {
      console.log('4. URL API déjà correcte:', normalizedPath);
      return normalizedPath;
    }

    // Pour les chemins relatifs
    if (!normalizedPath.startsWith('http')) {
      const filename = normalizedPath.split('/').pop();
      const apiUrl = `https://back-end-projet-final-spotify-kyng.onrender.com/api/images/image/${filename}`;
      console.log('5. Chemin relatif converti en URL API:', apiUrl);
      return apiUrl;
    }

    // Pour toute autre URL, retourner le placeholder
    console.log('6. Format non reconnu, retour du placeholder');
    return imgPlaceholder;
  } catch (error) {
    console.error('7. Erreur lors du traitement du chemin d\'image:', error);
    return imgPlaceholder;
  }
};
