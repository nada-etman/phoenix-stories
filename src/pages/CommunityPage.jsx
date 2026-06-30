import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EmberParticles from '@/components/effects/EmberParticles';
import { Users, Globe, Star, Award } from 'lucide-react';

const members = [
  { name: 'Laila K.', role: 'Top Storyteller', avatar: 'LK', stories: 24, joined: 'Dec 2024', badge: '🏆' },
  { name: 'Omar T.', role: 'Phoenix Rising', avatar: 'OT', stories: 18, joined: 'Jan 2025', badge: '🔥' },
  { name: 'Sara M.', role: 'Hope Weaver', avatar: 'SM', stories: 15, joined: 'Feb 2025', badge: '💫' },
  { name: 'Youssef R.', role: 'Dark Narrator', avatar: 'YR', stories: 21, joined: 'Mar 2025', badge: '🌑' },
  { name: 'Noor A.', role: 'Dream Architect', avatar: 'NA', stories: 12, joined: 'Apr 2025', badge: '✨' },
  { name: 'Karim H.', role: 'Mystery Master', avatar: 'KH', stories: 9, joined: 'May 2025', badge: '🕵️' },
];

const stats = [
  { icon: Users, label: 'Members', value: '2,450+' },
  { icon: Globe, label: 'Stories Shared', value: '8,320+' },
  { icon: Star, label: 'Countries', value: '47' },
  { icon: Award, label: 'Awards', value: '156' },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-black">
      <EmberParticles />
      <Navbar />
      
      <div className="pt-32 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-[#D4AF37]/15">
            <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[10px] font-bold text-[#D4AF37] tracking-[0.3em] uppercase">Our Community</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Where <span className="gradient-text">Stories</span> Come Alive
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            A community built for dreamers, survivors, and believers. This is your space to rise, share, and inspire.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-2xl border border-[#D4AF37]/10 bg-black/20">
              <stat.icon className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            Our <span className="text-[#D4AF37]">Shining</span> Members
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl border border-[#D4AF37]/10 bg-black/20 hover:border-[#D4AF37]/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center text-black font-bold text-lg">
                    {member.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{member.name}</h3>
                      <span>{member.badge}</span>
                    </div>
                    <p className="text-xs text-[#D4AF37]">{member.role}</p>
                  </div>
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t border-white/5">
                  <span className="text-xs text-gray-400">{member.stories} stories</span>
                  <span className="text-xs text-gray-500">Joined {member.joined}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}