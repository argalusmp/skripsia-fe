import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/lib/auth'
import { ThemeProvider } from '@/lib/theme'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkripsiA - AI Chat Interface',
  description: 'A modern AI chat interface for your thesis project',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          defaultTheme="system"
          enableSystem
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}