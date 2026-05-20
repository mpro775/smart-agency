import { motion } from "framer-motion";
import { type StorySection } from "../../services/about.service";
import { CheckCircle2, Award } from "lucide-react";

interface AboutStoryProps {
  story: StorySection;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export function AboutStory({ story }: AboutStoryProps) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" dir="rtl">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="text-center mb-16"
      >
        <span className="inline-block px-5 py-2 rounded-full bg-primary/5 border border-primary/15 text-primary text-sm font-bold mb-5 tracking-wide">
          قصتنا وهدفنا
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {story.title}
        </h2>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
          className="text-right"
        >
          <p className="text-lg text-slate-600 leading-[1.8] mb-10 font-medium">
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
                transition={{ delay: 0.1 + index * 0.08 }}
                className="p-5 bg-white border border-slate-200/80 rounded-2xl hover:border-primary/25 hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300 group"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <p className="text-slate-600 text-sm leading-relaxed font-semibold">
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
            className="relative bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 rounded-3xl p-8 overflow-hidden shadow-xl shadow-slate-200/30"
          >
            {/* Background soft glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-400/5 rounded-full blur-2xl" />
            
            <div className="relative z-10 text-right">
              <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/15 flex items-center justify-center mb-8 text-primary">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-900 tracking-tight">
                فلسفة سمارت
              </h3>
              <p className="text-slate-500 leading-[1.9] font-medium text-base">
                {story.closingStatement}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
