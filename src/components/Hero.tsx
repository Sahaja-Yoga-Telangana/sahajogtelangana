import Image from 'next/image'

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[color:var(--surface)]">
      <div className="absolute inset-0" />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Content */}
        <div className="z-10 w-full lg:w-1/2 space-y-6">
          <p className="text-base uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Meditation in Hyderabad that feels simple, calm, and free
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight text-[color:var(--ink)]">
             Sahaja Yoga Meditation
          </h1>
          <p className="text-lg md:text-xl text-[color:var(--muted)] leading-relaxed">
            Experience a gentle, guided practice of Sahaja Yoga meditation. Join free sessions across Hyderabad and Telangana and discover a quieter, clearer mind.
          </p>
          
          <blockquote className="border-l-2 border-[color:var(--accent)] pl-4 text-base md:text-lg text-[color:var(--muted)]">
            “Yoga means union with the divine. When you become one with the divine, the divine starts flowing through you.”
            <footer className="mt-2 text-base text-[color:var(--muted)]">— H. H. Shri Mataji Nirmala Devi</footer>
          </blockquote>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a
              href="#VirtualTour"
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-6 py-3 text-white font-semibold shadow-soft hover:bg-[color:var(--primary-600)] transition-colors"
            >
              Start a guided meditation
            </a>
            <a
              href="/centers"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] px-6 py-3 text-[color:var(--ink)] font-semibold hover:bg-[color:var(--surface-2)] transition-colors"
            >
              Find a center
            </a>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 flex justify-center relative">
          <div className="relative w-72 h-80 md:w-96 md:h-[430px] rounded-[32px] overflow-hidden shadow-soft border border-[color:var(--border)] bg-[color:var(--surface-2)]">
            <Image
              src="/maaa-with-hand.jpg"
              alt="Shri Mataji Nirmala Devi"
              fill
              className="object-cover"
            />
          </div>
        </div>
        
      </div>
      </div>
    </section>
  )
}

export default Hero
