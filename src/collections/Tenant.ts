import type { CollectionConfig } from 'payload'

export const Tenant: CollectionConfig = {
  slug: 'tenants',
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
      admin: {
        description: 'Example: "Frontend Development", "Backend Development"',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'Example: "frontend", "backend", "mobile"',
      },
    },
    {
      name: 'domain',
      type: 'text',
      required: false,
      label: 'Custom Subdomain',
      admin: {
        description: 'Optional custom subdomain: frontend.lms-ndaru.com',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Path Description',
      admin: {
        description: 'Brief description of this learning Path',
      },
    },
  ],
}
