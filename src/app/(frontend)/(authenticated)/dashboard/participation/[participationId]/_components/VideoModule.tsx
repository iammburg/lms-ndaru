import { useState } from 'react'
import { Participation } from '@/payload-types'
import NextButton from './NextButton'
import { markProgress } from '../_actions/markProgress'
import { Separator } from '@/components/ui/separator'

interface VideoModuleProps {
  module: any
  participation: Participation
  onCompleted: (nextIndex: number) => void
}

export default function VideoModule({ module, participation, onCompleted }: VideoModuleProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleNextModule() {
    setLoading(true)
    try {
      const updateParticipation = await markProgress(participation)
      if (updateParticipation && updateParticipation.progress) {
        onCompleted(updateParticipation.progress)
      } else {
        console.error('Failed to update participation progress')
        setError('Gagal memperbarui progres. Silakan coba lagi.')
      }
    } catch (error) {
      console.error(error)
      setError('Terjadi kesalahan saat memperbarui progres. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-2xl font-bold">{module.title}</h2>

      <div className="relative w-full aspect-video border border-white overflow-hidden rounded-md">
        <iframe
          src={module.playerUrl}
          style={{
            border: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; accelerometer; gyroscope; encrypted-media; clipboard-write"
        ></iframe>
      </div>

      {error && <div className="text-sm text-red-500 mb-2">{error}</div>}
      <NextButton
        loading={loading}
        onClick={handleNextModule}
        text="Tandai selesai & lanjut ke modul berikutnya"
      />

      <Separator className="mt-8" />
    </div>
  )
}
