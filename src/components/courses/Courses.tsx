import { TabletSmartphone, Code2, BrainCircuit, ShieldCheck, Network, Frame } from 'lucide-react'
import React from 'react'

const features = [
  {
    icon: Code2,
    title: 'Web Development',
    description:
      'Belajar Web Development dari dasar hingga mahir, mulai dari HTML, CSS, JavaScript, dan framework populer seperti React, Angular, atau Vue.',
  },
  {
    icon: TabletSmartphone,
    title: 'Mobile Development',
    description:
      'Kuasai pengembangan aplikasi mobile untuk platform iOS dan Android menggunakan teknologi seperti React Native, Flutter, atau Swift.',
  },
  {
    icon: BrainCircuit,
    title: 'AI & Machine Learning',
    description:
      'Pelajari konsep dasar dan teknik lanjutan dalam kecerdasan buatan dan pembelajaran mesin, termasuk penggunaan library seperti TensorFlow dan PyTorch.',
  },
  {
    icon: ShieldCheck,
    title: 'Cybersecurity',
    description:
      'Dapatkan pengetahuan tentang keamanan siber, termasuk teknik perlindungan data, enkripsi, dan praktik terbaik untuk menjaga sistem tetap aman.',
  },
  {
    icon: Network,
    title: 'Jaringan & Infrastruktur',
    description:
      'Pelajari tentang jaringan komputer, protokol, dan infrastruktur TI yang mendukung operasi bisnis modern.',
  },
  {
    icon: Frame,
    title: 'UI/UX Design',
    description:
      'Tingkatkan keterampilan desain UI/UX dengan mempelajari prinsip-prinsip desain, alat desain populer, dan praktik terbaik industri.',
  },
]

const Features = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 mt-14" id="courses">
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl md:leading-[1.2] mt-7 font-semibold tracking-tight text-center">
          Kelas dan Materi
        </h2>
        <div className="mt-10 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-(--breakpoint-lg) mx-auto px-6">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col border rounded-xl py-6 px-5">
              <div className="mb-4 h-10 w-10 flex items-center justify-center bg-muted rounded-full">
                <feature.icon className="size-5" />
              </div>
              <span className="text-lg font-semibold">{feature.title}</span>
              <p className="mt-1 text-foreground/80 text-[15px]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Features
