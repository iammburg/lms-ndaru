import { Button } from '@/components/ui/button'
import { Logo } from './BrandLogo'
import { NavMenu } from './NavMenu'
import { NavigationSheet } from './NavigationSheet'
import Link from 'next/link'

import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import { fileURLToPath } from 'url'
import config from '@/payload.config'

export default async function Navbar() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <div className="bg-muted sticky top-0 z-50">
      <nav className="h-16 bg-background border-b">
        <div className="h-full flex items-center justify-between max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <div className="flex items-center space-x-2 font-bold text-lg">
              <Logo />
              <span>LMS Ndaru</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />

          <div className="flex items-center gap-3">
            {!user ? (
              <div className="flex items-center gap-3">
                <Button variant="outline" className="hidden sm:inline-flex">
                  <Link href="/login">Log In</Link>
                </Button>
                <Button>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            ) : (
              <Button>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
