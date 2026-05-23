import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  FiSend,
  FiCheck,
  FiArrowLeft,
  FiArrowRight,
  FiGlobe,
  FiShoppingBag,
  FiSmartphone,
  FiSettings,
  FiCpu,
  FiMessageSquare,
  FiHelpCircle,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiUser,
  FiUsers,
  FiFileText,
} from "react-icons/fi";
import { Building2, Mail, Phone, MessageCircle } from "lucide-react";
import {
  publicLeadsService,
  ServiceType,
  BudgetRange,
  LeadType,
  LeadPriority,
  ProjectStage,
  Timeline,
  PreferredContactMethod,
  CompanySize,
} from "../services/leads.service";

type Step = 1 | 2 | 3 | 4 | 5;

interface WizardData {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  companySize: CompanySize | "";
  serviceType: ServiceType | "";
  projectStage: ProjectStage | "";
  projectGoal: string;
  message: string;
  currentWebsite: string;
  hasBrandIdentity: boolean | null;
  hasContentReady: boolean | null;
  budgetRange: BudgetRange | "";
  timeline: Timeline | "";
  expectedLaunchDate: string;
  preferredContactMethod: PreferredContactMethod | "";
  meetingPreference: string;
  projectAnswers: Record<string, unknown>;
}

const initialData: WizardData = {
  fullName: "",
  companyName: "",
  email: "",
  phone: "",
  companySize: "",
  serviceType: "",
  projectStage: "",
  projectGoal: "",
  message: "",
  currentWebsite: "",
  hasBrandIdentity: null,
  hasContentReady: null,
  budgetRange: "",
  timeline: "",
  expectedLaunchDate: "",
  preferredContactMethod: "",
  meetingPreference: "",
  projectAnswers: {},
};

const serviceCards = [
  {
    value: ServiceType.WEB_APP,
    label: "موقع إلكتروني",
    description: "موقع تعريفي أو تفاعلي مع لوحة تحكم",
    icon: <FiGlobe size={24} />,
  },
  {
    value: ServiceType.ECOMMERCE,
    label: "متجر إلكتروني",
    description: "لبيع المنتجات وإدارة الطلبات والدفع والتوصيل",
    icon: <FiShoppingBag size={24} />,
  },
  {
    value: ServiceType.MOBILE_APP,
    label: "تطبيق جوال",
    description: "تطبيق Android أو iOS أو كلاهما",
    icon: <FiSmartphone size={24} />,
  },
  {
    value: ServiceType.ERP,
    label: "نظام إداري / ERP",
    description: "نظام شامل لإدارة الموارد والعمليات",
    icon: <FiSettings size={24} />,
  },
  {
    value: ServiceType.AUTOMATION,
    label: "أتمتة أعمال",
    description: "أتمتة العمليات وربط الأدوات المختلفة",
    icon: <FiCpu size={24} />,
  },
  {
    value: ServiceType.CONSULTATION,
    label: "استشارة تقنية",
    description: "استشارة لاختيار الحل الأنسب لمشروعك",
    icon: <FiMessageSquare size={24} />,
  },
  {
    value: ServiceType.OTHER,
    label: "أخرى",
    description: "مشروع آخر أو فكرة مختلفة",
    icon: <FiHelpCircle size={24} />,
  },
];

const budgetCards = [
  { value: BudgetRange.SMALL, label: "أقل من 1,000 دولار" },
  { value: BudgetRange.MEDIUM, label: "1,000 - 5,000 دولار" },
  { value: BudgetRange.LARGE, label: "5,000 - 15,000 دولار" },
  { value: BudgetRange.ENTERPRISE, label: "أكثر من 15,000 دولار" },
  { value: BudgetRange.NOT_SPECIFIED, label: "غير محدد" },
];

const timelineCards = [
  { value: Timeline.URGENT, label: "عاجل" },
  { value: Timeline.ONE_MONTH, label: "خلال شهر" },
  { value: Timeline.TWO_THREE_MONTHS, label: "خلال 2 - 3 أشهر" },
  { value: Timeline.FLEXIBLE, label: "مرن" },
];

const companySizeOptions = [
  { value: CompanySize.INDIVIDUAL, label: "فرد / مستقل" },
  { value: CompanySize.STARTUP, label: "شركة ناشئة" },
  { value: CompanySize.SMALL_BUSINESS, label: "مشروع صغير" },
  { value: CompanySize.COMPANY, label: "شركة متوسطة / كبيرة" },
];

const projectStageOptions = [
  { value: ProjectStage.IDEA, label: "فكرة أولية" },
  { value: ProjectStage.EXISTING_BUSINESS, label: "مشروع قائم" },
  { value: ProjectStage.REDESIGN, label: "إعادة تصميم" },
  { value: ProjectStage.SCALING, label: "توسع وتطوير" },
];

const contactMethodOptions = [
  { value: PreferredContactMethod.WHATSAPP, label: "واتساب", icon: <MessageCircle size={18} /> },
  { value: PreferredContactMethod.PHONE, label: "مكالمة هاتفية", icon: <Phone size={18} /> },
  { value: PreferredContactMethod.EMAIL, label: "بريد إلكتروني", icon: <Mail size={18} /> },
  { value: PreferredContactMethod.MEETING, label: "اجتماع", icon: <FiCalendar size={18} /> },
];

function calculatePriority(data: Partial<WizardData>): LeadPriority {
  if (data.budgetRange === BudgetRange.ENTERPRISE) return LeadPriority.HIGH;
  if (data.timeline === Timeline.URGENT) return LeadPriority.HIGH;
  if (data.budgetRange === BudgetRange.LARGE) return LeadPriority.HIGH;
  if (data.budgetRange === BudgetRange.MEDIUM) return LeadPriority.MEDIUM;
  return LeadPriority.MEDIUM;
}

function getServiceLabel(value: ServiceType | ""): string {
  const card = serviceCards.find((c) => c.value === value);
  return card?.label || "-";
}

function getBudgetLabel(value: BudgetRange | ""): string {
  const card = budgetCards.find((c) => c.value === value);
  return card?.label || "-";
}

function getTimelineLabel(value: Timeline | ""): string {
  const card = timelineCards.find((c) => c.value === value);
  return card?.label || "-";
}

function getStageLabel(value: ProjectStage | ""): string {
  const opt = projectStageOptions.find((o) => o.value === value);
  return opt?.label || "-";
}

function getCompanySizeLabel(value: CompanySize | ""): string {
  const opt = companySizeOptions.find((o) => o.value === value);
  return opt?.label || "-";
}

function getContactMethodLabel(value: PreferredContactMethod | ""): string {
  const opt = contactMethodOptions.find((o) => o.value === value);
  return opt?.label || "-";
}

export default function QuotePage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [data, setData] = useState<WizardData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateField = <K extends keyof WizardData>(field: K, value: WizardData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateProjectAnswer = (key: string, value: unknown) => {
    setData((prev) => ({
      ...prev,
      projectAnswers: { ...prev.projectAnswers, [key]: value },
    }));
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!data.fullName && !!data.email;
      case 2:
        return !!data.serviceType;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 5 && canProceed()) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const leadData = {
        fullName: data.fullName,
        companyName: data.companyName || undefined,
        email: data.email,
        phone: data.phone || undefined,
        serviceType: data.serviceType as ServiceType,
        budgetRange: (data.budgetRange as BudgetRange) || BudgetRange.NOT_SPECIFIED,
        message: data.message || undefined,
        source: "Start Project Wizard",
        leadType: LeadType.PROJECT_BRIEF,
        projectStage: data.projectStage as ProjectStage | undefined,
        projectGoal: data.projectGoal || undefined,
        timeline: data.timeline as Timeline | undefined,
        preferredContactMethod: data.preferredContactMethod as PreferredContactMethod | undefined,
        companySize: data.companySize as CompanySize | undefined,
        currentWebsite: data.currentWebsite || undefined,
        hasBrandIdentity: data.hasBrandIdentity ?? undefined,
        hasContentReady: data.hasContentReady ?? undefined,
        expectedLaunchDate: data.expectedLaunchDate || undefined,
        meetingPreference: data.meetingPreference || undefined,
        projectAnswers: data.projectAnswers,
        priority: calculatePriority(data),
      };

      await publicLeadsService.create(leadData);

      setIsSubmitting(false);
      setSubmitSuccess(true);
    } catch (error: unknown) {
      console.error("Error submitting project brief:", error);
      setIsSubmitting(false);
      let message = "فشل إرسال الطلب. يرجى المحاولة مرة أخرى.";
      if (error && typeof error === "object" && "response" in error) {
        const resp = (error as { response?: { data?: { message?: string } } }).response;
        message = resp?.data?.message || message;
      }
      setSubmitError(message);
    }
  };

  const steps = [
    { num: 1, label: "معلوماتك" },
    { num: 2, label: "نوع المشروع" },
    { num: 3, label: "تفاصيل الفكرة" },
    { num: 4, label: "الميزانية والمدة" },
    { num: 5, label: "طريقة التواصل" },
  ];

  // Smart questions based on service type
  const renderSmartQuestions = () => {
    if (data.serviceType === ServiceType.ECOMMERCE) {
      return (
        <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-800">أسئلة خاصة بالمتجر الإلكتروني</h4>
          <div className="space-y-3">
            {[
              { key: "productsReady", label: "هل لديك منتجات جاهزة؟" },
              { key: "needsPayment", label: "هل تحتاج دفع إلكتروني؟" },
              { key: "needsDeliveryIntegration", label: "هل تحتاج ربط توصيل؟" },
              { key: "needsAdminPanel", label: "هل تحتاج لوحة تحكم؟" },
            ].map((q) => (
              <div key={q.key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{q.label}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateProjectAnswer(q.key, true)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      data.projectAnswers[q.key] === true
                        ? "bg-[#008080] text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-[#008080]"
                    }`}
                  >
                    نعم
                  </button>
                  <button
                    type="button"
                    onClick={() => updateProjectAnswer(q.key, false)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      data.projectAnswers[q.key] === false
                        ? "bg-gray-500 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    لا
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (data.serviceType === ServiceType.MOBILE_APP) {
      return (
        <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-800">أسئلة خاصة بالتطبيق</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">هل التطبيق Android فقط أم Android و iOS؟</span>
            </div>
            <div className="flex gap-2">
              {["Android only", "Android + iOS"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateProjectAnswer("platforms", opt)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    data.projectAnswers["platforms"] === opt
                      ? "bg-[#008080] text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-[#008080]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {[
              { key: "needsAdminPanel", label: "هل يحتاج لوحة تحكم؟" },
              { key: "hasDesign", label: "هل لديك تصميم جاهز؟" },
              { key: "productScope", label: "هل تريد MVP أم منتج كامل؟" },
            ].map((q) => (
              <div key={q.key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{q.label}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateProjectAnswer(q.key, "نعم")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      data.projectAnswers[q.key] === "نعم"
                        ? "bg-[#008080] text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-[#008080]"
                    }`}
                  >
                    نعم
                  </button>
                  <button
                    type="button"
                    onClick={() => updateProjectAnswer(q.key, "لا")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      data.projectAnswers[q.key] === "لا"
                        ? "bg-gray-500 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    لا
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (data.serviceType === ServiceType.WEB_APP) {
      return (
        <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-800">أسئلة خاصة بالموقع</h4>
          <div className="space-y-3">
            {[
              { key: "isInteractive", label: "هل الموقع تعريفي أم نظام تفاعلي؟" },
              { key: "needsBlog", label: "هل تحتاج مدونة أو لوحة تحكم؟" },
              { key: "needsSEO", label: "هل تحتاج تحسين SEO؟" },
            ].map((q) => (
              <div key={q.key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{q.label}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateProjectAnswer(q.key, "نعم")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      data.projectAnswers[q.key] === "نعم"
                        ? "bg-[#008080] text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-[#008080]"
                    }`}
                  >
                    نعم
                  </button>
                  <button
                    type="button"
                    onClick={() => updateProjectAnswer(q.key, "لا")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      data.projectAnswers[q.key] === "لا"
                        ? "bg-gray-500 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    لا
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (data.serviceType === ServiceType.AUTOMATION) {
      return (
        <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-800">أسئلة خاصة بالأتمتة</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">ما العملية التي تريد أتمتتها؟</label>
              <textarea
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]"
                placeholder="وصف مختصر..."
                onChange={(e) => updateProjectAnswer("processToAutomate", e.target.value)}
              />
            </div>
            {[
              { key: "needsCRM", label: "هل تحتاج ربط CRM؟" },
              { key: "needsNotifications", label: "هل تحتاج إشعارات؟" },
            ].map((q) => (
              <div key={q.key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{q.label}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateProjectAnswer(q.key, true)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      data.projectAnswers[q.key] === true
                        ? "bg-[#008080] text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-[#008080]"
                    }`}
                  >
                    نعم
                  </button>
                  <button
                    type="button"
                    onClick={() => updateProjectAnswer(q.key, false)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      data.projectAnswers[q.key] === false
                        ? "bg-gray-500 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    لا
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  // Success State
  if (submitSuccess) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center px-4 py-20"
        dir="rtl"
      >
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
          >
            <FiCheck className="text-green-600 text-4xl" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            تم استلام تفاصيل مشروعك بنجاح
          </h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            سيقوم فريق سمارت بمراجعة الطلب وتحضير تصوّر أولي خلال 24 ساعة عمل.
          </p>

          <div className="space-y-3 mb-10 text-right">
            {["مراجعة الطلب", "تحديد أفضل حل تقني", "التواصل معك", "إرسال تصوّر أولي أو تحديد اجتماع"].map(
              (step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="w-8 h-8 rounded-full bg-[#008080] text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </motion.div>
              )
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/967778032532"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
            >
              <MessageCircle size={18} />
              تواصل عبر واتساب
            </a>
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all"
              >
                العودة للرئيسية
              </motion.button>
            </Link>
            <Link to="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                استعراض أعمالنا
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-20 px-4"
      dir="rtl"
    >
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          ابدأ مشروعك —{" "}
          <span className="text-[#008080]">نحوّل فكرتك إلى خطة واضحة</span>
        </h1>
        <p className="text-gray-600 text-lg">
          خمس خطوات بسيطة لمساعدتنا على فهم مشروعك وتقديم أفضل حل تقني.
        </p>
      </div>

      {/* Error */}
      {submitError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-center"
        >
          {submitError}
        </motion.div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wizard */}
          <div className="lg:col-span-2">
            {/* Progress */}
            <div className="flex items-center justify-between mb-8 px-2">
              {steps.map((step, i) => (
                <div key={step.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        currentStep === step.num
                          ? "bg-[#008080] text-white"
                          : currentStep > step.num
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {currentStep > step.num ? (
                        <FiCheck size={16} />
                      ) : (
                        step.num
                      )}
                    </div>
                    <span className="text-xs mt-2 text-gray-500 hidden sm:block">
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded ${
                        currentStep > step.num ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* Step 1: Client Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-2">معلوماتك</h2>
                    <p className="text-gray-500 text-sm mb-6">
                      نحتاج هذه البيانات فقط لنتواصل معك بعد مراجعة تفاصيل المشروع.
                    </p>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            الاسم الكامل *
                          </label>
                          <input
                            type="text"
                            value={data.fullName}
                            onChange={(e) => updateField("fullName", e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#008080] text-sm"
                            placeholder="أدخل اسمك"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            البريد الإلكتروني *
                          </label>
                          <input
                            type="email"
                            value={data.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#008080] text-sm"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            اسم الشركة (اختياري)
                          </label>
                          <input
                            type="text"
                            value={data.companyName}
                            onChange={(e) => updateField("companyName", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#008080] text-sm"
                            placeholder="اسم الشركة"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            رقم الهاتف (اختياري)
                          </label>
                          <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => updateField("phone", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#008080] text-sm"
                            placeholder="+967 7XX XXX XXX"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          حجم الشركة
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {companySizeOptions.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => updateField("companySize", opt.value)}
                              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                                data.companySize === opt.value
                                  ? "border-[#008080] bg-[#008080]/5 text-[#008080]"
                                  : "border-gray-200 text-gray-600 hover:border-gray-300"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Service Selection */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-2">نوع المشروع</h2>
                    <p className="text-gray-500 text-sm mb-6">اختر نوع المشروع الذي تريد بناءه.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {serviceCards.map((card) => (
                        <button
                          key={card.value}
                          type="button"
                          onClick={() => updateField("serviceType", card.value)}
                          className={`p-5 rounded-xl border text-right transition-all ${
                            data.serviceType === card.value
                              ? "border-[#008080] bg-[#008080]/5 shadow-md"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                          }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                              data.serviceType === card.value
                                ? "bg-[#008080] text-white"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {card.icon}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{card.label}</h3>
                          <p className="text-gray-500 text-sm">{card.description}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Project Details */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-2">تفاصيل الفكرة</h2>
                    <p className="text-gray-500 text-sm mb-6">أخبرنا أكثر عن مشروعك.</p>
                    <div className="space-y-5">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          مرحلة المشروع
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {projectStageOptions.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => updateField("projectStage", opt.value)}
                              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                                data.projectStage === opt.value
                                  ? "border-[#008080] bg-[#008080]/5 text-[#008080]"
                                  : "border-gray-200 text-gray-600 hover:border-gray-300"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          هدف المشروع
                        </label>
                        <input
                          type="text"
                          value={data.projectGoal}
                          onChange={(e) => updateField("projectGoal", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#008080] text-sm"
                          placeholder="ما الهدف الرئيسي من هذا المشروع؟"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            الموقع الحالي (إن وجد)
                          </label>
                          <input
                            type="url"
                            value={data.currentWebsite}
                            onChange={(e) => updateField("currentWebsite", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#008080] text-sm"
                            placeholder="https://example.com"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            هل لديك هوية بصرية؟
                          </label>
                          <div className="flex gap-3">
                            {[true, false].map((val) => (
                              <button
                                key={val ? "yes" : "no"}
                                type="button"
                                onClick={() => updateField("hasBrandIdentity", val)}
                                className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all ${
                                  data.hasBrandIdentity === val
                                    ? "border-[#008080] bg-[#008080]/5 text-[#008080]"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                                }`}
                              >
                                {val ? "نعم" : "لا"}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          وصف المشروع
                        </label>
                        <textarea
                          rows={4}
                          value={data.message}
                          onChange={(e) => updateField("message", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#008080] text-sm resize-none"
                          placeholder="أخبرنا أكثر عن مشروعك، متطلباتك، والجدول الزمني المطلوب..."
                        />
                      </div>

                      {renderSmartQuestions()}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Budget & Timeline */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-2">الميزانية والمدة</h2>
                    <p className="text-gray-500 text-sm mb-6">
                      هذه المعلومات تساعدنا في تقديم الحل الأنسب لميزانيتك.
                    </p>
                    <div className="space-y-6">
                      <div>
                        <label className="block mb-3 text-sm font-medium text-gray-700">
                          الميزانية المتوقعة
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {budgetCards.map((card) => (
                            <button
                              key={card.value}
                              type="button"
                              onClick={() => updateField("budgetRange", card.value)}
                              className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                                data.budgetRange === card.value
                                  ? "border-[#008080] bg-[#008080]/5 text-[#008080]"
                                  : "border-gray-200 text-gray-600 hover:border-gray-300"
                              }`}
                            >
                              {card.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block mb-3 text-sm font-medium text-gray-700">
                          المدة المتوقعة
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {timelineCards.map((card) => (
                            <button
                              key={card.value}
                              type="button"
                              onClick={() => updateField("timeline", card.value)}
                              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                                data.timeline === card.value
                                  ? "border-[#008080] bg-[#008080]/5 text-[#008080]"
                                  : "border-gray-200 text-gray-600 hover:border-gray-300"
                              }`}
                            >
                              {card.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          تاريخ الإطلاق المتوقع (اختياري)
                        </label>
                        <input
                          type="date"
                          value={data.expectedLaunchDate}
                          onChange={(e) => updateField("expectedLaunchDate", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#008080] text-sm"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Contact Preference */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-2">طريقة التواصل</h2>
                    <p className="text-gray-500 text-sm mb-6">
                      اختر الطريقة الأنسب للتواصل معك بعد مراجعة الطلب.
                    </p>
                    <div className="space-y-6">
                      <div>
                        <label className="block mb-3 text-sm font-medium text-gray-700">
                          طريقة التواصل المفضلة
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {contactMethodOptions.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => updateField("preferredContactMethod", opt.value)}
                              className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium transition-all ${
                                data.preferredContactMethod === opt.value
                                  ? "border-[#008080] bg-[#008080]/5 text-[#008080]"
                                  : "border-gray-200 text-gray-600 hover:border-gray-300"
                              }`}
                            >
                              {opt.icon}
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      {data.preferredContactMethod === PreferredContactMethod.MEETING && (
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            وقت الاجتماع المفضل
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { value: "morning", label: "صباحًا" },
                              { value: "afternoon", label: "ظهرًا" },
                              { value: "evening", label: "مساءً" },
                              { value: "flexible", label: "مرن" },
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => updateField("meetingPreference", opt.value)}
                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                                  data.meetingPreference === opt.value
                                    ? "border-[#008080] bg-[#008080]/5 text-[#008080]"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    currentStep === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FiArrowRight size={16} />
                  السابق
                </button>

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      canProceed()
                        ? "bg-[#008080] text-white hover:bg-[#006666]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    التالي
                    <FiArrowLeft size={16} />
                  </button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className={`flex items-center gap-2 px-8 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed text-gray-200"
                        : "bg-[#008080] hover:bg-[#006666] text-white shadow-md"
                    }`}
                  >
                    {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
                    <FiSend size={16} />
                  </motion.button>
                )}
              </div>
            </form>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiFileText className="text-[#008080]" />
                ملخص طلبك
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <FiUser className="text-gray-400 mt-0.5 flex-shrink-0" size={14} />
                  <div>
                    <span className="text-gray-500">الاسم:</span>
                    <p className="font-medium">{data.fullName || "-"}</p>
                  </div>
                </div>
                {data.companyName && (
                  <div className="flex items-start gap-2">
                    <Building2 className="text-gray-400 mt-0.5 flex-shrink-0" size={14} />
                    <div>
                      <span className="text-gray-500">الشركة:</span>
                      <p className="font-medium">{data.companyName}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <FiGlobe className="text-gray-400 mt-0.5 flex-shrink-0" size={14} />
                  <div>
                    <span className="text-gray-500">نوع المشروع:</span>
                    <p className="font-medium">{getServiceLabel(data.serviceType)}</p>
                  </div>
                </div>
                {data.projectStage && (
                  <div className="flex items-start gap-2">
                    <FiSettings className="text-gray-400 mt-0.5 flex-shrink-0" size={14} />
                    <div>
                      <span className="text-gray-500">مرحلة المشروع:</span>
                      <p className="font-medium">{getStageLabel(data.projectStage)}</p>
                    </div>
                  </div>
                )}
                {data.companySize && (
                  <div className="flex items-start gap-2">
                    <FiUsers className="text-gray-400 mt-0.5 flex-shrink-0" size={14} />
                    <div>
                      <span className="text-gray-500">حجم الشركة:</span>
                      <p className="font-medium">{getCompanySizeLabel(data.companySize)}</p>
                    </div>
                  </div>
                )}
                {data.budgetRange && (
                  <div className="flex items-start gap-2">
                    <FiDollarSign className="text-gray-400 mt-0.5 flex-shrink-0" size={14} />
                    <div>
                      <span className="text-gray-500">الميزانية:</span>
                      <p className="font-medium">{getBudgetLabel(data.budgetRange)}</p>
                    </div>
                  </div>
                )}
                {data.timeline && (
                  <div className="flex items-start gap-2">
                    <FiClock className="text-gray-400 mt-0.5 flex-shrink-0" size={14} />
                    <div>
                      <span className="text-gray-500">المدة:</span>
                      <p className="font-medium">{getTimelineLabel(data.timeline)}</p>
                    </div>
                  </div>
                )}
                {data.preferredContactMethod && (
                  <div className="flex items-start gap-2">
                    <MessageCircle className="text-gray-400 mt-0.5 flex-shrink-0" size={14} />
                    <div>
                      <span className="text-gray-500">التواصل:</span>
                      <p className="font-medium">{getContactMethodLabel(data.preferredContactMethod)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
