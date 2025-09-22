import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Course } from '@/payload-types'
import { CheckCircle, Lock, PartyPopper, SquarePen, Video } from 'lucide-react'

interface CurriculumProps {
  course: Course
  currentModule: number
  completedModules: number[]
  highestUnlockedModule: number
  onModuleClick: (moduleIndex: number) => void
}

export default function Curriculum({
  course,
  currentModule,
  completedModules,
  highestUnlockedModule,
  onModuleClick,
}: CurriculumProps) {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto mb-10 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent max-h-[400px]">
      {course.curriculum?.map((block, index) => {
        const isCurrent = index === currentModule
        const isCompleted = completedModules.includes(index)
        const isLocked = index > highestUnlockedModule
        const isClickable = !isLocked

        let borderClass = 'border-gray-300 dark:border-gray-700'
        let cursorClass = 'cursor-default'
        let opacityClass = ''

        if (isCurrent) {
          borderClass = 'border-black dark:border-white'
        } else if (isCompleted) {
          borderClass = 'border-green-500'
        } else if (isLocked) {
          opacityClass = 'opacity-50'
        }

        if (isClickable) {
          cursorClass = 'cursor-pointer hover:scale-98 transition-transform duration-200'
        }

        const className = `${borderClass} ${cursorClass} ${opacityClass}`

        const handleClick = () => {
          if (isClickable) {
            onModuleClick(index)
          }
        }

        if (block.blockType === 'video') {
          return (
            <Card key={index} className={`w-full py-3 ${className}`} onClick={handleClick}>
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-500 font-medium gap-4 text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    {isCompleted && <CheckCircle className="size-4 text-green-500" />}
                    {isLocked && <Lock className="size-4 text-gray-400" />}
                    {block.title}
                  </div>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Video className="size-4" /> Durasi: {block.duration} Menit
                </CardDescription>
              </CardHeader>
            </Card>
          )
        }

        if (block.blockType === 'quiz') {
          return (
            <Card key={index} className={`w-full py-3 ${className}`} onClick={handleClick}>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-500 font-medium gap-4 text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    {isCompleted && <CheckCircle className="size-4 text-green-500" />}
                    {isLocked && <Lock className="size-4 text-gray-400" />}
                    {block.title}
                  </div>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <SquarePen className="size-4" /> Jumlah Quiz: {block.questions?.length || 0}
                </CardDescription>
              </CardHeader>
            </Card>
          )
        }

        if (block.blockType === 'finish') {
          return (
            <Card key={index} className={`w-full py-3 ${className}`} onClick={handleClick}>
              <CardHeader>
                <CardTitle className="flex items-center text-green-500 font-medium gap-4 text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    {isCompleted && <CheckCircle className="size-4 text-green-500" />}
                    {isLocked && <Lock className="size-4 text-gray-400" />}
                    Akhir Course
                  </div>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <PartyPopper className="size-4" /> Jika sudah menyelesaikan course, kamu bisa
                  mengunduh sertifikat
                </CardDescription>
              </CardHeader>
            </Card>
          )
        }

        return null
      })}
    </div>
  )
}
