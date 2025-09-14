import React from 'react'
import '../styles.css'
import { ThemeProvider } from '@/components/theme-provider'
import { getUser } from '../(authenticated)/_actions/getUser'
import { redirect } from 'next/navigation'

export const metadata = {
  description: 'Signup page for LMS Ndaru',
  title: 'Signup Page - LMS Ndaru',
}

export default async function SignupLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const user = await getUser()
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </div>
  )
}
