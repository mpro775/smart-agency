import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, BarChart3, Mail, Github, Linkedin, Globe, ExternalLink } from "lucide-react";
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
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-2xl shadow-black/30 min-h-[560px]"
        dir="rtl"
      >
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_25%_35%,rgba(34,211,238,0.22),transparent_35%),linear-gradient(to_bottom_right,rgba(255,255,255,0.04),transparent)]" />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

        <div className="relative z-10 grid lg:grid-cols-12 gap-8 p-5 md:p-8 lg:p-10 h-full">
          <div className="lg:col-span-5 relative min-h-[360px] flex items-end justify-center overflow-hidden rounded-3xl bg-cyan-400/5 border border-cyan-300/10">
            <div className="absolute w-72 h-72 rounded-full border border-cyan-300/30 shadow-[0_0_80px_rgba(34,211,238,0.20)] top-10" />
            <div className="absolute w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl" />
            {member.photo ? (
              <img src={member.photo} alt={member.fullName} className="relative z-10 w-full h-full object-cover object-top grayscale-0" />
            ) : (
              <div className="relative z-10 text-8xl font-black text-cyan-300/80">{member.fullName.charAt(0)}</div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-cyan-300 text-sm mb-5">
              <Briefcase size={15} />
              {getDepartmentLabel(member.department)}
            </div>

            <h3 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
              {member.fullName}
            </h3>

            <p className="text-xl text-gray-300 mb-4">{member.role}</p>

            {member.bio && (
              <p className="text-gray-400 leading-8 max-w-2xl mb-7">
                {truncateText(member.bio, 180)}
              </p>
            )}

            {skills.length > 0 && (
              <div className="mb-7">
                <h4 className="text-cyan-300 font-semibold mb-3">المهارات الأساسية</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="rounded-xl border border-white/10 bg-white/[0.045] px-4 py-2 text-sm text-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-col md:flex-row md:items-center md:justify-between gap-5 pt-6 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-3 flex items-center gap-3">
                  <BarChart3 className="text-cyan-300" size={24} />
                  <div>
                    <div className="text-white font-extrabold text-xl">{member.projectsCount ?? 0}</div>
                    <div className="text-gray-400 text-xs">مشروع مكتمل</div>
                  </div>
                </div>

                {socials.length > 0 && (
                  <div className="flex items-center gap-2">
                    {socials.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target={social.href?.startsWith("mailto:") ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="h-10 w-10 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-gray-300 hover:text-cyan-300 hover:border-cyan-300/40 transition-colors"
                      >
                        <social.icon size={17} />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => onOpenProfile(member)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 text-gray-950 font-bold px-6 py-3 hover:bg-cyan-200 transition-colors shadow-lg shadow-cyan-500/20"
              >
                عرض الملف المهني
                <ExternalLink size={17} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
