import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import About from "./pages/about";
import Projects from "./pages/project";
import ProjectDetailsPage from "./pages/projectDetails";
import QuotePage from "./pages/quote";
import BlogPage from "./pages/blog";
import BlogDetailsPage from "./pages/blogDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import ScrollToTop from "./components/ScrollToTop";
import BotLanding from "./pages/bot";

// Admin imports
import { QueryProvider, AuthProvider } from "./admin/context";
import { AdminLayout, PrivateRoute } from "./admin/components";
import {
  Dashboard,
  LoginPage,
  ProjectsList,
  ProjectForm,
  BlogList,
  BlogForm,
  LeadsList,
  TeamList,
  TeamForm,
  TestimonialsList,
  TestimonialForm,
  TechnologiesList,
  TechnologyForm,
  HostingList,
  HostingForm,
  FAQsList,
  FAQForm,
  ServicesList,
  ServiceForm,
  ProjectCategoriesList,
  ProjectCategoryForm,
  CompanyInfoForm,
  AboutForm,
} from "./admin/pages";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* Custom Cursor - Global for all pages */}
          <CustomCursor />
          
          <ScrollToTop />
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
                        path="/projects/:slug"
                        element={<ProjectDetailsPage />}
                      />
                      <Route path="/blog/:slug" element={<BlogDetailsPage />} />
                      <Route path="/quote" element={<QuotePage />} />
                    </Routes>
                  </main>
                  <Footer />
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
        </BrowserRouter>
      </AuthProvider>
    </QueryProvider>
  </React.StrictMode>
);
