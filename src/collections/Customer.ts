import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    group: 'User Management',
  },
  access: {
    create: () => true,
  },
  auth: true,
  fields: [],
}
