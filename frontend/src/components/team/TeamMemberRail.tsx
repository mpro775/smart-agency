import { motion } from "framer-motion";
import type { TeamMember } from "../../services/team.service";
import { getDepartmentAccent, getDepartmentLabel } from "./team-utils";

interface Props {
  members: TeamMember[];
  activeMember: TeamMember | null;
  onSelect: (member: TeamMember) => void;
}

export default function TeamMemberRail({ members, activeMember, onSelect }: Props) {
  return (
    <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0" dir="rtl">
      {members.map((member, index) => {
        const isActive = activeMember?._id === member._id;

        return (
          <motion.button
            key={member._id}
            type="button"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            viewport={{ once: true }}
            onClick={() => onSelect(member)}
            className={`relative min-w-[260px] lg:min-w-0 w-full text-right rounded-2xl border p-3 transition-all duration-300 group ${
              isActive
                ? "border-cyan-400/70 bg-cyan-400/10 shadow-lg shadow-cyan-500/20"
                : "border-white/10 bg-white/[0.035] hover:bg-white/[0.06] hover:border-cyan-400/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
                {member.photo ? (
                  <img src={member.photo} alt={member.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-cyan-300 font-bold">
                    {member.fullName.charAt(0)}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-white font-bold truncate">{member.fullName}</h3>
                <p className="text-gray-300 text-sm truncate mt-1">{member.role}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <span className={`w-2 h-2 rounded-full ${getDepartmentAccent(member.department)}`} />
                  <span>{getDepartmentLabel(member.department)}</span>
                </div>
              </div>
            </div>

            {isActive && (
              <span className="hidden lg:block absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-cyan-300 shadow-lg shadow-cyan-400/60" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
