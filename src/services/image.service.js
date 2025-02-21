export const getImageUrl = (imagePath) => {
  // Vérifie si imagePath est une chaîne et s'il est valide
  if (
    typeof imagePath !== 'string' ||
    imagePath.trim() === '' ||
    imagePath.split('/').pop() === 'undefined'
  ) {
    return 'https://sternbergclinic.com.au/wp-content/uploads/2020/03/placeholder.png'; // Retourne l'URL du placeholder si l'image est invalide
  }

  const correctedImagePath = imagePath.replace(/\\/g, '/');

  const imageFileName = correctedImagePath.split('/').pop();

  // Si l'URL est valide, retourne l'URL complète de l'image
  return `${process.env.NEXT_PUBLIC_API_URL}/images/image/${imageFileName.split('/').pop()}`;
};
