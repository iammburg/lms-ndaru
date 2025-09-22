'use client'

import { Course, Participation } from '@/payload-types'
import { useState } from 'react'
import Curriculum from './Curriculum'
import CourseModule from './CourseModule'
import { navigateToModule } from '../_actions/updateParticipation'

export default function CourseViewer({ participation }: { participation: Participation }) {
  const [currentModule, setCurrentModule] = useState(participation.currentModule ?? 0)
  const [completedModules, setCompletedModules] = useState<number[]>(
    (participation.completedModules as number[]) || [],
  )
  const [highestUnlockedModule, setHighestUnlockedModule] = useState(
    participation.highestUnlockedModule ?? 0,
  )
  const course: Course = participation.course as Course
  const totalModules = course.curriculum?.length || 0

  async function handleComplete(nextIndex: number) {
    setCurrentModule(nextIndex)
  }

  async function handleModuleNavigation(moduleIndex: number) {
    if (moduleIndex <= highestUnlockedModule) {
      try {
        await navigateToModule(participation.id.toString(), moduleIndex)
        setCurrentModule(moduleIndex)
      } catch (error) {
        console.error('Failed to navigate to module:', error)
      }
    }
  }

  function updateParticipationState(updatedParticipation: Participation) {
    setCurrentModule(updatedParticipation.currentModule ?? 0)
    setCompletedModules((updatedParticipation.completedModules as number[]) || [])
    setHighestUnlockedModule(updatedParticipation.highestUnlockedModule ?? 0)
  }

  return (
    <div className="flex flex-col gap-6">
      <CourseModule
        onCompleted={handleComplete}
        module={course.curriculum?.[currentModule]}
        participation={participation}
        totalModules={totalModules}
        onParticipationUpdate={updateParticipationState}
      />
      <Curriculum
        course={course}
        currentModule={currentModule}
        completedModules={completedModules}
        highestUnlockedModule={highestUnlockedModule}
        onModuleClick={handleModuleNavigation}
      />
    </div>
  )
}
