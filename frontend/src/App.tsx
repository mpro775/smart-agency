import "./App.css";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Services from "./components/Services";
import LatestBlogs from "./components/LatestBlogs";
import Team from "./components/Team";
import Technologies from "./components/Technologies";
import Testimonials from "./components/Testimonials";
import FAQs from "./components/FAQs";
import HostingPackages from "./components/HostingPackages";
import Footer from "./components/Footer";
import FloatingSectionNav from "./components/layout/FloatingSectionNav";
import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.6, 0.05, 0.01, 0.9] as const },
  },
};

function App() {
  return (
    <div className="relative">
      <FloatingSectionNav />

      <main className="relative overflow-hidden">
        <section id="hero">
          <Hero />
        </section>

        <motion.section
          id="services"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <Services />
        </motion.section>

        <motion.section
          id="projects"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <Projects />
        </motion.section>

        <motion.section
          id="technologies"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <Technologies />
        </motion.section>

        <motion.section
          id="team"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <Team />
        </motion.section>

        <motion.section
          id="testimonials"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <Testimonials />
        </motion.section>

        <motion.section
          id="hosting"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <HostingPackages />
        </motion.section>

        <motion.section
          id="faqs"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <FAQs />
        </motion.section>

        <motion.section
          id="blogs"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <LatestBlogs />
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
