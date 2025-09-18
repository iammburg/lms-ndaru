import { Participation } from '@/payload-types'
import { useState } from 'react'
import NextButton from './NextButton'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function FinishModule({ participation }: { participation: Participation }) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {}

  return (
    <div>
      <Card className="border-green-500 bg-green-50 dark:bg-green-950/20 py-2 mb-4">
        <CardContent>
          <div className="flex items-center gap-3">
            <CheckCircle className="size-4 text-green-600" />
            <p className="text-green-700 dark:text-green-300">
              Selamat! Kamu telah menyelesaikan course ini
            </p>
          </div>
        </CardContent>
      </Card>
      <NextButton loading={loading} text="Unduh Sertifikat" onClick={handleDownload} />
    </div>
  )
}
