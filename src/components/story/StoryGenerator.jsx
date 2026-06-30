
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Pen, ArrowLeft } from 'lucide-react';
import { generateCaption, generateStory, critiqueStory } from "@/api/apiClient";
import StoryDisplay from './StoryDisplay';

const GENRES = [
  { id: 'phoenix', label: 'Rise', icon: '🔥' },
  { id: 'dramatic', label: 'Drama', icon: '🎭' },
  { id: 'thriller', label: 'Thriller', icon: '🌑' },
  { id: 'fairyTale', label: 'Fairy', icon: '✨' },
  { id: 'noir', label: 'Noir', icon: '🕵️' },
  { id: 'hopeful', label: 'Hope', icon: '💫' },
];

export default function StoryGenerator({ imageFile, onComplete, onReset }) {
  const [genre, setGenre] = useState('phoenix');
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyData, setStoryData] = useState(null);
  const [steps, setSteps] = useState([]);
  const [previewUrl] = useState(() => URL.createObjectURL(imageFile));

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const startGeneration = async () => {
    setIsGenerating(true);
    setSteps([]);
    
    try {
      setSteps([{ agent: 'Vision Agent', status: 'analyzing' }]);
      const caption = await generateCaption(imageFile);
      setSteps([{ agent: 'Vision Agent', status: 'done' }]);

      setSteps(prev => [...prev, { agent: 'Narrative Architect', status: 'writing' }]);
      const story = await generateStory(caption, genre);
      setSteps(prev => [...prev, { agent: 'Narrative Architect', status: 'done' }]);

      setSteps(prev => [...prev, { agent: 'Story Critic', status: 'reviewing' }]);
      const critique = await critiqueStory(story, caption);
      setSteps(prev => [...prev, { agent: 'Story Critic', status: 'done' }]);

      setStoryData({ caption, story, critique, genre });
      onComplete?.({ caption, story, critique, genre });
      
    } catch (error) {
      console.error('Generation error:', error);
      setSteps(prev => [...prev, { agent: 'Error', status: 'failed' }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!storyData ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            {/* Back Button */}
            {onReset && (
              <button
                onClick={onReset}
                className="mb-6 flex items-center gap-2 text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-medium tracking-wide">Upload Different Image</span>
              </button>
            )}

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
              
              {/* LEFT SIDE - Controls */}
              <div className="flex flex-col justify-center space-y-8">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                    Your Image,{' '}
                    <span className="gradient-text">Your Story</span>
                  </h2>
                </div>

                {/* Genre Selection */}
                <div>
                  <p className="text-[10px] font-semibold text-[#D4AF37]/40 tracking-[0.3em] uppercase mb-4">Pick a Vibe</p>
                  <div className="grid grid-cols-3 gap-2">
                    {GENRES.map((g) => (
                      <motion.button
                        key={g.id}
                        onClick={() => setGenre(g.id)}
                        disabled={isGenerating}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`
                          relative p-3 rounded-xl text-center transition-all duration-300
                          disabled:opacity-50 disabled:cursor-not-allowed
                          ${genre === g.id
                            ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                            : 'bg-white/[0.02] border border-white/5 text-gray-300 hover:border-[#D4AF37]/30 hover:bg-white/[0.04]'
                          }
                        `}
                      >
                        <span className="relative block text-xl mb-1">{g.icon}</span>
                        <span className={`relative block text-[11px] font-bold ${genre === g.id ? 'text-black' : 'text-gray-300'}`}>
                          {g.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <motion.button
                  onClick={startGeneration}
                  disabled={isGenerating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative w-full overflow-hidden
                    bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37]
                    text-black font-bold px-6 py-4 rounded-2xl
                    inline-flex items-center justify-center gap-3 
                    transition-all duration-300 
                    hover:shadow-[0_0_50px_rgba(212,175,55,0.5)]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    group
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative flex items-center gap-3">
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm tracking-wide">Weaving Magic...</span>
                      </>
                    ) : (
                      <>
                        <Pen className="w-5 h-5" />
                        <span className="text-sm tracking-wide">Generate Story</span>
                      </>
                    )}
                  </span>
                </motion.button>

                {/* Progress Steps */}
                <AnimatePresence>
                  {steps.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-1.5"
                    >
                      {steps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-3 px-3 py-2"
                        >
                          <div className={`
                            w-1.5 h-1.5 rounded-full
                            ${step.status === 'done' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 
                              step.status === 'failed' ? 'bg-red-400' : 
                              'bg-[#D4AF37] animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.8)]'}
                          `} />
                          <span className="text-[11px] text-gray-400">{step.agent}</span>
                          <span className={`
                            text-[10px] ml-auto font-medium
                            ${step.status === 'done' ? 'text-green-400' : 
                              step.status === 'failed' ? 'text-red-400' : 'text-[#D4AF37]'}
                          `}>
                            {step.status === 'done' ? '✓' : step.status === 'failed' ? '✗' : '...'}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* RIGHT SIDE - Golden Image Card with Glow */}
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  {/* Golden Glow around the card */}
                  <div className="absolute -inset-2 bg-gradient-to-br from-[#D4AF37]/20 via-[#F4D03F]/10 to-[#B8960C]/20 rounded-3xl blur-xl opacity-50" />
                  
                  <div className="relative bg-gradient-to-b from-black/60 via-black/70 to-black/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-[0_0_60px_rgba(212,175,55,0.15)]">
                    
                    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                      <img
                        src={previewUrl}
                        alt="Your image"
                        className="w-full h-full object-cover rounded-3xl"
                      />
                      
                      {/* Inner Golden Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/20 via-transparent to-transparent" />
                      
                      {/* Light Shine effect on top */}
                      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                      
                      {/* Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase border border-[#D4AF37]/40 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                          ✦ Your Image
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* RESULT VIEW - Story Left, Golden Card Right */
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {onReset && (
              <button
                onClick={onReset}
                className="flex items-center gap-2 text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-medium tracking-wide">Upload Different Image</span>
              </button>
            )}

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
              {/* LEFT - Story */}
              <div>
                <StoryDisplay storyData={storyData} />
              </div>
              
              {/* RIGHT - Golden Card */}
              <div className="flex items-start">
                <div className="relative w-full max-w-sm mx-auto sticky top-24">
                  {/* Golden Glow */}
                  <div className="absolute -inset-2 bg-gradient-to-br from-[#D4AF37]/15 via-[#F4D03F]/8 to-[#B8960C]/15 rounded-2xl blur-lg opacity-40" />
                  
                  <div className="relative bg-gradient-to-b from-black/60 via-black/70 to-black/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-[0_0_40px_rgba(212,175,55,0.1)]">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                      <img
                        src={previewUrl}
                        alt="Your image"
                        className="w-full h-full object-cover rounded-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/15 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-[9px] font-bold text-[#D4AF37] tracking-[0.15em] uppercase border border-[#D4AF37]/30 shadow-[0_0_8px_rgba(212,175,55,0.15)]">
                          ✦ Your Image
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
