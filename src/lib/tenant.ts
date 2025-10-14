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

        if (!host) {
            return null
        }

        // Main app domains - no tenant
        const mainDomains = [
            'bibubelajar.com',
            'www.bibubelajar.com',
            'localhost:3000',
            'localhost'
        ]

        if (mainDomains.includes(host)) {
            return null
        }

        // Check for subdomain pattern (tenant.bibubelajar.com)
        if (host.includes('.bibubelajar.com')) {
            const subdomain = host.split('.')[0]

            // Skip 'www' subdomain
            if (subdomain === 'www') {
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
                return String(tenantBySlug.docs[0].id)
            }
        }

        return null
    } catch (error) {
        console.error('Error detecting tenant from domain:', error)
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