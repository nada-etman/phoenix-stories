
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import StoryGenerator from "@/components/story/StoryGenerator";


export default function UploadSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFile = (file) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum 10MB.');
      return;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Only JPG and PNG files allowed.');
      return;
    }
    setUploadedFile(file);
    toast.success('Image ready! Now let AI create your story.');
  };

  const resetUpload = () => {
    setUploadedFile(null);
  };

  return (
    <section id="upload" className="relative py-24 lg:py-32 z-10">
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        
        {!uploadedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="backdrop-blur-xl bg-black/40 border border-[#D4AF37]/20 rounded-3xl p-8 lg:p-12 shadow-[0_0_40px_rgba(212,175,55,0.1)]"
          >
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <h2 className="font-bold text-4xl lg:text-5xl text-white mb-5 tracking-tight leading-tight">
                  Start Your Journey
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Upload an image and let AI weave your story. Every picture carries emotions, memories, and meaning.
                </p>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`
                  relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-500
                  p-12 flex flex-col items-center justify-center text-center min-h-[280px] backdrop-blur-md
                  ${isDragging
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 scale-[1.02] shadow-[0_0_30px_rgba(212,175,55,0.3)]'
                    : 'border-[#D4AF37]/30 bg-black/30 hover:border-[#D4AF37]/60 hover:bg-black/40'
                  }
                `}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
                />
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-all duration-500 ${isDragging ? 'bg-[#D4AF37]/20' : 'bg-white/10'}`}>
                  <Upload className={`w-7 h-7 ${isDragging ? 'text-[#D4AF37]' : 'text-gray-300'}`} />
                </div>
                <p className="text-white font-semibold text-lg mb-2">Drag & Drop your image here</p>
                <p className="text-gray-300 text-base">or click to upload</p>
                <p className="text-gray-400 text-sm mt-4">JPG, PNG – Max 10MB</p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Directly to StoryGenerator with Golden Card - NO big preview */
          <StoryGenerator imageFile={uploadedFile} onReset={resetUpload} />
        )}
      </div>
    </section>
  );
}