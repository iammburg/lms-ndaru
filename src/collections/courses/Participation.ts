import { CollectionConfig } from 'payload'
import type { Access, Where } from 'payload'

const readAccess: Access = ({ req: { user } }) => {
  // Super admin can read all participation
  if (user?.collection === 'users' && user?.role === 'super-admin') {
    return true
  }

  // Tenant admin can read participation in their tenant
  if (user?.collection === 'users' && user?.role === 'tenant-admin') {
    const tenantId = typeof user.tenant === 'object' ? user.tenant?.id : user.tenant

    if (!tenantId) {
      return false
    }

    return {
      tenant: { equals: tenantId },
    } as Where
  }

  // Customer can only read their own participation
  if (user?.collection === 'customers' && user?.id) {
    return {
      customer: { equals: user.id },
    } as Where
  }

  return false
}

const updateAccess: Access = ({ req: { user } }) => {
  // Super admin can update all participation
  if (user?.collection === 'users' && user?.role === 'super-admin') {
    return true
  }

  // Tenant admin can update participation in their tenant
  if (user?.collection === 'users' && user?.role === 'tenant-admin') {
    const tenantId = typeof user.tenant === 'object' ? user.tenant?.id : user.tenant

    if (!tenantId) {
      return false
    }

    return {
      tenant: { equals: tenantId },
    } as Where
  }

  // Customer can only update their own participation
  if (user?.collection === 'customers' && user?.id) {
    return {
      customer: { equals: user.id },
    } as Where
  }

  return false
}

const deleteAccess: Access = ({ req: { user } }) => {
  // Super admin can delete all participation
  if (user?.collection === 'users' && user?.role === 'super-admin') {
    return true
  }

  // Tenant admin can delete participation in their tenant
  if (user?.collection === 'users' && user?.role === 'tenant-admin') {
    const tenantId = typeof user.tenant === 'object' ? user.tenant?.id : user.tenant

    if (!tenantId) {
      return false
    }

    return {
      tenant: { equals: tenantId },
    } as Where
  }

  return false
}

export const Participation: CollectionConfig = {
  slug: 'participation',
  admin: {
    group: 'Course Management',
  },
  access: {
    read: readAccess,
    create: ({ req: { user } }) => {
      // Super admin, tenant admin, and customers can create participation
      return (user?.collection === 'users' && (user?.role === 'super-admin' || user?.role === 'tenant-admin')) ||
        user?.collection === 'customers'
    },
    update: updateAccess,
    delete: deleteAccess,
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true, // ✅ Participation must belong to a tenant
      admin: {
        description: 'Tenant this participation belongs to',
        position: 'sidebar',
      },
      access: {
        // Only super admin can manually change tenant assignment
        update: ({ req }) => req.user?.collection === 'users',
      }
    },
    {
      name: 'customer',
      label: 'Customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },
    {
      name: 'course',
      label: 'Course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
    },
    {
      name: 'currentModule',
      label: 'Current Module',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'completedModules',
      label: 'Completed Modules',
      type: 'json',
      defaultValue: [],
    },
    {
      name: 'highestUnlockedModule',
      label: 'Highest Unlocked Module',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'isCompleted',
      label: 'Course Completed',
      type: 'checkbox',
      defaultValue: false,
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

// kita ngubah schema table participation ygy
