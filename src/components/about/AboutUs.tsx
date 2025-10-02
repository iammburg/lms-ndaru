import Logos07Page from '../logos/LogoSection'

const About = () => {
  return (
    <div className="relative flex items-start justify-center py-12 overflow-hidden" id="about">
      <div className="relative z-10 text-center max-w-7xl mx-auto w-full px-6">
        <h2 className="mt-6 text-xl sm:text-2xl md:text-3xl lg:text-4xl md:leading-[1.2] font-semibold tracking-tighter">
          Tentang LMS Ndaru
        </h2>
        <p className="mt-6 md:text-lg">
          LMS Ndaru adalah platform pembelajaran daring yang dirancang untuk membantu individu
          belajar mengenai pemrograman dan teknologi informasi. Dengan berbagai kelas dan materi
          yang disusun secara terstruktur, LMS Ndaru bertujuan untuk memberikan pengalaman belajar
          yang menyenangkan dan efektif bagi para penggunanya.
        </p>
        {/* <div className="mt-12 flex items-center justify-center gap-4">
          <Button size="lg" className="rounded-full text-base">
            Belajar Sekarang <ArrowUpRight className="h-5! w-5!" />
          </Button>
          <Button variant="outline" size="lg" className="rounded-full text-base shadow-none">
            <CirclePlay className="h-5! w-5!" /> Tonton Demo
          </Button>
        </div> */}
        <div className="mt-10">
          <Logos07Page />
        </div>
      </div>
    </div>
  )
}

export default About
