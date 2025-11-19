'use server'

import { getPayload } from 'payload'
import { getUser } from './getUser'
import configPromise from '@payload-config'

export async function participate({ courseId }: { courseId: number }) {
  const payload = await getPayload({ config: configPromise })
  const user = await getUser()

  if (!user) {
    throw new Error('User not found')
  }

  try {
    const createdParticipation = await payload.create({
      collection: 'participation',
      data: {
        course: courseId,
        customer: user.id,
        tenant: user.tenant ? (typeof user.tenant === 'object' ? user.tenant.id : user.tenant) : null,
        currentModule: 0,
        completedModules: [],
        highestUnlockedModule: 0,
        isCompleted: false,
      },
      overrideAccess: false,
      user: user,
    })

    return createdParticipation
  } catch (error) {
    console.error('Error creating participation.', error)
    throw new Error('Error creating participation.')
  }
}

// ini juga diubah buat nyesuain struktur schema participation yg baru ygy