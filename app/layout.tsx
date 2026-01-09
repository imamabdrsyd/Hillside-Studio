import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hillside Studio - Finance',
  description: 'Financial management system for Hillside Studio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="font-sans bg-gray-50 text-gray-800 min-h-screen">
        {children}
      </body>
    </html>
  )
}
