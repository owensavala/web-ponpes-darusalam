import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Amiri } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Pondok Pesantren Darussalam Bacan',
    default: 'Pondok Pesantren Darussalam Bacan - Portal Resmi Multi-Unit & PSB Online',
  },
  description:
    'Portal Resmi Yayasan Darussalam Bacan (Ponpes Darussalam Kupal) di Kabupaten Halmahera Selatan, Maluku Utara. Menaungi Pondok Tahfizh, MTs, SMP Tahfizh, MA, dan PKBM.',
  keywords: [
    'Pondok Pesantren Darussalam Bacan',
    'Ponpes Darussalam Kupal',
    'SMP Tahfizh Darusalam Bacan',
    'Yayasan Darussalam Bacan',
    'Halmahera Selatan',
    'PSB Online Bacan',
    'Pesantren Maluku Utara',
    'KH Asep Sofyan',
  ],
  authors: [{ name: 'Yayasan Darussalam Bacan' }],
  openGraph: {
    title: 'Pondok Pesantren Darussalam Bacan',
    description: "Mencetak Generasi Qur'ani, Berilmu, dan Berwawasan Global di Bumi Saruma Halmahera Selatan.",
    type: 'website',
    locale: 'id_ID',
    siteName: 'Pondok Pesantren Darussalam Bacan',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} ${amiri.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FAF8F2] text-[#0F2A24] antialiased selection:bg-[#D8C28A]/30 selection:text-[#0F2A24]">
        {children}
      </body>
    </html>
  );
}
