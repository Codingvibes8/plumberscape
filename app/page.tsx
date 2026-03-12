import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection"
import ServicesSection from "@/components/ServicesSection"
import WhyChooseUs from "@/components/WhyChooseUs"
import ProjectGallery from "@/components/ProjectGallery"
import TestimonialsSection from "@/components/TestimonialsSection"
import ContactForm from "@/components/ContactForm"
import Footer from "@/components/Footer"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <WhyChooseUs />
        <ProjectGallery />
        <TestimonialsSection />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
