"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
  budgetRanges,
  contactSchema,
  preferredContactMethods,
  preferredTimes,
  projectSizes,
  serviceTypes,
  type ContactFormData,
} from "@/lib/validations/contact"

const inputBaseClass =
  "mt-2 w-full rounded-lg border bg-white/10 px-4 py-3 text-ivory placeholder-ivory/50 backdrop-blur-sm transition-colors focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"

const inputErrorClass = "border-red-500"
const inputNormalClass = "border-ivory/20"

const pillBaseClass =
  "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all"

export default function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [referenceId, setReferenceId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const startedAtRef = useRef<number>(Date.now())

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      postcode: "",
      serviceType: "",
      projectSize: "",
      budgetRange: "",
      preferredContactMethod: "Email",
      preferredTime: "No preference",
      message: "",
      consent: false,
      honeypot: "",
      clientTime: 0,
    },
  })

  const messageLength = (watch("message") ?? "").length
  const watchedProjectSize = watch("projectSize")
  const watchedBudgetRange = watch("budgetRange")
  const watchedContactMethod = watch("preferredContactMethod")
  const watchedPreferredTime = watch("preferredTime")
  const watchedConsent = watch("consent")

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

  const onSubmitInvalid = () => {
    const firstErrorField = Object.keys(errors)[0]
    if (firstErrorField) {
      document.getElementById(firstErrorField)?.focus()
    }
    toast.error("Please check the highlighted fields", {
      description: "A few details need your attention before we can send your request.",
    })
  }

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, clientTime: startedAtRef.current }),
      })

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean
        referenceId?: string
        message?: string
        fieldErrors?: Record<string, string[]>
      }

      if (response.ok && payload.ok) {
        setReferenceId(payload.referenceId ?? null)
        setIsSuccess(true)
        toast.success("Request received", {
          description: `Reference ${payload.referenceId}. We'll be in touch within 24 hours.`,
        })
        return
      }

      if (response.status === 429) {
        toast.error("Too many requests", {
          description: "Please wait a minute before trying again.",
        })
        setSubmitError("You've sent several requests recently. Please wait a minute and try again.")
        return
      }

      toast.error("Something went wrong", {
        description: payload.message ?? "Please try again or call us on 020 7123 4567.",
      })
      setSubmitError(payload.message ?? "Something went wrong. Please try again or call us directly.")
    } catch {
      toast.error("Connection error", {
        description: "Please check your internet connection and try again.",
      })
      setSubmitError("Something went wrong. Please try again or call us directly.")
    }
  }

  const resetForm = () => {
    setValue("name", "")
    setValue("email", "")
    setValue("phone", "")
    setValue("postcode", "")
    setValue("serviceType", "")
    setValue("projectSize", "")
    setValue("budgetRange", "")
    setValue("preferredContactMethod", "Email")
    setValue("preferredTime", "No preference")
    setValue("message", "")
    setValue("consent", false)
    setIsSuccess(false)
    setReferenceId(null)
    setSubmitError("")
    startedAtRef.current = Date.now()
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
              Thank You, {watch("name").split(" ")[0] || "There"}!
            </h2>
            <p className="mt-4 text-lg text-ivory/80">
              We&apos;ve received your enquiry and will be in touch within 24 hours.
              For urgent matters, please call us directly.
            </p>

            {referenceId && (
              <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-full border border-ivory/20 bg-white/10 px-6 py-3">
                <span className="text-sm text-ivory/70">Your reference:</span>
                <span className="font-mono text-lg font-semibold tracking-wider text-copper">
                  {referenceId}
                </span>
              </div>
            )}

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="tel:+442071234567"
                className="inline-flex items-center gap-2 rounded-full bg-blue px-8 py-4 font-semibold text-white transition-all hover:bg-blue/90"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                020 7123 4567
              </a>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-full border border-ivory/30 px-8 py-4 font-semibold text-ivory transition-all hover:bg-white/10"
              >
                Submit Another Enquiry
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" ref={sectionRef} className="bg-navy py-20 lg:py-32">
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
              <div
                role="alert"
                className="mb-6 rounded-lg bg-red-500/20 p-4 text-sm text-red-300"
              >
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit, onSubmitInvalid)} className="space-y-6" noValidate>
              {/* Honeypot (hidden from humans and screen readers) */}
              <input
                type="text"
                {...register("honeypot")}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <input type="hidden" {...register("clientTime")} />

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-ivory">
                    Full Name <span className="text-copper">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={`${inputBaseClass} ${errors.name ? inputErrorClass : inputNormalClass}`}
                    placeholder="John Smith"
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-ivory">
                    Email Address <span className="text-copper">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`${inputBaseClass} ${errors.email ? inputErrorClass : inputNormalClass}`}
                    placeholder="john@example.com"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-ivory">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register("phone")}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    className={`${inputBaseClass} ${errors.phone ? inputErrorClass : inputNormalClass}`}
                    placeholder="020 1234 5678"
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <p id="phone-error" className="mt-1 text-sm text-red-400">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Postcode */}
                <div>
                  <label htmlFor="postcode" className="block text-sm font-medium text-ivory">
                    Postcode
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    {...register("postcode")}
                    aria-invalid={!!errors.postcode}
                    aria-describedby={errors.postcode ? "postcode-error" : undefined}
                    className={`${inputBaseClass} ${errors.postcode ? inputErrorClass : inputNormalClass}`}
                    placeholder="NW1 2AB"
                    autoComplete="postal-code"
                  />
                  {errors.postcode && (
                    <p id="postcode-error" className="mt-1 text-sm text-red-400">
                      {errors.postcode.message}
                    </p>
                  )}
                </div>

                {/* Service Type */}
                <div>
                  <label htmlFor="serviceType" className="block text-sm font-medium text-ivory">
                    Service Required <span className="text-copper">*</span>
                  </label>
                  <select
                    id="serviceType"
                    {...register("serviceType")}
                    aria-invalid={!!errors.serviceType}
                    aria-describedby={errors.serviceType ? "serviceType-error" : undefined}
                    className={`${inputBaseClass} ${errors.serviceType ? inputErrorClass : inputNormalClass}`}
                  >
                    <option value="" className="text-navy">Select a service</option>
                    {serviceTypes.map((service) => (
                      <option key={service} value={service} className="text-navy">
                        {service}
                      </option>
                    ))}
                  </select>
                  {errors.serviceType && (
                    <p id="serviceType-error" className="mt-1 text-sm text-red-400">
                      {errors.serviceType.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Project Size */}
              <fieldset>
                <legend className="block text-sm font-medium text-ivory">
                  Project Size <span className="text-copper">*</span>
                </legend>
                <div className="mt-2 flex flex-wrap gap-3">
                  {projectSizes.map((size) => (
                    <label
                      key={size}
                      className={`${pillBaseClass} ${
                        watchedProjectSize === size
                          ? "bg-blue text-white"
                          : "bg-white/10 text-ivory hover:bg-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        value={size}
                        {...register("projectSize")}
                        className="sr-only"
                      />
                      {size}
                    </label>
                  ))}
                </div>
                {errors.projectSize && (
                  <p className="mt-1 text-sm text-red-400">{errors.projectSize.message}</p>
                )}
              </fieldset>

              {/* Budget Range */}
              <fieldset>
                <legend className="block text-sm font-medium text-ivory">
                  Budget Range <span className="text-copper">*</span>
                </legend>
                <div className="mt-2 flex flex-wrap gap-3">
                  {budgetRanges.map((budget) => (
                    <label
                      key={budget}
                      className={`${pillBaseClass} ${
                        watchedBudgetRange === budget
                          ? "bg-copper text-white"
                          : "bg-white/10 text-ivory hover:bg-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        value={budget}
                        {...register("budgetRange")}
                        className="sr-only"
                      />
                      {budget}
                    </label>
                  ))}
                </div>
                {errors.budgetRange && (
                  <p className="mt-1 text-sm text-red-400">{errors.budgetRange.message}</p>
                )}
              </fieldset>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Preferred Contact Method */}
                <fieldset>
                  <legend className="block text-sm font-medium text-ivory">
                    Preferred Contact Method
                  </legend>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {preferredContactMethods.map((method) => (
                      <label
                        key={method}
                        className={`${pillBaseClass} ${
                          watchedContactMethod === method
                            ? "bg-blue text-white"
                            : "bg-white/10 text-ivory hover:bg-white/20"
                        }`}
                      >
                        <input
                          type="radio"
                          value={method}
                          {...register("preferredContactMethod")}
                          className="sr-only"
                        />
                        {method}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Preferred Time */}
                <fieldset>
                  <legend className="block text-sm font-medium text-ivory">
                    Preferred Time
                  </legend>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {preferredTimes.map((time) => (
                      <label
                        key={time}
                        className={`${pillBaseClass} ${
                          watchedPreferredTime === time
                            ? "bg-blue text-white"
                            : "bg-white/10 text-ivory hover:bg-white/20"
                        }`}
                      >
                        <input
                          type="radio"
                          value={time}
                          {...register("preferredTime")}
                          className="sr-only"
                        />
                        {time}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              {/* Message */}
              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor="message" className="block text-sm font-medium text-ivory">
                    Tell Us About Your Project <span className="text-copper">*</span>
                  </label>
                  <span className="text-xs text-ivory/50">{messageLength}/5000</span>
                </div>
                <textarea
                  id="message"
                  rows={5}
                  {...register("message")}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={`${inputBaseClass} resize-none ${errors.message ? inputErrorClass : inputNormalClass}`}
                  placeholder="Describe your plumbing needs, any specific issues, preferred timing, etc."
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-sm text-red-400">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* GDPR Consent */}
              <div>
                <label className="flex items-start gap-3 text-sm text-ivory/80">
                  <input
                    type="checkbox"
                    {...register("consent")}
                    aria-invalid={!!errors.consent}
                    aria-describedby={errors.consent ? "consent-error" : undefined}
                    className="mt-0.5 h-4 w-4 rounded border-ivory/30 bg-white/10 accent-blue"
                  />
                  <span>
                    I agree to PlumbScape storing and using my details to respond to this
                    enquiry, in line with our privacy policy. <span className="text-copper">*</span>
                  </span>
                </label>
                {errors.consent && (
                  <p id="consent-error" className="mt-1 text-sm text-red-400">
                    {errors.consent.message}
                  </p>
                )}
                {watchedConsent && (
                  <p className="mt-2 text-xs text-ivory/50">
                    Your details are used solely to arrange your quote and will never be shared with third parties.
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
                <p className="text-xs text-ivory/50">
                  We&apos;ll reply within 24 hours. Your enquiry is protected by our
                  privacy policy.
                </p>
              </div>
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