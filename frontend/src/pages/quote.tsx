import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import {
  publicLeadsService,
  ServiceType,
  BudgetRange,
} from "../services/leads.service";

export default function QuotePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    serviceType: "",
    budgetRange: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Map Arabic service options to ServiceType enum
      const serviceTypeMap: Record<string, ServiceType> = {
        "موقع إلكتروني": ServiceType.WEB_APP,
        "متجر إلكتروني": ServiceType.ECOMMERCE,
        "تطبيق جوال": ServiceType.MOBILE_APP,
        أتمتة: ServiceType.AUTOMATION,
        "نظام ERP": ServiceType.ERP,
        استشارة: ServiceType.CONSULTATION,
        أخرى: ServiceType.OTHER,
      };

      const budgetRangeMap: Record<string, BudgetRange> = {
        "أقل من 1,000 دولار": BudgetRange.SMALL,
        "1,000 - 5,000 دولار": BudgetRange.MEDIUM,
        "5,000 - 15,000 دولار": BudgetRange.LARGE,
        "أكثر من 15,000 دولار": BudgetRange.ENTERPRISE,
        "غير محدد": BudgetRange.NOT_SPECIFIED,
      };

      const leadData = {
        fullName: formData.fullName,
        companyName: formData.companyName || undefined,
        email: formData.email,
        phone: formData.phone || undefined,
        serviceType: serviceTypeMap[formData.serviceType] || ServiceType.OTHER,
        budgetRange: formData.budgetRange
          ? budgetRangeMap[formData.budgetRange] || BudgetRange.NOT_SPECIFIED
          : BudgetRange.NOT_SPECIFIED,
        message: formData.message || undefined,
        source: "Website Contact Form",
      };

      await publicLeadsService.create(leadData);

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        fullName: "",
        companyName: "",
        email: "",
        phone: "",
        serviceType: "",
        budgetRange: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      console.error("Error submitting lead:", error);
      setIsSubmitting(false);
      setSubmitError(
        error.response?.data?.message ||
          "فشل إرسال الطلب. يرجى المحاولة مرة أخرى."
      );
    }
  };

  const serviceOptions = [
    { value: "موقع إلكتروني", label: "موقع إلكتروني" },
    { value: "متجر إلكتروني", label: "متجر إلكتروني" },
    { value: "تطبيق جوال", label: "تطبيق جوال" },
    { value: "أتمتة", label: "أتمتة" },
    { value: "نظام ERP", label: "نظام ERP" },
    { value: "استشارة", label: "استشارة" },
    { value: "أخرى", label: "أخرى" },
  ];

  const budgetOptions = [
    { value: "أقل من 1,000 دولار", label: "أقل من 1,000 دولار" },
    { value: "1,000 - 5,000 دولار", label: "1,000 - 5,000 دولار" },
    { value: "5,000 - 15,000 دولار", label: "5,000 - 15,000 دولار" },
    { value: "أكثر من 15,000 دولار", label: "أكثر من 15,000 دولار" },
    { value: "غير محدد", label: "غير محدد" },
  ];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-16 md:py-24 px-4 sm:px-6 max-w-3xl mx-auto"
    >
      {/* العنوان والمقدمة */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12 text-center md:text-right"
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-primary mb-4"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          طلب عرض سعر أو استشارة
        </motion.h1>
        <motion.p
          className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto md:mx-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          لأننا نؤمن أن كل مشروع فريد، نفضل الاستماع إليك أولًا قبل تقديم عرض أو
          تكلفة. أرسل لنا تفاصيلك وسنعود إليك خلال أقل من 24 ساعة.
        </motion.p>
      </motion.div>

      {/* رسالة النجاح */}
      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center"
        >
          تم إرسال طلبك بنجاح! سنتواصل معك قريبًا.
        </motion.div>
      )}

      {/* رسالة الخطأ */}
      {submitError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center"
        >
          {submitError}
        </motion.div>
      )}

      {/* النموذج */}
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="fullName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              الاسم الكامل *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              placeholder="أدخل اسمك الكامل"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              البريد الإلكتروني *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="companyName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              اسم الشركة
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              placeholder="اسم الشركة (اختياري)"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              رقم الهاتف
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              placeholder="+966501234567"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="serviceType"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              نوع الخدمة المطلوبة *
            </label>
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjU1NSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[position:right_0.75rem_center] bg-[size:16px_12px]"
            >
              <option disabled value="">
                اختر نوع الخدمة
              </option>
              {serviceOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="budgetRange"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              الميزانية المتوقعة
            </label>
            <select
              id="budgetRange"
              name="budgetRange"
              value={formData.budgetRange}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjU1NSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[position:right_0.75rem_center] bg-[size:16px_12px]"
            >
              <option value="">اختر الميزانية (اختياري)</option>
              {budgetOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            تفاصيل المشروع *
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm resize-none"
            placeholder="أخبرنا أكثر عن مشروعك، متطلباتك، والجدول الزمني المطلوب..."
          ></textarea>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-500">* الحقول المطلوبة</p>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primaryDark text-white shadow-md hover:shadow-lg"
            }`}
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? (
              "جاري الإرسال..."
            ) : (
              <>
                إرسال الطلب
                <FiSend className="text-base" />
              </>
            )}
          </motion.button>
        </div>
      </motion.form>
    </motion.main>
  );
}
