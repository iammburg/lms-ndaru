import React from 'react'
import './styles.css'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata = {
  description:
    'Welcome to LMS Ndaru, your comprehensive learning management system designed to enhance educational experiences through seamless course management, interactive learning tools, and robust analytics.  ',
  title: 'LMS Ndaru - Learning Management System for Modern Education',
}

export default async function FrontendLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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
