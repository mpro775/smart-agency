"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronDown,
  FiChevronUp,
  FiHelpCircle,
  FiSearch,
  FiServer,
  FiCloud,
  FiCreditCard,
  FiCode,
  FiSettings,
  FiClock,
  FiShield,
  FiUsers,
  FiMessageCircle,
  FiCheckCircle,
  FiArrowUpLeft,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { SectionShell } from "./brand";
import { publicFaqsService } from "../services/faqs.service";
import type { FAQ } from "../services/faqs.service";

const categoryDisplayMap: Record<string, string> = {
  General: "قبل بدء المشروع",
  عام: "قبل بدء المشروع",
  تقني: "التقنية والتنفيذ",
  استضافة: "الاستضافة والبنية التحتية",
  دفع: "التكلفة والمدة",
  مالي: "التكلفة والمدة",
  خدمات: "التقنية والتنفيذ",
};

const getCategoryLabel = (category?: string) => {
  if (!category) return "عام";
  return categoryDisplayMap[category] || category;
};

const getCategoryIcon = (category?: string, question?: string) => {
  const categoryLower = category?.toLowerCase() || "";
  const questionLower = question?.toLowerCase() || "";

  if (
    categoryLower.includes("استضاف") ||
    questionLower.includes("سيرفر") ||
    questionLower.includes("استضاف")
  ) {
    return FiServer;
  }

  if (
    categoryLower.includes("تقني") ||
    questionLower.includes("سحاب") ||
    questionLower.includes("cloud")
  ) {
    return FiCloud;
  }

  if (
    categoryLower.includes("دفع") ||
    questionLower.includes("دفع") ||
    questionLower.includes("سعر") ||
    questionLower.includes("مالي")
  ) {
    return FiCreditCard;
  }

  if (
    categoryLower.includes("تطوير") ||
    questionLower.includes("كود") ||
    questionLower.includes("برمج")
  ) {
    return FiCode;
  }

  if (
    categoryLower.includes("إعداد") ||
    questionLower.includes("إعداد") ||
    questionLower.includes("تكوين")
  ) {
    return FiSettings;
  }

  return FiHelpCircle;
};

const formatIndex = (index: number) => String(index + 1).padStart(2, "0");

function SmartAdvisoryCard() {
  const steps = [
    { num: "01", text: "تحليل الفكرة" },
    { num: "02", text: "تقدير المدة والتكلفة" },
    { num: "03", text: "خطة التنفيذ والدعم" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="sticky top-24 rounded-3xl border border-[var(--smart-border-dark)] bg-[var(--smart-bg-dark-card)] backdrop-blur-sm p-8 overflow-hidden"
    >
      <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-l from-[var(--smart-primary-light)] to-transparent" />

      <h3 className="text-xl font-bold text-white mb-2">هل لديك فكرة مشروع؟</h3>
      <p className="text-white/60 text-sm mb-6 leading-relaxed">
        نساعدك على تحويلها إلى واقع ناجح.
      </p>

      <div className="space-y-4 mb-8">
        {steps.map((step) => (
          <div key={step.num} className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
              {step.num}
            </span>
            <span className="text-white/80 text-sm">{step.text}</span>
          </div>
        ))}
      </div>

      <motion.a
        href="https://wa.me/967778032532"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-primary/20"
      >
        <FaWhatsapp className="text-lg" />
        احجز استشارة مجانية
      </motion.a>

      <p className="text-white/40 text-xs text-center mt-4 flex items-center justify-center gap-1">
        <FiCheckCircle className="text-primary" />
        نرد عليك خلال أسرع وقت
      </p>
    </motion.div>
  );
}

function TrustBar() {
  const items = [
    {
      icon: FiShield,
      title: "حلول موثوقة وآمنة",
      desc: "نستخدم أفضل الممارسات لحماية مشروعك وبياناتك.",
    },
    {
      icon: FiUsers,
      title: "فريق متخصص",
      desc: "خبرة في التصميم، البرمجة، وإدارة المشاريع الرقمية.",
    },
    {
      icon: FiClock,
      title: "تسليم في الوقت المحدد",
      desc: "نعمل بخطة واضحة وجدول زمني متفق عليه.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/10 bg-white/[0.03]"
        >
          <item.icon className="text-3xl text-primary mb-3" />
          <h4 className="text-white font-semibold mb-1">{item.title}</h4>
          <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </motion.div>
  );
}

function EmptyResults() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 rounded-2xl border border-white/10 bg-white/[0.03]"
    >
      <FiMessageCircle className="text-5xl text-white/20 mx-auto mb-4" />
      <h4 className="text-white/80 font-semibold text-lg mb-2">
        لم نجد سؤالًا مطابقًا لبحثك
      </h4>
      <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">
        جرّب كلمات مثل: التكلفة، المدة، الدعم، الاستضافة، أو تواصل معنا مباشرة.
      </p>
    </motion.div>
  );
}

export default function FAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [faqsData, categoriesData] = await Promise.all([
          publicFaqsService.getAll(),
          publicFaqsService.getCategories().catch(() => []),
        ]);
        setFaqs(faqsData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError("فشل تحميل الأسئلة الشائعة. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (faqs.length === 0) return;

    const stripHtml = (html: string) => {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: stripHtml(faq.answer),
        },
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(faqSchema);
    script.id = "faq-schema";

    const existingScript = document.getElementById("faq-schema");
    if (existingScript) {
      existingScript.remove();
    }

    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById("faq-schema");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    let filtered =
      selectedCategory === "all"
        ? faqs
        : faqs.filter((faq) => faq.category === selectedCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((faq) => {
        const questionMatch = faq.question.toLowerCase().includes(query);
        const answerMatch = faq.answer.toLowerCase().includes(query);
        return questionMatch || answerMatch;
      });
    }

    return filtered;
  }, [faqs, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <SectionShell tone="dark" pattern="grid" id="faqs">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--smart-primary-light)]"></div>
          <p className="mt-4 text-[var(--smart-text-muted-on-dark)]">جاري تحميل مركز المساعدة...</p>
        </div>
      </SectionShell>
    );
  }

  if (error) {
    return (
      <SectionShell tone="dark" pattern="grid" id="faqs">
        <div className="text-center rounded-2xl border border-[var(--smart-border-dark)] bg-[var(--smart-bg-dark-card)] p-8">
          <p className="text-red-400">{error}</p>
        </div>
      </SectionShell>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <SectionShell tone="dark" pattern="grid" id="faqs" withContainer={false}>
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 text-sm font-medium rounded-full border border-primary/30 bg-primary/10 text-primary mb-4">
            مركز المساعدة
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            إجابات واضحة لـ
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-teal-400">
              {" "}
              قرارات أفضل
            </span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            جمعنا أكثر الأسئلة شيوعًا لمساعدتك على فهم طريقة عملنا واتخاذ قرارك
            بثقة ووضوح.
          </p>
        </motion.div>

        {/* Smart Filters */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedCategory("all")}
              className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 border ${
                selectedCategory === "all"
                  ? "bg-primary/20 border-primary/40 text-primary shadow-lg shadow-primary/10"
                  : "border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white/80"
              }`}
            >
              جميع الأسئلة
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 border ${
                  selectedCategory === category
                    ? "bg-primary/20 border-primary/40 text-primary shadow-lg shadow-primary/10"
                    : "border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white/80"
                }`}
              >
                {getCategoryLabel(category)}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Main Layout: Sidebar + FAQ List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Advisory Card */}
          <aside className="lg:col-span-4">
            <SmartAdvisoryCard />
          </aside>

          {/* FAQ List */}
          <div className="lg:col-span-8">
            {/* Search Box */}
            <div className="relative mb-6">
              <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
              <input
                type="text"
                placeholder="ابحث عن التكلفة، المدة، الدعم، أو طريقة العمل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] py-4 pr-12 pl-4 text-white placeholder:text-white/40 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              />
            </div>

            {/* Results Count */}
            {searchQuery && (
              <p className="text-sm text-white/40 mb-4">
                تم العثور على {filteredFaqs.length} نتيجة
                {` لـ "${searchQuery}"`}
              </p>
            )}

            {/* FAQ Accordion Cards */}
            <AnimatePresence mode="popLayout">
              {filteredFaqs.map((faq, index) => {
                const IconComponent = getCategoryIcon(
                  faq.category,
                  faq.question,
                );
                return (
                  <motion.div
                    key={faq._id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    layout
                    className={`relative overflow-hidden rounded-2xl border transition-all duration-300 mb-4 ${
                      expandedId === faq._id
                        ? "border-primary/40 bg-white/[0.07] shadow-[0_0_40px_rgba(20,184,166,0.12)]"
                        : "border-white/10 bg-white/[0.04] hover:bg-white/[0.06]"
                    }`}
                  >
                    {expandedId === faq._id && (
                      <div className="absolute right-0 top-0 h-full w-1 bg-primary" />
                    )}

                    <button
                      onClick={() =>
                        setExpandedId(expandedId === faq._id ? null : faq._id)
                      }
                      aria-expanded={expandedId === faq._id}
                      className="w-full px-6 py-5 flex items-center gap-4 text-right hover:bg-white/[0.02] transition-colors"
                    >
                      <span className="text-white/20 text-sm font-mono font-bold flex-shrink-0">
                        {formatIndex(index)}
                      </span>

                      <IconComponent className="text-primary text-xl flex-shrink-0" />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-base md:text-lg leading-snug">
                          {faq.question}
                        </h3>
                        {faq.category && (
                          <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                            {getCategoryLabel(faq.category)}
                          </span>
                        )}
                      </div>

                      <div className="flex-shrink-0">
                        {expandedId === faq._id ? (
                          <FiChevronUp className="text-white/40 text-xl" />
                        ) : (
                          <FiChevronDown className="text-white/40 text-xl" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedId === faq._id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 pr-16">
                            <div
                              className="text-white/70 leading-relaxed prose prose-sm prose-invert max-w-none"
                              dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Empty State */}
            {filteredFaqs.length === 0 && <EmptyResults />}

            {/* CTA Card */}
            {filteredFaqs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="mt-8 rounded-3xl border border-primary/30 bg-primary/[0.06] p-8 text-center overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-transparent" />
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                  لم تجد إجابة لسؤالك؟
                </h3>
                <p className="text-white/60 mb-6 leading-relaxed max-w-lg mx-auto">
                  تواصل معنا مباشرة وسنساعدك في فهم الخطوة المناسبة لمشروعك.
                </p>
                <motion.a
                  href="https://wa.me/967778032532"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-2xl font-semibold text-lg shadow-lg shadow-green-600/20 transition-all duration-300"
                >
                  <FaWhatsapp className="text-xl" />
                  تواصل معنا واتساب
                  <FiArrowUpLeft className="text-sm" />
                </motion.a>
              </motion.div>
            )}
          </div>
        </div>

        {/* Trust Bar */}
        <TrustBar />
      </div>
    </SectionShell>
  );
}
