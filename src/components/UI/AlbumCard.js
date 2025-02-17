'use client';

import React, { useEffect, useState } from 'react';
import { PlayIcon } from 'lucide-react';
import NextImage from 'next/image';

const AlbumCard = ({ title, desc, img, onCardClick }) => {
  const imgPlaceholder = 'https://placehold.co/200x200/jpeg';

  const [isImageValid, setIsImageValid] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const validateImage = async () => {
      try {
        const response = await fetch(img, { method: 'HEAD' });
        setIsImageValid(response.ok);
      } catch {
        setIsImageValid(false);
      }
    };

    if (img) {
      validateImage();
    }
  }, [img]);

  const handleImageError = () => {
    setImageError(true);
    setIsImageValid(false);
  };

  return (
    <div
      className="p-5 relative rounded-xl w-full max-w-xs flex flex-col items-center text-white group hover:bg-zinc-500 dark:hover:bg-zinc-800 cursor-pointer"
      onClick={onCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Album card for ${title}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCardClick(); }}
    >
      <div className="relative w-36 h-36 rounded-xl">
        <NextImage
          src={isImageValid && !imageError ? img : imgPlaceholder}
          alt={imageError ? 'Image failed to load for album ' + title : `${title} cover image`}
          className="w-full h-full object-cover rounded-xl"
          layout="fill"
          onError={handleImageError}
        />
        <button
          className="absolute bottom-2 right-2 bg-green-500 rounded-full w-10 h-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-green-600 shadow-lg"
          aria-label={`Play ${title}`}
        >
          <PlayIcon className="w-6 h-6 text-white" />
        </button>
      </div>
      <div className="w-full text-left">
        <h4 className="mt-2.5 text-sm">{title}</h4>
        <p className="text-sm text-zinc-400">{desc}</p>

        {/* Message d'erreur avec rôle alert pour les lecteurs d'écran */}
        {imageError && (
          <p role="alert" aria-live="assertive" className="text-red-500 text-xs mt-1">
            L'image n'a pas pu être chargée. Veuillez réessayer.
          </p>
        )}
      </div>
    </div>
  );
};

export default AlbumCard;
