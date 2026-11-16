import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import App from "./App";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import ScrollToTop from "./components/ScrollToTop";
import LocaleLayout from "./localization/LocaleLayout";
import { isLocale, type Locale } from "./i18n";
import { tr } from "./i18n";
import { QueryProvider } from "./providers/QueryProvider";
import { MotionConfig } from "framer-motion";

const About = lazy(() => import("./pages/about"));
const Projects = lazy(() => import("./pages/project"));
const ProjectDetailsPage = lazy(() => import("./pages/projectDetails"));
const QuotePage = lazy(() => import("./pages/quote"));
const BlogPage = lazy(() => import("./pages/blog"));
const BlogDetailsPage = lazy(() => import("./pages/blogDetails"));
const BotLanding = lazy(() => import("./pages/bot"));
const ContactPage = lazy(() => import("./pages/contact"));
const VerifyPage = lazy(() => import("./pages/verify"));

// Conditional Footer: hides on home page (homepage has its own Footer)
function LayoutFooter() {
  const { pathname } = useLocation();
  if (/^\/(ar|en)\/?$/.test(pathname)) return null;
  return <Footer />;
}

function PublicLayout() {
  const { pathname } = useLocation();
  const isHomepage = /^\/(ar|en)\/?$/.test(pathname);
  return (
    <LocaleLayout>
      <Navbar />
      {isHomepage ? (
        <Outlet />
      ) : (
        <main>
          <Outlet />
        </main>
      )}
      <LayoutFooter />
    </LocaleLayout>
  );
}

function RootRedirect() {
  const location = useLocation();
  const stored = localStorage.getItem("preferredLocale");
  const browserLocale = navigator.language.toLowerCase().startsWith("en")
    ? "en"
    : "ar";
  const locale: Locale = isLocale(stored ?? undefined)
    ? (stored as Locale)
    : browserLocale;
  return (
    <Navigate replace to={`/${locale}${location.search}${location.hash}`} />
  );
}

function LegacyRedirect() {
  const location = useLocation();
  return (
    <Navigate
      replace
      to={`/ar${location.pathname}${location.search}${location.hash}`}
    />
  );
}

function VerifyRedirect() {
  const location = useLocation();
  const stored = localStorage.getItem("preferredLocale");
  const locale: Locale = isLocale(stored ?? undefined)
    ? (stored as Locale)
    : navigator.language.toLowerCase().startsWith("en")
      ? "en"
      : "ar";
  return (
    <Navigate
      replace
      to={`/${locale}${location.pathname}${location.search}${location.hash}`}
    />
  );
}

const AdminRoutes = lazy(() => import("./admin/AdminRoutes"));
function RouteFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center text-slate-500">
      {tr("جاري التحميل...")}
    </div>
  );
}

// Set direction before the first React paint; changing RTL to LTR in an effect
// can move the entire Hero and its decorative pattern during English startup.
const startupLocale = /^\/en(?:\/|$)/.test(window.location.pathname)
  ? "en"
  : "ar";
document.documentElement.lang = startupLocale;
document.documentElement.dir = startupLocale === "en" ? "ltr" : "rtl";
document.body.dir = document.documentElement.dir;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <QueryProvider>
        <BrowserRouter>
          {/* Custom Cursor - Global for all pages */}
          <CustomCursor />

          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* Locale-prefixed public routes */}
              {(["ar", "en"] as const).map((locale) => (
                <Route
                  key={locale}
                  path={`/${locale}`}
                  element={<PublicLayout />}
                >
                  <Route index element={<App />} />
                  <Route path="about" element={<About />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="projects/:id" element={<ProjectDetailsPage />} />
                  <Route path="blog" element={<BlogPage />} />
                  <Route path="blog/:slug" element={<BlogDetailsPage />} />
                  <Route path="bot" element={<BotLanding />} />
                  <Route path="quote" element={<QuotePage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="verify" element={<VerifyPage />} />
                  <Route
                    path="verify/:certificateId"
                    element={<VerifyPage />}
                  />
                  <Route path="*" element={<Navigate replace to=".." />} />
                </Route>
              ))}

              {/* Backward-compatible redirects; old URLs remain Arabic. */}
              <Route path="/" element={<RootRedirect />} />
              <Route path="/verify" element={<VerifyRedirect />} />
              <Route
                path="/verify/:certificateId"
                element={<VerifyRedirect />}
              />
              <Route path="/about" element={<LegacyRedirect />} />
              <Route path="/projects" element={<LegacyRedirect />} />
              <Route path="/projects/:id" element={<LegacyRedirect />} />
              <Route path="/blog" element={<LegacyRedirect />} />
              <Route path="/blog/:slug" element={<LegacyRedirect />} />
              <Route path="/bot" element={<LegacyRedirect />} />
              <Route path="/quote" element={<LegacyRedirect />} />
              <Route path="/contact" element={<LegacyRedirect />} />

              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryProvider>
    </MotionConfig>
  </React.StrictMode>,
);
