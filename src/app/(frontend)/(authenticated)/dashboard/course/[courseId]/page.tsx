import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getUser } from '@/app/(frontend)/(authenticated)/_actions/getUser'
import { Course, Media } from '@/payload-types'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookCheck, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const CoursePage = async ({ params }: { params: { courseId: string } }) => {
  const { courseId } = await params
  const payload = await getPayload({ config: configPromise })
  const user = await getUser()
  let course: Course | null = null

  try {
    const res = await payload.findByID({
      collection: 'courses',
      id: courseId,
      overrideAccess: false,
      user: user,
    })

    course = res
  } catch (error) {
    console.log(error)
    return notFound()
  }

  if (!course) {
    return notFound()
  }

  return (
    <div className="flex flex-col mx-auto w-full max-w-4xl p-4 gap-4">
      <Link href="/dashboard">
        <Button variant="link" className="mb-4">
          <ArrowLeft /> Kembali ke Dashboard
        </Button>
      </Link>

      <img
        className="object-cover object-center aspect-video overflow-hidden w-full rounded-xl border border-gray-700"
        src={(course.image as Media | null)?.url ?? 'https://placehold.co/600x400.png'}
        alt={`${course.title} thumbnail`}
      />

      <div>
        <h1 className="max-w-lg mt-4 text-2xl lg:text-3xl font-semibold leading-tight text-gray-800 dark:text-white">
          {course.title}
        </h1>
        <p className="max-w-2xl mt-4 text-gray-700 dark:text-gray-200">{course.description}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Kurikulum</h2>
        <div className="flex flex-col gap-4">
          {course.curriculum?.map((block, id) => {
            if (block.blockType === 'video') {
              return (
                <Card className="w-full" key={id}>
                  <CardHeader>
                    <CardTitle className="flex items-center text-cyan-500 gap-4 text-sm sm:text-base md:text-lg">
                      <Video className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 flex-shrink-0" />
                      {block.title}
                    </CardTitle>
                    <CardDescription>Durasi: {block.duration} Menit</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Tonton Video</Button>
                  </CardContent>
                </Card>
              )
            }

            if (block.blockType === 'quiz') {
              return (
                <Card className="w-full" key={id}>
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-500 gap-4 text-sm sm:text-base md:text-lg">
                      <BookCheck className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 flex-shrink-0" />
                      {block.title}
                    </CardTitle>
                    <CardDescription>Jumlah Quiz: {block.questions?.length || 0}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Kerjakan Quiz</Button>
                  </CardContent>
                </Card>
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}

export default CoursePage
