export const isValidImage = (url) => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = url;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
};
