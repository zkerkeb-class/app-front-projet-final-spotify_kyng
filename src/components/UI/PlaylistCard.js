'use client';
import React, { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import NextImage from 'next/image';
import { isValidImage } from '@/utils';

const PlaylistCard = ({ id, title, img, onCardClick, onPlayClick, desc }) => {
  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlayClick(id);
  };

  const imgPlaceholder = 'https://placehold.co/200x200/jpeg';

  const [isImageValid, setIsImageValid] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    isValidImage(img)
      .then((isValid) => {
        setIsImageValid(isValid);
        if (!isValid) {
          setError('Image failed to load.');
        }
      })
      .catch(() => {
        setError('Image failed to load.');
      });
  }, [img]);

  return (
    <div
      className="p-5 relative rounded-xl w-full max-w-xs flex flex-col items-center text-white group hover:bg-zinc-500 dark:hover:bg-zinc-800 cursor-pointer"
      onClick={onCardClick}
      role="button"
      aria-label={`Playlist card for ${title}`}
      tabIndex="0" // Ajout de tabIndex pour navigation au clavier
      aria-describedby={`desc-${id}`} // Association de la description pour les utilisateurs de lecteurs d'écran
    >
      <div className="relative w-36 h-36 rounded-xl">
        <NextImage
          // src={isImageValid ? img : imgPlaceholder}
          src="http://localhost:8000/api/images/image/ad42942a-5918-4b0f-8611-d86b58041d7b-billie%20pic.jpeg?sp=racwdli&st=2025-01-30T15:51:38Z&se=2025-02-05T23:51:38Z&skoid=73109398-872f-4e38-af9b-ab1ff35f9cdd&sktid=38e72bba-3c22-4382-9323-ac1612931297&skt=2025-01-30T15:51:38Z&ske=2025-02-05T23:51:38Z&sks=b&skv=2022-11-02&sv=2022-11-02&sr=c&sig=3KEs%2FHGfVYV3m1KApc7nyBhNqjKfp0FaLpLEMVY2Lls%3D"
          alt={`Cover image for ${title}`} // Alt dynamique
          className="w-full h-full object-cover rounded-xl"
          layout="fill"
        />
        <button
          className="absolute bottom-2 right-2 bg-green-500 rounded-full w-10 h-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-green-600 shadow-lg"
          onClick={handlePlayClick}
          aria-label={`Play ${title}`}
          aria-pressed="false" // Retour sur l'état du bouton
        >
          <FaPlay
            size={15}
            className="text-white"
          />
        </button>
      </div>
      <div className="w-full text-left">
        <h4 className="mt-2.5 text-sm">{title}</h4>
        <p
          id={`desc-${id}`}
          className="text-sm text-zinc-400"
        >
          {desc}
        </p>{' '}
        {/* Ajout d'un ID unique pour la description */}
      </div>

      {/* Affichage des messages d'erreur contextuels pour les lecteurs d'écran
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="text-red-500 mt-2 text-sm"
        >
          {error}
        </div>
      )} */}
    </div>
  );
};

export default PlaylistCard;
