import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EmberParticles from '@/components/effects/EmberParticles';
import { Flame, Eye, Pen, Award } from 'lucide-react';

const features = [
  { icon: Eye, title: 'AI Vision', desc: 'Our AI analyzes your image deeply, understanding every detail, color, and emotion.' },
  { icon: Pen, title: 'Story Generation', desc: 'From the analysis, our Narrative Architect crafts a unique story just for you.' },
  { icon: Award, title: 'Quality Guaranteed', desc: 'Every story is reviewed by our Critic Agent before reaching your eyes.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <EmberParticles />
      <Navbar />
      
      <div className="pt-32 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Flame className="w-10 h-10 text-[#D4AF37]" />
              <div className="absolute inset-0 bg-[#D4AF37]/30 rounded-full blur-xl" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            About <span className="gradient-text">Phoenix</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Phoenix is not just a storytelling platform. It is a place where images transform into words, where emotions become narratives, and where every picture finds its voice.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16"
        >
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl border border-[#D4AF37]/10 bg-black/20 text-center hover:border-[#D4AF37]/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center max-w-xl mx-auto mt-20"
        >
          <div className="text-[#D4AF37] text-4xl font-serif mb-4">"</div>
          <blockquote className="text-xl font-bold text-white leading-relaxed">
            Not every ending is an end… some are wings waiting to{' '}
            <span className="gradient-text">rise.</span>
          </blockquote>
          <div className="mt-6 w-16 h-0.5 bg-gradient-to-r from-[#D4AF37] to-transparent mx-auto rounded-full" />
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}