import { motion } from "framer-motion";
import { type StorySection } from "../../services/about.service";
import { CheckCircle2, Award } from "lucide-react";

interface AboutStoryProps {
  story: StorySection;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function AboutStory({ story }: AboutStoryProps) {
  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" dir="rtl">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="text-center mb-20"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
          قصتنا وهدفنا
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white">
          {story.title}
        </h2>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
          className="text-right"
        >
          <p className="text-lg text-slate-300 leading-relaxed mb-10 font-medium">
            {story.description}
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {story.painPoints?.map((point, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-primary/40 hover:bg-slate-900/80 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-sm leading-relaxed font-semibold">
                    {point}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {story.closingStatement && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
            className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 text-white overflow-hidden shadow-2xl"
          >
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl" />
            
            <div className="relative z-10 text-right">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 text-primary">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black mb-4 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                فلسفة سمارت
              </h3>
              <p className="text-slate-300 leading-relaxed font-medium text-base">
                {story.closingStatement}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

