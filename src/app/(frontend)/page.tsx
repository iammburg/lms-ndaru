import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <div>
      {!user && <h1 className="text-3xl font-bold text-blue-800">Welcome to your new project.</h1>}
      {user && <h1 className="text-2xl font-bold text-blue-800">Welcome back, {user.email}</h1>}
    </div>
  )
}
