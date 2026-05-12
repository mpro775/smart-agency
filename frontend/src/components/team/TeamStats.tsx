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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12" dir="rtl">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl px-6 py-5 shadow-xl shadow-black/20 flex items-center justify-between"
        >
          <div>
            {stat.value && <div className="text-2xl font-extrabold text-cyan-300">{stat.value}</div>}
            <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
          </div>
          <stat.icon className="text-cyan-300" size={28} />
        </motion.div>
      ))}
    </div>
  );
}
