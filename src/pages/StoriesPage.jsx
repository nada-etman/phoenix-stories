import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EmberParticles from '@/components/effects/EmberParticles';
import StoriesSection from '@/components/sections/StoriesSection';

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-black">
      <EmberParticles />
      <Navbar />
      <div className="pt-24 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 px-6"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-[#D4AF37]/15">
            <span className="text-[10px] font-bold text-[#D4AF37] tracking-[0.3em] uppercase">Discover</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
            All <span className="gradient-text">Stories</span>
          </h1>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">
            Explore stories from our community. Each image holds a story waiting to be discovered.
          </p>
        </motion.div>
        <StoriesSection />
      </div>
      <Footer />
    </div>
  );
}