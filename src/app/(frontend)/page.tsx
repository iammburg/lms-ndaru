import './styles.css'
import Hero from '@/components/hero/Hero'
import About from '@/components/about/AboutUs'
import Features from '@/components/courses/Courses'
import Testimonial from '@/components/testimonial/Testimonial'
import Contact from '@/components/contact/Contact'
import Navbar from '@/components/navbar/Navbar'
import { getTenantContext } from '@/lib/tenant'

export default async function HomePage() {
  const { tenant } = await getTenantContext()
  console.log('Tenant data:', tenant)
  return (
    <div>
      {tenant && (
        <div className="w-full bg-cyan-500 text-white py-2 px-6 text-center">
          <h2 className="text-xl font-bold">{tenant.name}</h2>
          <p className="text-sm opacity-90">{tenant.description || 'Selamat datang di platform kami'}</p>
        </div>
      )}
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Testimonial />
      <Contact />
    </div>
  )
}
