import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Media Management',
  },
  access: {
    create: ({ req }) => {
      // Super admin can create media (global or tenant-specific)
      if (req.user?.collection === 'users' && req.user?.role === 'super-admin') {
        return true
      }
      // Tenant admin can create media within their tenant
      if (req.user?.collection === 'users' && req.user?.role === 'tenant-admin') {
        return true
      }
      // Customers can create media within their tenant
      if (req.user?.collection === 'customers') {
        return true
      }
      return false
    },
    read: ({ req }) => {
      // Super admin can read all media
      if (req.user?.collection === 'users' && req.user?.role === 'super-admin') {
        return true
      }

      // Tenant admin can read media in their tenant (filtered by multi-tenant plugin)
      if (req.user?.collection === 'users' && req.user?.role === 'tenant-admin') {
        return true
      }

      // Customers can read media (filtered by multi-tenant plugin)
      if (req.user?.collection === 'customers') {
        return true
      }

      return false
    },
    update: ({ req }) => {
      // Super admin can update all media
      if (req.user?.collection === 'users' && req.user?.role === 'super-admin') {
        return true
      }
      // Tenant admin can update media in their tenant
      if (req.user?.collection === 'users' && req.user?.role === 'tenant-admin') {
        return true
      }
      return false
    },
    delete: ({ req }) => {
      // Super admin can delete any media
      if (req.user?.collection === 'users' && req.user?.role === 'super-admin') {
        return true
      }
      // Tenant admin can delete media in their tenant
      if (req.user?.collection === 'users' && req.user?.role === 'tenant-admin') {
        return true
      }
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
