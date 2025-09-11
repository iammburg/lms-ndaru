import { Button } from '@/components/ui/button'
import { Logo } from './logo'
import { NavMenu } from './nav-menu'
import { NavigationSheet } from './navigation-sheet'
import Link from 'next/link'

const Navbar01Page = () => {
  return (
    <div className="bg-muted sticky top-0 z-50">
      <nav className="h-16 bg-background border-b">
        <div className="h-full flex items-center justify-between max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={'/'}>
            <div className="flex items-center space-x-2 font-bold text-lg">
              <Logo />
              <span>LMS Ndaru</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />

          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:inline-flex">
              <Link href={'/login'}>Log In</Link>
            </Button>
            <Button>
              <Link href={'/signup'}>Sign Up</Link>
            </Button>

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

export default Navbar01Page
