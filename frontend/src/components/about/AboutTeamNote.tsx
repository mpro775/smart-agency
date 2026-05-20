import { motion } from "framer-motion";
import { type TeamNoteSection } from "../../services/about.service";
import { Check } from "lucide-react";

interface AboutTeamNoteProps {
  teamNote: TeamNoteSection;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function AboutTeamNote({ teamNote }: AboutTeamNoteProps) {
  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" dir="rtl">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="relative bg-slate-900/30 backdrop-blur-md rounded-3xl border border-slate-800 overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-16 p-8 md:p-14 items-center">
          <div className="text-right">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
              فريق العمل
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              {teamNote.title}
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8 font-medium text-base">
              {teamNote.description}
            </p>

            {teamNote.highlights && teamNote.highlights.length > 0 && (
              <ul className="space-y-4">
                {teamNote.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center gap-3 justify-start">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-slate-300 text-sm font-semibold">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {teamNote.image && (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-teal-500/10 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={teamNote.image}
                alt={teamNote.title}
                className="relative rounded-2xl w-full h-72 md:h-96 object-cover shadow-2xl border border-slate-800/80 transform transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}

