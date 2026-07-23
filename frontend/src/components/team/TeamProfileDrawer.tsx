import { motion } from "framer-motion";
import {
  FiLinkedin,
  FiGithub,
  FiTwitter,
  FiGlobe,
  FiMail,
  FiBriefcase,
  FiCalendar,
  FiAward,
  FiUser,
} from "react-icons/fi";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { TeamMember } from "../../services/team.service";
import { getDepartmentLabel } from "./team-utils";

interface Props {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TeamProfileDrawer({ member, open, onOpenChange }: Props) {
  if (!member) return null;

  const accentColor = "text-cyan-400";
  const accentBg = "bg-cyan-500/10";
  const accentBorder = "border-cyan-500/20";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md lg:max-w-xl bg-[#09090b] border-white/10 text-gray-100 p-0 overflow-y-auto"
        dir="rtl"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>الملف المهني</SheetTitle>
          <SheetDescription>تفاصيل العضو</SheetDescription>
        </SheetHeader>

        {/* Ambient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-cyan-900/20 rounded-full blur-[80px] opacity-30" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] bg-blue-900/10 rounded-full blur-[60px] opacity-20" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* الصورة والاسم */}
          <div className="flex flex-col items-center text-center px-4 sm:px-6 pt-10 sm:pt-12 pb-6 sm:pb-8 border-b border-white/5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-28 h-36 sm:w-36 sm:h-48 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 mb-4 sm:mb-6"
            >
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.fullName}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl text-gray-700 font-light">
                    {member.fullName.charAt(0)}
                  </span>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {member.fullName}
              </h2>
              <div className={`inline-flex items-center px-3 py-1 sm:px-4 sm:py-1.5 rounded-full ${accentBg} border ${accentBorder} mb-4 sm:mb-5`}>
                <span className={`text-xs sm:text-sm font-medium ${accentColor}`}>
                  {member.role}
                </span>
              </div>

              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-400">
                {member.department && (
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <span className="text-gray-300">{getDepartmentLabel(member.department)}</span>
                    <FiBriefcase className="text-gray-600 shrink-0" />
                  </div>
                )}
                {member.joinedAt && (
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <span className="text-gray-300">منذ {new Date(member.joinedAt).getFullYear()}</span>
                    <FiCalendar className="text-gray-600 shrink-0" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* وسائل التواصل */}
            <div className="mt-4 sm:mt-6 flex flex-wrap gap-2.5 sm:gap-3 justify-center">
              {[
                { icon: FiLinkedin, href: member.linkedinUrl },
                { icon: FiGithub, href: member.githubUrl },
                { icon: FiTwitter, href: member.twitterUrl },
                { icon: FiGlobe, href: member.websiteUrl },
                { icon: FiMail, href: member.email ? `mailto:${member.email}` : null },
              ].map(
                (social, idx) =>
                  social.href && (
                    <motion.a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3 }}
                      className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 hover:border-white/20"
                    >
                      <social.icon className="w-4 h-4 sm:w-4 sm:h-4" />
                    </motion.a>
                  )
              )}
            </div>
          </div>

          {/* التفاصيل */}
          <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
            {member.bio && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                  <FiUser className={accentColor} />
                  نبذة تعريفية
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                  {member.bio}
                </p>
              </motion.section>
            )}

            {member.specializations && member.specializations.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-white mb-3 sm:mb-5">
                  <FiAward className={accentColor} />
                  المهارات والتخصصات
                </h3>
                <div className="flex flex-wrap gap-2">
                  {member.specializations.map((spec, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white/[0.03] border border-white/10 text-gray-300 text-xs sm:text-sm hover:bg-white/[0.05] hover:border-cyan-500/30 transition-colors cursor-default"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </motion.section>
            )}

            {member.funFact && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="relative p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-gray-800/20 to-gray-900/30 border border-white/5 overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FiAward size={80} />
                  </div>
                  <h4 className={`text-xs sm:text-sm font-medium ${accentColor} mb-2 uppercase tracking-wider`}>
                    شيء يميز هذا العضو
                  </h4>
                  <p className="text-gray-300 text-xs sm:text-sm italic relative z-10 leading-relaxed">
                    "{member.funFact}"
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
