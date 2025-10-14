import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    group: 'User Management',
  },
  access: {
    create: () => true,
    read: ({ req }) => {
      // Super admin can read all customers
      if (req.user?.collection === 'users') return true

      // Customers can read their own data
      if (req.user?.collection === 'customers') {
        return {
          id: { equals: req.user.id }
        }
      }

      return false
    },
    update: ({ req }) => {
      // Super admin can update all customers
      if (req.user?.collection === 'users') return true

      // Customers can update their own data
      if (req.user?.collection === 'customers') {
        return {
          id: { equals: req.user.id }
        }
      }

      return false
    },
    delete: ({ req }) => req.user?.collection === 'users',
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
