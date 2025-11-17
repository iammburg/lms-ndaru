import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getUser } from '@/app/(frontend)/(authenticated)/_actions/getUser'
import { Course, Media, Participation } from '@/payload-types'
import { notFound } from 'next/navigation'
import { ArrowLeft, SquarePen, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import StartCourseButton from './_components/StartCourseButton'
import ResumeCourseButton from './_components/ResumeCourseButton'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'

const CoursePage = async ({ params }: { params: Promise<{ courseId: string }> }) => {
  const { courseId } = await params
  const payload = await getPayload({ config: configPromise })
  const user = await getUser()
  let course: Course | null = null

  try {
    const userTenant = user?.tenant
    const tenantId = typeof userTenant === 'object' ? userTenant?.id : userTenant

    const res = await payload.findByID({
      collection: 'courses',
      id: courseId,
      overrideAccess: true,
    })

    const courseTenant = typeof res.tenant === 'object' ? res.tenant?.id : res.tenant
    if (tenantId && courseTenant !== tenantId) {
      console.log('Access denied: Course tenant mismatch')
      return notFound()
    }

    course = res
  } catch (error) {
    console.log(error)
    return notFound()
  }

  if (!course) {
    return notFound()
  }

  let participation: Participation | null = null
  try {
    const participationRes = await payload.find({
      collection: 'participation',
      where: {
        course: {
          equals: courseId,
        },
        customer: {
          equals: user?.id,
        },
      },
      overrideAccess: true,
    })

    participation = participationRes?.docs?.[0] || null
  } catch (error) {
    console.error(error)
  }

  return (
    <div className="flex flex-col mx-auto w-full max-w-5xl p-3 sm:p-4 lg:p-6 gap-4 mb-10">
      <Link href="/dashboard">
        <Button variant="link" className="mb-4">
          <ArrowLeft /> Kembali ke Dashboard
        </Button>
      </Link>

      <div className="relative w-full aspect-video overflow-hidden rounded-md border border-gray-700">
        <Image
          className="object-cover object-center"
          src={(course.image as Media | null)?.url ?? 'https://placehold.co/600x400.png'}
          alt={`${course.title} thumbnail`}
          fill={true}
        />
      </div>

      <div>
        <h1 className="mt-4 text-2xl lg:text-3xl font-semibold leading-tight text-gray-800 dark:text-white">
          {course.title}
        </h1>
        <p className="mt-4 text-gray-700 dark:text-gray-200">{course.description}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Kurikulum</h2>
        <div className="flex flex-col gap-4">
          {course.curriculum?.map((block, id) => {
            if (block.blockType === 'video') {
              return (
                <Card className="w-full py-3" key={id}>
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
                <Card className="w-full py-3" key={id}>
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
          })}
        </div>
      </div>

      <Separator className="mt-8" />

      <h2 className="text-xl font-semibold">Siap untuk belajar?</h2>
      {participation ? (
        <ResumeCourseButton participation={participation} />
      ) : (
        <StartCourseButton courseId={course.id} />
      )}
    </div>
  )
}

export default CoursePage
