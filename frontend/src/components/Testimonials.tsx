"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiStar, FiMessageSquare, FiExternalLink, FiBriefcase, FiLayers, FiAward, FiCode, FiTrendingUp } from "react-icons/fi";
import { SectionShell } from "./brand";
import { publicTestimonialsService } from "../services/testimonials.service";
import type { Testimonial } from "../services/testimonials.service";

function TestimonialsSkeleton() {
  return (
    <SectionShell tone="dark" pattern="mesh" id="testimonials">
      <div className="relative z-10">
        <div className="h-8 w-32 rounded-full bg-white/10 animate-pulse" />
        <div className="mt-6 h-12 w-96 max-w-full rounded-2xl bg-white/10 animate-pulse" />
        <div className="mt-4 h-6 w-80 max-w-full rounded-xl bg-white/10 animate-pulse" />
        <div className="mt-12 h-80 animate-pulse rounded-[2rem] bg-white/10" />
      </div>
    </SectionShell>
  );
}

function RatingBadge({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <FiStar key={i} className={`w-4 h-4 ${i < rating ? "text-[var(--smart-primary-light)] fill-[var(--smart-primary-light)]" : "text-white/20"}`} />
      ))}
      <span className="mr-2 text-sm text-[var(--smart-text-muted-on-dark)]">{rating.toFixed(1)}</span>
    </div>
  );
}

function ClientAvatar({ testimonial }: { testimonial: Testimonial }) {
  if (testimonial.clientPhoto) {
    return <img src={testimonial.clientPhoto} alt={testimonial.clientName} className="w-12 h-12 rounded-full object-cover border-2 border-[var(--smart-primary)]/30" />;
  }
  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--smart-primary)] to-[var(--smart-primary-dark)] flex items-center justify-center text-white font-bold text-lg">
      {testimonial.clientName.charAt(0)}
    </div>
  );
}

function TestimonialsHeader() {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true, amount: 0.2 }} className="text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-[var(--smart-border-dark)] bg-white/[0.05] px-4 py-2 text-sm font-bold text-[var(--smart-primary-light)] backdrop-blur-xl">
        <FiMessageSquare className="w-4 h-4" />
        آراء عملائنا
      </span>
      <h2 className="mt-6 text-4xl md:text-6xl font-bold leading-tight text-[var(--smart-text-on-dark)]">
        ثقة بُنيت على <span className="text-[var(--smart-primary-light)]">نتائج حقيقية</span>
      </h2>
      <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-[var(--smart-text-muted-on-dark)]">
        نفخر بالشراكات طويلة المدى التي نبنيها مع عملائنا. هذه بعض الكلمات التي تعكس أثر عملنا وجودة ما نقدمه في كل مشروع.
      </p>
    </motion.div>
  );
}

function FeaturedTestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} viewport={{ once: true, amount: 0.2 }} className="lg:col-span-8 relative rounded-[2rem] border border-[var(--smart-border-dark)] bg-[var(--smart-bg-dark-card)] p-8 md:p-10 shadow-2xl backdrop-blur-xl" data-cursor="hover">
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      <div className="relative z-10">
        <FiMessageSquare className="w-10 h-10 text-[var(--smart-primary)]/40 mb-6" />
        <p className="text-xl md:text-2xl leading-relaxed text-[var(--smart-text-on-dark)] mb-8">{testimonial.content}</p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ClientAvatar testimonial={testimonial} />
            <div>
              <h4 className="font-bold text-[var(--smart-text-on-dark)] text-lg">{testimonial.clientName}</h4>
              {testimonial.position && <p className="text-sm text-[var(--smart-text-muted-on-dark)]">{testimonial.position}</p>}
              {testimonial.companyName && <p className="text-sm text-[var(--smart-primary-light)]">{testimonial.companyName}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {testimonial.rating && <RatingBadge rating={testimonial.rating} />}
            {testimonial.linkedProject && typeof testimonial.linkedProject === "object" && "_id" in testimonial.linkedProject ? (
              <Link to={`/projects/${testimonial.linkedProject._id}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--smart-border-dark-strong)] bg-white/[0.05] px-5 py-2.5 text-sm text-[var(--smart-primary-light)] hover:bg-white/[0.08] transition-colors">
                <FiExternalLink className="w-4 h-4" />
                مشاهدة المشروع
              </Link>
            ) : null}
          </div>
        </div>
        {testimonial.companyLogo && (
          <div className="mt-6 pt-6 border-t border-[var(--smart-border-dark)] flex items-center gap-3">
            <img src={testimonial.companyLogo} alt={testimonial.companyName || "شعار الشركة"} className="h-8 object-contain opacity-70" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ProjectSummaryCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} viewport={{ once: true, amount: 0.2 }} className="lg:col-span-4">
      <div className="rounded-[2rem] border border-[var(--smart-border-dark)] bg-[var(--smart-bg-dark-card)] p-6 h-full backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-4">
          <FiBriefcase className="w-5 h-5 text-[var(--smart-primary-light)]" />
          <p className="text-sm font-medium text-[var(--smart-primary-light)]">ملخص المشروع</p>
        </div>
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-[var(--smart-text-muted-on-dark)]">
            <FiLayers className="w-4 h-4 text-[var(--smart-primary)]/60" />
            <span className="text-sm">تصميم وتجربة المستخدم</span>
          </div>
          <div className="flex items-center gap-3 text-[var(--smart-text-muted-on-dark)]">
            <FiCode className="w-4 h-4 text-[var(--smart-primary)]/60" />
            <span className="text-sm">تطوير موقع احترافي</span>
          </div>
        </div>
        <div className="rounded-2xl bg-[var(--smart-primary)]/10 p-4 border border-[var(--smart-border-dark-strong)]">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp className="w-4 h-4 text-[var(--smart-primary-light)]" />
            <span className="text-xs text-[var(--smart-primary-light)]">النتيجة</span>
          </div>
          <strong className="text-[var(--smart-text-on-dark)] text-sm">تجربة رقمية أكثر وضوحًا واحترافية</strong>
        </div>
      </div>
    </motion.div>
  );
}

function SmallTestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, amount: 0.2 }} whileHover={{ y: -4 }} className="rounded-3xl border border-[var(--smart-border-dark)] bg-[var(--smart-bg-dark-card)] p-6 backdrop-blur transition hover:bg-white/[0.08]" data-cursor="hover">
      {testimonial.rating && <div className="mb-4"><RatingBadge rating={testimonial.rating} /></div>}
      <p className="text-[var(--smart-text-muted-on-dark)] leading-relaxed mb-6 text-sm line-clamp-4">{testimonial.content}</p>
      <div className="flex items-center gap-3 pt-4 border-t border-[var(--smart-border-dark)]">
        <ClientAvatar testimonial={testimonial} />
        <div>
          <h4 className="font-semibold text-[var(--smart-text-on-dark)] text-sm">{testimonial.clientName}</h4>
          {testimonial.position && <p className="text-xs text-[var(--smart-text-muted-on-dark)]">{testimonial.position}</p>}
          {testimonial.companyName && <p className="text-xs text-[var(--smart-primary-light)]/80">{testimonial.companyName}</p>}
        </div>
      </div>
    </motion.div>
  );
}

function ClientLogosStrip({ clients }: { clients: Testimonial[] }) {
  if (clients.length === 0) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} viewport={{ once: true, amount: 0.2 }} className="lg:col-span-7 rounded-[2rem] border border-[var(--smart-border-dark)] bg-[var(--smart-bg-dark-card)] p-6 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-[var(--smart-text-on-dark)] mb-4 flex items-center gap-2">
        <FiAward className="w-5 h-5 text-[var(--smart-primary-light)]" />
        شركات وثقت بنا
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {clients.map((client, index) => (
          <div key={client._id || index} className="flex items-center justify-center rounded-2xl bg-white/5 p-4 min-h-[60px]">
            {client.companyLogo ? (
              <img src={client.companyLogo} alt={client.companyName || "شعار الشركة"} className="h-6 object-contain opacity-70 hover:opacity-100 transition-opacity" />
            ) : client.companyName ? (
              <span className="text-sm text-[var(--smart-text-muted-on-dark)] font-medium text-center">{client.companyName}</span>
            ) : (
              <span className="text-sm text-[var(--smart-text-muted-on-dark)] text-center">{client.clientName}</span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TrustStats({ testimonials }: { testimonials: Testimonial[] }) {
  const averageRating = testimonials.length ? testimonials.reduce((sum, item) => sum + (item.rating ?? 5), 0) / testimonials.length : 5;
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} viewport={{ once: true, amount: 0.2 }} className="lg:col-span-5 rounded-[2rem] border border-[var(--smart-border-dark)] bg-[var(--smart-bg-dark-card)] p-6 backdrop-blur-xl">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-3xl font-bold text-[var(--smart-primary-light)] mb-1">+20</div>
          <div className="text-xs text-[var(--smart-text-muted-on-dark)]">مشروع تم تسليمه بنجاح</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-[var(--smart-primary-light)] mb-1">{averageRating.toFixed(1)}</div>
          <div className="text-xs text-[var(--smart-text-muted-on-dark)]">متوسط التقييم من عملائنا</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-[var(--smart-primary-light)] mb-1">+8</div>
          <div className="text-xs text-[var(--smart-text-muted-on-dark)]">قطاعات تنوع في الخبرات</div>
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
        if (featured.length > 0) { setTestimonials(featured); return; }
        const all = await publicTestimonialsService.getAll({ limit: 6 });
        setTestimonials(all);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    }
    fetchTestimonials();
  }, []);

  if (loading) return <TestimonialsSkeleton />;
  if (!testimonials.length) return null;

  const featuredTestimonial = testimonials.find(item => item.isFeatured) ?? testimonials[0];
  const secondaryTestimonials = testimonials.filter(item => item._id !== featuredTestimonial?._id).slice(0, 3);
  const clientLogos = testimonials.filter(item => item.companyLogo || item.companyName).slice(0, 6);

  return (
    <SectionShell tone="dark" pattern="mesh" id="testimonials">
      <div className="relative z-10">
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
    </SectionShell>
  );
}
