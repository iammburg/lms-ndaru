import { Course, Participation } from '@/payload-types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Play, Clock, Calendar } from 'lucide-react'

export default function ResumeCourseButton({ participation }: { participation: Participation }) {
  const course: Course = participation.course as Course
  const courseLenght = course.curriculum?.length ?? 0
  let progress = participation.progress ?? 0
  progress = progress + 1
  const progressPercentage = Math.round((progress / (courseLenght || 1)) * 100)

  const createdDate = new Date(participation.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const updatedDate = new Date(participation.updatedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <Card className="py-3 lg:py-4">
      <CardHeader>
        <CardTitle className="text-sm lg:text-base font-normal leading-tight line-clamp-2">
          {course.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 lg:space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs lg:text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-normal text-right">
              <span className="hidden sm:inline">
                {progress} / {courseLenght} materi{' '}
              </span>
              ({progressPercentage}%)
            </span>
          </div>
          <div className="h-1.5 lg:h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex flex-row sm:flex-row gap-2 sm:gap-4 text-xs lg:text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="size-3 lg:size-4 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-xs">Dimulai:</span>{' '}
              <span className="font-normal text-foreground">{createdDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="size-3 lg:size-4 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-xs">Update:</span>{' '}
              <span className="font-normal text-foreground">{updatedDate}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 lg:pt-4">
        <Link href={`/dashboard/participation/${participation.id}`} className="w-full">
          <Button size="sm" className="w-full lg:size-default">
            <Play className="size-3 lg:size-4" />
            <span className="text-xs lg:text-sm">
              {progressPercentage === 100 ? 'Belajar Lagi' : 'Lanjutkan Course'}
            </span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
