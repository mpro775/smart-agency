"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { publicTeamService } from "../services/team.service";
import type { TeamMember } from "../services/team.service";
import TeamSectionHeader from "./team/TeamSectionHeader";
import TeamStats from "./team/TeamStats";
import TeamMemberRail from "./team/TeamMemberRail";
import FeaturedTeamMember from "./team/FeaturedTeamMember";
import TeamProfileDrawer from "./team/TeamProfileDrawer";

function TeamBackground() {
  return (
    <>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-cyan-500/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-t from-cyan-500/5 to-transparent" />
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-cyan-500/8 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Top Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
    </>
  );
}

function TeamShell({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="relative py-28 bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden"
      id="team"
    >
      <TeamBackground />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {children}
      </div>
    </section>
  );
}

function TeamLoadingState() {
  return (
    <TeamShell>
      <div className="text-center">
        <TeamSectionHeader />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 animate-pulse">
              <div className="h-7 w-16 bg-white/10 rounded mb-2" />
              <div className="h-4 w-24 bg-white/5 rounded" />
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.035] p-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-white/10 rounded" />
                    <div className="h-3 w-16 bg-white/5 rounded" />
                    <div className="h-2 w-20 bg-white/5 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-9">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] min-h-[560px] animate-pulse" />
          </div>
        </div>
      </div>
    </TeamShell>
  );
}

function TeamErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <TeamShell>
      <TeamSectionHeader />
      <div className="max-w-md mx-auto">
        <div className="rounded-2xl border border-red-400/20 bg-red-400/5 backdrop-blur-xl p-8 text-center" dir="rtl">
          <p className="text-red-300 mb-4">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 text-gray-950 font-bold px-6 py-3 hover:bg-cyan-200 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    </TeamShell>
  );
}

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);
  const [profileMember, setProfileMember] = useState<TeamMember | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const members = await publicTeamService.getForHomepage();
      setTeamMembers(members);
      setActiveMember(members[0] ?? null);
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError("فشل تحميل أعضاء الفريق. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleOpenProfile = (member: TeamMember) => {
    setProfileMember(member);
    setIsProfileOpen(true);
  };

  if (loading) return <TeamLoadingState />;
  if (error) return <TeamErrorState error={error} onRetry={fetchTeamMembers} />;
  if (!teamMembers.length || !activeMember) return null;

  return (
    <section
      className="relative py-28 bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden"
      id="team"
      dir="rtl"
    >
      <TeamBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <TeamSectionHeader />
        <TeamStats members={teamMembers} />

        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <TeamMemberRail
              members={teamMembers}
              activeMember={activeMember}
              onSelect={setActiveMember}
            />
          </div>

          <div className="lg:col-span-9 order-1 lg:order-2">
            <FeaturedTeamMember
              member={activeMember}
              onOpenProfile={handleOpenProfile}
            />
          </div>
        </div>
      </div>

      <TeamProfileDrawer
        member={profileMember}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />
    </section>
  );
}
