'use server'

import { Participation } from '@/payload-types'
import { completeModule } from './updateParticipation'

export async function markProgress(participation: Participation, totalModules: number) {
  if (!participation || typeof participation.currentModule !== 'number') {
    console.error('Invalid participation or currentModule')
    return null
  }

  const currentModuleIndex = participation.currentModule

  try {
    const updatedParticipation = await completeModule(
      participation.id.toString(),
      currentModuleIndex,
      totalModules,
    )

    return updatedParticipation
  } catch (error) {
    console.error('Error marking progress:', error)
    throw new Error(error instanceof Error ? error.message : String(error))
  }
}

// ini kita ganti biar pakai function completeModule yg ada di updateParticipation.ts ygy
// biar konsisten aja sih, soalnya function buat update participation udah ada di situ
// jadi daripada bikin function baru mending pake yg udah ada