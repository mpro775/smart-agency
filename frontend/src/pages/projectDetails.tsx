import { useState, useEffect } from "react";
import { FiArrowLeft, FiGlobe } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { publicProjectsService } from "../services/projects.service";
import type { Project } from "../admin/types";

export default function ProjectDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = await publicProjectsService.getBySlug(slug);
        setProject(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("فشل تحميل المشروع. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">جاري تحميل المشروع...</p>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error || "المشروع غير موجود"}</p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-primary hover:text-primaryDark transition"
          >
            <FiArrowLeft /> العودة إلى المشاريع
          </Link>
        </div>
      </main>
    );
  }

  const techNames = Array.isArray(project.technologies)
    ? project.technologies.map((t: any) => (typeof t === "string" ? t : t.name))
    : [];
  const projectImage =
    project.images?.cover ||
    project.images?.gallery?.[0] ||
    "https://via.placeholder.com/1200x600";

  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* زر العودة */}
      <div className="mb-8">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-primary hover:text-primaryDark transition"
        >
          <FiArrowLeft /> العودة إلى المشاريع
        </Link>
      </div>

      {/* صورة المشروع */}
      <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
        <img
          src={projectImage}
          alt={project.title}
          width={1200}
          height={600}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* المعلومات الرئيسية */}
      <div className="grid lg:grid-cols-3 gap-12">
        {/* المحتوى النصي */}
        <div className="lg:col-span-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 bg-green-100 text-green-800">
            {project.isPublished ? "نشط" : "مسودة"}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {project.title}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{project.category}</p>
          <p className="text-gray-700 mb-6">{project.summary}</p>

          {/* التحدي والحل */}
          {project.challenge && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">التحدي</h2>
              <p className="text-gray-700 leading-relaxed">
                {project.challenge}
              </p>
            </div>
          )}

          {project.solution && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">الحل</h2>
              <p className="text-gray-700 leading-relaxed">
                {project.solution}
              </p>
            </div>
          )}

          {/* النتائج */}
          {project.results && project.results.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">النتائج</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {project.results.map((result, i) => (
                  <div
                    key={i}
                    className="bg-primary/5 rounded-lg p-4 text-center"
                  >
                    <p className="text-3xl font-bold text-primary mb-2">
                      {result.value}
                    </p>
                    <p className="text-gray-700">{result.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* معرض الصور */}
          {project.images?.gallery && project.images.gallery.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                معرض المشروع
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.images.gallery.map((img, i) => (
                  <div key={i} className="rounded-lg overflow-hidden shadow-md">
                    <img
                      src={img}
                      alt={`${project.title} - ${i + 1}`}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* معلومات العميل */}
          {project.clientName && (
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
              <p className="text-sm text-gray-500 mb-2">العميل</p>
              <p className="font-medium text-gray-900 text-lg">
                {project.clientName}
              </p>
            </div>
          )}
        </div>

        {/* القسم الجانبي */}
        <div>
          {/* التقنيات */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              التقنيات المستخدمة
            </h2>
            <div className="flex flex-wrap gap-3">
              {techNames.length > 0 ? (
                techNames.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700"
                  >
                    {tech}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">لا توجد تقنيات محددة</p>
              )}
            </div>
          </div>

          {/* روابط المشروع */}
          {project.projectUrl && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                روابط المشروع
              </h2>
              <ul className="space-y-3">
                <li>
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition"
                  >
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                      <FiGlobe />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">الموقع الرسمي</p>
                      <p className="text-xs text-gray-500">زيارة الموقع</p>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
