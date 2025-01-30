'use client';

import { FaPlay } from 'react-icons/fa';
import Image from 'next/image';
import React from 'react';

const PlaylistCard = ({ id, title, desc, img, onCardClick, onPlayClick }) => {
  const handlePlayClick = (e) => {
    e.stopPropagation(); // Empêche l'événement de clic de se propager à la carte
    onPlayClick(id); // Appelle la fonction de lecture
  };

  return (
    <div
      className="w-[200px] p-4 bg-zinc-900 rounded-xl text-white cursor-pointer 
                transition-all duration-300 hover:bg-zinc-800 shadow-lg hover:shadow-xl 
                flex flex-col items-center space-y-3"
      onClick={onCardClick}
    >
      {/* Image container avec un effet de zoom au survol */}
      <div className="relative w-[160px] h-[160px] rounded-lg overflow-hidden group">
        <Image
          src={img || '/api/placeholder/160/160'}
          alt={`${title} cover image`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          layout="fill"
        />
        {/* Bouton Play flottant */}
        <button
          className="absolute bottom-2 right-2 bg-green-500 p-3 rounded-full 
                     hover:bg-green-600 transition-transform transform hover:scale-110 
                     shadow-lg opacity-0 group-hover:opacity-100 duration-300"
          onClick={handlePlayClick}
        >
          <FaPlay size={20} />
        </button>
      </div>

      {/* Texte */}
      <h4 className="text-base font-semibold truncate w-full text-center">{title}</h4>
      <p className="text-xs text-gray-400 truncate w-full text-center">{desc}</p>
    </div>
  );
};

export default PlaylistCard;
