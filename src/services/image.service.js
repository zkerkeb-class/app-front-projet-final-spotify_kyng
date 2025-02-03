export const fetchImage = async (filename) => {
    try {
      const url = `http://localhost:8000/api/images/image/${filename}`;
      console.log('Fetching image from:', url); // Log l'URL pour vérifier
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Image not found');
      }
      const imageBlob = await response.blob();
      return URL.createObjectURL(imageBlob); // Retourne un URL pour l'image
    } catch (error) {
      console.error('Error fetching image:', error);
      throw error;
    }
  };
  