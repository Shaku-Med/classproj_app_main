'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { GlitchText } from './GlitchText';
import { HolographicCard } from './HolographicCard';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <GlitchText className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome to the Future
            </GlitchText>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience the next generation of digital interaction. Join us in creating something extraordinary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3 text-lg">
              Get Started
            </Button>
            <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-3 text-lg">
              Learn More
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16"
        >
          <HolographicCard className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-purple-400 mb-2">100K+</h3>
                <p className="text-gray-300">Active Users</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-pink-400 mb-2">50+</h3>
                <p className="text-gray-300">Features</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-purple-400 mb-2">24/7</h3>
                <p className="text-gray-300">Support</p>
              </div>
            </div>
          </HolographicCard>
        </motion.div>
      </div>
    </section>
  );
}; 