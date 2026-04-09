import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import PageTransition from '@/components/PageTransition'

export const metadata: Metadata = {
  title: 'Jean Kwak Architects',
  description: 'Jean Kwak Architects',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <Navigation />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
