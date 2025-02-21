'use client';
import React from 'react';
import Image from 'next/image';

const AlbumCard = React.memo(({ title, desc, imagePath, onCardClick }) => {
  return (
    <div
      className="p-5 relative rounded-xl w-full max-w-xs flex flex-col items-center text-white hover:bg-zinc-800 transition duration-300 ease-in-out cursor-pointer group"
      onClick={onCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Album card for ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onCardClick();
      }}
    >
      <div className="relative w-36 h-36 rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <Image
          src={imagePath}
          alt={`Image de ${title}`}
          className="w-full h-full object-cover rounded-xl"
          width={144}
          height={144}
        />
      </div>
      <div className="w-full text-left mt-2.5">
        <h4 className="text-sm font-semibold text-white transition-opacity duration-300 group-hover:opacity-90">
          {title}
        </h4>
        <p className="text-sm text-zinc-400 transition-opacity duration-300 group-hover:opacity-80">
          {desc}
        </p>
      </div>
    </div>
  );
});

export default AlbumCard;
