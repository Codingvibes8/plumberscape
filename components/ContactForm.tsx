"use client"

import { useState, useRef, useEffect } from "react"

const serviceTypes = [
  "Emergency Plumbing",
  "Boiler Services",
  "Drain Cleaning",
  "Bathroom Installation",
  "Leak Detection",
  "Commercial Plumbing",
]

const projectSizes = ["Small", "Medium", "Large", "Enterprise"]

const budgetRanges = [
  "Under £500",
  "£500 - £2,000",
  "£2,000 - £5,000",
  "£5,000+",
]

interface FormData {
  name: string
  email: string
  phone: string
  serviceType: string
  projectSize: string
  message: string
  budgetRange: string
  honeypot: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    projectSize: "",
    message: "",
    budgetRange: "",
    honeypot: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")
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

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        return value.trim().length < 2 ? "Please enter your full name" : ""
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return !emailRegex.test(value) ? "Please enter a valid email address" : ""
      case "message":
        return value.trim().length < 20
          ? "Please provide at least 20 characters describing your needs"
          : ""
      default:
        return ""
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot check
    if (formData.honeypot) {
      return
    }

    // Validate all fields
    const newErrors: FormErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    }

    setErrors(newErrors)

    if (Object.values(newErrors).some((error) => error)) {
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSuccess(true)
    } catch {
      setSubmitError("Something went wrong. Please try again or call us directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <section id="contact" className="bg-navy py-20 lg:py-32">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="animate-fade-up">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue/20">
              <svg
                className="h-10 w-10 text-blue-light"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-3xl font-bold text-ivory sm:text-4xl">
              Thank You, {formData.name.split(" ")[0]}!
            </h2>
            <p className="mt-4 text-lg text-ivory/80">
              We&apos;ve received your enquiry and will be in touch within 24 hours.
              For urgent matters, please call us directly.
            </p>
            <a
              href="tel:+442071234567"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue px-8 py-4 font-semibold text-white transition-all hover:bg-blue/90"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              020 7123 4567
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-navy py-20 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <h2 className="font-display text-3xl font-bold text-ivory sm:text-4xl lg:text-5xl">
            Get Your Free Quote
          </h2>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-copper" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ivory/80">
            Tell us about your plumbing needs and we&apos;ll get back to you with a detailed quote within 24 hours.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-5">
          {/* Form */}
          <div className={`lg:col-span-3 ${isVisible ? "animate-fade-up stagger-2" : "opacity-0"}`}>
            {submitError && (
              <div className="mb-6 rounded-lg bg-red-500/20 p-4 text-red-300">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-ivory">
                    Full Name <span className="text-copper">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`mt-2 w-full rounded-lg border bg-white/10 px-4 py-3 text-ivory placeholder-ivory/50 backdrop-blur-sm transition-colors focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue ${
                      errors.name ? "border-red-500" : "border-ivory/20"
                    }`}
                    placeholder="John Smith"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-ivory">
                    Email Address <span className="text-copper">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`mt-2 w-full rounded-lg border bg-white/10 px-4 py-3 text-ivory placeholder-ivory/50 backdrop-blur-sm transition-colors focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue ${
                      errors.email ? "border-red-500" : "border-ivory/20"
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-ivory">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-ivory/20 bg-white/10 px-4 py-3 text-ivory placeholder-ivory/50 backdrop-blur-sm transition-colors focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
                    placeholder="020 1234 5678"
                  />
                </div>

                {/* Service Type */}
                <div>
                  <label htmlFor="serviceType" className="block text-sm font-medium text-ivory">
                    Service Required
                  </label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-ivory/20 bg-white/10 px-4 py-3 text-ivory backdrop-blur-sm transition-colors focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
                  >
                    <option value="" className="text-navy">Select a service</option>
                    {serviceTypes.map((service) => (
                      <option key={service} value={service} className="text-navy">
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Project Size */}
              <div>
                <label className="block text-sm font-medium text-ivory">Project Size</label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {projectSizes.map((size) => (
                    <label
                      key={size}
                      className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        formData.projectSize === size
                          ? "bg-blue text-white"
                          : "bg-white/10 text-ivory hover:bg-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="projectSize"
                        value={size}
                        checked={formData.projectSize === size}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-ivory">Budget Range</label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {budgetRanges.map((budget) => (
                    <label
                      key={budget}
                      className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        formData.budgetRange === budget
                          ? "bg-copper text-white"
                          : "bg-white/10 text-ivory hover:bg-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="budgetRange"
                        value={budget}
                        checked={formData.budgetRange === budget}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {budget}
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-ivory">
                  Tell Us About Your Project <span className="text-copper">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-2 w-full rounded-lg border bg-white/10 px-4 py-3 text-ivory placeholder-ivory/50 backdrop-blur-sm transition-colors focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue ${
                    errors.message ? "border-red-500" : "border-ivory/20"
                  }`}
                  placeholder="Describe your plumbing needs, any specific issues, preferred timing, etc."
                />
                {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue px-8 py-4 font-semibold text-white transition-all hover:bg-blue/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Submit Request
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className={`lg:col-span-2 ${isVisible ? "animate-fade-up stagger-3" : "opacity-0"}`}>
            <div className="rounded-2xl bg-white/5 p-8 backdrop-blur-sm">
              <h3 className="font-display text-xl font-semibold text-ivory">Contact Information</h3>
              
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-blue/20 p-3">
                    <svg className="h-6 w-6 text-blue-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-ivory">Address</div>
                    <div className="mt-1 text-ivory/70">
                      123 High Street<br />
                      London NW1 2AB
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-blue/20 p-3">
                    <svg className="h-6 w-6 text-blue-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-ivory">Phone</div>
                    <a href="tel:+442071234567" className="mt-1 block text-ivory/70 hover:text-blue-light">
                      020 7123 4567
                    </a>
                    <div className="mt-1 text-sm text-copper">24/7 Emergency Line</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-blue/20 p-3">
                    <svg className="h-6 w-6 text-blue-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-ivory">Email</div>
                    <a href="mailto:info@plumbscape.co.uk" className="mt-1 block text-ivory/70 hover:text-blue-light">
                      info@plumbscape.co.uk
                    </a>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-8 aspect-video overflow-hidden rounded-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19855.832154565888!2d-0.18686567536621094!3d51.53421129999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761ab6f7f85d4f%3A0x5f145d4c21ccc2e3!2sNW1%2C%20London!5e0!3m2!1sen!2suk!4v1709654321!5m2!1sen!2suk"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="PlumbScape location map"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
