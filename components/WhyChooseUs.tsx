"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const stats = [
  { value: 2500, suffix: "+", label: "Projects Completed" },
  { value: 20, suffix: "+", label: "Years Experience" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 24, suffix: "/7", label: "Emergency Support" },
]

const badges = [
  {
    title: "Fully Insured",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Gas Safe Registered",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: "Award Winning",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
]

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let start = 0
          const duration = 2000
          const step = (timestamp: number) => {
            if (!start) start = timestamp
            const progress = Math.min((timestamp - start) / duration, 1)
            setCount(Math.floor(progress * value))
            if (progress < 1) {
              requestAnimationFrame(step)
            }
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, hasAnimated])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

export default function WhyChooseUs() {
  const [isVisible, setIsVisible] = useState(false)
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

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-white py-20 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Image */}
          <div
            className={`relative ${isVisible ? "animate-fade-up" : "opacity-0"}`}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plumber-1%20copy-p2UahXUG4GXa3qa2Y0qlBT4whlL2uS.jpg"
                alt="Professional plumber inspecting industrial plumbing system"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-2xl bg-blue/10" />
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-copper/20" />
          </div>

          {/* Content */}
          <div className={isVisible ? "animate-fade-up stagger-2" : "opacity-0"}>
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
              Why Choose PlumbScape?
            </h2>
            <div className="mt-4 h-1 w-24 rounded-full bg-copper" />
            
            <p className="mt-6 text-lg text-slate leading-relaxed">
              For over two decades, PlumbScape has been the trusted choice for plumbing services across NW London. Our team of Gas Safe registered engineers delivers exceptional workmanship, transparent pricing, and reliable service you can count on.
            </p>

            <p className="mt-4 text-slate leading-relaxed">
              Whether it&apos;s a late-night emergency or a planned renovation, we bring the same level of professionalism and care to every job. Our commitment to customer satisfaction has earned us numerous industry awards and thousands of loyal clients.
            </p>

            {/* Stats Grid */}
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`text-center ${isVisible ? "animate-count-up" : "opacity-0"}`}
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className="font-display text-3xl font-bold text-blue lg:text-4xl">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="mt-1 text-sm text-slate">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="mt-10 flex flex-wrap gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.title}
                  className="inline-flex items-center gap-2 rounded-full bg-copper/10 px-4 py-2 text-sm font-medium text-copper"
                >
                  {badge.icon}
                  {badge.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
