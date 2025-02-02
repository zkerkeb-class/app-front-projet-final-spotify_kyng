'use client';
import React, { useEffect, useState } from 'react';
import { PlayIcon } from 'lucide-react';
import NextImage from 'next/image';

const ArtistCard = ({ title, desc, img, onCardClick }) => {
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
      className="p-4 sm:p-5 relative rounded-xl w-full max-w-xs flex flex-col items-center text-white group hover:bg-zinc-500 dark:hover:bg-zinc-800 cursor-pointer"
      onClick={onCardClick}
      role="button"
      tabIndex={0} // Ensures the card is focusable via keyboard
      aria-label={`Artist card for ${title}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCardClick(); }} // Keyboard event handling
    >
      <div className="relative w-[120px] sm:w-[150px] h-[120px] sm:h-[150px] rounded-full">
        <NextImage
          src={isImageValid && !imageError ? img : imgPlaceholder}
          alt={imageError ? 'Image failed to load' : `${title} profile image`}
          className="w-full h-full object-cover rounded-full"
          layout="fill"
          onError={handleImageError}
        />
      </div>
      <h4 className="mt-2.5 text-xs sm:text-sm leading-5 whitespace-nowrap text-ellipsis overflow-hidden">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-zinc-400">{desc}</p>
      {imageError && (
        <p role="alert" className="text-red-500 text-xs mt-1">
          L'image n'a pas pu être chargée. Veuillez réessayer.
        </p>
      )}
    </div>
  );
};

export default ArtistCard;
