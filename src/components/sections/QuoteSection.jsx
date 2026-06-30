
import React from 'react';
import { motion } from 'framer-motion';

const QUOTE_BG = 'https://media.base44.com/images/public/69fafcd79e163ba77254ff65/187eac17a_generated_b9c9dc6f.png';

export default function QuoteSection() {
  return (
    <section id="quote" className="relative py-24 lg:py-32 overflow-hidden z-10">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={QUOTE_BG}
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Glow line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
        >
          {/* Quote mark */}
          <div className="text-amber-400 text-5xl font-serif mb-6 leading-none">"</div>

          <blockquote className="font-bold text-xl sm:text-2xl lg:text-3xl text-white leading-relaxed tracking-tight">
            Not every ending is an end…
            <br />
            some are wings waiting to{' '}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent font-extrabold">
              rise.
            </span>
          </blockquote>

          {/* Decorative glow */}
          <div className="mt-8 flex justify-center">
            <div className="w-16 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}