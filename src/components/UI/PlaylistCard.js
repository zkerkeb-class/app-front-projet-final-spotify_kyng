'use client';
import React from 'react';
import { FaPlay } from 'react-icons/fa';

const PlaylistCard = React.memo(({ id, title, onCardClick, onPlayClick, desc }) => {
  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlayClick(id);
  };

  return (
    <div
      className="p-5 relative rounded-xl w-full max-w-xs flex flex-col items-center text-white hover:bg-zinc-800 transition duration-300 ease-in-out cursor-pointer group"
      onClick={onCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Playlist card for ${title}`}
      aria-describedby={`desc-${id}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onCardClick();
      }}
    >
      <div className="relative w-36 h-36 rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <img
          src="playlist.png"
          alt="Image de la playlist"
          className="w-full h-full object-cover rounded-xl"
        />
        <button
          className="absolute bottom-2 right-2 bg-green-500 rounded-full w-10 h-10 flex items-center justify-center opacity-0 transition-opacity duration-300 transform scale-90 group-hover:opacity-100 group-hover:scale-100 hover:bg-green-600 shadow-lg"
          onClick={handlePlayClick}
          aria-label={`Lire ${title}`}
          aria-pressed="false"
        >
          <FaPlay
            size={15}
            className="text-white"
          />
        </button>
      </div>

      <div className="w-full text-left mt-2.5">
        <h4 className="text-sm font-semibold text-white transition-opacity duration-300 group-hover:opacity-90">
          {title}
        </h4>
        <p
          id={`desc-${id}`}
          className="text-sm text-zinc-400 transition-opacity duration-300 group-hover:opacity-80"
        >
          {desc}
        </p>
      </div>
    </div>
  );
});

export default PlaylistCard;
