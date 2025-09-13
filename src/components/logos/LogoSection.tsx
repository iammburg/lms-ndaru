import {
  Logo01,
  Logo02,
  Logo03,
  Logo04,
  Logo05,
  Logo06,
  Logo07,
  Logo08,
} from '@/components/logos/Logos'
import { Marquee } from '@/components/ui/marquee'

const Logos07Page = () => {
  return (
    <div className="flex items-center justify-center px-6">
      <div className="overflow-hidden">
        <p className="text-center md:text-lg">
          Terpercaya oleh perusahaan-perusahaan besar (maunya gitu)
        </p>

        <div className="mt-14 max-w-(--breakpoint-xl) space-y-8">
          <Marquee
            pauseOnHover
            className="[--duration:40s] [&_svg]:mr-10 mask-x-from-70% mask-x-to-90%"
          >
            <Logo01 />
            <Logo02 />
            <Logo03 />
            <Logo04 />
            <Logo05 />
            <Logo06 />
            <Logo07 />
            <Logo08 />
          </Marquee>
          <Marquee
            pauseOnHover
            reverse
            className="[--duration:40s] [&_svg]:mr-10 mask-x-from-70% mask-x-to-90%"
          >
            <Logo01 />
            <Logo02 />
            <Logo03 />
            <Logo04 />
            <Logo05 />
            <Logo06 />
            <Logo07 />
            <Logo08 />
          </Marquee>
        </div>
      </div>
    </div>
  )
}

export default Logos07Page
