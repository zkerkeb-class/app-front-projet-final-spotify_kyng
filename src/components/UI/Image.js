'use client'
import React, { useEffect, useState } from 'react';
import { fetchImage } from '@/services/image.service';

const Image = ({ filename }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const url = await fetchImage(filename);
        setImageUrl(url);
      } catch (error) {
        setError('Failed to load image');
      }
    };

    loadImage();
  }, [filename]);

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <img
          src="https://placehold.co/200x200/jpeg"
          alt="Default"
        />
      </div>
    );
  }

  if (!imageUrl) {
    return <div>Loading...</div>;
  }

  return (
    <img
      src={imageUrl}
      
    />
  );
};

export default Image;
