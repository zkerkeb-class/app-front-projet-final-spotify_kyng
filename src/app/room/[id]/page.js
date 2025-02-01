'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateUniqueID } from '@/utils';

export default function RoomJoinPage({ params }) {
  const { roomId } = params;
  const router = useRouter();
  const [roomExists, setRoomExists] = useState(null);

  useEffect(() => {
    // Vérifier si la room existe
    const checkRoom = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room/${roomId}`);
      if (res.ok) {
        setRoomExists(true);
      } else {
        setRoomExists(false);
      }
    };
    checkRoom();
  }, [roomId]);

  const handleJoinRoom = async () => {
    const userId = generateUniqueID();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room/join/${roomId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, userId }),
    });

    if (res.ok) {
      router.push('/');
    } else {
      alert('Erreur lors de la connexion à la room.');
    }
  };

  if (roomExists === null) return <p>Chargement...</p>;
  if (!roomExists) return <p>⚠️ Cette room n'existe pas.</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Rejoindre la Room</h1>
      <p>Vous êtes sur le point de rejoindre la Room : {roomId}</p>

      <button
        onClick={handleJoinRoom}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Rejoindre
      </button>
    </div>
  );
}
