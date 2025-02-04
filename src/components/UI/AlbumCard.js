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
          // src={isImageValid && !imageError ? img : imgPlaceholder}
          src="http://localhost:8000/api/images/image/ad42942a-5918-4b0f-8611-d86b58041d7b-billie%20pic.jpeg?sp=racwdli&st=2025-01-30T15:51:38Z&se=2025-02-05T23:51:38Z&skoid=73109398-872f-4e38-af9b-ab1ff35f9cdd&sktid=38e72bba-3c22-4382-9323-ac1612931297&skt=2025-01-30T15:51:38Z&ske=2025-02-05T23:51:38Z&sks=b&skv=2022-11-02&sv=2022-11-02&sr=c&sig=3KEs%2FHGfVYV3m1KApc7nyBhNqjKfp0FaLpLEMVY2Lls%3D"
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
        {/* {imageError && (
          <p role="alert" aria-live="assertive" className="text-red-500 text-xs mt-1">
            L'image n'a pas pu être chargée. Veuillez réessayer.
          </p>
        )} */}
      </div>
    </div>
  );
};

export default AlbumCard;
