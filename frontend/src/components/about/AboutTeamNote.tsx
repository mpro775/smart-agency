import { motion } from "framer-motion";
import { type TeamNoteSection } from "../../services/about.service";

interface AboutTeamNoteProps {
  teamNote: TeamNoteSection;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function AboutTeamNote({ teamNote }: AboutTeamNoteProps) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 p-8 md:p-12 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              الفريق
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
              {teamNote.title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {teamNote.description}
            </p>

            {teamNote.highlights && teamNote.highlights.length > 0 && (
              <ul className="space-y-3">
                {teamNote.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm font-medium">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {teamNote.image && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl blur-xl" />
              <img
                src={teamNote.image}
                alt={teamNote.title}
                className="relative rounded-2xl w-full h-64 md:h-80 object-cover shadow-lg"
              />
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
