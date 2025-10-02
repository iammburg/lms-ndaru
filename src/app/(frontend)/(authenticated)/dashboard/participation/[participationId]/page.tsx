import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getUser } from '../../../_actions/getUser'
import { Participation } from '@/payload-types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import CourseViewer from './_components/CourseViewer'

export default async function ParticipationPage({
  params,
}: {
  params: { participationId: string }
}) {
  const payload = await getPayload({ config: configPromise })
  const { participationId } = await params
  const user = await getUser()
  let participation: Participation | null = null

  try {
    const res: Participation = await payload.findByID({
      collection: 'participation',
      id: participationId,
      overrideAccess: false,
      user: user,
    })

    participation = res
  } catch (error) {
    console.error(error)
    return notFound()
  }

  if (!participation) {
    return notFound()
  }

  return (
    <div className="flex flex-col mx-auto w-full max-w-5xl p-3 sm:p-4 lg:p-6 gap-4">
      <Link href="/dashboard">
        <Button variant="link" className="mb-4">
          <ArrowLeft /> Kembali ke Dashboard
        </Button>
      </Link>
      {/* <div>
        {participation.course && typeof participation.course === 'object'
          ? participation.course.title
          : 'No course assigned'}
      </div> */}

      <CourseViewer participation={participation} />
    </div>
  )
}
