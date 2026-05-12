import { motion } from "framer-motion";
import { type StorySection } from "../../services/about.service";

interface AboutStoryProps {
  story: StorySection;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function AboutStory({ story }: AboutStoryProps) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="text-center mb-16"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
          قصتنا
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900">
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
        >
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
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
                className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-gray-700 text-sm leading-relaxed">
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
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">فلسفة سمارت</h3>
              <p className="text-gray-300 leading-relaxed">
                {story.closingStatement}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
