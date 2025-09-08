import React from 'react'
import { montserrat } from '../fonts'
import './styles.css'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <body className={montserrat.className}>
        <main>{children}</main>
      </body>
    </html>
  )
}
