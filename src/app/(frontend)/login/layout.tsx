import React from 'react'
import { montserrat } from '../fonts'
import '../styles.css'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template Ygy',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={`${montserrat.variable}`} suppressHydrationWarning>
      <body className={montserrat.className}>
        <main>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </main>
      </body>
    </html>
  )
}
