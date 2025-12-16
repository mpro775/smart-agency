import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { publicHostingPackagesService } from "../services/hosting-packages.service";
import type { HostingPackage, PackageSelectionRequest } from "../services/hosting-packages.service";

interface PackageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: HostingPackage | null;
  billingCycle: 'Monthly' | 'Yearly';
  isEnterprise?: boolean;
}

export default function PackageSelectionModal({
  isOpen,
  onClose,
  selectedPackage,
  billingCycle,
  isEnterprise = false
}: PackageSelectionModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const selectionData: PackageSelectionRequest = {
        packageId: selectedPackage?._id || 'enterprise-custom',
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName || undefined,
        message: formData.message || undefined,
        billingCycle,
      };

      await publicHostingPackagesService.selectPackage(selectionData);

      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        companyName: '',
        message: '',
      });

      // Close modal after success
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 2000);

    } catch (error: any) {
      console.error('Error submitting package selection:', error);
      setIsSubmitting(false);
      setSubmitError(
        error.response?.data?.message ||
        'فشل إرسال الطلب. يرجى المحاولة مرة أخرى.'
      );
    }
  };

  const resetModal = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      companyName: '',
      message: '',
    });
    setSubmitError(null);
    setSubmitSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={resetModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-primary to-primaryDark text-white p-6 rounded-t-2xl">
              <button
                onClick={resetModal}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <h3 className="text-xl font-bold mb-2">
                {isEnterprise ? 'طلب حل مخصص' : 'اختيار الباقة'}
              </h3>
              <p className="text-white/90 text-sm">
                {isEnterprise
                  ? 'أخبرنا عن احتياجاتك وسنقوم بإعداد عرض سعر مخصص'
                  : `طلب ${selectedPackage?.name} - ${billingCycle === 'Monthly' ? 'شهري' : 'سنوي'}`
                }
              </p>
            </div>

            {/* Form */}
            <div className="p-6">
              {submitSuccess ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    تم إرسال طلبك بنجاح!
                  </h4>
                  <p className="text-gray-600">
                    سنتواصل معك خلال 24 ساعة لمناقشة التفاصيل.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="example@email.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+966501234567"
                    />
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اسم الشركة (اختياري)
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="اسم شركتك"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رسالة إضافية (اختياري)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder={isEnterprise ? "أخبرنا عن احتياجاتك المحددة..." : "أي ملاحظات إضافية..."}
                    />
                  </div>

                  {/* Error Message */}
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg"
                    >
                      <AlertCircle size={16} />
                      <span className="text-sm">{submitError}</span>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-primaryDark text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        جاري الإرسال...
                      </>
                    ) : (
                      'إرسال الطلب'
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
