'use client';
import Image from 'next/image';
import React from 'react';

const ArtistCard = React.memo(({ title, desc, imagePath, onCardClick }) => {
  return (
    <div
      className="p-4 sm:p-5 relative rounded-xl w-full max-w-xs flex flex-col items-center text-white hover:bg-zinc-800 transition duration-300 ease-in-out cursor-pointer group"
      onClick={onCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Carte artiste pour ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onCardClick();
      }}
    >
      <div className="relative w-[120px] sm:w-[150px] h-[120px] sm:h-[150px] rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <Image
          src={imagePath}
          alt={`Image de ${title}`}
          className="w-full h-full object-cover rounded-full"
          width={144}
          height={144}
        />
      </div>
      <h4 className="mt-2.5 text-xs sm:text-sm leading-5 text-center font-semibold text-white">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-zinc-400 text-center">{desc}</p>
    </div>
  );
});

export default ArtistCard;
