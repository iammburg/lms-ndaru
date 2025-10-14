import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'status', 'createdAt'],
    group: 'Tenant Management',
  },
  access: {
    // Super admin can create tenants, customers can create their own
    create: ({ req }) => {
      return req.user?.collection === 'users' || req.user?.collection === 'customers'
    },
    read: ({ req }) => {
      // Super admin can read all
      if (req.user?.collection === 'users') return true
      // Customers can only read tenants they created
      if (req.user?.collection === 'customers') {
        return {
          createdBy: { equals: req.user.id }
        }
      }
      return false
    },
    update: ({ req }) => {
      // Super admin can update all
      if (req.user?.collection === 'users') return true
      // Customers can update tenants they created
      if (req.user?.collection === 'customers') {
        return {
          createdBy: { equals: req.user.id }
        }
      }
      return false
    },
    delete: ({ req }) => {
      // Only super admin can delete tenants
      return req.user?.collection === 'users'
    },
  },
  fields: [
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      label: 'Created By',
      admin: {
        description: 'Customer who created this tenant',
        position: 'sidebar',
      },
      access: {
        // Auto-filled, not manually editable
        update: ({ req }) => req.user?.collection === 'users',
      }
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tenant Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Tenant Slug',
      admin: {
        description: 'Unique identifier for subdomain (e.g., "acme" → acme.bibubelajar.com)',
      },
      validate: (value: any) => {
        if (!value) return 'Slug is required'

        const stringValue = String(value)

        // Only allow lowercase letters, numbers, and hyphens
        const slugPattern = /^[a-z0-9-]+$/
        if (!slugPattern.test(stringValue)) {
          return 'Slug can only contain lowercase letters, numbers, and hyphens'
        }

        // Prevent reserved subdomains
        const reservedSlugs = ['www', 'api', 'admin', 'app', 'mail', 'ftp', 'blog', 'shop', 'store']
        if (reservedSlugs.includes(stringValue)) {
          return `"${stringValue}" is a reserved subdomain and cannot be used`
        }

        return true
      }
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Suspended', value: 'suspended' },
      ],
    },
    {
      name: 'subdomain',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Auto-generated subdomain URL',
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            if (siblingData.slug) {
              return `${siblingData.slug}.bibubelajar.com`
            }
            return undefined
          }
        ]
      }
    },
    {
      name: 'contactEmail',
      type: 'email',
      label: 'Contact Email',
      admin: {
        description: 'Primary contact email for this tenant',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Brief description or notes about this tenant',
      },
    },
    {
      name: 'settings',
      type: 'group',
      label: 'Tenant Settings',
      fields: [
        {
          name: 'brandColor',
          type: 'text',
          label: 'Brand Color',
          admin: {
            description: 'Hex color code for tenant branding (e.g., #1a73e8)',
          },
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo',
          required: false,
          admin: {
            description: 'Upload a logo for this tenant',
          },
        },
        {
          name: 'maxUsers',
          type: 'number',
          label: 'Max Users',
          defaultValue: 100,
          admin: {
            description: 'Maximum number of users allowed for this tenant',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Auto-assign createdBy on create
        if (operation === 'create' && req.user?.collection === 'customers') {
          data.createdBy = req.user.id
        }
        return data
      }
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        // Create tenant admin after tenant creation
        if (operation === 'create' && req.user?.collection === 'customers' && doc.createdBy) {
          try {
            await req.payload.create({
              collection: 'tenantAdmins',
              data: {
                email: req.user.email,
                password: 'temp-password-' + Math.random().toString(36).substring(7), // Temporary password
                tenant: doc.id,
                role: 'admin',
                isActive: true,
                permissions: {
                  canManageUsers: true,
                  canManageCourses: true,
                  canViewAnalytics: true,
                }
              }
            })

            console.log(`Tenant admin created for tenant: ${doc.name}`)

            // TODO: Send email with tenant admin credentials

          } catch (error) {
            console.error('Failed to create tenant admin:', error)
          }
        }
      }
    ]
  },
  timestamps: true,
}
