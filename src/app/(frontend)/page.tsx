import './styles.css'
import Navbar01Page from '@/components/navbar-01/navbar-01'
import Hero02 from '@/components/hero-02/hero-02'
import About from '@/components/about/about'
import Features01Page from '@/components/features-01/features-01'

export default async function HomePage() {
  return (
    <div>
      {/* {!user && <h1 className="text-3xl font-bold text-blue-800">Welcome to your new project.</h1>}
      {user && <h1 className="text-2xl font-bold text-blue-800">Welcome back, {user.email}</h1>} */}

      <Navbar01Page />
      <Hero02 />
      <About />
      <Features01Page />
    </div>
  )
}
