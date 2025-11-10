import type { CollectionConfig, Access, Where } from 'payload'

const readAccess: Access = ({ req }) => {
  // Super admin can read all customers
  if (req.user?.collection === 'users' && req.user?.role === 'super-admin') {
    return true
  }

  // Tenant admin can only read customers in their tenant
  if (req.user?.collection === 'users' && req.user?.role === 'tenant-admin') {
    const tenantId = typeof req.user.tenant === 'object' ? req.user.tenant?.id : req.user.tenant

    if (!tenantId) {
      return false // No access if no tenant
    }

    return {
      tenant: { equals: tenantId },
    } as Where
  }

  // Customers can read their own data
  if (req.user?.collection === 'customers' && req.user?.id) {
    return {
      id: { equals: req.user.id },
    } as Where
  }

  return false
}

const updateAccess: Access = ({ req }) => {
  // Super admin can update all customers
  if (req.user?.collection === 'users' && req.user?.role === 'super-admin') {
    return true
  }

  // Tenant admin can update customers in their tenant
  if (req.user?.collection === 'users' && req.user?.role === 'tenant-admin') {
    const tenantId = typeof req.user.tenant === 'object' ? req.user.tenant?.id : req.user.tenant

    if (!tenantId) {
      return false
    }

    return {
      tenant: { equals: tenantId },
    } as Where
  }

  // Customers can update their own data
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
  },
  access: {
    create: () => true,
    read: readAccess,
    update: updateAccess,
    delete: ({ req }) => {
      // Only super admin can delete customers
      return req.user?.collection === 'users' && req.user?.role === 'super-admin'
    },
  },
  auth: true,
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: false, // ✅ Optional - allows main app users without tenant
      admin: {
        description: 'Tenant assignment (optional for main app users)',
        position: 'sidebar',
      },
      access: {
        // Only super admin can manually change tenant assignment
        update: ({ req }) => req.user?.collection === 'users',
      }
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Auto-assign tenant on create if not provided and on tenant domain
        if (operation === 'create' && !data.tenant) {
          try {
            const { detectTenantFromDomain } = await import('../lib/tenant')
            const tenantId = await detectTenantFromDomain()
            if (tenantId) {
              data.tenant = tenantId
            }
            // If no tenant detected (main app), leave tenant as null
          } catch (error) {
            console.error('Error auto-assigning tenant:', error)
          }
        }
        return data
      }
    ]
  },
}
