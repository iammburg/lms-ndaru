import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Course } from '@/payload-types'
import { SquarePen, Video } from 'lucide-react'

export default function Curriculum({
  course,
  currentProgress,
}: {
  course: Course
  currentProgress: number
}) {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto mb-10 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent max-h-[400px]">
      {course.curriculum?.map((block, index) => {
        const isCurrent = index === currentProgress
        const borderClass = isCurrent ? 'border-blue-500' : 'border-gray-300 dark:border-gray-700'
        const className = borderClass

        if (block.blockType === 'video') {
          return (
            <Card key={index} className={`w-full py-3 ${className}`}>
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-500 font-medium gap-4 text-sm md:text-base">
                  {block.title}
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
            <Card key={index} className={`w-full py-3 ${className}`}>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-500 font-medium gap-4 text-sm md:text-base">
                  {block.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <SquarePen className="size-4" /> Jumlah Quiz: {block.questions?.length || 0}
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
