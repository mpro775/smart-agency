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
import { useQuery } from "@tanstack/react-query";
import { homepageService } from "./services/homepage.service";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.6, 0.05, 0.01, 0.9] as const },
  },
};

function App() {
  const {
    data: homepageData,
    isLoading: isHomepageLoading,
    isError: isHomepageError,
  } = useQuery({
    queryKey: ["public-homepage"],
    queryFn: homepageService.get,
  });

  const homepageProps = isHomepageError ? undefined : homepageData;

  return (
    <div className="relative">
      <FloatingSectionNav />

      <main className="relative overflow-hidden">
        <section id="hero">
          <Hero />
        </section>

        {isHomepageLoading ? (
          <section className="px-4 py-24 text-center text-slate-500">
            جاري تحميل محتوى الصفحة الرئيسية...
          </section>
        ) : (
          <>
            <motion.section
              id="services"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={sectionVariants}
            >
              <Services initialServices={homepageProps?.services} />
            </motion.section>

            <motion.section
              id="projects"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={sectionVariants}
            >
              <Projects
                initialProjects={homepageProps?.featuredProjects}
                initialCategories={homepageProps?.projectCategories}
              />
            </motion.section>

            <motion.section
              id="technologies"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={sectionVariants}
            >
              <Technologies initialTechnologies={homepageProps?.technologies} />
            </motion.section>

            <motion.section
              id="team"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={sectionVariants}
            >
              <Team initialMembers={homepageProps?.teamMembers} />
            </motion.section>

            <motion.section
              id="testimonials"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={sectionVariants}
            >
              <Testimonials initialTestimonials={homepageProps?.testimonials} />
            </motion.section>

            <motion.section
              id="hosting"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={sectionVariants}
            >
              <HostingPackages initialPackages={homepageProps?.hostingPackages} />
            </motion.section>

            <motion.section
              id="faqs"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={sectionVariants}
            >
              <FAQs initialFaqs={homepageProps?.faqs} />
            </motion.section>

            <motion.section
              id="blogs"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={sectionVariants}
            >
              <LatestBlogs initialBlogs={homepageProps?.latestBlogs} />
            </motion.section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
