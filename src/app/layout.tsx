import './globals.css'
import type { Metadata } from 'next'
import { Ysabeau } from 'next/font/google'
import NextAuthSessionProvider from './provider/sessionProvider'
import Navbar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'
import { defaultMetadata } from '@/lib/seo'
import { Analytics } from "@vercel/analytics/next"
import ClientExitIntentNote from '@/components/ClientExitIntentNote'

const ysabeau = Ysabeau({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = defaultMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={ysabeau.variable}>
      <body className="font-sans bg-[color:var(--bg)] text-[color:var(--ink)]">
        <NextAuthSessionProvider>
          <div className="flex flex-col min-h-screen">
            {/* Toaster for notifications */}
            <Toaster position="top-center" />

            {/* Navigation */}
            <header className="bg-[color:var(--surface)] border-b border-gray-200 shadow-sm sticky top-0 z-30">
              <Navbar />
            </header>

            {/* Main Content */}
            <main className="flex-grow">
              {children}
              <Analytics />
            </main>

            {/* Bottom Call-To-Actions */}
            {/* <section className="bg-[#fef5e7] text-white py-10">
              <div className="shrine-container max-w-7xl mx-auto grid gap-6 md:grid-cols-3 text-center">
                
                <div className="bg-[#A31D6B] hover:bg-[#73114A] transition-colors rounded-xl shadow-lg p-6">
                  <h4 className="text-lg md:text-xl font-semibold mb-2">Support the Mission</h4>
                  <p className="text-[#FDF5A6] mb-4 text-base md:text-base">Make a Divine Donation</p>
                  <a
                    href="#"
                    className="inline-block px-5 py-2 bg-[#FDF5A6] text-[#8A1457] rounded-md font-medium hover:bg-[color:var(--surface)] transition-all"
                  >
                    Donate Now
                  </a>
                </div>

                <div className="bg-[#A31D6B] hover:bg-[#73114A] transition-colors rounded-xl shadow-lg p-6">
                  <h4 className="text-lg md:text-xl font-semibold mb-2">Join Our Events</h4>
                  <p className="text-[#FDF5A6] mb-4 text-base md:text-base">Register for Upcoming Sessions</p>
                  <a
                    href="/register-event"
                    className="inline-block px-5 py-2 bg-[#FDF5A6] text-[#8A1457] rounded-md font-medium hover:bg-[color:var(--surface)] transition-all"
                  >
                    Register Now
                  </a>
                </div>

                <div className="bg-[#A31D6B] hover:bg-[#73114A] transition-colors rounded-xl shadow-lg p-6">
                  <h4 className="text-lg md:text-xl font-semibold mb-2">Need a Receipt?</h4>
                  <p className="text-[#FDF5A6] mb-4 text-base md:text-base">Download Your Contribution Record</p>
                  <a
                    href="/download-receipt"
                    className="inline-block px-5 py-2 bg-[#FDF5A6] text-[#8A1457] rounded-md font-medium hover:bg-[color:var(--surface)] transition-all"
                  >
                    Get Receipt
                  </a>
                </div>

              </div>
            </section> */}

            {/* Footer */}
            <Footer />
          </div>
        </NextAuthSessionProvider>
        <ClientExitIntentNote />
      </body>
    </html>
  )
}
