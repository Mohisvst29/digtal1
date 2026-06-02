import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ContentProvider } from '@/components/ContentProvider';
import ScrollReveal from '@/components/ScrollReveal';

const ibmPlex = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ديجيتال هيلث | وكالة تسويق رقمي طبي متكامل في الرياض',
  description: 'وكالة تسويق رقمي طبي متخصصة في الرياض. نساعد الأطباء، العيادات، والمستشفيات على جذب المرضى وزيادة الحجوزات من خلال استراتيجيات تسويق طبية.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${ibmPlex.variable} ${jakarta.variable} h-full`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />
      </head>
      <body className="min-h-full flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-900">
        <ContentProvider>
          <ScrollReveal />
          {children}
        </ContentProvider>
      </body>
    </html>
  );
}
