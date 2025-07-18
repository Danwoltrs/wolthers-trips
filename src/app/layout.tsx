import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/variables.css'
import '../styles/globals.css'
import '../styles/components.css'
import '../styles/utilities.css'
import { ThemeProvider } from '../components/theme-provider'
import AuthSessionProvider from '../components/session-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wolthers & Associates Travel Management',
  description: 'A comprehensive travel itinerary management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthSessionProvider>
          <ThemeProvider
            defaultTheme="system"
            storageKey="wolthers-travel-theme"
          >
            {children}
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}