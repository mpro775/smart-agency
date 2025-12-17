"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiStar, FiMessageSquare, FiExternalLink } from "react-icons/fi";
import { publicTestimonialsService } from "../services/testimonials.service";
import type { Testimonial } from "../services/testimonials.service";

// --- التعديل الجذري هنا ---
// حركة مستمرة لليسار (أو لليمين بتغيير الإشارة)
// نستخدم -50% لأن لدينا شريطين متجاورين (كل واحد 100% من العرض)
const marqueeStyles = `
  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  
  /* إذا كنت تريد الحركة لليمين (عكس الاتجاه)، استخدم هذا الكود بدلاً من السابق:
  @keyframes scroll {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  */

  .animate-scroll {
    animation: scroll 40s linear infinite;
    display: flex;
    flex-shrink: 0;
  }

  .paused .animate-scroll {
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
        // ضمان وجود عدد كافٍ من العناصر (على الأقل 4)
        let data = featured;
        if (data.length > 0 && data.length < 4) {
          data = [...data, ...data, ...data];
        }
        setTestimonials(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        try {
          const all = await publicTestimonialsService.getAll({ limit: 6 });
          setTestimonials(all);
        } catch {
          setError("فشل تحميل آراء العملاء.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) return <div className="py-20 text-center">جاري التحميل...</div>;
  if (error)
    return <div className="py-20 text-center text-red-600">{error}</div>;
  if (testimonials.length === 0) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: marqueeStyles }} />
      <section
        className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
        id="testimonials"
      >
        <div className="container mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-4">
              آراء العملاء
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ماذا يقول عملاؤنا
            </h2>
          </motion.div>
        </div>

        {/* --- الحاوية الرئيسية للشريط --- */}
        {/* نستخدم dir="ltr" للحاوية فقط لضبط اتجاه الحركة الفيزيائية */}
        <div className="relative flex overflow-hidden group" dir="ltr">
          {/* تدرجات لونية على الجوانب للإخفاء الجمالي */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

          {/* --- الحاوية الداخلية للشريطين --- */}
          <div className="flex animate-scroll shrink-0">
            {/* --- الشريط الأول (الأصلي) --- */}
            <div className="flex shrink-0 gap-8 items-stretch py-4 px-4">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`original-${index}`}
                  testimonial={testimonial}
                />
              ))}
            </div>

            {/* --- الشريط الثاني (التوأم - لملء الفراغ فوراً) --- */}
            {/* هذا الشريط يطابق الأول تماماً ويتحرك معه بنفس السرعة */}
            <div
              className="flex shrink-0 gap-8 items-stretch py-4 px-4"
              aria-hidden="true"
            >
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`duplicate-${index}`}
                  testimonial={testimonial}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// قمت بفصل البطاقة لتنظيف الكود وتسهيل التعديل
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 relative overflow-hidden flex-shrink-0 h-full flex flex-col"
      style={{ width: "400px" }}
      dir="rtl" // إعادة المحتوى للعربية
    >
      <div className="absolute top-6 left-6 opacity-5">
        <FiMessageSquare className="w-16 h-16 text-primary" />
      </div>

      <div className="flex-shrink-0">
        {testimonial.rating && (
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className="w-5 h-5"
                style={
                  i < testimonial.rating!
                    ? {
                        color: "var(--color-primary)",
                        fill: "var(--color-primary)",
                        stroke: "var(--color-primary)",
                      }
                    : {
                        color: "transparent",
                        fill: "transparent",
                        stroke: "var(--color-primary)",
                        strokeWidth: "1.5",
                      }
                }
              />
            ))}
          </div>
        )}

        {testimonial.linkedProject &&
          typeof testimonial.linkedProject === "object" &&
          "slug" in testimonial.linkedProject && (
            <Link
              to={`/projects/${testimonial.linkedProject.slug}`}
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors mb-4"
            >
              <FiExternalLink className="w-4 h-4" />
              شاهد المشروع
            </Link>
          )}
      </div>

      <p className="text-gray-700 leading-relaxed mb-6 relative z-10 text-right flex-1">
        {testimonial.content}
      </p>

      <div className="flex items-center gap-4 pt-6 border-t border-gray-100 flex-shrink-0">
        {testimonial.clientPhoto ? (
          <img
            src={testimonial.clientPhoto}
            alt={testimonial.clientName}
            className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg">
            {testimonial.clientName.charAt(0)}
          </div>
        )}
        <div className="flex-1 text-right">
          <h4 className="font-bold text-gray-900">{testimonial.clientName}</h4>
          {testimonial.position && (
            <p className="text-sm text-gray-600">{testimonial.position}</p>
          )}
        </div>
      </div>
    </div>
  );
}
