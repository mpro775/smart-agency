import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Monitor, Play, Rocket, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectGalleryProps {
  displayImages: string[];
  videoUrl?: string;
  heroImage: string;
  title: string;
}

function isYoutubeUrl(url?: string) {
  if (!url) return false;
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export default function ProjectGallery({ displayImages, videoUrl, heroImage, title }: ProjectGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const currentImage = selectedImageIndex !== null ? displayImages[selectedImageIndex] : null;
  const isVideoYoutube = isYoutubeUrl(videoUrl);

  useEffect(() => {
    if (selectedImageIndex === null || displayImages.length === 0) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImageIndex(null);
      if (e.key === "ArrowRight") {
        setSelectedImageIndex((i) =>
          i === null ? null : (i - 1 + displayImages.length) % displayImages.length
        );
      }
      if (e.key === "ArrowLeft") {
        setSelectedImageIndex((i) =>
          i === null ? null : (i + 1) % displayImages.length
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, displayImages.length]);

  if (displayImages.length === 0) return null;

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
      >
        <div className="rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur-md p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 opacity-70" />
          <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm">
              <Monitor className="w-6 h-6" />
            </div>
            <span>معرض اللقطات الفنية</span>
          </h3>

          {/* HTML Video Preview */}
          {videoUrl && !isVideoYoutube && (
            <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 relative group shadow-sm">
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block"
              >
                <img
                  src={heroImage}
                  alt={title}
                  className="w-full h-72 object-cover group-hover:scale-[1.01] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/25 transition duration-500">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-2xl backdrop-blur-sm"
                  >
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </motion.div>
                </div>
              </a>
            </div>
          )}

          {/* Images Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayImages.map((img, index) => (
              <motion.button
                key={`${img}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.01 }}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50 group aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-teal-500/50 shadow-sm transition-all duration-500 ${
                  index === 0 ? "col-span-2 aspect-[16/9] md:aspect-[8/3]" : ""
                }`}
              >
                <img
                  src={img}
                  alt={`${title} ${index + 1}`}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-slate-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300">
                    <Rocket className="w-5 h-5 text-slate-700 -rotate-45" />
                  </div>
                </div>
                <span className="absolute bottom-3 left-3 text-xs bg-slate-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {index + 1} / {displayImages.length}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImageIndex !== null && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Top bar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-5 left-5 right-5 flex items-center justify-between z-10 pointer-events-none"
            >
              <div className="rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 px-5 py-2 text-sm text-slate-300 font-semibold select-none">
                {selectedImageIndex + 1} / {displayImages.length}
              </div>
              <button
                type="button"
                className="w-11 h-11 rounded-full border border-white/10 bg-slate-900/80 text-white hover:bg-slate-800 transition flex items-center justify-center pointer-events-auto backdrop-blur-md"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(null);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Nav arrows */}
            {displayImages.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-slate-900/80 text-white hover:bg-slate-800 transition flex items-center justify-center group pointer-events-auto backdrop-blur-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((i) =>
                      i === null ? null : (i - 1 + displayImages.length) % displayImages.length
                    );
                  }}
                >
                  <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-slate-900/80 text-white hover:bg-slate-800 transition flex items-center justify-center group pointer-events-auto backdrop-blur-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((i) =>
                      i === null ? null : (i + 1) % displayImages.length
                    );
                  }}
                >
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
              </>
            )}

            {/* Thumbnail strip */}
            {displayImages.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 z-10 overflow-x-auto max-w-[90vw]"
              >
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(idx);
                    }}
                    className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      idx === selectedImageIndex
                        ? "border-teal-400 ring-2 ring-teal-400/30"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </motion.div>
            )}

            {/* Main image */}
            <motion.img
              key={selectedImageIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              src={currentImage}
              alt={`${title} ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10 select-none"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
