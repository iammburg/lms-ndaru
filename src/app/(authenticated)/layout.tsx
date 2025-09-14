import { redirect } from 'next/navigation'
import React, { FC, ReactNode } from 'react'
import { getUser } from './actions/getUser'
import './styles.css'
import { montserrat } from '@/lib/fonts'
import { ThemeProvider } from '@/components/theme-provider'
import NavbarDasboard from './components/NavbarDashboard'

export const metadata = {
  description:
    'Welcome to LMS Ndaru, your comprehensive learning management system designed to enhance educational experiences through seamless course management, interactive learning tools, and robust analytics.  ',
  title: 'LMS Ndaru - Learning Management System for Modern Education',
  icons: {
    icon: '/assets/icon.ico',
  },
}

interface LayoutProps {
  children: ReactNode
}

const AuthenticatedLayout: FC<LayoutProps> = async ({ children }) => {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.className}`}>
        <main className="authenticated-layout">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavbarDasboard />
            {children}
          </ThemeProvider>
        </main>
      </body>
    </html>
  )
}

export default AuthenticatedLayout
