import type { CollectionConfig, Access, Where } from 'payload'

const readAccess: Access = ({ req }) => {
  // Super admin can read all users
  if (req.user?.collection === 'users' && req.user?.role === 'super-admin') {
    return true
  }

  // Tenant admin can only read themselves and other admins in their tenant
  if (req.user?.collection === 'users' && req.user?.role === 'tenant-admin' && req.user?.id) {
    const tenantId = typeof req.user.tenant === 'object' ? req.user.tenant?.id : req.user.tenant

    if (!tenantId) {
      return { id: { equals: req.user.id } } as Where // Fallback: only self
    }

    return {
      or: [
        { id: { equals: req.user.id } }, // Own record
        {
          tenant: { equals: tenantId },
          role: { equals: 'tenant-admin' },
        }, // Same tenant admins
      ],
    } as Where
  }

  return false
}

const updateAccess: Access = ({ req }) => {
  // Super admin can update all users
  if (req.user?.collection === 'users' && req.user?.role === 'super-admin') {
    return true
  }

  // Tenant admin can only update their own record (limited fields)
  if (req.user?.collection === 'users' && req.user?.role === 'tenant-admin' && req.user?.id) {
    return {
      id: { equals: req.user.id },
    } as Where
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
    tokenExpiration: 7200, // 2 hours
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10 minutes
  },
  access: {
    // Only super-admins can create new admin users manually
    // Or auto-created when customer creates tenant
    create: ({ req }) => {
      return req.user?.collection === 'users' && req.user?.role === 'super-admin'
    },
    read: readAccess,
    update: updateAccess,
    delete: ({ req }) => {
      // Only super admin can delete admin users
      return req.user?.collection === 'users' && req.user?.role === 'super-admin'
    },
    admin: ({ req }) => {
      // Both super-admin and tenant-admin can access admin panel
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
        // Only super admin can change roles
        update: ({ req }) => req.user?.collection === 'users' && req.user?.role === 'super-admin',
      }
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: false, // Super admin doesn't need tenant
      admin: {
        description: 'Tenant assignment (only for tenant-admin role)',
        position: 'sidebar',
        condition: (data) => data?.role === 'tenant-admin', // Only show for tenant-admin
      },
      validate: (value: unknown, { data }: { data: Record<string, unknown> }) => {
        // Tenant required for tenant-admin
        if (data?.role === 'tenant-admin' && !value) {
          return 'Tenant is required for tenant-admin role'
        }
        // Super admin shouldn't have tenant
        if (data?.role === 'super-admin' && value) {
          return 'Super admin should not be assigned to a tenant'
        }
        return true
      },
      access: {
        // Only super admin can change tenant assignment
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
        // Only super admin can activate/deactivate
        update: ({ req }) => req.user?.collection === 'users' && req.user?.role === 'super-admin',
      }
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Ensure super-admin doesn't have tenant
        if (data?.role === 'super-admin') {
          data.tenant = null
        }
        return data
      }
    ]
  },
  timestamps: true,
}