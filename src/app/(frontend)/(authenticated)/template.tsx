import { redirect } from 'next/navigation'
import React, { FC, ReactNode } from 'react'
import { getUser } from './_actions/getUser'
import '../styles.css'
import NavbarDashboard from './_components/NavbarDashboard'

interface TemplateProps {
  children: ReactNode
}

const Template: FC<TemplateProps> = async ({ children }) => {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <main>
      <NavbarDashboard />
      {children}
    </main>
  )
}

export default Template
