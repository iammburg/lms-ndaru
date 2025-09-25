import type { CollectionConfig } from 'payload'

export const Tenant: CollectionConfig = {
  slug: 'tenants',
  //   access: {
  //     read: ({ req: { user } }) => {
  //       return user?.collection === 'users'
  //     },
  //     create: ({ req: { user } }) => {
  //       return user?.collection === 'users'
  //     },
  //     update: ({ req: { user } }) => {
  //       return user?.collection === 'users'
  //     },
  //     delete: ({ req: { user } }) => {
  //       return user?.collection === 'users'
  //     },
  //   },
  admin: {
    useAsTitle: 'name',
  },
  labels: {
    singular: 'Learning Path',
    plural: 'Learning Paths',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Learning Path Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      validate: (val: string | null | undefined) => {
        if (!val || !/^[a-z0-9-]+$/.test(val)) {
          return 'Slug must contain only lowercase letters, numbers, and hyphens'
        }
        return true
      },
    },
    {
      name: 'domain',
      type: 'text',
      required: false,
      label: 'Custom Domain',
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Learning Path Description',
    },
  ],
}
