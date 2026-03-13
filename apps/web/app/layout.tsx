import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoTrack AI — Huella de Carbono para Negocios',
  description:
    'Calcula la huella de carbono de tu negocio en segundos usando lenguaje natural. ' +
    'Recibe análisis detallados y recomendaciones accionables impulsadas por IA.',
  keywords: ['huella de carbono', 'CO2', 'sostenibilidad', 'negocios', 'IA'],
  authors: [{ name: 'EcoTrack AI Team' }],
  openGraph: {
    title: 'EcoTrack AI',
    description: 'Mide tu huella de carbono con IA',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            classNames: {
              toast: 'font-sans',
            },
          }}
        />
      </body>
    </html>
  )
}
