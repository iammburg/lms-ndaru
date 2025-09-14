'use client'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ComponentProps } from 'react'
import { usePathname } from 'next/navigation'

export const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => {
  const pathname = usePathname()

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="gap-3 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start">
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              'default-styles',
              pathname === '/dashboard' && 'bg-accent text-accent-foreground',
            )}
          >
            <Link href={'/dashboard'}>Dashboard</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="#">Blog</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="#">About</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="#">Contact Us</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
