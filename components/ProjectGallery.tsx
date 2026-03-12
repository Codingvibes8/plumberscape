"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

const projects = [
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plumber-at-drain-CJzuMhjpqrWPGdHtZgzGr0rxMUkcrD.jpg",
    title: "Commercial Drain Installation",
    location: "Camden, NW1",
    category: "Commercial",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plumber-2%20copy-boVxFH57q0OgVaKvsUvTlPYNnDibJb.jpg",
    title: "Luxury Bathroom Renovation",
    location: "Hampstead, NW3",
    category: "Residential",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plumber-service3-fNwqb5iIQ5y0auvcNrEQsOqRFcy2LR.jpg",
    title: "Multi-Unit Boiler System",
    location: "Kilburn, NW6",
    category: "Commercial",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plumber-service2-w6joZ86P3Su6e35FmWSRvVVlVZzLlf.jpg",
    title: "Leak Detection Survey",
    location: "St John's Wood, NW8",
    category: "Residential",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plumber-service1-QymbaFT5NB3tDuvdgVKYgNaMUPRdCA.jpg",
    title: "Emergency Pipe Repair",
    location: "West Hampstead, NW6",
    category: "Emergency",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plumber-1%20copy-p2UahXUG4GXa3qa2Y0qlBT4whlL2uS.jpg",
    title: "Industrial Water System",
    location: "Cricklewood, NW2",
    category: "Commercial",
  },
]

const categories = ["All", "Residential", "Commercial", "Emergency"]

export default function ProjectGallery() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [isVisible, setIsVisible] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<typeof projects[0] | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="bg-ivory py-20 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
            Our Recent Projects
          </h2>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-copper" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate">
            Browse our portfolio of completed plumbing projects across residential and commercial properties in NW London.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                activeCategory === category
                  ? "bg-blue text-white shadow-lg shadow-blue/30"
                  : "bg-white text-navy hover:bg-blue/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <button
              key={project.title}
              onClick={() => setLightboxImage(project)}
              className={`group relative aspect-[4/3] overflow-hidden rounded-2xl bg-navy ${
                isVisible ? "animate-fade-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 translate-y-full p-6 text-left transition-transform duration-300 group-hover:translate-y-0">
                <span className="inline-block rounded-full bg-copper/20 px-3 py-1 text-xs font-medium text-copper backdrop-blur-sm">
                  {project.category}
                </span>
                <h3 className="mt-2 font-display text-xl font-semibold text-ivory">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-ivory/80">{project.location}</p>
              </div>

              {/* Zoom Icon */}
              <div className="absolute right-4 top-4 rounded-full bg-white/20 p-2 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/95 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
            onClick={() => setLightboxImage(null)}
            aria-label="Close lightbox"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div
            className="relative max-h-[80vh] max-w-5xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImage.image}
              alt={lightboxImage.title}
              width={1200}
              height={800}
              className="h-auto w-full object-contain"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 to-transparent p-8">
              <h3 className="font-display text-2xl font-semibold text-ivory">
                {lightboxImage.title}
              </h3>
              <p className="mt-1 text-ivory/80">{lightboxImage.location}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
