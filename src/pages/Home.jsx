import React, { lazy, Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';

const UploadSection = lazy(() => import('@/components/sections/UploadSection'));
const StoriesSection = lazy(() => import('@/components/sections/StoriesSection'));
const QuoteSection = lazy(() => import('@/components/sections/QuoteSection'));
const Footer = lazy(() => import('@/components/layout/Footer'));
const EmberParticles = lazy(() => import('@/components/effects/EmberParticles'));

export default function Home() {
  return (
    <div className="relative bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover z-0"
        style={{ willChange: 'transform' }}
      >
        <source src="/videos/phoenix2.mp4" type="video/mp4" />
        <source src="/videos/phoenix2.webm" type="video/webm" />
      </video>

      <div className="fixed inset-0 bg-black/40 z-[1]" />

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        
        <Suspense fallback={null}>
          <UploadSection />
          <StoriesSection />
          <QuoteSection />
          <Footer />
          <EmberParticles />
        </Suspense>
      </div>
    </div>
  );
}