
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const CATEGORIES = ['All Stories', 'Rebirth', 'Hope', 'Courage', 'Freedom', 'Love'];

const ALL_STORIES = [
  {
    id: 1,
    title: 'From Darkness to Dawn',
    category: 'Rebirth',
    author: 'Laila K.',
    image: 'https://media.base44.com/images/public/69fafcd79e163ba77254ff65/28069c571_generated_8c6c1811.png',
  },
  {
    id: 2,
    title: 'The Day I Chose Me',
    category: 'Hope',
    author: 'Omar T.',
    image: 'https://media.base44.com/images/public/69fafcd79e163ba77254ff65/71aba5364_generated_52652361.png',
  },
  {
    id: 3,
    title: 'Breaking Walls Within',
    category: 'Courage',
    author: 'Sara M.',
    image: 'https://media.base44.com/images/public/69fafcd79e163ba77254ff65/51cdfe338_generated_8e871f04.png',
  },
  {
    id: 4,
    title: 'I Flew When I Let Go',
    category: 'Freedom',
    author: 'Youssef R.',
    image: 'https://media.base44.com/images/public/69fafcd79e163ba77254ff65/9b40eab3a_generated_950a51ed.png',
  },
  {
    id: 5,
    title: 'A New Beginning',
    category: 'Love',
    author: 'Nour A.',
    image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&q=80',
  },
  {
    id: 6,
    title: 'Rising from the Ashes',
    category: 'Rebirth',
    author: 'Kareem S.',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
  },
  {
    id: 7,
    title: 'The Light Within',
    category: 'Hope',
    author: 'Dina F.',
    image: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?w=800&q=80',
  },
  {
    id: 8,
    title: 'Unbreakable Spirit',
    category: 'Courage',
    author: 'Tarek M.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  },
];

const CARD_WIDTH = 280;   // px — width of each card
const CARD_GAP   = 24;    // px — gap between cards
const STEP       = CARD_WIDTH + CARD_GAP;

export default function StoriesSection() {
  const [activeCategory, setActiveCategory] = useState('All Stories');
  const [offset, setOffset] = useState(0);

  const filtered =
    activeCategory === 'All Stories'
      ? ALL_STORIES
      : ALL_STORIES.filter((s) => s.category === activeCategory);

  // max offset so we don't scroll past the last card
  const maxOffset = Math.max(0, (filtered.length - 4) * STEP);

  const goNext = () => setOffset((o) => Math.min(o + STEP, maxOffset));
  const goPrev = () => setOffset((o) => Math.max(o - STEP, 0));

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setOffset(0);
  };

  return (
    <section id="stories" className="relative py-24 lg:py-32 z-10">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-500" />
            <span className="text-amber-400 text-xl">❦</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-amber-500" />
          </div>
          <h2 className="font-bold text-3xl lg:text-4xl text-white tracking-tight">
            Stories That Rise
          </h2>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`text-xs font-semibold tracking-wider px-5 py-2.5 rounded-full border transition-all duration-300 ${
                activeCategory === cat
                  ? 'border-amber-500 text-amber-400 bg-amber-500/10 backdrop-blur-md'
                  : 'border-amber-500/20 text-amber-200/60 hover:border-amber-500/40 hover:text-amber-300'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </motion.div>

        {/* ── Horizontal carousel ── */}
        <div className="relative">

          {/* Arrow Left */}
          <button
            onClick={goPrev}
            disabled={offset === 0}
            className={`absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-20
              w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border
              hidden md:flex items-center justify-center transition-all duration-300
              ${offset === 0
                ? 'border-amber-500/10 text-amber-300/20 cursor-not-allowed'
                : 'border-amber-500/30 text-amber-400 hover:border-amber-500/60 hover:bg-amber-500/10 cursor-pointer'
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Arrow Right */}
          <button
            onClick={goNext}
            disabled={offset >= maxOffset}
            className={`absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-20
              w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border
              hidden md:flex items-center justify-center transition-all duration-300
              ${offset >= maxOffset
                ? 'border-amber-500/10 text-amber-300/20 cursor-not-allowed'
                : 'border-amber-500/30 text-amber-400 hover:border-amber-500/60 hover:bg-amber-500/10 cursor-pointer'
              }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Viewport — hides overflow */}
          <div className="overflow-hidden">
            {/* Track — all cards in ONE row */}
            <motion.div
              className="flex"
              style={{ gap: CARD_GAP }}
              animate={{ x: -offset }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {filtered.map((story) => (
                <div
                  key={story.id}
                  className="group relative overflow-hidden rounded-2xl border border-amber-500/10
                    hover:border-amber-500/30 transition-all duration-500 cursor-pointer flex-shrink-0"
                  style={{ width: CARD_WIDTH, aspectRatio: '3/5' }}
                >
                  {/* Image */}
                  <img
                    src={story.image}
                    alt={story.title}
                    className="absolute inset-0 w-full h-full object-cover
                      transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold tracking-widest text-amber-400
                      bg-black/50 backdrop-blur-sm border border-amber-500/20 px-2.5 py-1 rounded-full">
                      {story.category.toUpperCase()}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-sm lg:text-base leading-snug mb-2
                      group-hover:text-amber-200 transition-colors duration-300">
                      {story.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center
                        text-[10px] font-bold text-black flex-shrink-0">
                        {story.author[0]}
                      </div>
                      <span className="text-amber-300/60 text-xs font-medium">
                        by {story.author}
                      </span>
                    </div>
                  </div>

                  {/* Shine */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
                    duration-500 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Explore more */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mt-14"
        >
          <button className="group inline-flex items-center gap-2 text-sm font-semibold tracking-wider
            text-amber-300/60 border border-amber-500/20 px-6 py-3 rounded-full
            hover:border-amber-500/40 hover:text-amber-400 hover:bg-amber-500/5 transition-all duration-300">
            EXPLORE MORE STORIES
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}