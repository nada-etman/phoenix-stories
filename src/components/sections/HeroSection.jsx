import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react';

const socialLinks = [
  { Icon: Instagram, href: 'https://www.facebook.com/?utm_source=chatgpt.com' },  // ← غيري الرابط هنا
  { Icon: Facebook, href: 'https://www.instagram.com/?utm_source=chatgpt.com' },   // ← غيري الرابط هنا
  { Icon: Twitter, href: 'https://x.com/?utm_source=chatgpt.com' },    // ← غيري الرابط هنا
];

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      
      {/* Social Icons */}
      <div className="hidden lg:flex absolute left-8 xl:left-12 top-1/2 -translate-y-1/2 flex-col gap-4 z-20">
        {socialLinks.map(({ Icon, href }, i) => (
          <motion.a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + i * 0.15, duration: 0.5 }}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]/70 hover:text-[#D4AF37] hover:border-[#D4AF37]/60 transition-all duration-300"
          >
            <Icon className="w-4 h-4" />
          </motion.a>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full pt-20 pb-20">
        <div className="max-w-2xl">
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-[#D4AF37] text-sm font-bold tracking-[0.3em] mb-6"
            style={{ willChange: 'transform, opacity' }}
          >
            RISE. REBORN. INSPIRE.
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="font-bold text-6xl lg:text-7xl xl:text-8xl text-white leading-[1.1] mb-6 tracking-tight"
            style={{ willChange: 'transform, opacity' }}
          >
            Every Image<br />
            Holds{' '}
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#FFD700] bg-clip-text text-transparent">
              a Story
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-gray-300 text-lg lg:text-xl mb-10 leading-relaxed max-w-xl"
            style={{ willChange: 'transform, opacity' }}
          >
            Phoenix is a space for real stories of rising, falling, and rising again.
            Share your story. Inspire the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <button
              onClick={() => document.querySelector('#upload')?.scrollIntoView({ behavior: 'smooth' })}
              className="relative bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-semibold px-8 py-4 rounded-full inline-flex items-center gap-3 hover:scale-105 transform transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]"
            >
              SHARE YOUR STORY
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Mobile Social Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex lg:hidden gap-4 mt-8"
          >
            {socialLinks.map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
