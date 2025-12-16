"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiStar, FiMessageSquare, FiExternalLink } from "react-icons/fi";
import { publicTestimonialsService } from "../services/testimonials.service";
import type { Testimonial } from "../services/testimonials.service";

// CSS للشريط المتحرك
const marqueeStyles = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .animate-marquee {
    animation: marquee 20s linear infinite;
  }

  .hover\\:pause-marquee:hover {
    animation-play-state: paused;
  }
`;

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const featured = await publicTestimonialsService.getFeatured();
        setTestimonials(featured);
        setError(null);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        // Fallback to all testimonials if featured fails
        try {
          const all = await publicTestimonialsService.getAll({ limit: 6 });
          setTestimonials(all);
        } catch {
          setError("فشل تحميل آراء العملاء. يرجى المحاولة مرة أخرى.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
        id="testimonials"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">جاري تحميل آراء العملاء...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
        id="testimonials"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: marqueeStyles }} />
      <section
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
        id="testimonials"
      >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-4">
            آراء العملاء
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ماذا يقول{" "}
            <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))]">
              عملاؤنا
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            شهادات حقيقية من عملاء راضين عن خدماتنا
          </p>
        </motion.div>

        {/* شريط التمرير اللانهائي */}
        <div className="relative overflow-hidden">
          <div
            className="flex gap-8 animate-marquee hover:pause-marquee"
            style={{
              width: 'max-content',
            }}
          >
            {/* تكرار البطاقات مرتين لضمان الاستمرارية */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={`${testimonial._id}-${index}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % testimonials.length) * 0.1, duration: 0.6 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -10 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 relative overflow-hidden flex-shrink-0"
                style={{ width: '400px' }}
              >
              {/* أيقونة الاقتباس - Watermark */}
              <div className="absolute top-6 left-6 opacity-5">
                <FiMessageSquare className="w-16 h-16 text-primary" />
              </div>
              {/* علامة الاقتباس الكبيرة كخلفية */}
              <div className="absolute top-4 right-4 opacity-5 pointer-events-none select-none">
                <span className="text-8xl text-primary font-serif">❝</span>
              </div>

              {/* التقييم */}
              {testimonial.rating && (
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating!
                          ? "text-cyan-400 fill-cyan-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* زر ربط المشروع */}
              {testimonial.linkedProject && typeof testimonial.linkedProject === 'object' && testimonial.linkedProject.slug && (
                <Link
                  to={`/projects/${testimonial.linkedProject.slug}`}
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors mb-4"
                >
                  <FiExternalLink className="w-4 h-4" />
                  شاهد المشروع الذي قمنا به لـ {testimonial.clientName}
                </Link>
              )}

              {/* المحتوى */}
              <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
                {testimonial.content}
              </p>

              {/* معلومات العميل */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                {testimonial.clientPhoto ? (
                  <img
                    src={testimonial.clientPhoto}
                    alt={testimonial.clientName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primaryDark flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.clientName.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">
                    {testimonial.clientName}
                  </h4>
                  {testimonial.position && (
                    <p className="text-sm text-gray-600">
                      {testimonial.position}
                    </p>
                  )}
                  {testimonial.companyName && (
                    <p className="text-sm text-primary font-medium">
                      {testimonial.companyName}
                    </p>
                  )}
                </div>
                {testimonial.companyLogo && (
                  <img
                    src={testimonial.companyLogo}
                    alt={testimonial.companyName}
                    className="w-12 h-12 object-contain opacity-60"
                  />
                )}
              </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
