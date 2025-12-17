"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiCheck,
  FiServer,
  FiZap,
  FiArrowLeft,
  FiCpu,
  FiHardDrive,
  FiActivity,
} from "react-icons/fi";
import { publicHostingPackagesService } from "../services/hosting-packages.service";
import type { HostingPackage } from "../services/hosting-packages.service";
import PackageSelectionModal from "./PackageSelectionModal";

type BillingCycle = "Monthly" | "Yearly";

// --- مكون عرض السعر المتحرك ---
function AnimatedPrice({ price }: { price: number }) {
  const [currentValue, setCurrentValue] = useState(price);

  useEffect(() => {
    const startValue = currentValue;
    const difference = price - startValue;
    const startTime = Date.now();
    if (difference === 0) return;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / 500, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + difference * easeOutCubic);
      setCurrentValue(current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [price]); // eslint-disable-line react-hooks/exhaustive-deps

  return <span>{currentValue}</span>;
}

export default function HostingPackages() {
  const [packages, setPackages] = useState<HostingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("Monthly");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackageForModal, setSelectedPackageForModal] =
    useState<HostingPackage | null>(null);
  const [isEnterpriseModal, setIsEnterpriseModal] = useState(false);
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(
    new Set()
  );

  // --- دوال الحساب والمنطق (نفس المنطق السابق لضمان العمل الصحيح) ---
  const getDisplayPrice = useCallback(
    (pkg: HostingPackage) =>
      billingCycle === "Yearly"
        ? pkg.yearlyPrice || Math.round(pkg.price * 12 * 0.8)
        : pkg.price,
    [billingCycle]
  );

  const getOriginalPrice = useCallback(
    (pkg: HostingPackage) =>
      billingCycle === "Yearly"
        ? pkg.yearlyPrice
          ? pkg.price * 12
          : null
        : pkg.originalPrice || null,
    [billingCycle]
  );

  const getBasePackage = useCallback(
    (baseId: string) => packages.find((p) => p._id === baseId) || null,
    [packages]
  );

  const getAdditionalFeatures = useCallback(
    (pkg: HostingPackage) => {
      if (!pkg.basePackageId) return [];
      const base = getBasePackage(pkg.basePackageId);
      if (!base?.features || !pkg.features) return [];
      const baseSet = new Set(base.features.map((f) => f.trim().toLowerCase()));
      return pkg.features
        .map((f) => f.trim())
        .filter((f) => f && !baseSet.has(f.toLowerCase()));
    },
    [getBasePackage]
  );

  const openPackageModal = (pkg: HostingPackage) => {
    setSelectedPackageForModal(pkg);
    setIsEnterpriseModal(false);
    setModalOpen(true);
  };

  const openEnterpriseModal = () => {
    setSelectedPackageForModal(null);
    setIsEnterpriseModal(true);
    setModalOpen(true);
  };

  const toggleFeatures = (id: string) => {
    setExpandedFeatures((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await publicHostingPackagesService.getAll();
        setPackages(data);
      } catch (err) {
        console.error(err);
        setError("فشل تحميل البيانات، يرجى المحاولة لاحقاً.");
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // --- حالات التحميل والخطأ ---
  if (loading)
    return (
      <div className="py-32 flex justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  if (error)
    return (
      <div className="py-32 text-center text-red-500 bg-gray-50">{error}</div>
    );
  if (packages.length === 0) return null;

  return (
    <section className="relative py-24 bg-gray-50 overflow-hidden" id="hosting">
      {/* خلفية جمالية خفيفة */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* رأس القسم */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide mb-4">
            خطط الاستضافة
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            اختر الخطة المثالية{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--color-primary), var(--color-primary-dark))",
              }}
            >
              لنمو مشروعك
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            استضافة سحابية عالية الأداء مع ضمان استقرار بنسبة 99.9% ودعم فني على
            مدار الساعة.
          </p>
        </motion.div>

        {/* زر التبديل (Monthly / Yearly) بتصميم محسّن */}
        <div className="flex justify-center mb-16">
          <div className="relative bg-white p-1.5 rounded-2xl border border-gray-200 shadow-md inline-flex">
            {/* الخلفية المتحركة مع تأثير gradient */}
            <motion.div
              className="absolute top-1.5 bottom-1.5 rounded-xl z-0"
              style={{
                background:
                  "linear-gradient(to right, var(--color-primary), var(--color-primary-dark))",
                boxShadow: "0 4px 12px rgba(0, 128, 128, 0.25)",
              }}
              initial={false}
              animate={{
                right: billingCycle === "Monthly" ? "6px" : "50%",
                width: "calc(50% - 9px)",
                x: billingCycle === "Monthly" ? 0 : -3,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                mass: 0.8,
              }}
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setBillingCycle("Monthly")}
              className="relative z-10 px-10 py-3 rounded-xl text-sm font-bold transition-all duration-300"
              style={{
                color: billingCycle === "Monthly" ? "#ffffff" : "#4b5563",
              }}
            >
              <span className="relative z-10">شهري</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setBillingCycle("Yearly")}
              className="relative z-10 px-10 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2"
              style={{
                color: billingCycle === "Yearly" ? "#ffffff" : "#4b5563",
              }}
            >
              <span className="relative z-10">سنوي</span>
              <motion.span
                initial={false}
                animate={{
                  scale: billingCycle === "Yearly" ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 0.5,
                  repeat: billingCycle === "Yearly" ? Infinity : 0,
                  repeatDelay: 2,
                }}
                className="text-[10px] px-2 py-1 rounded-lg font-extrabold whitespace-nowrap"
                style={{
                  backgroundColor:
                    billingCycle === "Yearly"
                      ? "rgba(255, 255, 255, 0.25)"
                      : "#dcfce7",
                  color: billingCycle === "Yearly" ? "#ffffff" : "#15803d",
                  border:
                    billingCycle === "Yearly"
                      ? "1px solid rgba(255, 255, 255, 0.3)"
                      : "1px solid #bbf7d0",
                }}
              >
                توفير 20%
              </motion.span>
            </motion.button>
          </div>
        </div>

        {/* شبكة الكروت */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
          {packages.map((pkg, index) => {
            const displayPrice = getDisplayPrice(pkg);
            const originalPrice = getOriginalPrice(pkg);
            const isPopular = pkg.isPopular;

            return (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={`relative flex flex-col p-6 rounded-3xl transition-all duration-300 group ${
                  isPopular
                    ? "bg-gray-900 text-white shadow-2xl shadow-gray-900/20 scale-100 lg:scale-110 z-10 ring-1 ring-gray-800"
                    : "bg-white text-gray-900 shadow-lg border border-gray-100 hover:border-primary/30 hover:shadow-xl"
                }`}
              >
                {/* شارة "الأكثر طلباً" */}
                {isPopular && (
                  <div className="absolute -top-5 left-0 right-0 flex justify-center">
                    <span
                      className="text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide uppercase"
                      style={{
                        background:
                          "linear-gradient(to right, var(--color-primary), var(--color-primary-dark))",
                      }}
                    >
                      الخيار الأفضل
                    </span>
                  </div>
                )}

                {/* رأس البطاقة */}
                <div className="mb-6">
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      isPopular ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {pkg.name}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      isPopular ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {pkg.description || "حل مثالي للمواقع الناشئة"}
                  </p>
                </div>

                {/* السعر */}
                <div className="mb-6 pb-6 border-b border-gray-100/10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight">
                      <AnimatedPrice price={displayPrice} />
                    </span>
                    <span
                      className={`text-lg font-medium ${
                        isPopular ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {pkg.currency || "ر.س"}
                    </span>
                    <span
                      className={`text-sm ${
                        isPopular ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      /{billingCycle === "Monthly" ? "شهرياً" : "سنوياً"}
                    </span>
                  </div>
                  {originalPrice && originalPrice > displayPrice && (
                    <div className="mt-1 text-sm text-red-500 line-through decoration-red-500/50">
                      بدلاً من {originalPrice} {pkg.currency}
                    </div>
                  )}
                </div>

                {/* المواصفات الأساسية (Grid Layout) */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {pkg.storage && (
                    <div className="flex flex-col gap-1">
                      <span
                        className={`text-xs ${
                          isPopular ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        المساحة
                      </span>
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <FiHardDrive
                          className={
                            isPopular ? "text-primary" : "text-primary"
                          }
                        />
                        {pkg.storage}
                      </div>
                    </div>
                  )}
                  {pkg.bandwidth && (
                    <div className="flex flex-col gap-1">
                      <span
                        className={`text-xs ${
                          isPopular ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        النطاق
                      </span>
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <FiActivity
                          className={
                            isPopular ? "text-primary" : "text-primary"
                          }
                        />
                        {pkg.bandwidth}
                      </div>
                    </div>
                  )}
                  {pkg.cpu && (
                    <div className="flex flex-col gap-1">
                      <span
                        className={`text-xs ${
                          isPopular ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        المعالج
                      </span>
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <FiCpu
                          className={
                            isPopular ? "text-primary" : "text-primary"
                          }
                        />
                        {pkg.cpu}
                      </div>
                    </div>
                  )}
                  {pkg.ram && (
                    <div className="flex flex-col gap-1">
                      <span
                        className={`text-xs ${
                          isPopular ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        الذاكرة
                      </span>
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <FiZap
                          className={
                            isPopular ? "text-primary" : "text-blue-600"
                          }
                        />
                        {pkg.ram}
                      </div>
                    </div>
                  )}
                </div>

                {/* قائمة المميزات */}
                <div className="flex-1 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-sm font-bold uppercase tracking-wider ${
                        isPopular ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      أبرز المميزات
                    </span>
                    {/* زر التوسيع */}
                    {pkg.features && pkg.features.length > 0 && (
                      <button
                        onClick={() => toggleFeatures(pkg._id)}
                        className={`text-xs hover:underline ${
                          isPopular ? "text-primary" : "text-primary"
                        }`}
                      >
                        {expandedFeatures.has(pkg._id)
                          ? "إخفاء التفاصيل"
                          : "عرض الكل"}
                      </button>
                    )}
                  </div>

                  <ul className="space-y-3">
                    {/* عرض أول 4 مميزات فقط أو الكل إذا تم التوسيع */}
                    {(() => {
                      const allFeatures = [];

                      // إضافة مميزات الباقة الأساسية إن وجدت
                      if (pkg.basePackageId) {
                        const base = getBasePackage(pkg.basePackageId);
                        if (base)
                          allFeatures.push({
                            text: `كل مميزات ${base.name}`,
                            highlight: true,
                          });
                      }

                      // إضافة المميزات الإضافية
                      const extras = getAdditionalFeatures(pkg);
                      extras.forEach((f) =>
                        allFeatures.push({ text: f, highlight: false })
                      );

                      // إضافة المميزات العادية إذا لم يكن هناك باقة أساسية
                      if (!pkg.basePackageId && pkg.features) {
                        pkg.features.forEach((f) =>
                          allFeatures.push({ text: f, highlight: false })
                        );
                      }

                      // المنطق للعرض
                      const displayedFeatures = expandedFeatures.has(pkg._id)
                        ? allFeatures
                        : allFeatures.slice(0, 4);

                      return displayedFeatures.map((feat, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-sm"
                        >
                          <div
                            className={`mt-0.5 rounded-full p-0.5 ${
                              isPopular
                                ? "bg-primary/20 text-primary"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            <FiCheck size={12} />
                          </div>
                          <span
                            className={
                              isPopular ? "text-gray-300" : "text-gray-600"
                            }
                          >
                            {feat.highlight ? (
                              <span className="font-semibold text-current">
                                {feat.text}
                              </span>
                            ) : (
                              feat.text
                            )}
                          </span>
                        </li>
                      ));
                    })()}
                  </ul>
                </div>

                {/* زر الإجراء (CTA) */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openPackageModal(pkg)}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    isPopular
                      ? "bg-primary text-white hover:bg-primaryDark hover:shadow-lg hover:shadow-primary/25"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {isPopular ? "ابدأ الآن" : "اختر الباقة"}
                  <FiArrowLeft className={isPopular ? "animate-pulse" : ""} />
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* قسم المؤسسات (Enterprise) بتصميم عصري */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="relative rounded-3xl overflow-hidden bg-gray-900 text-white p-8 md:p-12 lg:flex items-center justify-between border border-gray-800">
            {/* خلفية جمالية */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mb-8 lg:mb-0">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <FiServer size={24} />
                <span className="font-bold tracking-wide uppercase">
                  حلول المؤسسات
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                هل تحتاج إلى موارد مخصصة؟
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                نقدم سيرفرات خاصة، توازن حمل (Load Balancing)، وحماية متقدمة من
                هجمات DDoS للمتاجر الكبرى والتطبيقات ذات الزيارات العالية.
              </p>
            </div>

            <div className="relative z-10">
              <button
                onClick={openEnterpriseModal}
                className="whitespace-nowrap bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg shadow-white/10"
              >
                تواصل مع المبيعات
              </button>
            </div>
          </div>
        </motion.div>

        <PackageSelectionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedPackage={selectedPackageForModal}
          billingCycle={billingCycle}
          isEnterprise={isEnterpriseModal}
        />
      </div>
    </section>
  );
}
