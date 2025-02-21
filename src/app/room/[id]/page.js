'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { io } from 'socket.io-client';
import Container from '@/components/UI/Container';
import { generateUniqueID } from '@/utils';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import ErrorMessage from '@/components/UI/ErrorMessage';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export default function RoomJoinPage() {
  const { id } = useParams();
  const router = useRouter();
  const [roomExists, setRoomExists] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkRoomExistence = useCallback(
    async (retries = 0) => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room/${id}`);
        if (res.ok) {
          setRoomExists(true);
          if (!socket) {
            const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
              autoConnect: false,
            });
            setSocket(newSocket);
          }
        } else {
          setRoomExists(false);
        }
      } catch (err) {
        if (retries < MAX_RETRIES) {
          setTimeout(() => checkRoomExistence(retries + 1), RETRY_DELAY);
        } else {
          setError('Erreur lors de la vérification de la room, veuillez réessayer plus tard.');
          setRoomExists(false);
        }
      } finally {
        setLoading(false);
      }
    },
    [id, socket]
  );

  useEffect(() => {
    checkRoomExistence();
  }, [checkRoomExistence]);

  const handleJoinRoom = async () => {
    try {
      const userId = generateUniqueID();
      localStorage.setItem('userId', userId);
      socket.connect();
      socket.emit('join-room', id, userId);
      localStorage.setItem('jamSessionId', id);
      router.push('/');
    } catch (error) {
      setError('Erreur lors de la connexion à la room');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <ErrorMessage
        error={error}
        onRetry={retryFetchData}
      />
    );
  if (roomExists === null) return <p className="text-white">Chargement...</p>;
  if (!roomExists) return <p className="text-white">⚠️ Cette room n'existe pas.</p>;

  return (
    <Container>
      <div className="p-6 bg-zinc-800 text-white rounded-lg shadow-lg max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4">Rejoindre la Room</h1>
        <p className="text-center text-lg mb-6">
          Vous êtes sur le point de rejoindre la Room : <span className="font-semibold">{id}</span>
        </p>

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
