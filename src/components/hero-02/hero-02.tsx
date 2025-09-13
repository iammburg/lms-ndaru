import { Button } from '@/components/ui/button'
import { ArrowUpRight, CirclePlay } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Hero02 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-(--breakpoint-xl) w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12">
        <div>
          <h1 className="mt-6 max-w-[17ch] text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] font-semibold leading-[1.2]! tracking-tighter">
            Ngoding itu menyenangkan bukan? Bukan! 😅
          </h1>
          <p className="mt-6 max-w-[60ch] sm:text-lg">
            Lorem ipsum dolor sit amet itu artinya apa? Aku juga gak tau. Pokoknya nulis biar
            menuhin Hero Section ini. Yang penting nulis. PayloadCMS berat banget asli.
          </p>
          <div className="mt-12 flex items-center gap-4">
            <Button size="lg" className="rounded-full text-base">
              Belajar Sekarang <ArrowUpRight className="h-5! w-5!" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full text-base shadow-none">
              <CirclePlay className="h-5! w-5!" /> Watch Demo
            </Button>
          </div>
        </div>
        <div className="w-full aspect-video bg-accent rounded-xl" />
      </div>
    </div>
  )
}

export default Hero02
