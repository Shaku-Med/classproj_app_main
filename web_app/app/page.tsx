'use client'
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { FloatingParticles } from "../components/FloatingParticles";
import { GlitchText } from "../components/GlitchText";
import { HolographicCard } from "../components/HolographicCard";
import { CustomIcons } from "../components/icons";
import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { CTASection } from "../components/CTASection";

export default function ModernLandingPage() {
  return (
    <>
      <FloatingParticles />
      
      {/* <div className="fixed filter-blur-lg inset-0 bg-gradient-to-br from-background/20 via-background to-primary/20" /> */}
      
      <Navbar />
      
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </>
  );
}