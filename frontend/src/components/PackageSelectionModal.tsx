import {
  useState,
  type FormEvent,
  type ComponentType,
  type InputHTMLAttributes,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  Package,
  Calendar,
} from "lucide-react";
import { publicHostingPackagesService } from "../services/hosting-packages.service";
import type {
  HostingPackage,
  PackageSelectionRequest,
} from "../services/hosting-packages.service";

interface PackageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: HostingPackage | null;
  billingCycle: "Monthly" | "Yearly";
  isEnterprise?: boolean;
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ComponentType<{ size?: number }>;
}

export default function PackageSelectionModal({
  isOpen,
  onClose,
  selectedPackage,
  billingCycle,
  isEnterprise = false,
}: PackageSelectionModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // حساب السعر للعرض فقط
  const displayPrice = selectedPackage
    ? billingCycle === "Yearly"
      ? selectedPackage.yearlyPrice ||
        Math.round(selectedPackage.price * 12 * 0.8)
      : selectedPackage.price
    : 0;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const selectionData: PackageSelectionRequest = {
        packageId: selectedPackage?._id || "enterprise-custom",
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

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        companyName: "",
        message: "",
      });

      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 2500);
    } catch (error: unknown) {
      console.error("Error submitting package selection:", error);
      setIsSubmitting(false);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "فشل إرسال الطلب. يرجى المحاولة مرة أخرى."
      );
    }
  };

  const resetModal = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      message: "",
    });
    setSubmitError(null);
    setSubmitSuccess(false);
    onClose();
  };

  // مكون حقل الإدخال المعاد استخدامه للتنظيم
  const InputField = ({ icon: Icon, ...props }: InputFieldProps) => (
    <div className="relative group">
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
        <Icon size={18} />
      </div>
      <input
        {...props}
        className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none placeholder:text-gray-400"
      />
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={resetModal}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* زر الإغلاق */}
            <button
              onClick={resetModal}
              className="absolute top-4 left-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors z-20"
            >
              <X size={20} />
            </button>

            {/* محتوى المودال */}
            <div className="p-0">
              {submitSuccess ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    تم استلام طلبك بنجاح!
                  </h3>
                  <p className="text-gray-500 max-w-xs mx-auto">
                    شكراً لثقتك بنا. سيقوم فريقنا بمراجعة طلبك والتواصل معك في
                    أقرب وقت ممكن لإكمال الإجراءات.
                  </p>
                </div>
              ) : (
                <>
                  {/* رأس المودال: ملخص الطلب */}
                  <div className="bg-gray-50 border-b border-gray-100 p-8 pt-10">
                    <div className="text-center mb-2">
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider mb-3">
                        {isEnterprise ? "طلب خاص" : "تأكيد الطلب"}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {isEnterprise ? "حلول المؤسسات" : selectedPackage?.name}
                      </h3>
                    </div>

                    {!isEnterprise && selectedPackage && (
                      <div className="mt-4 bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-50 p-2.5 rounded-xl text-primary">
                            <Package size={20} />
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              الباقة المختارة
                            </p>
                            <p className="font-semibold text-gray-900">
                              {selectedPackage.name}
                            </p>
                          </div>
                        </div>
                        <div className="w-px h-8 bg-gray-100 mx-2"></div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              {billingCycle === "Monthly" ? "شهرياً" : "سنوياً"}
                            </p>
                            <p className="font-bold text-gray-900 text-lg">
                              {displayPrice}{" "}
                              <span className="text-xs font-normal text-gray-500">
                                {selectedPackage.currency || "ر.س"}
                              </span>
                            </p>
                          </div>
                          <div className="bg-green-50 p-2.5 rounded-xl text-green-600">
                            <Calendar size={20} />
                          </div>
                        </div>
                      </div>
                    )}

                    {isEnterprise && (
                      <p className="text-center text-gray-600 text-sm mt-2 max-w-sm mx-auto">
                        املأ النموذج أدناه وسيقوم خبراؤنا التقنيون بالتواصل معك
                        لتصميم الحل الأمثل.
                      </p>
                    )}
                  </div>

                  {/* نموذج البيانات */}
                  <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 mr-1">
                          الاسم الكامل <span className="text-red-500">*</span>
                        </label>
                        <InputField
                          icon={User}
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          placeholder="مثال: محمد أحمد"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 mr-1">
                          رقم الهاتف <span className="text-red-500">*</span>
                        </label>
                        <InputField
                          icon={Phone}
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="05xxxxxxxx"
                          dir="ltr"
                          className="text-right"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 mr-1">
                        البريد الإلكتروني{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <InputField
                        icon={Mail}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="name@company.com"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 mr-1">
                        اسم الشركة (اختياري)
                      </label>
                      <InputField
                        icon={Building2}
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="اسم مؤسستك أو شركتك"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 mr-1">
                        ملاحظات إضافية
                      </label>
                      <div className="relative group">
                        <div className="absolute top-3 right-0 pr-3 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                          <MessageSquare size={18} />
                        </div>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none placeholder:text-gray-400 resize-none"
                          placeholder={
                            isEnterprise
                              ? "صف لنا متطلبات السيرفر والمواصفات التي تحتاجها..."
                              : "أي تعليمات خاصة..."
                          }
                        />
                      </div>
                    </div>

                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2"
                      >
                        <AlertCircle size={16} className="shrink-0" />
                        {submitError}
                      </motion.div>
                    )}

                    <div className="pt-2">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold shadow-lg shadow-gray-900/20 hover:bg-black hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>جاري المعالجة...</span>
                          </>
                        ) : (
                          <span>
                            {isEnterprise ? "إرسال طلب عرض سعر" : "إتمام الطلب"}
                          </span>
                        )}
                      </motion.button>
                      <p className="text-center text-xs text-gray-400 mt-4">
                        بضغطك على إتمام الطلب، أنت توافق على شروط الخدمة وسياسة
                        الخصوصية.
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
