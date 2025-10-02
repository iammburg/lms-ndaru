'use server'

import { Participation } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getUser } from '@/app/(frontend)/(authenticated)/_actions/getUser'

export async function updateParticipation(
  participationId: string,
  updates: {
    currentModule?: number
    completedModules?: number[]
    highestUnlockedModule?: number
    isCompleted?: boolean
  },
) {
  const payload = await getPayload({ config: configPromise })
  const user = await getUser()

  if (!user) {
    throw new Error('User not found')
  }

  try {
    const updatedParticipation = await payload.update({
      collection: 'participation',
      id: participationId,
      data: updates,
      overrideAccess: false,
      user: user,
    })

    return updatedParticipation
  } catch (error) {
    console.error('Error updating participation:', error)
    throw new Error(error instanceof Error ? error.message : String(error))
  }
}

export async function navigateToModule(participationId: string, moduleIndex: number) {
  const payload = await getPayload({ config: configPromise })
  const user = await getUser()

  if (!user) {
    throw new Error('User not found')
  }

  try {
    const participation: Participation = await payload.findByID({
      collection: 'participation',
      id: participationId,
      overrideAccess: false,
      user: user,
    })

    const highestUnlocked = participation.highestUnlockedModule ?? 0

    if (moduleIndex > highestUnlocked) {
      throw new Error('Module is locked')
    }

    const updatedParticipation = await payload.update({
      collection: 'participation',
      id: participationId,
      data: {
        currentModule: moduleIndex,
      },
      overrideAccess: false,
      user: user,
    })

    return updatedParticipation
  } catch (error) {
    console.error('Error navigating to module:', error)
    throw new Error(error instanceof Error ? error.message : String(error))
  }
}

export async function completeModule(
  participationId: string,
  moduleIndex: number,
  totalModules: number,
) {
  const payload = await getPayload({ config: configPromise })
  const user = await getUser()

  if (!user) {
    throw new Error('User not found')
  }

  try {
    const participation: Participation = await payload.findByID({
      collection: 'participation',
      id: participationId,
      overrideAccess: false,
      user: user,
    })

    const completedModules = (participation.completedModules as number[]) || []
    const currentHighest = participation.highestUnlockedModule ?? 0

    if (!completedModules.includes(moduleIndex)) {
      completedModules.push(moduleIndex)
    }

    const newHighestUnlocked = Math.max(currentHighest, moduleIndex + 1)

    const isCompleted = completedModules.length === totalModules

    const nextModule = moduleIndex + 1 < totalModules ? moduleIndex + 1 : moduleIndex

    const updatedParticipation = await payload.update({
      collection: 'participation',
      id: participationId,
      data: {
        currentModule: nextModule,
        completedModules,
        highestUnlockedModule: newHighestUnlocked,
        isCompleted,
      },
      overrideAccess: false,
      user: user,
    })

    return updatedParticipation
  } catch (error) {
    console.error('Error completing module:', error)
    throw new Error(error instanceof Error ? error.message : String(error))
  }
}

// di sini ada 3 function ygy
// updateParticipation: buat update data participation secara umum
// navigateToModule: buat navigasi ke module tertentu, tapi cuma boleh ke module yg udah di unlock
// completeModule: buat nandain kalo module udah selesai, terus unlock module berikutnya kalo ada