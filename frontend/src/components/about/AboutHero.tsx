import { motion } from "framer-motion";
import { RiLightbulbFlashLine } from "react-icons/ri";
import { type About } from "../../services/about.service";

interface AboutHeroProps {
  aboutData: About;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: Array<{
    id: string;
    title: string;
    icon: React.JSX.Element;
    content: string;
    color: string;
  }>;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
      children: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  },
};

export function AboutHero({ aboutData, activeTab, setActiveTab, tabs }: AboutHeroProps) {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-secondary/20 via-secondary/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Text Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center lg:text-right order-2 lg:order-1"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm text-sm font-semibold mb-8 backdrop-blur-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-lg shadow-primary/50"></span>
            </span>
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent font-bold">
              من نحن
            </span>
          </motion.div>


          {/* Title with Gradient */}
          <motion.h1
            variants={fadeInUp}
            className="text-2xl lg:text-5xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tight"
          >
            {aboutData.hero?.title?.split(" ").map((word, i) => (
              <span
                key={i}
                className={
                  i === 1
                    ? "text-transparent bg-clip-text bg-gradient-to-l from-primary via-primary-dark to-primary animate-gradient-x"
                    : ""
                }
              >
                {word}{" "}
              </span>
            )) || (
              <>
                نصنع{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary via-primary-dark to-primary">
                  المستقبل
                </span>{" "}
                الرقمي
              </>
            )}
          </motion.h1>


          {/* Subtitle with shimmer effect */}
          <motion.p
            variants={fadeInUp}
            className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
          >
            <span className="relative inline-block">
              {aboutData.hero?.subtitle}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{
                  x: ["-200%", "200%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut",
                }}
              />
            </span>
          </motion.p>

          {/* Enhanced Tabs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8"
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-6 py-3.5 rounded-2xl text-sm font-bold transition-all duration-500 overflow-hidden group ${
                  activeTab === tab.id
                    ? "text-white shadow-2xl shadow-primary/30"
                    : "text-gray-600 hover:text-gray-900 bg-white/50 backdrop-blur-sm hover:bg-white border border-gray-200/50"
                }`}
              >
                {activeTab === tab.id && (
                  <>
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                  </>
                )}
                <span className="relative flex items-center gap-2 z-10">
                  <motion.span
                    animate={activeTab === tab.id ? { rotate: [0, 10, -10, 0] } : {}}
                    transition={activeTab === tab.id ? { duration: 0.5 } : {}}
                  >
                    {tab.icon}
                  </motion.span>
                  {tab.title}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Enhanced Content Card */}
          <motion.div
            layout
            className="relative bg-white/70 backdrop-blur-2xl border border-white/50 p-8 rounded-3xl shadow-2xl shadow-gray-200/50 text-right min-h-[160px] overflow-hidden"
          >
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/5 to-transparent rounded-tr-full" />

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative z-10"
            >
              <div className="flex items-start gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  {tabs.find((t) => t.id === activeTab)?.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-primary-dark mb-2">
                    {tabs.find((t) => t.id === activeTab)?.title}
                  </h3>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg font-medium">
                {tabs.find((t) => t.id === activeTab)?.content}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative order-1 lg:order-2"
        >
          {/* Glow effect behind image */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary-dark/20 to-transparent rounded-[3rem] blur-3xl transform scale-105" />

          <motion.div
            whileHover={{ scale: 1.02, rotate: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/80 bg-white/20 backdrop-blur-sm"
          >
            <img
              src={aboutData.hero?.image || "/placeholder-office.jpg"}
              alt="Office Life"
              className="w-full h-auto object-cover"
            />
            {/* Multi-layer gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent mix-blend-multiply" />

            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-[2.5rem]"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(0, 128, 128, 0.3)",
                  "0 0 60px rgba(0, 128, 128, 0.5)",
                  "0 0 20px rgba(0, 128, 128, 0.3)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Enhanced Floating Badge */}
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 2, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
            }}
            className="absolute -bottom-8 -right-8 bg-white p-5 rounded-3xl shadow-2xl flex items-center gap-5 border border-gray-100 max-w-sm backdrop-blur-sm"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-primary flex items-center justify-center text-white shadow-lg"
            >
              <RiLightbulbFlashLine size={32} />
            </motion.div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                نبتكر الحلول
              </p>
              <p className="text-gray-900 font-black text-lg bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                +20 مشروع ناجح
              </p>
            </div>
          </motion.div>

          {/* Decorative particles */}
          {[...Array(3)].map((_, particleIndex) => (
            <motion.div
              key={particleIndex}
              className="absolute w-2 h-2 bg-primary rounded-full"
              style={{
                top: `${20 + particleIndex * 30}%`,
                right: `${-5 + particleIndex * 2}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2 + particleIndex,
                repeat: Infinity,
                delay: particleIndex * 0.5,
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
