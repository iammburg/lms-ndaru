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
  tenant?: number | null
}

export interface SignupResponse {
  success: boolean
  error?: string
}

// type Response = {
//   exp?: number
//   token?: string
//   user?: Customer
// }

export async function signup({ email, password }: SignupParams): Promise<SignupResponse> {
  const payload = await getPayload({ config })

  try {
    const tenantId = await detectTenantFromDomain()

    const customerData: SignupParams = {
      email,
      password,
    }

    if (tenantId) {
      customerData.tenant = parseInt(tenantId)
    } else {
      customerData.tenant = null
    }

    console.log('Creating customer with data:', customerData)
    console.log('type of Tenant ID:', typeof customerData.tenant)

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
      const cookieStore = await cookies()
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
