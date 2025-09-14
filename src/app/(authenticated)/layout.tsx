import { redirect } from 'next/navigation'
import React, { FC, ReactNode } from 'react'
import { getUser } from './actions/getUser'
import '../styles.css'
import NavbarDasboard from './components/NavbarDashboard'

interface LayoutProps {
  children: ReactNode
}

const AuthenticatedLayout: FC<LayoutProps> = async ({ children }) => {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <main className="authenticated-layout">
      <NavbarDasboard />
      {children}
    </main>
  )
}

export default AuthenticatedLayout
