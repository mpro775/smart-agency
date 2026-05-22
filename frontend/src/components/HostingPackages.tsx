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
  FiHeadphones,
  FiShield,
  FiLayers,
  FiGlobe,
  FiSend,
  FiAward,
  FiBox,
} from "react-icons/fi";
import { SectionShell } from "./brand";
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

// --- أيقونات الباقات ---
function getPackageIcon(name: string) {
  const normalized = name.toLowerCase();

  if (
    normalized.includes("wordpress") ||
    normalized.includes("وورد") ||
    normalized.includes("wordpress")
  ) {
    return FiGlobe;
  }

  if (normalized.includes("أساسية") || normalized.includes("basic")) {
    return FiSend;
  }

  if (
    normalized.includes("متوسطة") ||
    normalized.includes("growth") ||
    normalized.includes("النمو")
  ) {
    return FiAward;
  }

  if (normalized.includes("متقدمة") || normalized.includes("advanced")) {
    return FiBox;
  }

  return FiServer;
}

// --- نصوص مساعدة للباقات ---
function getPackageMicrocopy(pkg: HostingPackage) {
  const name = pkg.name.toLowerCase();

  if (name.includes("أساسية")) return "مثالية للمواقع الصغيرة والبدايات الذكية.";
  if (name.includes("متوسطة")) return "للشركات النامية والمشاريع الاحترافية.";
  if (name.includes("متقدمة")) return "للمشاريع الكبيرة والتطبيقات عالية الأداء.";
  if (name.includes("wordpress") || name.includes("وورد"))
    return "مخصصة لمواقع WordPress مع أداء محسن.";

  return pkg.description || "خطة مرنة مصممة لدعم نمو مشروعك.";
}

// --- مكون Spec للمواصفات التقنية ---
function Spec({
  label,
  value,
  icon: Icon,
  dark = false,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-3 ${
        dark ? "border-white/10 bg-white/5" : "border-gray-100 bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Icon className="text-primary" />
        <span>{label}</span>
      </div>
      <div
        className={`mt-1 text-sm font-bold ${
          dark ? "text-white" : "text-gray-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

// --- نقاط القيمة ---
const valuePoints = [
  { label: "دعم فني سريع", icon: FiHeadphones },
  { label: "حماية SSL", icon: FiShield },
  { label: "أداء عالي", icon: FiZap },
  { label: "جاهز للتوسع", icon: FiLayers },
];

interface HostingPackagesProps {
  initialPackages?: HostingPackage[];
}

export default function HostingPackages({
  initialPackages,
}: HostingPackagesProps) {
  const [packages, setPackages] = useState<HostingPackage[]>(
    initialPackages || [],
  );
  const [loading, setLoading] = useState(!initialPackages);
  const [error, setError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("Monthly");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackageForModal, setSelectedPackageForModal] =
    useState<HostingPackage | null>(null);
  const [isEnterpriseModal, setIsEnterpriseModal] = useState(false);
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(
    new Set()
  );

  // --- دوال الحساب والمنطق ---
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
    if (initialPackages) {
      setPackages(initialPackages);
      setLoading(false);
      return;
    }

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
  }, [initialPackages]);

  // ترتيب الباقات حسب sortOrder
  const sortedPackages = [...packages].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  );

  // --- حالات التحميل والخطأ ---
  if (loading)
    return (
      <SectionShell tone="light" pattern="dots" id="hosting">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--smart-primary)]"></div>
        </div>
      </SectionShell>
    );
  if (error)
    return (
      <SectionShell tone="light" pattern="dots" id="hosting">
        <div className="text-center text-red-500">{error}</div>
      </SectionShell>
    );
  if (packages.length === 0) return null;

  return (
    <SectionShell tone="light" pattern="dots" id="hosting" withContainer={false}>
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
            خطط مرنة
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            اختر الخطة الأنسب{" "}
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
            خطط احترافية للاستضافة والخدمات الرقمية مصممة لتحقيق أعلى أداء، أمان
            واستقرار، مع دعم فني متخصص يساعدك على النجاح والنمو.
          </p>
        </motion.div>

        {/* زر التبديل (Monthly / Yearly) */}
        <div className="flex justify-center mb-10">
          <div className="relative bg-white p-1.5 rounded-2xl border border-gray-200 shadow-md inline-flex">
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
                وفّر 20%
              </motion.span>
            </motion.button>
          </div>
        </div>

        {/* شريط نقاط القيمة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 grid max-w-4xl grid-cols-2 gap-3 rounded-2xl border border-gray-200/70 bg-white/70 p-3 shadow-sm backdrop-blur md:grid-cols-4"
        >
          {valuePoints.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm"
            >
              <item.icon className="text-primary" size={16} />
              <span>{item.label}</span>
            </div>
          ))}
        </motion.div>

        {/* شبكة البطاقات */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 items-start">
          {sortedPackages.map((pkg, index) => {
            const displayPrice = getDisplayPrice(pkg);
            const originalPrice = getOriginalPrice(pkg);
            const isPopular = pkg.isPopular;
            const PackageIcon = getPackageIcon(pkg.name);
            const microcopy = getPackageMicrocopy(pkg);
            const allFeatures = [];

            if (pkg.basePackageId) {
              const base = getBasePackage(pkg.basePackageId);
              if (base)
                allFeatures.push({
                  text: `كل مميزات ${base.name}`,
                  highlight: true,
                });
            }

            const extras = getAdditionalFeatures(pkg);
            extras.forEach((f) =>
              allFeatures.push({ text: f, highlight: false })
            );

            if (!pkg.basePackageId && pkg.features) {
              pkg.features.forEach((f) =>
                allFeatures.push({ text: f, highlight: false })
              );
            }

            const displayedFeatures = expandedFeatures.has(pkg._id)
              ? allFeatures
              : allFeatures.slice(0, 5);

            return (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -8 }}
                className={`relative flex flex-col rounded-3xl transition-all duration-300 ${
                  isPopular
                    ? "bg-gray-900 text-white shadow-2xl shadow-gray-900/30 xl:-translate-y-4 ring-1 ring-primary/30"
                    : "bg-white text-gray-900 shadow-lg border border-gray-100 hover:shadow-xl"
                }`}
                data-cursor="hover"
              >
                {/* شارة "الأكثر طلبًا" */}
                {isPopular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span
                      className="text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide"
                      style={{
                        background:
                          "linear-gradient(to right, var(--color-primary), var(--color-primary-dark))",
                      }}
                    >
                      الأكثر طلبًا
                    </span>
                  </div>
                )}

                <div className="p-6">
                  {/* رأس البطاقة */}
                  <div className="mb-5 flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                        isPopular ? "bg-white/10" : "bg-primary/10"
                      }`}
                    >
                      <PackageIcon
                        className={isPopular ? "text-primary" : "text-primary"}
                        size={22}
                      />
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-bold ${
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
                        {microcopy}
                      </p>
                    </div>
                  </div>

                  {/* سبب تمييز الباقة */}
                  {isPopular && (
                    <p className="mb-5 rounded-2xl bg-white/10 px-4 py-3 text-sm leading-6 text-teal-50">
                      أفضل توازن بين السعر، الأداء، والدعم للمشاريع الجادة.
                    </p>
                  )}

                  {/* السعر */}
                  <div className="mb-5">
                    <div className="flex items-end gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          isPopular ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {pkg.currency || "SAR"}
                      </span>
                      <span
                        className={`text-5xl font-black tracking-tight ${
                          isPopular ? "text-primary" : "text-primary"
                        }`}
                      >
                        <AnimatedPrice price={displayPrice} />
                      </span>
                      <span
                        className={`pb-2 text-sm ${
                          isPopular ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        / {billingCycle === "Monthly" ? "شهرياً" : "سنوياً"}
                      </span>
                    </div>
                    {originalPrice && originalPrice > displayPrice && (
                      <div className="mt-1 text-sm text-red-500 line-through decoration-red-500/50">
                        بدلاً من {originalPrice} {pkg.currency}
                      </div>
                    )}
                  </div>

                  {/* المواصفات التقنية */}
                  {(pkg.storage || pkg.bandwidth || pkg.cpu || pkg.ram) && (
                    <div className="mb-5 grid grid-cols-2 gap-2">
                      {pkg.storage && (
                        <Spec
                          label="التخزين"
                          value={pkg.storage}
                          icon={FiHardDrive}
                          dark={isPopular}
                        />
                      )}
                      {pkg.bandwidth && (
                        <Spec
                          label="النطاق"
                          value={pkg.bandwidth}
                          icon={FiActivity}
                          dark={isPopular}
                        />
                      )}
                      {pkg.cpu && (
                        <Spec
                          label="المعالج"
                          value={pkg.cpu}
                          icon={FiCpu}
                          dark={isPopular}
                        />
                      )}
                      {pkg.ram && (
                        <Spec
                          label="الذاكرة"
                          value={pkg.ram}
                          icon={FiZap}
                          dark={isPopular}
                        />
                      )}
                    </div>
                  )}

                  {/* المميزات */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isPopular ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        المميزات
                      </span>
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

                    <ul className="space-y-2.5">
                      {displayedFeatures.map((feat, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-sm leading-6"
                        >
                          <span
                            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                              isPopular
                                ? "bg-primary/20 text-primary"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            <FiCheck size={13} />
                          </span>
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
                      ))}
                    </ul>
                  </div>

                  {/* زر الإجراء */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openPackageModal(pkg)}
                    className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                      isPopular
                        ? "bg-primary text-white hover:bg-primaryDark shadow-lg shadow-primary/25"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {isPopular ? "اختر الخطة" : "ابدأ الآن"}
                    <FiArrowLeft
                      className={isPopular ? "animate-pulse" : ""}
                    />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA الحل المخصص */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="rounded-3xl border border-gray-200/70 bg-white/80 p-6 shadow-xl shadow-gray-900/5 backdrop-blur md:p-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-5">
                <div className="hidden h-20 w-28 rounded-2xl bg-primary/10 md:flex items-center justify-center">
                  <FiServer size={32} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-gray-900">
                    تحتاج حلاً مخصصًا؟ دعنا نبني لك باقة تناسب مشروعك
                  </h3>
                  <p className="mt-2 text-gray-600">
                    سنصمم لك خطة خاصة تتناسب مع احتياجاتك، حجم الزيارات، نوع
                    المشروع، وأهداف النمو.
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openEnterpriseModal}
                className="rounded-2xl bg-gray-950 px-8 py-4 font-bold text-white shadow-lg transition hover:bg-primary whitespace-nowrap"
              >
                تواصل معنا
              </motion.button>
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
    </SectionShell>
  );
}
