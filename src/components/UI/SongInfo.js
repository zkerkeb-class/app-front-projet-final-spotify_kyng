import React from 'react';

const SongInfo = ({ currentSong, isFullscreen }) => {
  const { name, artist, artwork } = currentSong || {};

  return (
    <div
      className={`flex items-center space-x-4 mb-4 ${isFullscreen ? 'justify-center' : ''}`}
      role="contentinfo"
      aria-label={`Informations sur la chanson ${name || 'inconnue'}`}
    >
      <img
        src={artwork || '/images/default-artwork.webp'}
        alt={`Artwork for ${name} by ${artist}`}
        className={`${isFullscreen ? 'w-32 h-32' : 'w-16 h-16'} rounded-md`}
        aria-describedby="song-artwork" // Ajout d'un ID pour l'image si nécessaire
      />
      <div>
        <h2
          className="text-black dark:text-white font-semibold text-lg"
          aria-label={`Titre de la chanson ${name || 'inconnu'}`}
        >
          {name || 'Unknown Song'}
        </h2>
        <p
          className="text-gray-400 dark:text-gray-300"
          aria-label={`Nom de l'artiste ${artist || 'inconnu'}`}
        >
          {artist || 'Unknown Artist'}
        </p>
      </div>

      {/* Gestion des erreurs en cas de données manquantes */}
      {(name === undefined || artist === undefined) && (
        <div
          role="alert"
          aria-live="assertive"
          className="text-red-500 dark:text-red-400 mt-2 text-sm"
        >
          Informations sur la chanson manquantes. Veuillez vérifier les données.
        </div>
      )}
    </div>
  );
};

export default SongInfo;
