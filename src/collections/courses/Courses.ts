import { CollectionConfig } from 'payload'
import { VideoBlock } from './blocks/VideoBlock'
import { QuizBlock } from './blocks/QuizBlock'
import { FinishBlock } from './blocks/FinishBlock'

export const Courses: CollectionConfig = {
  slug: 'courses',
  access: {
    read: ({ req: { user } }) => {
      // Super admin can read all courses
      if (user?.collection === 'users') return true

      // Tenant admin can read courses in their tenant
      if (user?.collection === 'tenantAdmins') {
        const tenantId = typeof user.tenant === 'object' ? user.tenant?.id : user.tenant
        if (tenantId) {
          return {
            tenant: { equals: tenantId }
          }
        }
      }

      // Customer can read courses in their tenant (if they have one)
      if (user?.collection === 'customers' && user.tenant) {
        const tenantId = typeof user.tenant === 'object' ? user.tenant?.id : user.tenant
        if (tenantId) {
          return {
            tenant: { equals: tenantId }
          }
        }
      }

      // Customers without tenant (main app users) cannot read courses
      return false
    },
    create: ({ req: { user } }) => {
      // Only super admin and tenant admin can create courses
      return user?.collection === 'users' || user?.collection === 'tenantAdmins'
    },
    update: ({ req: { user } }) => {
      // Only super admin can update all courses
      if (user?.collection === 'users') return true

      // Tenant admin can update courses in their tenant
      if (user?.collection === 'tenantAdmins') {
        const tenantId = typeof user.tenant === 'object' ? user.tenant?.id : user.tenant
        if (tenantId) {
          return {
            tenant: { equals: tenantId }
          }
        }
      }

      return false
    },
    delete: ({ req: { user } }) => {
      // Only super admin can delete all courses
      if (user?.collection === 'users') return true

      // Tenant admin can delete courses in their tenant
      if (user?.collection === 'tenantAdmins') {
        const tenantId = typeof user.tenant === 'object' ? user.tenant?.id : user.tenant
        if (tenantId) {
          return {
            tenant: { equals: tenantId }
          }
        }
      }

      return false
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
