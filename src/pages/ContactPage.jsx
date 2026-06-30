import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EmberParticles from '@/components/effects/EmberParticles';
import { Send, Mail, MapPin, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

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
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-[#D4AF37]/15">
            <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[10px] font-bold text-[#D4AF37] tracking-[0.3em] uppercase">Get in Touch</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Contact <span className="gradient-text">Us</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Have questions, suggestions, or just want to say hello? We would love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-4xl mx-auto mt-12">
          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full bg-white/5 border border-[#D4AF37]/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full bg-white/5 border border-[#D4AF37]/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
            />
            <textarea
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              rows={5}
              className="w-full bg-white/5 border border-[#D4AF37]/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50 transition-colors resize-none"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all duration-300"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </motion.form>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="p-5 rounded-2xl border border-[#D4AF37]/10 bg-black/20">
              <Mail className="w-5 h-5 text-[#D4AF37] mb-2" />
              <h3 className="font-semibold text-white text-sm">Email</h3>
              <p className="text-gray-400 text-sm">hello@phoenixstories.com</p>
            </div>
            <div className="p-5 rounded-2xl border border-[#D4AF37]/10 bg-black/20">
              <MapPin className="w-5 h-5 text-[#D4AF37] mb-2" />
              <h3 className="font-semibold text-white text-sm">Location</h3>
              <p className="text-gray-400 text-sm">Cairo, Egypt</p>
            </div>
            <div className="p-5 rounded-2xl border border-[#D4AF37]/10 bg-black/20">
              <MessageCircle className="w-5 h-5 text-[#D4AF37] mb-2" />
              <h3 className="font-semibold text-white text-sm">Social Media</h3>
              <p className="text-gray-400 text-sm">@phoenixstories</p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}