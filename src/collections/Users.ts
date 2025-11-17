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

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'User Management',
    defaultColumns: ['email', 'role', 'tenant', 'createdAt'],
    description: 'Admin users (Super Admins and Tenant Admins)',
  },
  auth: {
    tokenExpiration: 7200,
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600 * 1000,
  },
  access: {
    create: ({ req }) => {
      return req.user?.collection === 'users' && req.user?.role === 'super-admin'
    },
    read: readAccess,
    update: updateAccess,
    delete: ({ req }) => {
      return req.user?.collection === 'users' && req.user?.role === 'super-admin'
    },
    admin: ({ req }) => {
      return req.user?.collection === 'users' &&
        (req.user?.role === 'super-admin' || req.user?.role === 'tenant-admin')
    }
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'tenant-admin',
      options: [
        {
          label: 'Super Admin',
          value: 'super-admin',
        },
        {
          label: 'Tenant Admin',
          value: 'tenant-admin',
        },
      ],
      admin: {
        description: 'Super Admin: Full access to all tenants. Tenant Admin: Access only to assigned tenant.',
        position: 'sidebar',
      },
      access: {
        update: ({ req }) => req.user?.collection === 'users' && req.user?.role === 'super-admin',
      }
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: false,
      admin: {
        description: 'Tenant assignment (only for tenant-admin role)',
        position: 'sidebar',
        condition: (data) => data?.role === 'tenant-admin',
      },
      validate: (value: unknown, { data }: { data: Record<string, unknown> }) => {
        if (data?.role === 'tenant-admin' && !value) {
          return 'Tenant is required for tenant-admin role'
        }
        if (data?.role === 'super-admin' && value) {
          return 'Super admin should not be assigned to a tenant'
        }
        return true
      },
      access: {
        update: ({ req }) => req.user?.collection === 'users' && req.user?.role === 'super-admin',
      }
    },
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      admin: {
        description: 'Full name of the admin user',
      }
    },
    {
      name: 'isActive',
      type: 'checkbox',
      required: true,
      defaultValue: true,
      admin: {
        description: 'Whether this admin account is active',
        position: 'sidebar',
      },
      access: {
        update: ({ req }) => req.user?.collection === 'users' && req.user?.role === 'super-admin',
      }
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data?.role === 'super-admin') {
          data.tenant = null
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
  timestamps: true,
}