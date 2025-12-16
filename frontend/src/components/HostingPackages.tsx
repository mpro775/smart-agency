"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiServer, FiZap, FiStar } from "react-icons/fi";
import { publicHostingPackagesService } from "../services/hosting-packages.service";
import type { HostingPackage } from "../services/hosting-packages.service";
import PackageSelectionModal from "./PackageSelectionModal";

type BillingCycle = "Monthly" | "Yearly";

// Animated Price Display Component
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

      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + difference * easeOutCubic);

      setCurrentValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price]);

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

  // Calculate display price based on billing cycle
  const getDisplayPrice = useCallback(
    (pkg: HostingPackage): number => {
      if (billingCycle === "Yearly") {
        // Use yearlyPrice if available, otherwise calculate (monthly × 12 × 0.8 for 20% discount)
        return pkg.yearlyPrice || Math.round(pkg.price * 12 * 0.8);
      }
      return pkg.price;
    },
    [billingCycle]
  );

  // Calculate original price for yearly (monthly × 12)
  const getOriginalPrice = useCallback(
    (pkg: HostingPackage): number | null => {
      if (billingCycle === "Yearly") {
        return pkg.yearlyPrice ? pkg.price * 12 : null;
      }
      return pkg.originalPrice || null;
    },
    [billingCycle]
  );

  // Get billing cycle text
  const getBillingCycleText = useCallback((): string => {
    return billingCycle === "Monthly" ? "شهرياً" : "سنوياً";
  }, [billingCycle]);

  // Get base package for feature stacking
  const getBasePackage = useCallback(
    (basePackageId: string): HostingPackage | null => {
      return packages.find((pkg) => pkg._id === basePackageId) || null;
    },
    [packages]
  );

  // Get additional features (features not in base package)
  const getAdditionalFeatures = useCallback(
    (pkg: HostingPackage): string[] => {
      if (!pkg.basePackageId) return pkg.features || [];

      const basePackage = getBasePackage(pkg.basePackageId);
      if (!basePackage || !basePackage.features) return pkg.features || [];

      const baseFeatures = new Set(
        basePackage.features.map((f) => f.toLowerCase())
      );
      return (pkg.features || []).filter(
        (feature) => !baseFeatures.has(feature.toLowerCase())
      );
    },
    [getBasePackage]
  );

  // Open package selection modal
  const openPackageModal = useCallback((pkg: HostingPackage) => {
    setSelectedPackageForModal(pkg);
    setIsEnterpriseModal(false);
    setModalOpen(true);
  }, []);

  // Open enterprise modal
  const openEnterpriseModal = useCallback(() => {
    setSelectedPackageForModal(null);
    setIsEnterpriseModal(true);
    setModalOpen(true);
  }, []);

  // Get CTA button text based on package type
  const getCtaText = useCallback((pkg: HostingPackage): string => {
    if (pkg.isPopular) {
      return "الخيار الأكثر طلباً";
    } else if (pkg.isBestValue) {
      return "للأداء الأقصى";
    } else if (pkg.sortOrder === 1) {
      return "ابدأ الانطلاق";
    } else {
      return "اختر هذه الباقة";
    }
  }, []);

  // Toggle features visibility
  const toggleFeatures = useCallback((packageId: string) => {
    setExpandedFeatures((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(packageId)) {
        newSet.delete(packageId);
      } else {
        newSet.add(packageId);
      }
      return newSet;
    });
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await publicHostingPackagesService.getAll();
        setPackages(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching hosting packages:", err);
        setError("فشل تحميل باقات الاستضافة. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <section
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
        id="hosting"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">جاري تحميل باقات الاستضافة...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
        id="hosting"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (packages.length === 0) {
    return null;
  }

  return (
    <section
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
      id="hosting"
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
            باقات الاستضافة
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            اختر{" "}
            <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))]">
              الباقة المناسبة
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            حلول استضافة موثوقة وسريعة لمواقعك وتطبيقاتك
          </p>
        </motion.div>

        {/* Billing Cycle Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200 flex items-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setBillingCycle("Monthly")}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                billingCycle === "Monthly"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              شهري
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setBillingCycle("Yearly")}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                billingCycle === "Yearly"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              سنوي
              <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                خصم 20%
              </span>
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {packages.map((pkg, index) => {
            const displayPrice = getDisplayPrice(pkg);
            const originalPrice = getOriginalPrice(pkg);

            return (
              <motion.div
                key={`${pkg._id}-${billingCycle}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                  pkg.isPopular
                    ? "border-primary scale-105 shadow-primary/20"
                    : pkg.isBestValue
                    ? "border-yellow-400 shadow-yellow-400/20"
                    : "border-gray-100"
                }`}
                style={{
                  boxShadow: pkg.isPopular
                    ? "0 20px 40px -12px rgba(var(--color-primary-rgb, 14, 165, 233), 0.3), 0 8px 16px -8px rgba(var(--color-primary-rgb, 14, 165, 233), 0.2)"
                    : pkg.isBestValue
                    ? "0 20px 40px -12px rgba(251, 191, 36, 0.3), 0 8px 16px -8px rgba(251, 191, 36, 0.2)"
                    : undefined,
                }}
              >
                {/* Ribbon Badge */}
                {pkg.isPopular && (
                  <div className="absolute -top-1 -right-1 z-20">
                    <div className="relative bg-gradient-to-l from-primary to-primaryDark text-white px-6 py-2 text-sm font-bold shadow-lg transform rotate-12 origin-bottom-left">
                      <div className="absolute inset-0 bg-gradient-to-l from-primary to-primaryDark opacity-80 blur-sm"></div>
                      <span className="relative z-10">الأكثر شعبية</span>
                    </div>
                  </div>
                )}

                {pkg.isBestValue && (
                  <div className="absolute -top-1 -right-1 z-20">
                    <div className="relative bg-gradient-to-l from-yellow-400 to-yellow-500 text-white px-6 py-2 text-sm font-bold shadow-lg transform rotate-12 origin-bottom-left flex items-center gap-2">
                      <div className="absolute inset-0 bg-gradient-to-l from-yellow-400 to-yellow-500 opacity-80 blur-sm"></div>
                      <FiStar className="text-sm relative z-10" />
                      <span className="relative z-10">أفضل قيمة</span>
                    </div>
                  </div>
                )}

                {/* خصم */}
                {pkg.discountPercentage && pkg.discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                    خصم {pkg.discountPercentage}%
                  </div>
                )}

                <div className="p-6">
                  {/* العنوان */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiServer className="text-primary text-xl" />
                      <h3 className="text-xl font-bold text-gray-900">
                        {pkg.name}
                      </h3>
                    </div>
                    {pkg.description && (
                      <p className="text-sm text-gray-600">{pkg.description}</p>
                    )}
                  </div>

                  {/* السعر */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <AnimatePresence mode="wait">
                        {originalPrice && originalPrice > displayPrice && (
                          <motion.span
                            key={`original-${pkg._id}-${billingCycle}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-lg text-gray-400 line-through"
                          >
                            {originalPrice} {pkg.currency || "SAR"}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <motion.span
                        key={`price-${pkg._id}-${billingCycle}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="text-3xl font-bold text-gray-900"
                      >
                        <AnimatedPrice price={displayPrice} />{" "}
                        {pkg.currency || "SAR"}
                      </motion.span>
                      <motion.span
                        key={`cycle-${pkg._id}-${billingCycle}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm text-gray-600"
                      >
                        /{getBillingCycleText()}
                      </motion.span>
                    </div>
                    {billingCycle === "Yearly" && (
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-green-600 font-medium mt-1"
                      >
                        وفر{" "}
                        {(pkg.yearlyPrice
                          ? pkg.price * 12 - pkg.yearlyPrice
                          : pkg.price * 12 * 0.2
                        ).toFixed(0)}{" "}
                        ريال سنوياً
                      </motion.p>
                    )}
                  </div>

                  {/* المواصفات */}
                  <div className="space-y-3 mb-6">
                    {pkg.storage && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 group/spec">
                        <FiZap className="text-primary" />
                        <span>
                          <strong>مساحة:</strong> {pkg.storage}
                        </span>
                        {pkg.benefitHints?.storage && (
                          <div className="relative">
                            <div className="opacity-0 group-hover/spec:opacity-100 transition-opacity duration-200 absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                              {pkg.benefitHints.storage}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {pkg.bandwidth && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 group/spec">
                        <FiZap className="text-primary" />
                        <span>
                          <strong>نطاق:</strong> {pkg.bandwidth}
                        </span>
                        {pkg.benefitHints?.bandwidth && (
                          <div className="relative">
                            <div className="opacity-0 group-hover/spec:opacity-100 transition-opacity duration-200 absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                              {pkg.benefitHints.bandwidth}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {pkg.ram && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 group/spec">
                        <FiZap className="text-primary" />
                        <span>
                          <strong>RAM:</strong> {pkg.ram}
                        </span>
                        {pkg.benefitHints?.ram && (
                          <div className="relative">
                            <div className="opacity-0 group-hover/spec:opacity-100 transition-opacity duration-200 absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                              {pkg.benefitHints.ram}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {pkg.cpu && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 group/spec">
                        <FiZap className="text-primary" />
                        <span>
                          <strong>CPU:</strong> {pkg.cpu}
                        </span>
                        {pkg.benefitHints?.cpu && (
                          <div className="relative">
                            <div className="opacity-0 group-hover/spec:opacity-100 transition-opacity duration-200 absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                              {pkg.benefitHints.cpu}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {pkg.domains && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 group/spec">
                        <FiZap className="text-primary" />
                        <span>
                          <strong>نطاقات:</strong> {pkg.domains}
                        </span>
                        {pkg.benefitHints?.domains && (
                          <div className="relative">
                            <div className="opacity-0 group-hover/spec:opacity-100 transition-opacity duration-200 absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                              {pkg.benefitHints.domains}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* المميزات */}
                  {pkg.features && pkg.features.length > 0 && (
                    <div className="mb-6">
                      <motion.button
                        onClick={() => toggleFeatures(pkg._id)}
                        className="flex items-center justify-between w-full text-left group mb-3"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <h4 className="font-semibold text-gray-900">
                          المميزات:
                        </h4>
                        <motion.div
                          animate={{
                            rotate: expandedFeatures.has(pkg._id) ? 180 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                          className="text-gray-500 group-hover:text-gray-700"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M5 7.5L10 12.5L15 7.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </motion.div>
                      </motion.button>

                      <AnimatePresence>
                        {expandedFeatures.has(pkg._id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-3">
                              {/* Base package features */}
                              {pkg.basePackageId &&
                                (() => {
                                  const basePackage = getBasePackage(
                                    pkg.basePackageId!
                                  );
                                  return basePackage ? (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                      <p className="text-sm text-gray-600 mb-2">
                                        كل مميزات{" "}
                                        <span className="font-semibold text-primary">
                                          {basePackage.name}
                                        </span>
                                        ، بالإضافة إلى:
                                      </p>
                                      <ul className="space-y-1">
                                        {basePackage.features
                                          ?.slice(0, 3)
                                          .map((feature, i) => (
                                            <li
                                              key={`base-${i}`}
                                              className="flex items-start gap-2 text-xs text-gray-500"
                                            >
                                              <FiCheck className="text-gray-400 mt-0.5 shrink-0" />
                                              <span>{feature}</span>
                                            </li>
                                          ))}
                                        {basePackage.features &&
                                          basePackage.features.length > 3 && (
                                            <li className="text-xs text-gray-400 pl-4">
                                              و{" "}
                                              {basePackage.features.length - 3}{" "}
                                              مميزات أخرى...
                                            </li>
                                          )}
                                      </ul>
                                    </div>
                                  ) : null;
                                })()}

                              {/* Additional features */}
                              {getAdditionalFeatures(pkg).length > 0 && (
                                <ul className="space-y-2">
                                  {getAdditionalFeatures(pkg).map(
                                    (feature, i) => (
                                      <li
                                        key={`additional-${i}`}
                                        className="flex items-start gap-2 text-sm text-gray-900 font-medium"
                                      >
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                                        <span>{feature}</span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}

                              {/* Regular features (no stacking) */}
                              {!pkg.basePackageId && (
                                <ul className="space-y-2">
                                  {pkg.features.map((feature, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2 text-sm text-gray-700"
                                    >
                                      <FiCheck className="text-primary mt-1 shrink-0" />
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* زر الاشتراك */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openPackageModal(pkg)}
                    className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                      pkg.isPopular
                        ? "bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {getCtaText(pkg)}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enterprise Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12 border border-gray-200">
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                هل تحتاج مواصفات خاصة؟
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                للمؤسسات الكبرى والمتاجر العملاقة، نوفر سيرفرات خاصة ودعم VIP.
                احصل على حلول مخصصة تناسب احتياجات عملك الفريدة.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openEnterpriseModal}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-primaryDark text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FiServer className="text-xl" />
                تواصل معنا لعرض سعر
                <FiZap className="text-xl" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Package Selection Modal */}
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
