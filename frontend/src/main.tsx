import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import App from "./App";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import ScrollToTop from "./components/ScrollToTop";

const About = lazy(() => import("./pages/about"));
const Projects = lazy(() => import("./pages/project"));
const ProjectDetailsPage = lazy(() => import("./pages/projectDetails"));
const QuotePage = lazy(() => import("./pages/quote"));
const BlogPage = lazy(() => import("./pages/blog"));
const BlogDetailsPage = lazy(() => import("./pages/blogDetails"));
const BotLanding = lazy(() => import("./pages/bot"));
const ContactPage = lazy(() => import("./pages/contact"));

// Conditional Footer: hides on home page (homepage has its own Footer)
function LayoutFooter() {
  const { pathname } = useLocation();
  if (pathname === "/") return null;
  return <Footer />;
}

// Admin imports
import { QueryProvider, AuthProvider } from "./admin/context";
import { PrivateRoute } from "./admin/components/PrivateRoute";

const AdminLayout = lazy(() =>
  import("./admin/components/layout/AdminLayout").then((module) => ({
    default: module.AdminLayout,
  })),
);
const LoginPage = lazy(() => import("./admin/pages/Login"));
const Dashboard = lazy(() => import("./admin/pages/Dashboard"));
const ProjectsList = lazy(() => import("./admin/pages/projects/ProjectsList"));
const ProjectForm = lazy(() => import("./admin/pages/projects/ProjectForm"));
const BlogList = lazy(() => import("./admin/pages/blog/BlogList"));
const BlogForm = lazy(() => import("./admin/pages/blog/BlogForm"));
const LeadsList = lazy(() => import("./admin/pages/leads/LeadsList"));
const TeamList = lazy(() => import("./admin/pages/team/TeamList"));
const TeamForm = lazy(() => import("./admin/pages/team/TeamForm"));
const TestimonialsList = lazy(
  () => import("./admin/pages/testimonials/TestimonialsList"),
);
const TestimonialForm = lazy(
  () => import("./admin/pages/testimonials/TestimonialForm"),
);
const TechnologiesList = lazy(
  () => import("./admin/pages/technologies/TechnologiesList"),
);
const TechnologyForm = lazy(
  () => import("./admin/pages/technologies/TechnologyForm"),
);
const HostingList = lazy(() => import("./admin/pages/hosting/HostingList"));
const HostingForm = lazy(() => import("./admin/pages/hosting/HostingForm"));
const FAQsList = lazy(() => import("./admin/pages/faqs/FAQsList"));
const FAQForm = lazy(() => import("./admin/pages/faqs/FAQForm"));
const ServicesList = lazy(() => import("./admin/pages/services/ServicesList"));
const ServiceForm = lazy(() => import("./admin/pages/services/ServiceForm"));
const ProjectCategoriesList = lazy(
  () => import("./admin/pages/project-categories/ProjectCategoriesList"),
);
const ProjectCategoryForm = lazy(
  () => import("./admin/pages/project-categories/ProjectCategoryForm"),
);
const CompanyInfoForm = lazy(
  () => import("./admin/pages/company-info/CompanyInfoForm"),
);
const AboutForm = lazy(() => import("./admin/pages/about/AboutForm"));

function RouteFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center text-slate-500">
      جاري التحميل...
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* Custom Cursor - Global for all pages */}
          <CustomCursor />

          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route
              element={
                <>
                  <Navbar />
                  <main>
                    <Routes>
                      <Route path="/" element={<App />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/bot" element={<BotLanding />} />
                      <Route
                        path="/projects/:id"
                        element={<ProjectDetailsPage />}
                      />
                      <Route path="/blog/:slug" element={<BlogDetailsPage />} />
                      <Route path="/quote" element={<QuotePage />} />
                      <Route path="/contact" element={<ContactPage />} />
                    </Routes>
                  </main>
                  <LayoutFooter />
                </>
              }
              path="/*"
            />

            {/* Admin Login (Public) */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Admin Routes (Protected) */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />

              {/* Projects */}
              <Route path="projects" element={<ProjectsList />} />
              <Route path="projects/new" element={<ProjectForm />} />
              <Route path="projects/:id/edit" element={<ProjectForm />} />

              {/* Blog */}
              <Route path="blog" element={<BlogList />} />
              <Route path="blog/new" element={<BlogForm />} />
              <Route path="blog/:id/edit" element={<BlogForm />} />

              {/* Leads */}
              <Route path="leads" element={<LeadsList />} />

              {/* Team */}
              <Route path="team" element={<TeamList />} />
              <Route path="team/new" element={<TeamForm />} />
              <Route path="team/:id/edit" element={<TeamForm />} />

              {/* Testimonials */}
              <Route path="testimonials" element={<TestimonialsList />} />
              <Route path="testimonials/new" element={<TestimonialForm />} />
              <Route
                path="testimonials/:id/edit"
                element={<TestimonialForm />}
              />

              {/* Technologies */}
              <Route path="technologies" element={<TechnologiesList />} />
              <Route path="technologies/new" element={<TechnologyForm />} />
              <Route
                path="technologies/:id/edit"
                element={<TechnologyForm />}
              />

              {/* Hosting */}
              <Route path="hosting" element={<HostingList />} />
              <Route path="hosting/new" element={<HostingForm />} />
              <Route path="hosting/:id/edit" element={<HostingForm />} />

              {/* FAQs */}
              <Route path="faqs" element={<FAQsList />} />
              <Route path="faqs/new" element={<FAQForm />} />
              <Route path="faqs/:id/edit" element={<FAQForm />} />

              {/* Services */}
              <Route path="services" element={<ServicesList />} />
              <Route path="services/new" element={<ServiceForm />} />
              <Route path="services/:id/edit" element={<ServiceForm />} />

              {/* Project Categories */}
              <Route
                path="project-categories"
                element={<ProjectCategoriesList />}
              />
              <Route
                path="project-categories/new"
                element={<ProjectCategoryForm />}
              />
              <Route
                path="project-categories/:id/edit"
                element={<ProjectCategoryForm />}
              />

              {/* Company Info */}
              <Route path="company-info" element={<CompanyInfoForm />} />

              {/* About */}
              <Route path="about" element={<AboutForm />} />
            </Route>
          </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryProvider>
  </React.StrictMode>
);
