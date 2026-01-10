"use client";
import { motion } from "framer-motion";
import {
  FiLinkedin,
  FiGithub,
  FiTwitter,
  FiGlobe,
  FiMail,
  FiBriefcase,
  FiUser,
  FiCalendar,
  FiAward,
} from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TeamMember } from "../services/team.service";

interface TeamMemberDialogProps {
  member: TeamMember;
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamMemberDialog({
  member,
  isOpen,
  onClose,
}: TeamMemberDialogProps) {
  // ألوان هادئة وعصرية (نظام داكن مطفي)
  const accentColor = "text-emerald-400";
  const accentBg = "bg-emerald-500/10";
  const accentBorder = "border-emerald-500/20";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-5xl xl:max-w-6xl bg-[#09090b] border border-white/10 text-gray-100 shadow-2xl p-0 overflow-hidden sm:rounded-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>تفاصيل العضو</DialogTitle>
        </DialogHeader>

        {/* خلفية هادئة جداً - Ambient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-900/20 rounded-full blur-[80px] md:blur-[120px] opacity-40" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-blue-900/10 rounded-full blur-[60px] md:blur-[100px] opacity-30" />
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto md:overflow-hidden">
          {/* العمود الأيسر - الصورة والمعلومات الشخصية */}
          <div className="md:col-span-4 lg:col-span-4 bg-white/[0.02] border-b md:border-b-0 md:border-e border-white/5 p-6 md:p-8 flex flex-col items-center text-center relative">
            {/* الصورة الشخصية */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-32 h-44 md:w-40 md:h-56 mb-6 md:mb-8 mt-2 md:mt-4 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group"
            >
              {member.photo ? (
                <>
                  <img
                    src={member.photo}
                    alt={member.fullName}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
                  <span className="text-5xl md:text-6xl text-gray-700 font-light">
                    {member.fullName.charAt(0)}
                  </span>
                </div>
              )}
            </motion.div>

            {/* الاسم والمنصب */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full"
            >
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">
                {member.fullName}
              </h2>
              <div
                className={`inline-flex items-center px-4 py-1.5 rounded-full ${accentBg} border ${accentBorder} mb-6`}
              >
                <span className={`text-xs md:text-sm font-medium ${accentColor}`}>
                  {member.role}
                </span>
              </div>

              {/* معلومات سريعة */}
              <div className="space-y-4 w-full text-sm text-gray-400 border-t border-white/5 pt-6 text-center md:text-right">
                {member.department && (
                  <div className="flex items-center justify-center md:justify-end gap-3 group">
                    <span className="transition-colors group-hover:text-gray-200">
                      {member.department}
                    </span>
                    <FiBriefcase className="text-gray-600 group-hover:text-emerald-400 transition-colors shrink-0" />
                  </div>
                )}
                {member.joinedAt && (
                  <div className="flex items-center justify-center md:justify-end gap-3 group">
                    <span className="transition-colors group-hover:text-gray-200">
                      منذ {new Date(member.joinedAt).getFullYear()}
                    </span>
                    <FiCalendar className="text-gray-600 group-hover:text-emerald-400 transition-colors shrink-0" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* وسائل التواصل */}
            <div className="mt-8 md:mt-auto pt-6 flex gap-3 justify-center w-full">
              {[
                { icon: FiLinkedin, href: member.linkedinUrl },
                { icon: FiGithub, href: member.githubUrl },
                { icon: FiTwitter, href: member.twitterUrl },
                { icon: FiGlobe, href: member.websiteUrl },
                {
                  icon: FiMail,
                  href: member.email ? `mailto:${member.email}` : null,
                },
              ].map(
                (social, idx) =>
                  social.href && (
                    <motion.a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3 }}
                      className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 hover:border-white/20"
                    >
                      <social.icon size={18} />
                    </motion.a>
                  )
              )}
            </div>
          </div>

          {/* العمود الأيمن - التفاصيل */}
          <div className="md:col-span-8 p-6 md:p-10 lg:p-12 flex flex-col h-full overflow-y-auto custom-scrollbar">
            <div className="space-y-10">
              {/* نبذة عني */}
              {member.bio && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                    <FiUser className={accentColor} />
                    نبذة تعريفية
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-base font-light">
                    {member.bio}
                  </p>
                </motion.section>
              )}

              {/* التخصصات */}
              {member.specializations && member.specializations.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-5">
                    <FiAward className={accentColor} />
                    المهارات والتخصصات
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {member.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-gray-300 text-sm hover:bg-white/[0.05] hover:border-emerald-500/30 transition-colors cursor-default"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* حقيقة ممتعة */}
              {member.funFact && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-gray-800/20 to-gray-900/30 border border-white/5 overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <FiAward size={80} />
                    </div>
                    <h4
                      className={`text-sm font-medium ${accentColor} mb-2 uppercase tracking-wider`}
                    >
                      شيء قد لا تعرفه
                    </h4>
                    <p className="text-gray-300 italic relative z-10 leading-relaxed">
                      "{member.funFact}"
                    </p>
                  </div>
                </motion.div>
              )}

              {/* زر إغلاق للجوال */}
              <button
                onClick={onClose}
                className="md:hidden w-full py-4 rounded-xl bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-colors border border-white/10"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
