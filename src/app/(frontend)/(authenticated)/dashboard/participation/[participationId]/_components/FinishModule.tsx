import { Course, Participation, Customer } from '@/payload-types'
import { useState } from 'react'
import NextButton from './NextButton'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function FinishModule({ participation }: { participation: Participation }) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      let course: Course = participation.course as Course
      const customer = participation.customer as Customer
      let response = await fetch(`/printCertificate/${participation.id}`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Failed to generate certificate')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${course.title} - ${customer.email} certificate.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading certificate:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Card className="border-green-500 bg-green-50 dark:bg-green-950/20 py-2 mb-4">
        <CardContent>
          <div className="flex items-center gap-3">
            <CheckCircle className="size-4 text-green-600 animate-caret-blink" />
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
