'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import SideBar from '@/components/partials/Sidebar';
import Jam from '@/components/partials/Jam';
import Header from '@/components/partials/Header';
import Head from 'next/head';
import StoreProvider from './StoreProvider';
import AudioPlayer from '@/components/partials/AudioPlayer';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const inter = Inter({
  subsets: ['latin'],
});
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  autoConnect: false,
});

export default function RootLayout({ children }) {
  // Définition de l'état isJamActive avec useState
  const [isJamActive, setIsJamActive] = useState(false);  // Initialisation de l'état à false

  useEffect(() => {
    if (!socket?.connected) {
      socket.connect();
    }

    // Vérifie si la session Jam est active
    const jamSessionId = localStorage.getItem('jamSessionId');
    setIsJamActive(!!jamSessionId);  // Met à jour l'état avec setIsJamActive

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <StoreProvider>
      <html
        lang="en"
        className="dark"
      >
        <Head>
          <meta
            name="apple-mobile-web-app-title"
            content="Spotify"
          />
          <title>Spotify</title>
          <link
            rel="icon"
            href="/spotify_logo.png"
          />
          <meta
            name="description"
            content="Generated by create next app"
          />
        </Head>
        <body
          className={`h-screen ${inter.className} overflow-x-hidden flex flex-col dark:bg-black`}
        >
          <Header />
          <div className="flex gap-4 flex-1">
            {/* Sidebar avec position sticky */}
            <div className="sticky top-0 flex-shrink-0">
              <SideBar />
            </div>
            <main className="flex-1 overflow-y-auto max-h-screen">
              {' '}
              {/* Contenu principal avec overflow vertical */}
              {children}
            </main>
            {isJamActive && (
              <div className="sticky top-0 flex-shrink-0">
                <Jam socket={socket} />
              </div>
            )}
          </div>
          <AudioPlayer socket={socket} />
        </body>
      </html>
    </StoreProvider>
  );
}
