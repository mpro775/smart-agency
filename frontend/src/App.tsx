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
import { ScrollSnapContainer, ScrollSnapSection } from "./components/scroll-snap";

// تعريف الأقسام للتنقل
const sections = [
  { id: "hero", label: "الرئيسية" },
  { id: "services", label: "خدماتنا" },
  { id: "projects", label: "أعمالنا" },
  { id: "technologies", label: "التقنيات" },
  { id: "team", label: "فريقنا" },
  { id: "testimonials", label: "آراء العملاء" },
  { id: "hosting", label: "باقات الاستضافة" },
  { id: "faqs", label: "الأسئلة الشائعة" },
  { id: "blogs", label: "المدونة" },
  { id: "footer", label: "تواصل معنا" },
];

function App() {
  return (
    <ScrollSnapContainer sections={sections}>
        {/* Hero Section - Fast animation */}
        <ScrollSnapSection id="hero" animationStyle="fast">
          <Hero />
        </ScrollSnapSection>
        
        {/* Services Section - Wave animation for smooth reveal */}
        <ScrollSnapSection id="services" animationStyle="wave">
          <Services />
        </ScrollSnapSection>
        
        {/* Projects Section - Fast stagger for dynamic feel */}
        <ScrollSnapSection id="projects" animationStyle="fast">
          <Projects />
        </ScrollSnapSection>
        
        {/* Technologies Section - Slow for elegant reveal */}
        <ScrollSnapSection id="technologies" animationStyle="slow">
          <Technologies />
        </ScrollSnapSection>
        
        {/* Team Section - Standard stagger */}
        <ScrollSnapSection id="team" animationStyle="stagger">
          <Team />
        </ScrollSnapSection>
        
        {/* Testimonials Section - Wave for smooth cards */}
        <ScrollSnapSection id="testimonials" animationStyle="wave">
          <Testimonials />
        </ScrollSnapSection>
        
        {/* Hosting Packages - Fast for pricing cards */}
        <ScrollSnapSection id="hosting" animationStyle="fast">
          <HostingPackages />
        </ScrollSnapSection>
        
        {/* FAQs Section - Stagger for accordion effect */}
        <ScrollSnapSection id="faqs" animationStyle="stagger">
          <FAQs />
        </ScrollSnapSection>
        
        {/* Blogs Section - Wave animation */}
        <ScrollSnapSection id="blogs" animationStyle="wave">
          <LatestBlogs />
        </ScrollSnapSection>
        
        {/* Footer Section - No animation (Footer has its own) */}
        <ScrollSnapSection id="footer" animationStyle="none">
          <Footer />
        </ScrollSnapSection>
      </ScrollSnapContainer>
  );
}

export default App;
