'use client'

import { participate } from '@/app/(frontend)/(authenticated)/_actions/participate'
import { Participation } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState, MouseEvent } from 'react'
import { LoaderCircle, Play, TriangleAlert } from 'lucide-react'

export default function StartCourseButton({ courseId }: { courseId: number }) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleStartCourse(e: MouseEvent<HTMLButtonElement>) {
    setStatus('loading')
    setError(null)
    e.preventDefault()

    try {
      const participation: Participation = await participate({ courseId })

      if (!participation) {
        throw new Error('Failed to create participation')
      }

      router.push(`/dashboard/participation/${participation.id}`)
    } catch (error) {
      setStatus('error')
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan')
      console.error('Error starting course:', error)
    }
  }

  const isLoading = status === 'loading'
  const isError = status === 'error'

  return (
    <div className="mt-6">
      <Button
        onClick={handleStartCourse}
        disabled={isLoading}
        variant={isError ? 'destructive' : 'default'}
        size="lg"
        className="w-full"
      >
        {isLoading ? (
          <>
            <LoaderCircle className="animate-spin text-xl" /> Memproses
          </>
        ) : isError ? (
          <>
            <TriangleAlert className="text-xl" /> Terjadi Kesalahan
          </>
        ) : (
          <>
            <Play className="text-xl" /> Mulai Kursus
          </>
        )}
      </Button>
      {isError && error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  )
}
