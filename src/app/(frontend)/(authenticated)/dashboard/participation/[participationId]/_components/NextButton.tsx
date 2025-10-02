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
    <Button onClick={onClick} disabled={loading} className="cursor-pointer w-full">
      {text}
      <div className="flex items-center">
        <LoaderCircle className={`animate-spin ${loading ? 'inline-block' : 'hidden'}`} />
      </div>
    </Button>
  )
}
