'use server'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'
import configPromise from '@payload-config'
import Image from 'next/image'
import { Course, Customer, Participation } from '@/payload-types'
import Link from 'next/link'
import { getUser } from '../_actions/getUser'
import ResumeCourseButton from './course/[courseId]/_components/ResumeCourseButton'

const page = async () => {
  const payload = await getPayload({ config: configPromise })

  // get the user
  const user = await getUser()

  console.log('User object:', JSON.stringify(user, null, 2))
  console.log('User tenant value:', user?.tenant)
  console.log('User tenant type:', typeof user?.tenant)
  console.log('User tenant ID:', typeof user?.tenant === 'object' ? user?.tenant?.id : user?.tenant)

  // get courses
  let courses: Course[] = []

  try {
    // Get tenant ID from user
    const userTenant = (user as Customer)?.tenant
    const tenantId = typeof userTenant === 'object' ? userTenant?.id : userTenant

    console.log('Fetching courses for tenant:', tenantId)

    const coursesRes = await payload.find({
      collection: 'courses',
      where: tenantId ? {
        tenant: { equals: tenantId }
      } : {
        tenant: { equals: null }
      },
      limit: 10,
      overrideAccess: true,
    })
    courses = coursesRes.docs
    console.log('Courses found:', courses.length)
    console.log('Courses:', coursesRes)
  } catch (e) {
    console.log('Error fetching courses:', e)
  }

  let participations: Participation[] | null = []

  try {
    const participationsRes = await payload.find({
      collection: 'participation',
      where: {
        customer: {
          equals: user?.id,
        },
      },
      overrideAccess: true,
    })

    participations = participationsRes?.docs || []
  } catch (error) {
    console.error(error)
  }

  return (
    <div className="flex flex-col mx-auto w-full max-w-5xl p-3 sm:p-4 lg:p-6 gap-4">
      <div className="flex flex-col">
        <div className="text-lg lg:text-xl font-bold">
          Selamat datang di {typeof user?.tenant === 'object' && user?.tenant !== null ? user.tenant.name : 'BiBuBelajar'}, <span className="">{user?.email}!</span>
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
          {courses != null && courses.length > 0 ? (
            courses.map((course) => {
              return (
                <Link
                  href={`/dashboard/course/${course.id}`}
                  key={course.id}
                  className="flex flex-col cursor-pointer relative border rounded-md border-gray-700 hover:border-white transition ease-in-out duration-100 overflow-hidden"
                >
                  <div className="relative w-full aspect-video border rounded-md overflow-hidden">
                    {course.image && typeof course.image === 'object' && course.image.url ? (
                      <Image
                        alt={`${course.title} thumbnail`}
                        src={course.image.url}
                        fill={true}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex items-center text-sm font-medium">
                    {course.title}
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="text-sm">Belum ada course yang tersedia.</div>
          )}
        </Suspense>
      </div>
    </div>
  )
}

export default page
