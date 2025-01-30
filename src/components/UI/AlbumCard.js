'use client';

import Image from 'next/image';
import React from 'react';

const AlbumCard = ({ id, title, artist, img, onCardClick }) => {
  return (
    <div
      className="w-[180px] p-4 bg-zinc-900 rounded-lg text-white cursor-pointer transition-colors duration-300 hover:bg-zinc-800 flex flex-col items-center"
      onClick={onCardClick}
    >
      <div className="relative w-[150px] h-[150px] rounded-lg overflow-hidden">
        <Image
          src={img || '/api/placeholder/150/150'}
          alt={title + ' cover image'}
          className="w-full h-full object-cover"
          layout="fill"
        />
      </div>
      <h4 className="mt-2 text-sm font-semibold truncate w-full text-center">{title}</h4>
      <p className="text-xs text-gray-400 truncate w-full text-center">{artist}</p>
    </div>
  );
};

export default AlbumCard;
