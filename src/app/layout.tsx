import NavBar from '@/app/components/nav-bar/nav-bar'
import { ReactQueryClientProvider } from '@/app/components/react-query-client-provider'
import { createTheme, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/dropzone/styles.css'
import { Notifications } from '@mantine/notifications'
import '@mantine/notifications/styles.css'
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const theme = createTheme({})

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '輸送 - Yusou',
  description: '輸送 - Yusou. Effortless, Reliable, and Secure Cross-Platform File Sharing 🚚',
  authors: [{ name: 'iuuukhueeee', url: 'https://iuuukhueeee.github.io' }],
  creator: 'iuuukhueeee',
  publisher: 'iuuukhueeee',
  keywords: ['Sharing', 'Dropzone', 'Drag and drop'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReactQueryClientProvider>
          <MantineProvider theme={theme}>
            <Notifications />
            <NavBar />
            {children}
            <Analytics />
          </MantineProvider>
        </ReactQueryClientProvider>
      </body>
      <Script defer src="/stats/script.js" data-website-id="185eb7e0-e507-4fd1-9fb6-f37de3c53a6d" />
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" defer async />
    </html>
  )
}
