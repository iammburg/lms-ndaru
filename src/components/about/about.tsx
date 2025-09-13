import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowUpRight, CirclePlay } from 'lucide-react'
import Link from 'next/link'

const About = () => {
  return (
    <div
      className="relative flex items-start justify-center p-6 py-10 overflow-hidden mt-12 mb-14 "
      id="about"
    >
      <div className="relative z-10 text-center max-w-3xl">
        <h2 className="mt-6 text-xl sm:text-2xl md:text-3xl lg:text-4xl md:leading-[1.2] font-semibold tracking-tighter">
          Tentang LMS Ndaru
        </h2>
        <p className="mt-6 md:text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button size="lg" className="rounded-full text-base">
            Belajar Sekarang <ArrowUpRight className="h-5! w-5!" />
          </Button>
          <Button variant="outline" size="lg" className="rounded-full text-base shadow-none">
            <CirclePlay className="h-5! w-5!" /> Tonton Demo
          </Button>
        </div>
      </div>
    </div>
  )
}

export default About
