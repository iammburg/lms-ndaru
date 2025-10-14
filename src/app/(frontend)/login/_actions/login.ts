'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import { Customer } from '@/payload-types'
import { detectTenantFromDomain } from '@/lib/tenant'

interface LoginParams {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  error?: string
}

export type Result = {
  exp?: number
  token?: string
  user?: Customer
}

export async function login({ email, password }: LoginParams): Promise<LoginResponse> {
  const payload = await getPayload({ config })
  try {
    // Get current tenant context
    const currentTenantId = await detectTenantFromDomain()

    const result: Result = await payload.login({
      collection: 'customers',
      data: {
        email,
        password,
      },
    })

    if (result.token && result.user) {
      // Validate tenant access
      if (currentTenantId) {
        // User is trying to login to a tenant domain
        const userTenant = typeof result.user.tenant === 'object'
          ? result.user.tenant?.id
          : result.user.tenant

        if (String(userTenant) !== currentTenantId) {
          return {
            success: false,
            error: 'You don\'t have access to this tenant. Please contact your administrator.'
          }
        }
      }
      // For main app (no tenant), allow login regardless of user's tenant

      const cookieStore = await cookies()
      cookieStore.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      })

      return { success: true }
    } else {
      return { success: false, error: 'Invalid email or password' }
    }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Login failed. Please check your credentials and try again.' }
  }
}
