import { Button } from '@/components/ui/button'
import { ArrowUpRight, CirclePlay } from 'lucide-react'
import Image from 'next/image'
// import Link from 'next/link'
import React from 'react'
import CodingIllustration from '../../public/assets/Coding-1.png'

const Hero = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8" id="home">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-14 items-center">
          <div className="">
            <h1 className="text-4xl max-w-2xl mx-auto lg:mx-0 md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] font-semibold leading-[1.2]! tracking-tighter">
              Ngoding itu menyenangkan bukan? <span className="text-rose-700">Bukan!</span> 😅
            </h1>

            <p className="text-lg sm:text-xl mt-3 mb-6 max-w-2xl mx-auto lg:mx-0">
              Lorem ipsum dolor sit amet itu artinya apa? Aku juga gak tau. Pokoknya nulis biar
              menuhin Hero Section ini. Yang penting nulis. Kombinasi Next.js + PayloadCMS.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button size="lg" className="rounded-full text-base px-8 py-3 w-full sm:w-auto">
                Belajar Sekarang <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full text-base shadow-none px-8 py-3 w-full sm:w-auto border-gray-600 hover:border-gray-400"
              >
                <CirclePlay className="mr-2 h-5 w-5" /> Tonton Demo
              </Button>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="w-full flex items-center justify-center lg:justify-end">
              <Image
                src={CodingIllustration}
                alt="Coding Illustration"
                width={800}
                height={800}
                className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl xl:max-w-3xl h-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
