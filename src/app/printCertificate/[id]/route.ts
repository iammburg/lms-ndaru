import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getUser } from '@/app/(frontend)/(authenticated)/_actions/getUser'
import { Course, Participation } from '@/payload-types'
import { NextRequest } from 'next/server'
import ejs from 'ejs'

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const user = await getUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }
    const { id: participationId } = await params
    const participation: Participation = await payload.findByID({
      collection: 'participation',
      id: participationId,
      overrideAccess: false,
      user: user,
    })
    if (!participation) {
      return new Response('Participation not found', { status: 404 })
    }

    const course: Course = participation.course as Course
    if (!course.curriculum || course.curriculum.length === 0) {
      return new Response('Course curriculum not found', { status: 400 })
    }
    const lastModule = course.curriculum[course.curriculum.length - 1]
    if (lastModule.blockType !== 'finish') {
      return new Response('Course has no certificate', { status: 400 })
    }
    if (participation.progress !== course.curriculum.length - 1) {
      return new Response('Course is not finished', { status: 400 })
    }
    if (!('template' in lastModule)) {
      return new Response('Course has no certificate template', { status: 400 })
    }

    const html = ejs.render(lastModule.template, {
      name: user?.email,
      courseTitle: course.title,
      date: new Date(participation.updatedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    })

    // Generate PDF using Puppeteer
    const puppeteer = require('puppeteer')
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
    })

    const page = await browser.newPage()

    // Set the HTML content directly from backend template
    await page.setContent(html, { waitUntil: 'networkidle0' })

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: false,
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
    })

    await browser.close()

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${course.title || 'certificate'}.pdf"`,
      },
    })
  } catch (error) {
    console.error(error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
