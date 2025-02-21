export const isValidImage = (url) => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = url;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
};

export const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const generateUniqueID = () => {
  return Math.random().toString(36).substr(2, 9);
};
