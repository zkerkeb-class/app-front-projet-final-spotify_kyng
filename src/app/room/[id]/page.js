'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { io } from 'socket.io-client';
import Container from '@/components/UI/Container';
import { generateUniqueID } from '@/utils';

export default function RoomJoinPage() {
  const { id } = useParams();
  const router = useRouter();
  const [roomExists, setRoomExists] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Vérifier si la room existe
    const checkRoom = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room/${id}`);
        if (res.ok) {
          setRoomExists(true);
          const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
            autoConnect: false,
          });
          setSocket(newSocket);
        } else {
          setRoomExists(false);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la room :', error);
      }
    };
    checkRoom();
  }, [id]);

  const handleJoinRoom = async () => {
    try {
      const userId = generateUniqueID();
      localStorage.setItem('userId', userId);
      // Connexion au serveur Socket.io
      socket.connect();
      socket.emit('join-room', id, userId);
      localStorage.setItem('jamSessionId', id);
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la connexion à la room');
    }
  };

  if (roomExists === null) return <p className="text-white">Chargement...</p>;
  if (!roomExists) return <p className="text-white">⚠️ Cette room n'existe pas.</p>;

  return (
    <Container>
      <div className="p-6 bg-zinc-800 text-white rounded-lg shadow-lg max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4">Rejoindre la Room</h1>
        <p className="text-center text-lg mb-6">Vous êtes sur le point de rejoindre la Room : <span className="font-semibold">{id}</span></p>

        <button
          onClick={handleJoinRoom}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
        >
          Rejoindre
        </button>
      </div>
    </Container>
  );
}
