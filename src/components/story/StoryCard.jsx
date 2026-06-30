
import React from 'react';
import { motion } from 'framer-motion';

const CATEGORY_COLORS = {
  Rebirth: 'bg-amber-500/90 text-black',
  Hope: 'bg-amber-600/90 text-black',
  Courage: 'bg-amber-400/90 text-black',
  Freedom: 'bg-amber-500/90 text-black',
  Love: 'bg-amber-600/90 text-black',
};

export default function StoryCard({ story, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group cursor-pointer"
    >
      <div className="relative rounded-xl overflow-hidden bg-black/40 backdrop-blur-xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${CATEGORY_COLORS[story.category] || 'bg-amber-500/80 text-black'}`}>
              {story.category.toUpperCase()}
            </span>
          </div>

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-amber-500/10 via-transparent to-amber-500/5" />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-white text-sm lg:text-base mb-2 group-hover:text-amber-400 transition-colors duration-300">
            {story.title}
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black text-[10px] font-bold">
              {story.author[0]}
            </div>
            <span className="text-amber-200/50 text-xs">by {story.author}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}