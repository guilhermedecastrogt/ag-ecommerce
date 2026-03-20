"use client";

import { useReveal } from "@/components/useReveal";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Ecommerce from "@/components/Ecommerce";
import Services from "@/components/Services";
import Laboratories from "@/components/Laboratories";
import Scheduling from "@/components/Scheduling";
import Emergency from "@/components/Emergency";
import Brands from "@/components/Brands";
import AboutUs from "@/components/AboutUs";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  useReveal();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Ecommerce />
        <Services />
        <Laboratories />
        <Scheduling />
        <Emergency />
        <Brands />
        <AboutUs />
        <Contact />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
