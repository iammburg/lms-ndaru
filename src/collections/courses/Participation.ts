import { CollectionConfig } from 'payload'

export const Participation: CollectionConfig = {
  slug: 'participation',
  admin: {
    group: 'Course Management',
  },
  fields: [
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
}

// kita ngubah schema table participation ygy
