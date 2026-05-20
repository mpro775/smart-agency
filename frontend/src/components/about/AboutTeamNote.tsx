import { motion } from "framer-motion";
import { type TeamNoteSection } from "../../services/about.service";
import { Check } from "lucide-react";

interface AboutTeamNoteProps {
  teamNote: TeamNoteSection;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export function AboutTeamNote({ teamNote }: AboutTeamNoteProps) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" dir="rtl">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="relative bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xl shadow-slate-200/40"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/5 rounded-full blur-[100px]" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 p-8 md:p-12 items-center">
          <div className="text-right">
            <span className="inline-block px-5 py-2 rounded-full bg-primary/5 border border-primary/15 text-primary text-sm font-bold mb-6 tracking-wide">
              فريق العمل
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              {teamNote.title}
            </h2>
            <p className="text-slate-500 leading-[1.9] mb-8 font-medium text-base">
              {teamNote.description}
            </p>

            {teamNote.highlights && teamNote.highlights.length > 0 && (
              <ul className="space-y-3">
                {teamNote.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center gap-3 justify-start">
                    <div className="w-6 h-6 rounded-lg bg-primary/5 border border-primary/15 flex items-center justify-center flex-shrink-0 text-primary">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-slate-600 text-sm font-semibold">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {teamNote.image && (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-teal-400/5 rounded-2xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
              <img
                src={teamNote.image}
                alt={teamNote.title}
                className="relative rounded-2xl w-full h-72 md:h-96 object-cover shadow-lg border border-slate-200/80 transform transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
