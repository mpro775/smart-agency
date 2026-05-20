import { motion } from "framer-motion";

interface ProjectMediaProps {
  videoUrl?: string;
  title: string;
  heroImage: string;
  projectUrl?: string;
  slug: string;
}

function isYoutubeUrl(url?: string) {
  if (!url) return false;
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function getYoutubeEmbedUrl(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function ProjectMedia({ videoUrl, title, heroImage, projectUrl, slug }: ProjectMediaProps) {
  const hasYoutube = isYoutubeUrl(videoUrl);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative"
      >
        {/* Browser Mockup Wrapper */}
        <div className="relative rounded-3xl border border-slate-200/80 bg-white/80 p-2.5 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.15)] backdrop-blur-xl overflow-hidden group">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100/90 bg-slate-50/90 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400/95 ring-2 ring-red-400/20 block cursor-pointer hover:brightness-90 transition-all" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/95 ring-2 ring-yellow-400/20 block cursor-pointer hover:brightness-90 transition-all" />
              <span className="w-3 h-3 rounded-full bg-green-400/95 ring-2 ring-green-400/20 block cursor-pointer hover:brightness-90 transition-all" />
            </div>
            <div className="bg-slate-200/60 border border-slate-200/40 rounded-xl px-6 py-1.5 text-xs text-slate-500 select-none w-48 sm:w-96 text-center truncate font-mono shadow-inner select-all cursor-text">
              {projectUrl || `${slug}.smartagency.com`}
            </div>
            <div className="w-14 flex items-center justify-end gap-2 text-slate-400">
              <div className="w-5 h-5 rounded hover:bg-slate-200/50 flex items-center justify-center transition-colors cursor-pointer">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              </div>
              <div className="w-5 h-5 rounded hover:bg-slate-200/50 flex items-center justify-center transition-colors cursor-pointer">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              </div>
            </div>
          </div>

          {/* Media Container */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] lg:aspect-[16/7.5] w-full overflow-hidden rounded-b-2xl bg-slate-950">
            {hasYoutube && videoUrl ? (
              <iframe
                src={getYoutubeEmbedUrl(videoUrl) || ""}
                title={title}
                className="w-full h-full border-0 absolute inset-0 z-10"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img
                src={heroImage}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.015]"
              />
            )}
            {!hasYoutube && (
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-slate-950/5 pointer-events-none opacity-50 group-hover:opacity-75 transition-opacity duration-700" />
            )}
            <div className="absolute bottom-0 right-0 w-44 h-44 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />
          </div>
        </div>

        {/* Shadow Drop Effect */}
        <div className="absolute -bottom-8 left-[5%] right-[5%] h-8 bg-gradient-to-b from-slate-900/10 to-transparent blur-xl rounded-full pointer-events-none" />
      </motion.div>
    </section>
  );
}
