import type { CollectionConfig, Access, Where } from 'payload'

const readAccess: Access = ({ req }) => {
  if (req.user?.collection === 'users' && req.user?.role === 'super-admin') {
    return true
  }

  if (req.user?.collection === 'users' && req.user?.role === 'tenant-admin') {
    const tenantId = typeof req.user.tenant === 'object' ? req.user.tenant?.id : req.user.tenant

    if (!tenantId) {
      return false
    }

    return {
      id: { equals: tenantId },
    } as Where
  }

  if (req.user?.collection === 'customers' && req.user?.id) {
    return {
      createdBy: { equals: req.user.id },
    } as Where
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
      id: { equals: tenantId },
    } as Where
  }

  if (req.user?.collection === 'customers' && req.user?.id) {
    return {
      createdBy: { equals: req.user.id },
    } as Where
  }

  return false
}

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'status', 'createdAt'],
    group: 'Tenant Management',
  },
  access: {
    create: ({ req }) => {
      return (req.user?.collection === 'users' && req.user?.role === 'super-admin') ||
        req.user?.collection === 'customers'
    },
    read: readAccess,
    update: updateAccess,
    delete: ({ req }) => {
      return req.user?.collection === 'users' && req.user?.role === 'super-admin'
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
      },
      access: {
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
      validate: (value: unknown) => {
        if (!value) return 'Slug is required'

        const stringValue = String(value)

        const slugPattern = /^[a-z0-9-]+$/
        if (!slugPattern.test(stringValue)) {
          return 'Slug can only contain lowercase letters, numbers, and hyphens'
        }

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
  timestamps: true,
}
