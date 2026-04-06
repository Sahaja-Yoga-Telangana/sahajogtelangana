import './globals.css'
import type { Metadata } from 'next'
import { Noto_Sans_Telugu, Ysabeau } from 'next/font/google'
import NextAuthSessionProvider from './provider/sessionProvider'
import LocaleProvider from './provider/localeProvider'
import Navbar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'
import { defaultMetadata } from '@/lib/seo'
import { Analytics } from "@vercel/analytics/next"
import ClientExitIntentNote from '@/components/ClientExitIntentNote'
import { getRequestLocale } from '@/lib/serverLocale'

const ysabeau = Ysabeau({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const notoSansTelugu = Noto_Sans_Telugu({
  subsets: ['telugu'],
  variable: '--font-telugu',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = defaultMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = getRequestLocale();

  return (
    <html lang={locale} className={`${ysabeau.variable} ${notoSansTelugu.variable}`}>
      <body className="font-sans bg-[color:var(--bg)] text-[color:var(--ink)]">
        <LocaleProvider initialLocale={locale}>
          <NextAuthSessionProvider>
            <div className="flex flex-col min-h-screen">
              <Toaster position="top-center" />

              <header className="bg-[color:var(--surface)] border-b border-gray-200 shadow-sm sticky top-0 z-30">
                <Navbar />
              </header>

              <main className="flex-grow">
                {children}
                <Analytics />
              </main>

              <Footer />
            </div>
          </NextAuthSessionProvider>
        </LocaleProvider>
        <ClientExitIntentNote />
      </body>
    </html>
  )
}
