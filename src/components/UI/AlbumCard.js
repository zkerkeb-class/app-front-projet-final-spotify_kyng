'use client';

import React, { useEffect, useState } from 'react';
import { PlayIcon } from 'lucide-react';
import NextImage from 'next/image';
import { isValidImage } from '@/utils';

const AlbumCard = ({ title, desc, img, onCardClick }) => {
  const imgPlaceholder = 'https://placehold.co/200x200/jpeg';

  const [isImageValid, setIsImageValid] = useState(false);

  useEffect(() => {
    isValidImage(img).then(setIsImageValid);
  }, [img]);

  return (
    <div
      className="p-5 relative rounded-xl w-48 flex flex-col items-center text-white group hover:bg-zinc-500 dark:hover:bg-zinc-800 cursor-pointer"
      onClick={onCardClick}
    >
      <div className="relative w-36 h-36 rounded-xl">
        <NextImage
          src={isImageValid ? img : imgPlaceholder}
          alt={`${title} cover image`}
          className="w-full h-full object-cover rounded-xl"
          layout="fill"
        />
        <button
          className="absolute bottom-2 right-2 bg-green-500 rounded-full w-10 h-10 flex 
          items-center justify-center opacity-0 transition-opacity duration-300 
          group-hover:opacity-100 hover:bg-green-600 shadow-lg"
          onClick={onCardClick}
        >
          <PlayIcon className="w-6 h-6 text-white" />
        </button>
      </div>
      <div className="w-full text-left">
        <h4 className="mt-2.5 text-sm">{title}</h4>
        <p className="text-sm text-zinc-700">{desc}</p>
      </div>
    </div>
  );
};

export default AlbumCard;
