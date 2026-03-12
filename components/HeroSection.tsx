"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"

const heroSlides = [
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plumber-service1-QymbaFT5NB3tDuvdgVKYgNaMUPRdCA.jpg",
    title: "24/7 Emergency Plumbing",
    subtitle: "Fast response when you need it most",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plumber-service3-fNwqb5iIQ5y0auvcNrEQsOqRFcy2LR.jpg",
    title: "Expert Installation & Repair",
    subtitle: "Boilers, water heaters, and complete systems",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plumber-2%20copy-boVxFH57q0OgVaKvsUvTlPYNnDibJb.jpg",
    title: "Professional Service",
    subtitle: "Trusted by homes and businesses across NW London",
  },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }, [])

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <section
      className="relative h-screen min-h-[600px] w-full overflow-hidden"
      aria-label="Hero carousel"
    >
      {/* Background Images */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={currentSlide !== index}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/50 to-navy/80" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl">
          <span className="mb-4 inline-block rounded-full bg-blue/20 px-4 py-2 text-sm font-medium text-blue-light backdrop-blur-sm">
            Trusted Plumbing Experts Since 2004
          </span>
          
          <h1 className="font-display text-4xl font-bold text-ivory sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            {heroSlides[currentSlide].title}
          </h1>
          
          <p className="mt-6 text-lg text-ivory/90 sm:text-xl md:text-2xl">
            {heroSlides[currentSlide].subtitle}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="#services"
              className="inline-flex items-center gap-2 rounded-full bg-blue px-8 py-4 text-base font-semibold text-white transition-all hover:bg-blue/90 hover:shadow-xl hover:shadow-blue/30"
            >
              Explore Our Services
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ivory px-8 py-4 text-base font-semibold text-ivory transition-all hover:bg-ivory hover:text-navy"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Now: 020 7123 4567
            </Link>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                currentSlide === index
                  ? "w-8 bg-copper"
                  : "bg-ivory/50 hover:bg-ivory/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={currentSlide === index}
            />
          ))}
        </div>

        {/* Thumbnail Previews */}
        <div className="absolute bottom-8 right-8 hidden gap-2 lg:flex">
          {heroSlides.map((slide, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`relative h-16 w-24 overflow-hidden rounded-lg transition-all ${
                currentSlide === index
                  ? "ring-2 ring-copper ring-offset-2 ring-offset-navy"
                  : "opacity-60 hover:opacity-100"
              }`}
              aria-label={`Go to slide: ${slide.title}`}
            >
              <Image
                src={slide.image}
                alt=""
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-8 hidden animate-bounce lg:block">
        <svg className="h-8 w-8 text-ivory/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
