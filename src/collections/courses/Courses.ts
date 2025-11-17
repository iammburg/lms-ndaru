import type { CollectionConfig, Access, Where } from 'payload'
import { VideoBlock } from './blocks/VideoBlock'
import { QuizBlock } from './blocks/QuizBlock'
import { FinishBlock } from './blocks/FinishBlock'

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

  if (req.user?.collection === 'customers' && req.user?.id) {
    return {
      id: { equals: req.user.id },
    } as Where
  }

  return false
}

export const Courses: CollectionConfig = {
  slug: 'courses',
  access: {
    create: () => true,
    read: readAccess,
    update: updateAccess,
    delete: ({ req }) => {
      return req.user?.collection === 'users' && (req.user as any).role === 'super-admin'
    },
  },
  admin: {
    useAsTitle: 'title',
    group: 'Course Management',
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true, // ✅ Courses must belong to a tenant
      admin: {
        description: 'Tenant this course belongs to',
        position: 'sidebar',
      },
      access: {
        // Only super admin can manually change tenant assignment
        update: ({ req }) => req.user?.collection === 'users',
      }
    },
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'image',
      label: 'Image',
      type: 'relationship',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'curriculum',
      label: 'Curriculum',
      type: 'blocks',
      blocks: [VideoBlock, QuizBlock, FinishBlock],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Auto-assign tenant on create if user has tenant and no tenant specified
        if (operation === 'create' && !data.tenant && req.user) {
          const user = req.user as any
          const tenantId = typeof user.tenant === 'object' ? user.tenant?.id : user.tenant
          if (tenantId) {
            data.tenant = tenantId
          }
        }
        return data
      }
    ]
  },
}
