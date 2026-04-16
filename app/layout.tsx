import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import SiteTransition from '@/components/SiteTransition'
import { GridOverlay } from '@/components/GridOverlay'

export const metadata: Metadata = {
  title: 'Jean Kwak Architects',
  description: 'Jean Kwak Architects',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
      </head>
      <body className="h-full">
        <SiteTransition navigation={<Navigation />}>
          {children}
        </SiteTransition>
        <GridOverlay />
      </body>
    </html>
  )
}
