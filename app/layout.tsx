import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import SiteTransition from '@/components/SiteTransition'

export const metadata: Metadata = {
  title: 'Jean Kwak Architects',
  description: 'Jean Kwak Architects',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <SiteTransition navigation={<Navigation />}>
          {children}
        </SiteTransition>
      </body>
    </html>
  )
}
