"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"

const testimonials = [
  {
    quote: "PlumbScape responded within the hour when our pipe burst at 2am. Professional, efficient, and genuinely caring. They saved us from a potential disaster.",
    author: "Sarah Mitchell",
    role: "Homeowner, Hampstead",
    rating: 5,
    avatar: "SM",
  },
  {
    quote: "We've used PlumbScape for all our commercial properties for over 5 years. Their reliability and expertise is unmatched. Highly recommend for any business.",
    author: "James Cooper",
    role: "Property Manager",
    rating: 5,
    avatar: "JC",
  },
  {
    quote: "Fantastic bathroom renovation from start to finish. The team was punctual, clean, and the quality of work exceeded our expectations. Worth every penny.",
    author: "Emma Thompson",
    role: "Homeowner, St John's Wood",
    rating: 5,
    avatar: "ET",
  },
  {
    quote: "Their leak detection service found a hidden leak that two other plumbers missed. Saved us thousands in potential water damage. True professionals.",
    author: "Michael Chen",
    role: "Restaurant Owner",
    rating: 5,
    avatar: "MC",
  },
  {
    quote: "Boiler installation was seamless. Fair pricing, no hidden costs, and they even cleaned up better than when they arrived. Will definitely use again.",
    author: "Lisa Patterson",
    role: "Homeowner, Kilburn",
    rating: 5,
    avatar: "LP",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-5 w-5 ${i < rating ? "text-copper" : "text-slate/30"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [nextSlide])

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

  useEffect(() => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / testimonials.length
      scrollRef.current.scrollTo({
        left: cardWidth * currentIndex,
        behavior: "smooth",
      })
    }
  }, [currentIndex])

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="bg-white py-20 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
            What Our Clients Say
          </h2>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-copper" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate">
            Don&apos;t just take our word for it. Here&apos;s what our valued customers have to say about our plumbing services.
          </p>
        </div>

        {/* Large Quote Mark */}
        <div className="relative mt-16">
          <svg
            className="absolute -top-8 left-0 h-24 w-24 text-copper/10 lg:-left-8"
            fill="currentColor"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>

          {/* Testimonials Carousel */}
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.author}
                className={`w-full flex-shrink-0 snap-center rounded-2xl bg-ivory p-8 sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] ${
                  isVisible ? "animate-fade-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <StarRating rating={testimonial.rating} />
                <p className="mt-6 text-lg leading-relaxed text-navy">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue text-sm font-semibold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-navy">{testimonial.author}</div>
                    <div className="text-sm text-slate">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prevSlide}
              className="rounded-full bg-ivory p-3 text-navy transition-all hover:bg-blue hover:text-white"
              aria-label="Previous testimonial"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    currentIndex === index ? "w-6 bg-copper" : "bg-slate/30 hover:bg-slate/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={currentIndex === index}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="rounded-full bg-ivory p-3 text-navy transition-all hover:bg-blue hover:text-white"
              aria-label="Next testimonial"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
