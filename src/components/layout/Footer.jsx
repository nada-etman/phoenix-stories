import React from 'react';
import { Flame, Instagram, Facebook, X , Youtube, Send } from 'lucide-react';

const FOOTER_LINKS = {
  Explore: ['Stories', 'Community', 'Challenges', 'Top Contributors'],
  Company: ['About Us', 'How It Works', 'Our Mission', 'Contact'],
  Support: ['Help Center', 'Guidelines', 'Privacy Policy', 'Terms of Service'],
};

const SOCIALS = [
  { Icon: Instagram, href: '#' },  // ← غيري الرابط هنا
  { Icon: Facebook, href: '#' },   // ← غيري الرابط هنا
  { Icon: X, href: '#' },    // ← غيري الرابط هنا
  { Icon: Youtube, href: '#' },    // ← غيري الرابط هنا
];

export default function Footer() {
  return (
    <footer id="footer" className="relative pt-20 pb-8 border-t border-amber-500/10 z-10">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          {/* Logo column */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative">
                <Flame className="w-7 h-7 text-amber-400" />
                <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-lg" />
              </div>
              <div>
                <span className="font-bold text-lg text-amber-400 tracking-tight">PHOENIX</span>
                <p className="text-[10px] text-amber-400/50 -mt-1 tracking-widest">Stories that rise.</p>
              </div>
            </div>
            <p className="text-amber-200/40 text-sm leading-relaxed max-w-xs">
              A community built for dreamers, survivors, and believers. This is your space to rise.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-amber-400 text-sm mb-5 tracking-wide">{title.toUpperCase()}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-amber-200/40 text-sm hover:text-amber-400 transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Stay Connected */}
          <div>
            <h4 className="font-bold text-amber-400 text-sm mb-5 tracking-wide">STAY CONNECTED</h4>
            <div className="flex gap-3 mb-5">
              {SOCIALS.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 backdrop-blur-md border border-amber-500/20 flex items-center justify-center text-amber-300/50 hover:text-amber-400 hover:border-amber-500/40 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-black/30 backdrop-blur-md border border-amber-500/20 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-amber-200/30 focus:outline-none focus:border-amber-500/40 transition-colors"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
                <Send className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-amber-500/10 pt-6">
          <p className="text-center text-amber-200/30 text-xs">
            © 2024 Phoenix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
