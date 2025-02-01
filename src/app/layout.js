import { Inter } from 'next/font/google';
import './globals.css';
import SideBar from '@/components/partials/Sidebar';
import Jam from '@/components/partials/Jam';
import Header from '@/components/partials/Header';
import Head from 'next/head';
import StoreProvider from './StoreProvider';
import AudioPlayer from '@/components/partials/AudioPlayer';
const inter = Inter({
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
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
          <description>Generated by create next app</description>
        </Head>
        <body
          className={`h-screen ${inter.className} overflow-x-hidden  flex flex-col dark:bg-black`}
        >
          <Header />
          <div className="flex gap-2 flex-1">
            <SideBar />
            <main className="flex overflow-y-auto">
              {children}
              <Jam />
            </main>
          </div>
          <AudioPlayer />
        </body>
      </html>
    </StoreProvider>
  );
}
