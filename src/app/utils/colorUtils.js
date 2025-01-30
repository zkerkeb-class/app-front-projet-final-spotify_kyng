import ColorThief from 'colorthief'; // Si vous utilisez la bibliothèque color-thief

export const extractColorFromImage = (imageUrl) => {
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const imageWithProxy = proxyUrl + imageUrl;
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Ajoutez ce header CORS
    img.src = imageWithProxy;
    img.onload = () => {
      const colorThief = new ColorThief();
      const color = colorThief.getColor(img);
      const rgb = `rgb(${color.join(', ')})`;
      resolve(rgb);
    };
    img.onerror = reject;
  });
};
