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

function App() {
  return (
    <>
      <Hero />
      <Services />
      <Projects />
      <Technologies />
      <Team />
      <Testimonials />
      <HostingPackages />
      <FAQs />
      <LatestBlogs />
      {/* <BotTeaser /> */}
    </>
  );
}

export default App;
