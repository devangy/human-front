import { Fira_Code, Inter } from "next/font/google";
import "./globals.css";

import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import LogoMarquee from "@/components/landing/LogoMarquee";
import Stats from "@/components/landing/Stats";
import HowItWorks from "@/components/landing/HowItWorks";
import ProductShowcase from "@/components/landing/ProductShowcase";
import BentoFeatures from "@/components/landing/BentoFeatures";
import Languages from "@/components/landing/Languages";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-display-raw",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-raw",
  display: "swap",
});

export default function Home() {
  return (
    <div
      className={`${firaCode.variable} ${inter.variable} bg-ink relative min-h-screen font-sans text-white antialiased`}
    >
      <div className="bg-grain" />
      <Nav />
      <main>
        <Hero />
        <LogoMarquee />
        <Stats />
        <HowItWorks />
        <ProductShowcase />
        <BentoFeatures />
        <Languages />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
