import React from 'react'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata = {
  description: 'LMS Ndaru - Learning Management System',
  title: 'LMS Ndaru',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
