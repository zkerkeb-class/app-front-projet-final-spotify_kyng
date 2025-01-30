import Image from 'next/image';
import React from 'react';

const ArtistCard = ({ title, desc, img, onCardClick }) => {
  return (
    <div
      className="p-5 relative rounded-xl text-white group cursor-pointer 
                 bg-zinc-900 transition-all duration-300 hover:bg-zinc-800 
                 shadow-lg hover:shadow-xl flex flex-col items-center space-y-3"
      onClick={onCardClick}
    >
      {/* Image avec effet zoom au survol */}
      <div className="relative w-[160px] h-[160px] rounded-full overflow-hidden group-hover:scale-105 transition-transform duration-300">
        <Image
          src={img || '/api/placeholder/160/160'}
          alt={`${title} cover image`}
          className="w-full h-full object-cover"
          layout="fill"
        />
      </div>

      {/* Texte */}
      <h4 className="text-base font-semibold text-center truncate w-full">{title}</h4>
      <p className="text-xs text-gray-400 text-center line-clamp-2">{desc}</p>
    </div>
  );
};

export default ArtistCard;
