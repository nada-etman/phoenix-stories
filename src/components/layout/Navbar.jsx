


import React, { useState, useEffect } from 'react';
import { Flame, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Stories', href: '/stories' },
  { label: 'Community', href: '/community' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (href) => {
    setMobileOpen(false);
    if (href === '/') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-black/70 backdrop-blur-xl border-b border-[#D4AF37]/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleClick('/')}>
            <div className="relative">
              <Flame className="w-7 h-7 text-[#D4AF37]" />
              <div className="absolute inset-0 w-7 h-7 bg-[#D4AF37]/30 rounded-full blur-lg" />
            </div>
            <div>
              <span className="font-semibold text-xl text-white tracking-tight">PHOENIX</span>
              <p className="text-[10px] text-[#D4AF37] -mt-1 tracking-widest">Stories that rise.</p>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleClick(link.href)}
                className={`text-sm transition-colors duration-300 tracking-wide uppercase font-medium ${
                  isActive(link.href) 
                    ? 'text-[#D4AF37]' 
                    : 'text-gray-300 hover:text-[#D4AF37]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <button
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  document.querySelector('#upload')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="relative bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black text-sm font-semibold px-6 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 hover:scale-105"
            >
              SHARE YOUR STORY
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white p-2"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-[#D4AF37]/20"
          >
            <div className="px-6 py-6 space-y-4">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleClick(link.href)}
                  className={`block w-full text-left transition-colors text-sm font-medium tracking-wide ${
                    isActive(link.href) 
                      ? 'text-[#D4AF37]' 
                      : 'text-gray-300 hover:text-[#D4AF37]'
                  }`}
                >
                  {link.label.toUpperCase()}
                </button>
              ))}
              <button
                onClick={() => {
                  navigate('/');
                  setMobileOpen(false);
                  setTimeout(() => {
                    document.querySelector('#upload')?.scrollIntoView({ behavior: 'smooth' });
                  }, 200);
                }}
                className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black text-sm font-semibold px-6 py-3 rounded-full w-full mt-4"
              >
                SHARE YOUR STORY
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}