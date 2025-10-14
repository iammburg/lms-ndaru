'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { getUser } from './getUser'

interface CreateTenantData {
    name: string
    slug: string
    description?: string
    contactEmail?: string
}

export async function createTenant(data: CreateTenantData) {
    const payload = await getPayload({ config })
    const user = await getUser()

    if (!user) {
        throw new Error('You must be logged in to create a tenant')
    }

    // Only customers can create tenants via self-service
    if (user.collection !== 'customers') {
        throw new Error('Only customers can create tenants via self-service')
    }

    try {
        // Check if slug is already taken
        const existingTenant = await payload.find({
            collection: 'tenants',
            where: {
                slug: { equals: data.slug }
            },
            limit: 1,
        })

        if (existingTenant.docs.length > 0) {
            throw new Error('Subdomain is already taken. Please choose a different one.')
        }

        // Create the tenant
        const tenant = await payload.create({
            collection: 'tenants',
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                contactEmail: data.contactEmail || user.email,
                status: 'active',
                createdBy: user.id,
                settings: {
                    maxUsers: 50, // Default for self-service
                }
            },
        })

        console.log(`Tenant "${tenant.name}" created successfully`)

        return {
            tenant,
            subdomainUrl: `https://${tenant.slug}.bibubelajar.com`,
        }
    } catch (error) {
        console.error('Error creating tenant:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to create tenant')
    }
}
