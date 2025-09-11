import React from 'react'
import '../styles.css'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata = {
  description: 'Login page for LMS Ndaru',
  title: 'Login Page | LMS Ndaru',
}

export default async function LoginLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <div>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </div>
  )
}
