'use client'

import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'

export default function NextButton({
  loading,
  text,
  onClick,
}: {
  loading: boolean
  text: string
  onClick: () => void
}) {
  return (
    <Button onClick={onClick} disabled={loading}>
      {text}{' '}
      <div className="ml-2 flex items-center">
        <LoaderCircle className={`animate-spin ${loading ? 'block' : 'hidden'}`} />
      </div>
    </Button>
  )
}
