import type { CollectionConfig, Access, Where } from 'payload'

const readAccess: Access = ({ req }) => {
  if (req.user?.collection === 'users' && (req.user as any).role === 'super-admin') {
    return true
  }

  if (req.user?.collection === 'users' && (req.user as any).role === 'tenant-admin') {
    const userTenant = (req.user as any).tenant
    const tenantId = typeof userTenant === 'object' ? userTenant?.id : userTenant

    if (!tenantId) {
      return false
    }

    const whereClause = {
      tenant: { equals: tenantId },
    }
    return whereClause
  }

  if (req.user?.collection === 'customers' && req.user?.id) {
    const whereClause = {
      id: { equals: req.user.id },
    }
    return whereClause
  }

  return false
}

const updateAccess: Access = ({ req }) => {
  if (req.user?.collection === 'users' && req.user?.role === 'super-admin') {
    return true
  }

  if (req.user?.collection === 'users' && req.user?.role === 'tenant-admin') {
    const tenantId = typeof req.user.tenant === 'object' ? req.user.tenant?.id : req.user.tenant

    if (!tenantId) {
      return false
    }

    return {
      tenant: { equals: tenantId },
    } as Where
  }

  if (req.user?.collection === 'customers' && req.user?.id) {
    return {
      id: { equals: req.user.id },
    } as Where
  }

  return false
}

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    group: 'User Management',
    defaultColumns: ['email', 'tenant', 'createdAt'],
  },
  access: {
    create: () => true,
    read: readAccess,
    update: updateAccess,
    delete: ({ req }) => {
      return req.user?.collection === 'users' && (req.user as any).role === 'super-admin'
    },
  },
  auth: true,
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: false,
      admin: {
        description: 'Tenant assignment (optional for main app users)',
        position: 'sidebar',
      },
      access: {
        update: ({ req }) => req.user?.collection === 'users',
      }
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && !data.tenant) {
          try {
            const { detectTenantFromDomain } = await import('../lib/tenant')
            const tenantId = await detectTenantFromDomain()
            if (tenantId) {
              data.tenant = tenantId
            }
          } catch (error) {
            console.error('Error auto-assigning tenant:', error)
          }
        }
        return data
      }
    ],
    afterRead: [
      async ({ doc, req }) => {
        return doc
      }
    ]
  },
}
