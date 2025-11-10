'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { getUser } from './getUser'

interface CreateTenantData {
    name: string
    slug: string
    description?: string
    contactEmail?: string
    adminEmail?: string
    adminPassword?: string
    adminName?: string
}

export async function createTenant(data: CreateTenantData) {
    const payload = await getPayload({ config })
    const user = await getUser()

    if (!user) {
        throw new Error('You must be logged in to create a tenant')
    }

    try {
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
                    maxUsers: 100,
                }
            },
        })

        console.log(`Tenant "${tenant.name}" created successfully with ID: ${tenant.id}`)

        try {
            const adminUser = await payload.create({
                collection: 'users',
                data: {
                    email: data.adminEmail || user.email,
                    password: data.adminPassword || `${data.slug}Admin123!`,
                    name: data.adminName || `${data.name} Admin`,
                    role: 'tenant-admin',
                    tenant: tenant.id,
                    isActive: true,
                },
                overrideAccess: true, // Bypass access control for auto-creation
            })

            console.log(`Tenant admin created: ${adminUser.email} for tenant: ${tenant.name}`)

            return {
                tenant,
                adminUser: {
                    email: adminUser.email,
                    defaultPassword: data.adminPassword || `${data.slug}Admin123!`,
                },
                subdomainUrl: `https://${tenant.slug}.bibubelajar.com`,
                adminPanelUrl: `https://${tenant.slug}.bibubelajar.com/admin`,
            }
        } catch (adminError) {
            console.error('Error creating tenant admin:', adminError)

            // Tenant created but admin failed - still return success
            return {
                tenant,
                adminUser: null,
                subdomainUrl: `https://${tenant.slug}.bibubelajar.com`,
                adminPanelUrl: `https://${tenant.slug}.bibubelajar.com/admin`,
                warning: 'Tenant created but admin user creation failed. Please create admin manually.',
            }
        }
    } catch (error) {
        console.error('Error creating tenant:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to create tenant')
    }
}
