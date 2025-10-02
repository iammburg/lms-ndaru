import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center mx-auto w-full max-w-5xl p-4 gap-4">
      <Card className="shadow-none bg-muted">
        <CardHeader className="px-8">
          <CardTitle className="mb-1 text-3xl font-bold text-rose-400 tracking-tight">
            404 - Course Not Found 😓
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Course yang Anda cari tidak ditemukan. Silakan periksa kembali course yang Anda cari.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-2 flex flex-row gap-2 px-8">
          <Link href="/dashboard">
            <Button>
              <ArrowLeft /> Kembali ke Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
