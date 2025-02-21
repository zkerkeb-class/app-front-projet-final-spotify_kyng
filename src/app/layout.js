'use client';

import './globals.css';
import Head from 'next/head';
import SideBar from '@/components/partials/Sidebar';
import Jam from '@/components/partials/Jam';
import Header from '@/components/partials/Header';
import StoreProvider from './StoreProvider';
import AudioPlayer from '@/components/partials/AudioPlayer';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import '../lib/i18n';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  autoConnect: false,
});

export default function RootLayout({ children }) {
  const { i18n } = useTranslation();
  const [isJamActive, setIsJamActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem('lang');
    if (storedLang) {
      i18n.changeLanguage(storedLang);
    } else {
      i18n.changeLanguage('fr');
    }

    if (!socket?.connected) {
      socket.connect();
    }

    const jamSessionId = localStorage.getItem('jamSessionId');
    setIsJamActive(!!jamSessionId);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [i18n]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <StoreProvider>
      <html
        lang="fr"
        className="dark"
      >
        <Head>
          <meta
            name="apple-mobile-web-app-title"
            content="Spotify"
          />
          <meta
            name="description"
            content="Generated by create next app"
          />
          <meta
            name="theme-color"
            content="#ffffff"
          />
          <link
            rel="manifest"
            href="/manifest.json"
          />
          <link
            rel="icon"
            href="/spotify_logo.png"
          />
          <title>Spotify</title>
        </Head>
        <body className={`h-screen overflow-x-hidden flex flex-col dark:bg-black`}>
          <Header
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />

          {isJamActive && (
            <div className="block lg:hidden w-full bg-white dark:bg-black">
              <Jam socket={socket} />
            </div>
          )}

          <div className="flex flex-1 h-full relative">
            <aside
              className={`fixed inset-y-0 left-0 transform transition-transform duration-300 lg:static lg:w-64 z-50 bg-zinc dark:bg-black py-6 px-5
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
            >
              <SideBar
                isSidebarOpen={isSidebarOpen}
                closeSidebar={closeSidebar}
              />
            </aside>

            <main className="flex-1 p-4 mx-auto overflow-y-auto lg:max-h-screen transition-all duration-300">
              <div className="flex flex-col h-full">{children}</div>
            </main>

            {isJamActive && (
              <aside className="hidden lg:block fixed inset-y-0 right-0 w-72 transform transition-transform duration-300 lg:static bg-zinc-800 dark:bg-black">
                <Jam socket={socket} />
              </aside>
            )}
          </div>

          <AudioPlayer socket={socket} />
        </body>
      </html>
    </StoreProvider>
  );
}
