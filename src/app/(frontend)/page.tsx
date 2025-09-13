import './styles.css'
import Navbar01Page from '@/components/navbar/Navbar'
import Hero02 from '@/components/hero/Hero'
import About from '@/components/about/about'
import Features01Page from '@/components/courses/Courses'
import Testimonial01 from '@/components/Testimonial/Testimonial'
import Contact02Page from '@/components/contact/Contact'

export default async function HomePage() {
  return (
    <div>
      {/* {!user && <h1 className="text-3xl font-bold text-blue-800">Welcome to your new project.</h1>}
      {user && <h1 className="text-2xl font-bold text-blue-800">Welcome back, {user.email}</h1>} */}

      <Navbar01Page />
      <Hero02 />
      <About />
      <Features01Page />
      <Testimonial01 />
      <Contact02Page />
    </div>
  )
}
