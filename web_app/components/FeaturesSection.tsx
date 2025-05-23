'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { HolographicCard } from './HolographicCard';
import { CustomIcons } from './icons';

const features = [
  {
    title: 'AI-Powered Interactions',
    description: 'Experience seamless conversations with our advanced AI technology.',
    icon: CustomIcons.Chat,
  },
  {
    title: 'Real-time Collaboration',
    description: 'Work together with others in real-time, no matter where you are.',
    icon: CustomIcons.Community,
  },
  {
    title: 'Smart Matching',
    description: 'Find your perfect match with our intelligent matching system.',
    icon: CustomIcons.Dating,
  },
  {
    title: 'Content Creation',
    description: 'Create and share amazing content with our powerful tools.',
    icon: CustomIcons.Videos,
  },
  {
    title: 'Social Feed',
    description: 'Stay connected with your community through our dynamic feed.',
    icon: CustomIcons.Feed,
  },
  {
    title: 'Premium Features',
    description: 'Unlock exclusive features with our premium membership.',
    icon: CustomIcons.Sparkles,
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the tools and capabilities that make our platform unique
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <HolographicCard className="h-full p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 mb-4 text-purple-400">
                    <feature.icon />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </HolographicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}; 