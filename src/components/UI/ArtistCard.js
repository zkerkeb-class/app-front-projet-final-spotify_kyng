'use client';
import React, { useEffect, useState } from 'react';
import { PlayIcon } from 'lucide-react';
import NextImage from 'next/image';
import { isValidImage } from '@/utils';

const ArtistCard = ({ title, desc, img }) => {
  const imgPlaceholder = 'https://placehold.co/200x200/jpeg';

  const [isImageValid, setIsImageValid] = useState(false);

  useEffect(() => {
    isValidImage(img).then(setIsImageValid);
  }, [img]);
  return (
    <div className="p-5 relative rounded-xl text-white group hover:bg-zinc-800">
      <div className="relative w-[150px] h-[150px] rounded-xl">
        <NextImage
          src={isImageValid ? img : imgPlaceholder}
          alt={title + ' cover image'}
          className="w-full h-full object-cover rounded-full"
          layout="fill"
        />
      </div>
      <div className="relative">
        <button className="absolute -top-10 right-2.5 bg-green-500 rounded-full opacity-0 transition-all duration-400 w-10 h-10 flex items-center justify-center group-hover:opacity-100 group-hover:-top-[60px]">
          <PlayIcon className="w-6 h-6" />
        </button>
      </div>
      <h4 className="mt-2.5 text-sm leading-5 whitespace-nowrap text-ellipsis overflow-hidden">
        {title}
      </h4>
      <p className="mt-2.5 text-xs leading-5 font-semibold text-[#b3b3b3] line-clamp-2">{desc}</p>
    </div>
  );
};

export default ArtistCard;
