import './styles.css'
import Hero from '@/components/hero/Hero'
import About from '@/components/about/AboutUs'
import Features from '@/components/courses/Courses'
import Testimonial from '@/components/testimonial/Testimonial'
import Contact from '@/components/contact/Contact'
import Navbar from '@/components/navbar/Navbar'

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Testimonial />
      <Contact />
    </div>
  )
}
