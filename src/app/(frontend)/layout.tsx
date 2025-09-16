import React from 'react'
import { montserrat } from '@/lib/fonts'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata = {
  description:
    'Welcome to LMS Ndaru, your comprehensive learning management system designed to enhance educational experiences through seamless course management, interactive learning tools, and robust analytics.',
  title: 'LMS Ndaru - Learning Management System for Modern Education',
  icons: {
    icon: '/assets/icon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={montserrat.className}>
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
