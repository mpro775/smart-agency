import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
const TraineesList = lazy(() => import("./pages/trainees/TraineesList"));
const TraineeForm = lazy(() => import("./pages/trainees/TraineeForm"));
const CertificatesList = lazy(
  () => import("./pages/certificates/CertificatesList"),
);
const CertificateForm = lazy(
  () => import("./pages/certificates/CertificateForm"),
);
// Admin imports
import { AuthProvider } from "./context";
import { PrivateRoute } from "./components/PrivateRoute";

const AdminLayout = lazy(() =>
  import("./components/layout/AdminLayout").then((module) => ({
    default: module.AdminLayout,
  })),
);
const LoginPage = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProjectsList = lazy(() => import("./pages/projects/ProjectsList"));
const ProjectForm = lazy(() => import("./pages/projects/ProjectForm"));
const BlogList = lazy(() => import("./pages/blog/BlogList"));
const BlogForm = lazy(() => import("./pages/blog/BlogForm"));
const LeadsList = lazy(() => import("./pages/leads/LeadsList"));
const TeamList = lazy(() => import("./pages/team/TeamList"));
const TeamForm = lazy(() => import("./pages/team/TeamForm"));
const TestimonialsList = lazy(
  () => import("./pages/testimonials/TestimonialsList"),
);
const TestimonialForm = lazy(
  () => import("./pages/testimonials/TestimonialForm"),
);
const TechnologiesList = lazy(
  () => import("./pages/technologies/TechnologiesList"),
);
const TechnologyForm = lazy(
  () => import("./pages/technologies/TechnologyForm"),
);
const HostingList = lazy(() => import("./pages/hosting/HostingList"));
const HostingForm = lazy(() => import("./pages/hosting/HostingForm"));
const FAQsList = lazy(() => import("./pages/faqs/FAQsList"));
const FAQForm = lazy(() => import("./pages/faqs/FAQForm"));
const ServicesList = lazy(() => import("./pages/services/ServicesList"));
const ServiceForm = lazy(() => import("./pages/services/ServiceForm"));
const ProjectCategoriesList = lazy(
  () => import("./pages/project-categories/ProjectCategoriesList"),
);
const ProjectCategoryForm = lazy(
  () => import("./pages/project-categories/ProjectCategoryForm"),
);
const CompanyInfoForm = lazy(
  () => import("./pages/company-info/CompanyInfoForm"),
);
const AboutForm = lazy(() => import("./pages/about/AboutForm"));

export default function AdminRoutes() {
  return (
    <AuthProvider>
      <Routes>
        {/* Admin Login (Public) */}
        <Route path="login" element={<LoginPage />} />

        {/* Admin Routes (Protected) */}
        <Route
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
          <Route path="trainees" element={<TraineesList />} />
          <Route path="trainees/new" element={<TraineeForm />} />
          <Route path="trainees/:id/edit" element={<TraineeForm />} />
          <Route path="certificates" element={<CertificatesList />} />
          <Route path="certificates/new" element={<CertificateForm />} />
          <Route path="certificates/:id/edit" element={<CertificateForm />} />
          <Route path="team" element={<TeamList />} />
          <Route path="team/new" element={<TeamForm />} />
          <Route path="team/:id/edit" element={<TeamForm />} />

          {/* Testimonials */}
          <Route path="testimonials" element={<TestimonialsList />} />
          <Route path="testimonials/new" element={<TestimonialForm />} />
          <Route path="testimonials/:id/edit" element={<TestimonialForm />} />

          {/* Technologies */}
          <Route path="technologies" element={<TechnologiesList />} />
          <Route path="technologies/new" element={<TechnologyForm />} />
          <Route path="technologies/:id/edit" element={<TechnologyForm />} />

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
    </AuthProvider>
  );
}
