// app/not-found.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export default function GlobalNotFound() {
  return (
    <html lang="en" className={inter.className}>
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        
        <main className="flex flex-col flex-grow items-center justify-center text-center px-4">
          <h1 className="text-5xl font-bold text-indigo-600 mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Oups 😢 La page que vous recherchez n’existe pas ou a été déplacée.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-500 transition-colors"
          >
            Retour à l’accueil
          </a>
        </main>
        
      </body>
    </html>
  )
}

