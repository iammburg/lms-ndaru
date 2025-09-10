'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { Customer } from '@/payload-types'
import { Result } from '../../login/actions/login'
import { cookies } from 'next/headers'
import { a } from 'vitest/dist/chunks/suite.d.FvehnV49.js'

interface SignupParams {
  email: string
  password: string
}

export interface SignupResponse {
  success: boolean
  error?: string
}

type Response = {
  exp?: number
  token?: string
  user?: Customer
}

export async function signup({ email, password }: SignupParams): Promise<SignupResponse> {
  const payload = await getPayload({ config })

  try {
    await payload.create({
      collection: 'customers',
      data: {
        email,
        password,
      },
    })
    const result: Result = await payload.login({
      collection: 'customers',
      data: {
        email,
        password,
      },
    })

    if (result.token) {
      let cookieStore = await cookies()
      cookieStore.set({
        name: 'payload-token',
        value: result.token,
        httpOnly: true,
        path: '/',
      })
      return { success: true }
    } else {
      return { success: false, error: 'Login failed' }
    }
  } catch (error) {
    return { success: false, error: 'Sign up failed' }
  }
}
