'use client';
import React, { useEffect, useState } from 'react';
import { PlayIcon } from 'lucide-react';
import NextImage from 'next/image';
import { isValidImage } from '@/utils';

const ArtistCard = ({ title, desc, img, onCardClick }) => {
  const imgPlaceholder = 'https://placehold.co/200x200/jpeg';
  
  const [isImageValid, setIsImageValid] = useState(false);

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

  return (
    <div
      className="p-4 sm:p-5 relative rounded-xl w-full max-w-xs flex flex-col items-center text-white group hover:bg-zinc-500 dark:hover:bg-zinc-800 cursor-pointer"
      onClick={onCardClick}
      role="button"
      aria-label={`Artist card for ${title}`}
    >
      <div className="relative w-[120px] sm:w-[150px] h-[120px] sm:h-[150px] rounded-full">
        <NextImage
          src={isImageValid ? img : imgPlaceholder}
          alt={`${title} cover image`}
          className="w-full h-full object-cover rounded-full"
          layout="fill"
        />
      </div>
      <h4 className="mt-2.5 text-xs sm:text-sm leading-5 whitespace-nowrap text-ellipsis overflow-hidden">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-zinc-400">{desc}</p>
    </div>
  );
};

export default ArtistCard;
