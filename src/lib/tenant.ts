import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'

/**
 * Detect tenant based on the current request domain
 * Returns null for main app, tenant ID for tenant subdomains
 */
export async function detectTenantFromDomain(): Promise<string | null> {
    try {
        const headersList = await headers()
        const host = headersList.get('host') || headersList.get('x-forwarded-host')

        console.log('[Tenant Detection] Host from headers:', host)

        if (!host) {
            console.log('[Tenant Detection] No host header found')
            return null
        }

        const mainDomains = [
            'bibubelajar.com',
            'www.bibubelajar.com',
            'localhost:3000',
            'localhost'
        ]

        if (mainDomains.includes(host)) {
            console.log('[Tenant Detection] Main app domain detected:', host)
            return null
        }

        if (host.includes('.bibubelajar.com')) {
            const subdomain = host.split('.')[0]
            console.log('[Tenant Detection] Subdomain extracted:', subdomain)

            if (subdomain === 'www') {
                console.log('[Tenant Detection] Skipping www subdomain')
                return null
            }

            const payload = await getPayload({ config })

            const tenantBySlug = await payload.find({
                collection: 'tenants',
                where: {
                    slug: {
                        equals: subdomain
                    }
                },
                limit: 1,
            })

            if (tenantBySlug.docs.length > 0) {
                const tenantId = String(tenantBySlug.docs[0].id)
                console.log('[Tenant Detection] Tenant found! ID:', tenantId, 'Name:', tenantBySlug.docs[0].name)
                return tenantId
            } else {
                console.log('[Tenant Detection] No tenant found with slug:', subdomain)
            }
        } else {
            console.log('[Tenant Detection] Host does not match subdomain pattern:', host)
        }

        return null
    } catch (error) {
        console.error('[Tenant Detection] Error:', error)
        return null
    }
}

/**
 * Get tenant context for the current request
 */
export async function getTenantContext() {
    const tenantId = await detectTenantFromDomain()

    if (!tenantId) {
        return {
            isMainApp: true,
            tenantId: null,
            tenant: null
        }
    }

    try {
        const payload = await getPayload({ config })
        const tenant = await payload.findByID({
            collection: 'tenants',
            id: tenantId,
        })

        return {
            isMainApp: false,
            tenantId,
            tenant
        }
    } catch (error) {
        console.error('Error getting tenant context:', error)
        return {
            isMainApp: true,
            tenantId: null,
            tenant: null
        }
    }
}