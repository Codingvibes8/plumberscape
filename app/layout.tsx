import type { Metadata } from 'next'
import { DM_Sans, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PlumbScape | Professional Plumbing Services NW London',
  description: 'Award-winning plumbing company specialising in residential and commercial plumbing, emergency repairs, and installations. Serving NW London for over 20 years. Available 24/7.',
  keywords: ['plumber', 'plumbing services', 'emergency plumber', 'boiler repair', 'drain cleaning', 'NW London plumber', 'commercial plumbing'],
  openGraph: {
    title: 'PlumbScape | Professional Plumbing Services NW London',
    description: 'Award-winning plumbing company specialising in residential and commercial plumbing, emergency repairs, and installations.',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PlumbScape | Professional Plumbing Services',
    description: 'Expert plumbing services for homes and businesses in NW London.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "PlumbScape",
              "description": "Professional plumbing services for residential and commercial properties in NW London",
              "url": "https://plumbscape.co.uk",
              "telephone": "+44-20-7123-4567",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 High Street",
                "addressLocality": "London",
                "postalCode": "NW1 2AB",
                "addressCountry": "GB"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "51.5074",
                "longitude": "-0.1278"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "00:00",
                "closes": "23:59"
              },
              "priceRange": "££",
              "areaServed": "NW London"
            })
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
