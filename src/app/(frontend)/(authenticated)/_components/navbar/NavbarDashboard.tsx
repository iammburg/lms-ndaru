import { Logo } from './BrandLogo'
import { NavMenu } from './NavMenu'
import { NavigationSheet } from './NavigationSheet'
import LogoutButton from '../LogoutButton'
import { getTenantContext } from '@/lib/tenant'

const NavbarDashboard = async () => {
  const { isMainApp } = await getTenantContext()

  return (
    <div className="bg-muted sticky top-0 z-50">
      <nav className="h-16 bg-background border-b">
        <div className="h-full flex items-center justify-between max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Logo />

            {/* Desktop Menu */}
            <NavMenu isMainApp={isMainApp} className="hidden md:block" />
          </div>

          <div className="flex items-center gap-3">
            <LogoutButton />

            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet isMainApp={isMainApp} />
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavbarDashboard
