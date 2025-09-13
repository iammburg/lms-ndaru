import { redirect } from 'next/navigation'
import React, { FC, ReactNode } from 'react'
import { getUser } from './actions/getUser'
import './styles.css'
import { ThemeProvider } from '@/components/theme-provider'

interface LayoutProps {
  children: ReactNode
}

const AuthenticatedLayout: FC<LayoutProps> = async ({ children }) => {
  const user = await getUser()
  if (!user) {
    redirect('/login')
    return null
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <main className="authenticated-layout">
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

export default AuthenticatedLayout
