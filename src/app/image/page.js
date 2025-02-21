// import React from 'react';
// import ImageComponent from '@/components/UI/OptimizedImage';

// const Image = () => {
//   return (
//     <div>
//       <h1>Spotify Image Display</h1>
//       <ImageComponent filename="ad42942a-5918-4b0f-8611-d86b58041d7b-billie%20pic.jpeg?sp=racwdli&st=2025-01-30T15:51:38Z&se=2025-02-05T23:51:38Z&skoid=73109398-872f-4e38-af9b-ab1ff35f9cdd&sktid=38e72bba-3c22-4382-9323-ac1612931297&skt=2025-01-30T15:51:38Z&ske=2025-02-05T23:51:38Z&sks=b&skv=2022-11-02&sv=2022-11-02&sr=c&sig=3KEs%2FHGfVYV3m1KApc7nyBhNqjKfp0FaLpLEMVY2Lls%3D" />
//     </div>
//   );
// };

// export default Image;

'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const ImagePreview = ({ src, name, size }) => {
  // Vérification si 'name' est défini avant d'exécuter la méthode 'split'
  const fileExtension = name ? name.split('.').pop() : 'unknown';

  return (
    <div className="flex flex-col items-center">
      <Image
        src={src}
        alt={name}
        className={`w-${size} h-${size} object-cover`}
        width={size}
        height={size}
      />
      <p className="text-sm text-gray-500">{name}</p>
      <p className="text-sm text-gray-400">Extension : {fileExtension}</p>
    </div>
  );
};

export default ImagePreview;
