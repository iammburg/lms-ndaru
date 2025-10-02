'use server'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'
import configPromise from '@payload-config'
import Image from 'next/image'
import { Course, Participation } from '@/payload-types'
import Link from 'next/link'
import { getUser } from '../_actions/getUser'
import ResumeCourseButton from './course/[courseId]/_components/ResumeCourseButton'

const page = async () => {
  const payload = await getPayload({ config: configPromise })

  // get the user
  const user = await getUser()

  // get courses
  let courses: Course[] = []

  try {
    let coursesRes = await payload.find({
      collection: 'courses',
      limit: 10,
      overrideAccess: false,
      user: user,
    })
    courses = coursesRes.docs
  } catch (e) {
    console.log(e)
  }

  let participations: Participation[] | null = []

  try {
    let participationsRes = await payload.find({
      collection: 'participation',
      where: {
        customer: {
          equals: user?.id,
        },
      },
      overrideAccess: false,
      user: user,
    })

    participations = participationsRes?.docs || []
  } catch (error) {
    console.error(error)
  }

  return (
    <div className="flex flex-col mx-auto w-full max-w-5xl p-3 sm:p-4 lg:p-6 gap-4">
      <div className="flex flex-col">
        <div className="text-lg lg:text-xl font-bold">
          Selamat datang, <span className="">{user?.email}!</span>
        </div>
        <p className="text-sm lg:text-base text-muted-foreground mt-1">
          Kamu dapat melihat semua course yang tersedia untuk dipelajari di halaman ini
        </p>
      </div>
      <div className="text-base lg:text-lg text-cyan-500 mt-4 lg:mt-6">Course yang kamu ikuti</div>
      {participations && participations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          <Suspense fallback={<div>Loading...</div>}>
            {participations.map((participation) => {
              return <ResumeCourseButton key={participation.id} participation={participation} />
            })}
          </Suspense>
        </div>
      ) : (
        <div className="text-sm">Kamu belum mengikuti course apapun.</div>
      )}
      <div className="text-base lg:text-lg text-cyan-500 mt-4 lg:mt-6">Semua Course</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          {courses.map((course) => {
            return (
              <Link
                href={`/dashboard/course/${course.id}`}
                key={course.id}
                className="flex flex-col cursor-pointer relative border rounded-md border-gray-700 hover:border-white transition ease-in-out duration-100 overflow-hidden"
              >
                <div className="relative w-full aspect-video border rounded-md overflow-hidden">
                  {course.image && typeof course.image === 'object' && course.image.url ? (
                    <Image alt={`${course.title} thumbnail`} src={course.image.url} fill={true} />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </Suspense>
      </div>
    </div>
  )
}

export default page
