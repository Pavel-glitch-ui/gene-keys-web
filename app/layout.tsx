import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { TelegramProvider } from '@/src/shared/lib/telegram';
import { AppStateProvider } from '@/src/_app/providers/AppStateProvider';
import { AppShell } from '@/src/_app/ui/AppShell';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-cormorant',
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Тень — пространство глубинной диагностики',
  description: 'Пространство самопознания: четыре авторских исследования, хологенетический профиль, персональный разбор и план практик на четыре недели.',
  icons: {
    icon: [
      { url: '/icon.png', sizes: '528x528', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <TelegramProvider>
          <AppStateProvider>
            <AppShell>{children}</AppShell>
          </AppStateProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}
