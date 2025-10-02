import React, { ReactElement } from 'react'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'

export default function SubmitButton({
  loading,
  text,
}: {
  loading: boolean
  text: string
}): ReactElement {
  return (
    <Button type="submit" className="w-full" disabled={loading}>
      {text}
      {''}
      <div className="ml-2 flex items-center">
        <LoaderCircle className={`animate-spin ${loading ? 'block' : 'hidden'}`} />
      </div>
    </Button>
  )
}
