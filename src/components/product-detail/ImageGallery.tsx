import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  name: string;
}

export default function ImageGallery({ images, name }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prevImage = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <>
      <div className="space-y-4">
        {/* Main image */}
        <div
          className="relative rounded-2xl overflow-hidden border border-white/10 cursor-pointer group aspect-[4/3]"
          onClick={() => setLightboxOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={`${name} - Image ${activeIndex + 1}`}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <ZoomIn
              size={32}
              className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  i === activeIndex
                    ? 'border-primary-500 shadow-lg shadow-primary-500/20'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img
                  src={img}
                  alt={`${name} thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-6 right-6 text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
              onClick={() => setLightboxOpen(false)}
            >
              <X size={28} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 md:left-8 text-white/60 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-10"
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  className="absolute right-4 md:right-8 text-white/60 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-10"
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={`${name} - Full size`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {activeIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
