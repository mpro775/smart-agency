import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, BarChart3, Mail, Github, Linkedin, Globe, ExternalLink, Lightbulb } from "lucide-react";
import type { TeamMember } from "../../services/team.service";
import { getDepartmentLabel, truncateText } from "./team-utils";

interface Props {
  member: TeamMember;
  onOpenProfile: (member: TeamMember) => void;
}

export default function FeaturedTeamMember({ member, onOpenProfile }: Props) {
  const skills = member.specializations?.slice(0, 3) ?? [];

  const socials = [
    { href: member.linkedinUrl, icon: Linkedin, label: "LinkedIn" },
    { href: member.githubUrl, icon: Github, label: "GitHub" },
    { href: member.websiteUrl, icon: Globe, label: "Website" },
    { href: member.email ? `mailto:${member.email}` : undefined, icon: Mail, label: "Email" },
  ].filter((item) => item.href);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={member._id}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.98 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-2xl shadow-black/30 min-h-0 lg:min-h-[560px]"
        dir="rtl"
      >
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_25%_35%,rgba(34,211,238,0.22),transparent_35%),linear-gradient(to_bottom_right,rgba(255,255,255,0.04),transparent)]" />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

        <div className="relative z-10 grid lg:grid-cols-12 gap-5 sm:gap-8 p-4 sm:p-6 md:p-8 lg:p-10 h-full">
          <div className="lg:col-span-5 relative h-56 xs:h-64 sm:h-80 lg:h-full min-h-[220px] xs:min-h-[260px] sm:min-h-[320px] lg:min-h-[360px] flex items-end justify-center overflow-hidden rounded-2xl sm:rounded-3xl bg-cyan-400/5 border border-cyan-300/10">
            <div className="absolute w-48 h-48 sm:w-72 sm:h-72 rounded-full border border-cyan-300/30 shadow-[0_0_80px_rgba(34,211,238,0.20)] top-6 sm:top-10" />
            <div className="absolute w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-cyan-400/10 blur-3xl" />
            {member.photo ? (
              <img src={member.photo} alt={member.fullName} className="relative z-10 w-full h-full object-cover object-top grayscale-0" />
            ) : (
              <div className="relative z-10 text-6xl sm:text-8xl font-black text-cyan-300/80 my-auto">{member.fullName.charAt(0)}</div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-1.5 sm:gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 sm:px-4 sm:py-2 text-cyan-300 text-xs sm:text-sm mb-3 sm:mb-5">
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {getDepartmentLabel(member.department)}
            </div>

            <h3 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-2 sm:mb-3 break-words">
              {member.fullName}
            </h3>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-3 sm:mb-4">{member.role}</p>

            {member.bio && (
              <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-6 sm:leading-8 max-w-2xl mb-4 sm:mb-7">
                {truncateText(member.bio, 180)}
              </p>
            )}

            {member.funFact && (
              <div className="mb-4 sm:mb-7 rounded-xl sm:rounded-2xl border border-amber-400/20 bg-amber-400/5 backdrop-blur-sm p-3 sm:p-4 flex items-start gap-2.5 sm:gap-3">
                <Lightbulb className="text-amber-400 shrink-0 mt-0.5 w-4 h-4 sm:w-5 sm:h-5" />
                <p className="text-amber-200/90 text-xs sm:text-sm leading-6 sm:leading-7 italic">
                  {member.funFact}
                </p>
              </div>
            )}

            {skills.length > 0 && (
              <div className="mb-4 sm:mb-7">
                <h4 className="text-xs sm:text-sm text-cyan-300 font-semibold mb-2 sm:mb-3">المهارات الأساسية</h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="rounded-lg sm:rounded-xl border border-white/10 bg-white/[0.045] px-2.5 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4 sm:pt-6 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-black/20 px-3 py-2 sm:px-5 sm:py-3 flex items-center gap-2.5 sm:gap-3">
                  <BarChart3 className="text-cyan-300 w-5 h-5 sm:w-6 sm:h-6" />
                  <div>
                    <div className="text-white font-extrabold text-base sm:text-xl">{member.projectsCount ?? 0}</div>
                    <div className="text-gray-400 text-[10px] sm:text-xs">مشروع مكتمل</div>
                  </div>
                </div>

                {socials.length > 0 && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {socials.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target={social.href?.startsWith("mailto:") ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-gray-300 hover:text-cyan-300 hover:border-cyan-300/40 transition-colors"
                      >
                        <social.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => onOpenProfile(member)}
                className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-cyan-300 text-gray-950 font-bold text-xs sm:text-sm hover:bg-cyan-200 transition-colors shadow-lg shadow-cyan-500/20"
                aria-label="عرض الملف المهني"
              >
                <span>عرض الملف</span>
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
