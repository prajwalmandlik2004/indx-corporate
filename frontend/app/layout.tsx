import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/src/components/Navbar'
import Footer from '@/src/components/Footer'
import { Toaster } from 'react-hot-toast';
import ScrollToTop from '@/src/components/ScrollTop'
import SiteLocker from '@/src/components/SiteLocker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'INDX - Intercognitive Reasearch',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SiteLocker>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <Navbar />
            <main className="flex-grow">
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                  },
                }}
              />
            </main>
            <Footer />
            <ScrollToTop />
          </div>
        </SiteLocker>
      </body>
    </html>
  )
}