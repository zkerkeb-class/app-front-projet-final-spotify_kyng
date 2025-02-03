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
          const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL,{
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
      socket.emit('join-room', id, userId );
      localStorage.setItem('jamSessionId', id);
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la connexion à la room');
    }
  };

  if (roomExists === null) return <p className="dark:text-white">Chargement...</p>;
  if (!roomExists) return <p>⚠️ Cette room n'existe pas.</p>;

  return (
    <Container>
      <div className="p-4 dark:text-white">
        <h1 className="text-xl font-bold">Rejoindre la Room</h1>
        <p>Vous êtes sur le point de rejoindre la Room : {id}</p>

        <button
          onClick={handleJoinRoom}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Rejoindre
        </button>
      </div>
    </Container>
  );
}
