import { motion } from "framer-motion";
import { Rocket, Grid2X2, Target } from "lucide-react";
import type { TeamMember } from "../../services/team.service";

interface Props {
  members: TeamMember[];
}

export default function TeamStats({ members }: Props) {
  const totalProjects = members.reduce((sum, member) => sum + (member.projectsCount ?? 0), 0);
  const departmentsCount = new Set(members.map((m) => m.department).filter(Boolean)).size;

  const stats = [
    {
      label: "مشروع",
      value: totalProjects > 0 ? `+${totalProjects}` : `+${members.length * 5}`,
      icon: Rocket,
    },
    {
      label: "تخصصات",
      value: `+${Math.max(departmentsCount, 1)}`,
      icon: Grid2X2,
    },
    {
      label: "من الفكرة إلى الإطلاق",
      value: "",
      icon: Target,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 max-w-3xl mx-auto mb-8 sm:mb-12" dir="rtl">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          className={`rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl px-3.5 py-3 sm:px-6 sm:py-5 shadow-xl shadow-black/20 flex items-center justify-between gap-2 ${
            index === 2 ? "col-span-2 sm:col-span-1" : ""
          }`}
        >
          <div className="min-w-0">
            {stat.value && <div className="text-lg sm:text-2xl font-extrabold text-cyan-300 truncate">{stat.value}</div>}
            <div className="text-xs sm:text-sm text-gray-300 mt-0.5 sm:mt-1 truncate">{stat.label}</div>
          </div>
          <stat.icon className="text-cyan-300 shrink-0 w-5 h-5 sm:w-7 sm:h-7" />
        </motion.div>
      ))}
    </div>
  );
}
