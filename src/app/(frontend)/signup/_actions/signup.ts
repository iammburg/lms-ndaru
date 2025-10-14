'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { Customer } from '@/payload-types'
import { Result } from '../../login/_actions/login'
import { cookies } from 'next/headers'
import { detectTenantFromDomain } from '@/lib/tenant'

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
    // Detect tenant from current domain
    const tenantId = await detectTenantFromDomain()

    // Prepare customer data
    const customerData: any = {
      email,
      password,
    }

    // Add tenant if detected (for tenant domains)
    if (tenantId) {
      customerData.tenant = tenantId
    }

    await payload.create({
      collection: 'customers',
      data: customerData,
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
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}
