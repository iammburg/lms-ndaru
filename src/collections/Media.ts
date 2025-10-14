import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Media Management',
  },
  access: {
    create: ({ req }) => {
      // Allow super admin to create media (global or tenant-specific)
      if (req.user?.collection === 'users') return true
      // Allow customers to create media within their tenant
      if (req.user?.collection === 'customers') return true
      // Allow tenant admins to create media within their tenant
      if (req.user?.collection === 'tenantAdmins') return true
      return false
    },
    read: ({ req }) => {
      // Super admin can read all media
      if (req.user?.collection === 'users') return true
      // Others can read media (will be filtered by tenant automatically)
      return true
    },
    update: ({ req }) => {
      // Super admin can update all media
      if (req.user?.collection === 'users') return true
      // Tenant admins can update media in their tenant
      if (req.user?.collection === 'tenantAdmins') return true
      // Customers generally shouldn't update media after upload
      return false
    },
    delete: ({ req }) => {
      // Super admin can delete any media
      if (req.user?.collection === 'users') return true
      // Tenant admins can delete media in their tenant
      if (req.user?.collection === 'tenantAdmins') return true
      return false
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
