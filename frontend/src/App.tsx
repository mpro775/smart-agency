import "./App.css";
import { lazy } from "react";
import { useQuery } from "@tanstack/react-query";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import FloatingSectionNav from "./components/layout/FloatingSectionNav";
import DeferredSection from "./components/layout/DeferredSection";
import { homepageService } from "./services/homepage.service";
import { useLocale } from "./localization/LocaleLayout";

const Services = lazy(() => import("./components/Services"));
const Projects = lazy(() => import("./components/Projects"));
const Technologies = lazy(() => import("./components/Technologies"));
const Team = lazy(() => import("./components/Team"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const HostingPackages = lazy(() => import("./components/HostingPackages"));
const FAQs = lazy(() => import("./components/FAQs"));
const LatestBlogs = lazy(() => import("./components/LatestBlogs"));

function App() {
  const { locale } = useLocale();
  const { data, isPending } = useQuery({
    queryKey: ["public-homepage", locale],
    queryFn: homepageService.get,
  });
  return (
    <div className="relative">
      <FloatingSectionNav />
      <main className="relative overflow-hidden">
        <Hero />
        <DeferredSection id="services" pending={isPending}>
          <Services initialServices={data?.services} />
        </DeferredSection>
        <DeferredSection id="projects" pending={isPending}>
          <Projects
            initialProjects={data?.featuredProjects}
            initialCategories={data?.projectCategories}
          />
        </DeferredSection>
        <DeferredSection id="technologies" pending={isPending}>
          <Technologies initialTechnologies={data?.technologies} />
        </DeferredSection>
        <DeferredSection id="team" pending={isPending}>
          <Team initialMembers={data?.teamMembers} />
        </DeferredSection>
        <DeferredSection id="testimonials" pending={isPending}>
          <Testimonials initialTestimonials={data?.testimonials} />
        </DeferredSection>
        <DeferredSection id="hosting" pending={isPending}>
          <HostingPackages initialPackages={data?.hostingPackages} />
        </DeferredSection>
        <DeferredSection id="faqs" pending={isPending}>
          <FAQs initialFaqs={data?.faqs} />
        </DeferredSection>
        <DeferredSection id="blogs" pending={isPending}>
          <LatestBlogs initialBlogs={data?.latestBlogs} />
        </DeferredSection>
      </main>
      <DeferredSection id="footer" pending={isPending}>
        <Footer
          initialCompanyInfo={data?.companyInfo}
          homepagePending={isPending}
        />
      </DeferredSection>
    </div>
  );
}
export default App;
