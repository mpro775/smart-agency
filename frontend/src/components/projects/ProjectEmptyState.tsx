"use client";
import { motion } from "framer-motion";

interface ProjectEmptyStateProps {
  message?: string;
  subMessage?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function ProjectEmptyState({
  message = "لا توجد مشاريع في هذا التصنيف حالياً",
  subMessage = "نعمل على إضافة نماذج جديدة قريباً.",
  actionLabel,
  onAction,
}: ProjectEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-20"
      dir="rtl"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-6">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <div className="text-gray-500 text-lg font-medium mb-2">{message}</div>
      {subMessage && (
        <div className="text-gray-400 text-sm mb-6">{subMessage}</div>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 rounded-xl bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white font-medium shadow-lg hover:shadow-xl transition-all"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
