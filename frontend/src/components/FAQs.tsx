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
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { publicFaqsService } from "../services/faqs.service";
import type { FAQ } from "../services/faqs.service";

// Icon mapping function based on category and question content
const getCategoryIcon = (category?: string, question?: string) => {
  const categoryLower = category?.toLowerCase() || "";
  const questionLower = question?.toLowerCase() || "";

  // Hosting related
  if (
    categoryLower.includes("استضاف") ||
    questionLower.includes("سيرفر") ||
    questionLower.includes("استضاف")
  ) {
    return FiServer;
  }

  // Cloud/Technical
  if (
    categoryLower.includes("تقني") ||
    questionLower.includes("سحاب") ||
    questionLower.includes("cloud")
  ) {
    return FiCloud;
  }

  // Payment/Financial
  if (
    categoryLower.includes("دفع") ||
    questionLower.includes("دفع") ||
    questionLower.includes("سعر") ||
    questionLower.includes("مالي")
  ) {
    return FiCreditCard;
  }

  // Code/Development
  if (
    categoryLower.includes("تطوير") ||
    questionLower.includes("كود") ||
    questionLower.includes("برمج")
  ) {
    return FiCode;
  }

  // Settings/General technical
  if (
    categoryLower.includes("إعداد") ||
    questionLower.includes("إعداد") ||
    questionLower.includes("تكوين")
  ) {
    return FiSettings;
  }

  // Default fallback
  return FiHelpCircle;
};

// Get color class for category
const getCategoryColor = (category?: string) => {
  const categoryLower = category?.toLowerCase() || "";

  if (categoryLower.includes("استضاف") || categoryLower.includes("تقني")) {
    return "text-primary";
  }
  if (categoryLower.includes("دفع") || categoryLower.includes("مالي")) {
    return "text-green-600";
  }
  if (categoryLower.includes("تطوير")) {
    return "text-blue-600";
  }

  return "text-primary";
};

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

  // Inject FAQPage schema for SEO
  useEffect(() => {
    if (faqs.length === 0) return;

    // Function to strip HTML tags from answer
    const stripHtml = (html: string) => {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

    // Generate FAQPage schema
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

    // Create script element
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(faqSchema);
    script.id = "faq-schema";

    // Remove existing schema if present
    const existingScript = document.getElementById("faq-schema");
    if (existingScript) {
      existingScript.remove();
    }

    // Add new schema
    document.head.appendChild(script);

    // Cleanup function
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

    // Apply search filter if there's a search query
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
      <section className="py-20 bg-white" id="faqs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">جاري تحميل الأسئلة الشائعة...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white" id="faqs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white" id="faqs">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-4">
            الأسئلة الشائعة
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            أسئلة{" "}
            <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))]">
              شائعة
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            إجابات على الأسئلة الأكثر شيوعاً التي يطرحها عملاؤنا
          </p>
        </motion.div>

        {/* شريط البحث */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 text-lg" />
            </div>
            <input
              type="text"
              placeholder="بماذا يمكننا مساعدتك اليوم؟"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              تم العثور على {filteredFaqs.length} نتيجة
              {searchQuery && searchQuery.length > 0
                ? ` لـ "${searchQuery}"`
                : ""}
            </p>
          )}
        </motion.div>

        {/* الفلاتر - تظهر فقط على الشاشات الصغيرة */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12 lg:hidden"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-md"
              }`}
            >
              الكل
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-md"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* تخطيط القائمة مع الشريط الجانبي على الشاشات الكبيرة */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* الشريط الجانبي للفئات - مخفي على الشاشات الصغيرة */}
          {categories.length > 0 && (
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-20">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 text-right">
                    الفئات
                  </h3>
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategory("all")}
                      className={`w-full text-right px-3 py-2 rounded-lg transition-all duration-300 ${
                        selectedCategory === "all"
                          ? "bg-primary text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      الكل
                    </motion.button>
                    {categories.map((category) => (
                      <motion.button
                        key={category}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-right px-3 py-2 rounded-lg transition-all duration-300 ${
                          selectedCategory === category
                            ? "bg-primary text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                  {searchQuery && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        تم العثور على {filteredFaqs.length} نتيجة
                        {searchQuery && searchQuery.length > 0
                          ? ` لـ "${searchQuery}"`
                          : ""}
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          )}

          {/* قائمة الأسئلة */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence>
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className={`bg-white rounded-xl transition-all duration-300 overflow-hidden ${
                    expandedId === faq._id
                      ? "shadow-lg border-2 border-primary bg-primary/5"
                      : "shadow-md hover:shadow-lg border border-gray-100"
                  }`}
                >
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === faq._id ? null : faq._id)
                    }
                    className="w-full px-6 py-5 flex items-center justify-between text-right hover:bg-gray-50 transition-colors"
                  >
                    <div className="shrink-0 ml-4">
                      {expandedId === faq._id ? (
                        <FiChevronUp className="text-gray-400 text-xl" />
                      ) : (
                        <FiChevronDown className="text-gray-400 text-xl" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {faq.question}
                          </h3>
                          {faq.category && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                              {faq.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mr-4">
                      {(() => {
                        const IconComponent = getCategoryIcon(
                          faq.category,
                          faq.question
                        );
                        return (
                          <IconComponent
                            className={`text-xl ${getCategoryColor(
                              faq.category
                            )}`}
                          />
                        );
                      })()}
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
                            className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* بطاقة الدعوة للعمل */}
            {filteredFaqs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                    لم تجد السؤال الذي تبحث عنه؟
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    فريق الدعم لدينا متواجد للمساعدة. تواصل معنا مباشرة عبر
                    واتساب وسنقوم بحل استفسارك في أقرب وقت ممكن.
                  </p>
                  <motion.a
                    href="https://wa.me/967778032532"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <FaWhatsapp className="text-xl" />
                    تحدث معنا واتساب
                    <FaWhatsapp className="text-xl" />
                  </motion.a>
                </div>
              </motion.div>
            )}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">لا توجد أسئلة في هذه الفئة</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
