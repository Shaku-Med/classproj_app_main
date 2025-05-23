'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { HolographicCard } from './HolographicCard';

export const CTASection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <HolographicCard className="p-8 md:p-12">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Ready to Get Started?
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Join thousands of users who are already experiencing the future of digital interaction.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3 text-lg">
                  Sign Up Now
                </Button>
                <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-3 text-lg">
                  Contact Sales
                </Button>
              </div>
            </div>
          </HolographicCard>
        </motion.div>
      </div>
    </section>
  );
}; 