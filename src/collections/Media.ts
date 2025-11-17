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

  if (req.user?.collection === 'customers') {
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

  if (req.user?.collection === 'customers') {
    const tenantId = typeof req.user.tenant === 'object' ? req.user.tenant?.id : req.user.tenant

    if (!tenantId) {
      return false
    }

    return {
      tenant: { equals: tenantId },
    } as Where
  }

  return false
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Media Management',
  },
  access: {
    create: () => true,
    read: readAccess,
    update: updateAccess,
    delete: ({ req }) => {
      return req.user?.collection === 'users' && (req.user as any).role === 'super-admin'
    },
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: false,
      admin: {
        description: 'Tenant this media belongs to (optional for super-admin)',
        position: 'sidebar',
      },
      access: {
        update: ({ req }) => req.user?.collection === 'users',
      }
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && !data.tenant && req.user) {
          const user = req.user as any
          if (!(user.collection === 'users' && user.role === 'super-admin')) {
            const tenantId = typeof user.tenant === 'object' ? user.tenant?.id : user.tenant
            if (tenantId) {
              data.tenant = tenantId
            }
          }
        }
        return data
      }
    ]
  },
}
