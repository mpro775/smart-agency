"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiStar,
  FiMessageSquare,
  FiExternalLink,
  FiBriefcase,
  FiLayers,
  FiAward,
  FiCode,
  FiTrendingUp,
} from "react-icons/fi";
import { publicTestimonialsService } from "../services/testimonials.service";
import type { Testimonial } from "../services/testimonials.service";

function TestimonialsSkeleton() {
  return (
    <section className="relative py-24 overflow-hidden bg-slate-950 text-white">
      <div className="container relative z-10 mx-auto px-4">
        <div className="h-8 w-32 rounded-full bg-white/10 animate-pulse" />
        <div className="mt-6 h-12 w-96 max-w-full rounded-2xl bg-white/10 animate-pulse" />
        <div className="mt-4 h-6 w-80 max-w-full rounded-xl bg-white/10 animate-pulse" />
        <div className="mt-12 h-80 animate-pulse rounded-[2rem] bg-white/10" />
      </div>
    </section>
  );
}

function RatingBadge({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <FiStar
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-primary fill-primary" : "text-white/20"}`}
        />
      ))}
      <span className="mr-2 text-sm text-slate-300">{rating.toFixed(1)}</span>
    </div>
  );
}

function ClientAvatar({ testimonial }: { testimonial: Testimonial }) {
  if (testimonial.clientPhoto) {
    return (
      <img
        src={testimonial.clientPhoto}
        alt={testimonial.clientName}
        className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
      />
    );
  }
  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center text-white font-bold text-lg">
      {testimonial.clientName.charAt(0)}
    </div>
  );
}

function TestimonialsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, amount: 0.2 }}
      className="text-center"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
        <FiMessageSquare className="w-4 h-4" />
        آراء عملائنا
      </span>

      <h2 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
        ثقة بُنيت على <span className="text-primary">نتائج حقيقية</span>
      </h2>

      <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-slate-300">
        نفخر بالشراكات طويلة المدى التي نبنيها مع عملائنا. هذه بعض الكلمات التي تعكس أثر عملنا وجودة ما نقدمه في كل مشروع.
      </p>
    </motion.div>
  );
}

function FeaturedTestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      viewport={{ once: true, amount: 0.2 }}
      className="lg:col-span-8 relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 md:p-10 shadow-2xl backdrop-blur-xl"
    >
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <FiMessageSquare className="w-10 h-10 text-primary/40 mb-6" />

        <p className="text-xl md:text-2xl leading-relaxed text-white mb-8">
          {testimonial.content}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ClientAvatar testimonial={testimonial} />
            <div>
              <h4 className="font-bold text-white text-lg">{testimonial.clientName}</h4>
              {testimonial.position && (
                <p className="text-sm text-slate-400">{testimonial.position}</p>
              )}
              {testimonial.companyName && (
                <p className="text-sm text-primary">{testimonial.companyName}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {testimonial.rating && <RatingBadge rating={testimonial.rating} />}

            {testimonial.linkedProject &&
            typeof testimonial.linkedProject === "object" &&
            "_id" in testimonial.linkedProject ? (
              <Link
                to={`/projects/${testimonial.linkedProject._id}`}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm text-primary hover:bg-primary/20 transition-colors"
              >
                <FiExternalLink className="w-4 h-4" />
                مشاهدة المشروع
              </Link>
            ) : null}
          </div>
        </div>

        {testimonial.companyLogo && (
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
            <img
              src={testimonial.companyLogo}
              alt={testimonial.companyName || "شعار الشركة"}
              className="h-8 object-contain opacity-70"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ProjectSummaryCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      viewport={{ once: true, amount: 0.2 }}
      className="lg:col-span-4"
    >
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 h-full backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-4">
          <FiBriefcase className="w-5 h-5 text-primary" />
          <p className="text-sm font-medium text-primary">ملخص المشروع</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-slate-300">
            <FiLayers className="w-4 h-4 text-primary/60" />
            <span className="text-sm">تصميم وتجربة المستخدم</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <FiCode className="w-4 h-4 text-primary/60" />
            <span className="text-sm">تطوير موقع احترافي</span>
          </div>
        </div>

        <div className="rounded-2xl bg-primary/10 p-4 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-primary">النتيجة</span>
          </div>
          <strong className="text-white text-sm">
            تجربة رقمية أكثر وضوحًا واحترافية
          </strong>
        </div>
      </div>
    </motion.div>
  );
}

function SmallTestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur transition hover:bg-white/[0.08]"
    >
      {testimonial.rating && (
        <div className="mb-4">
          <RatingBadge rating={testimonial.rating} />
        </div>
      )}

      <p className="text-slate-300 leading-relaxed mb-6 text-sm line-clamp-4">
        {testimonial.content}
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
        <ClientAvatar testimonial={testimonial} />
        <div>
          <h4 className="font-semibold text-white text-sm">{testimonial.clientName}</h4>
          {testimonial.position && (
            <p className="text-xs text-slate-400">{testimonial.position}</p>
          )}
          {testimonial.companyName && (
            <p className="text-xs text-primary/80">{testimonial.companyName}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ClientLogosStrip({ clients }: { clients: Testimonial[] }) {
  if (clients.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      viewport={{ once: true, amount: 0.2 }}
      className="lg:col-span-7 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <FiAward className="w-5 h-5 text-primary" />
        شركات وثقت بنا
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {clients.map((client, index) => (
          <div
            key={client._id || index}
            className="flex items-center justify-center rounded-2xl bg-white/5 p-4 min-h-[60px]"
          >
            {client.companyLogo ? (
              <img
                src={client.companyLogo}
                alt={client.companyName || "شعار الشركة"}
                className="h-6 object-contain opacity-70 hover:opacity-100 transition-opacity"
              />
            ) : client.companyName ? (
              <span className="text-sm text-slate-300 font-medium text-center">
                {client.companyName}
              </span>
            ) : (
              <span className="text-sm text-slate-400 text-center">
                {client.clientName}
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TrustStats({ testimonials }: { testimonials: Testimonial[] }) {
  const averageRating = testimonials.length
    ? testimonials.reduce((sum, item) => sum + (item.rating ?? 5), 0) / testimonials.length
    : 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      viewport={{ once: true, amount: 0.2 }}
      className="lg:col-span-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
    >
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-3xl font-bold text-primary mb-1">+20</div>
          <div className="text-xs text-slate-400">مشروع تم تسليمه بنجاح</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary mb-1">
            {averageRating.toFixed(1)}
          </div>
          <div className="text-xs text-slate-400">متوسط التقييم من عملائنا</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary mb-1">+8</div>
          <div className="text-xs text-slate-400">قطاعات تنوع في الخبرات</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const featured = await publicTestimonialsService.getFeatured();
        if (featured.length > 0) {
          setTestimonials(featured);
          return;
        }

        const all = await publicTestimonialsService.getAll({ limit: 6 });
        setTestimonials(all);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  if (loading) return <TestimonialsSkeleton />;
  if (!testimonials.length) return null;

  const featuredTestimonial = testimonials.find(item => item.isFeatured) ?? testimonials[0];
  const secondaryTestimonials = testimonials
    .filter(item => item._id !== featuredTestimonial?._id)
    .slice(0, 3);

  const clientLogos = testimonials
    .filter(item => item.companyLogo || item.companyName)
    .slice(0, 6);

  return (
    <section id="testimonials" dir="rtl" className="relative overflow-hidden bg-slate-950 py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.18),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <TestimonialsHeader />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <FeaturedTestimonialCard testimonial={featuredTestimonial} />
          <ProjectSummaryCard />
        </div>

        {secondaryTestimonials.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {secondaryTestimonials.map((testimonial) => (
              <SmallTestimonialCard key={testimonial._id} testimonial={testimonial} />
            ))}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <ClientLogosStrip clients={clientLogos} />
          <TrustStats testimonials={testimonials} />
        </div>
      </div>
    </section>
  );
}
