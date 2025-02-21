'use client';

import React, { useState, useEffect } from 'react';

const OptimizedImage = ({ src, alt, width, height, className = '' }) => {
  const imgPlaceholder =
    'http://localhost:8000/api/images/image/ad42942a-5918-4b0f-8611-d86b58041d7b-billie%20pic.jpeg'; // Placeholder image en basse résolution.

  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    const validateImage = async () => {
      try {
        const response = await fetch(src, { method: 'HEAD' });
        if (response.ok) {
          setImageSrc(src);
        } else {
          setImageSrc(imgPlaceholder);
        }
      } catch {
        setImageSrc(imgPlaceholder);
      }
    };

    if (src) {
      validateImage();
    }
  }, [src]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <img
        src={imgPlaceholder}
        alt={alt}
        className={`absolute w-full h-full object-cover transition-opacity duration-700 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <picture>
        <source
          srcSet={`${imageSrc}.avif 1x, ${imageSrc}.avif 2x, ${imageSrc}.avif 3x`}
          type="image/avif"
        />
        <source
          srcSet={`${imageSrc}.webp 1x, ${imageSrc}.webp 2x, ${imageSrc}.webp 3x`}
          type="image/webp"
        />
        <img
          src={`${imageSrc}.webp`}
          alt={alt}
          className={`absolute w-full h-full object-cover transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      </picture>
    </div>
  );
};

export default OptimizedImage;
