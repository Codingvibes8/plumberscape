import { z } from "zod"

export const serviceTypes = [
  "Emergency Plumbing",
  "Boiler Services",
  "Drain Cleaning",
  "Bathroom Installation",
  "Leak Detection",
  "Commercial Plumbing",
] as const

export const projectSizes = ["Small", "Medium", "Large", "Enterprise"] as const

export const budgetRanges = [
  "Under £500",
  "£500 - £2,000",
  "£2,000 - £5,000",
  "£5,000+",
] as const

export const preferredContactMethods = ["Email", "Phone"] as const

export const preferredTimes = [
  "Urgent (ASAP)",
  "Morning (8am - 12pm)",
  "Afternoon (12pm - 5pm)",
  "Evening (5pm - 8pm)",
  "No preference",
] as const

const phoneRegex = /^[+()\-.\s\d]{7,30}$/
const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/

export const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Please enter your full name")
      .max(100, "Name must be under 100 characters")
      .regex(
        /^[a-zA-Z\u00C0-\u024F' .\-\u2019]+$/,
        "Please use only letters, spaces, apostrophes or hyphens"
      ),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .max(254, "Email address is too long"),

    phone: z
      .string()
      .trim()
      .max(30, "Phone number is too long")
      .refine(
        (value) => value === "" || phoneRegex.test(value),
        "Please enter a valid phone number (e.g. 020 7123 4567)"
      ),

    postcode: z
      .string()
      .trim()
      .max(10, "Postcode is too long")
      .refine(
        (value) => value === "" || postcodeRegex.test(value.toUpperCase()),
        "Please enter a valid UK postcode (e.g. NW1 2AB)"
      ),

    serviceType: z.union([z.literal(""), z.enum(serviceTypes)]),

    projectSize: z.union([z.literal(""), z.enum(projectSizes)]),

    budgetRange: z.union([z.literal(""), z.enum(budgetRanges)]),

    preferredContactMethod: z.enum(preferredContactMethods),

    preferredTime: z.enum(preferredTimes),

    message: z
      .string()
      .trim()
      .min(20, "Please provide at least 20 characters describing your needs")
      .max(5000, "Message must be under 5,000 characters"),

    consent: z
      .boolean()
      .refine((value) => value === true, {
        message:
          "Please agree to us storing and using your details to respond to this enquiry",
      }),

    honeypot: z.string().max(0),

    clientTime: z.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.serviceType === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["serviceType"],
        message: "Please select a service",
      })
    }
    if (data.projectSize === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["projectSize"],
        message: "Please select a project size",
      })
    }
    if (data.budgetRange === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["budgetRange"],
        message: "Please select a budget range",
      })
    }
  })

export type ContactFormData = z.infer<typeof contactSchema>