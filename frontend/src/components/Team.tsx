"use client";
import { useState, useEffect } from "react";
import { SectionShell } from "./brand";
import { publicTeamService } from "../services/team.service";
import type { TeamMember } from "../services/team.service";
import TeamSectionHeader from "./team/TeamSectionHeader";
import TeamStats from "./team/TeamStats";
import TeamMemberRail from "./team/TeamMemberRail";
import FeaturedTeamMember from "./team/FeaturedTeamMember";
import TeamProfileDrawer from "./team/TeamProfileDrawer";

function TeamLoadingState() {
  return (
    <SectionShell tone="dark" pattern="mesh" id="team">
      <div className="text-center">
        <TeamSectionHeader />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-[var(--smart-border-dark)] bg-[var(--smart-bg-dark-card)] px-6 py-5 animate-pulse">
              <div className="h-7 w-16 bg-white/10 rounded mb-2" />
              <div className="h-4 w-24 bg-white/5 rounded" />
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl border border-[var(--smart-border-dark)] bg-[var(--smart-bg-dark-card)] p-3 animate-pulse">
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
            <div className="rounded-3xl border border-[var(--smart-border-dark)] bg-[var(--smart-bg-dark-card)] min-h-[560px] animate-pulse" />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function TeamErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <SectionShell tone="dark" pattern="mesh" id="team">
      <TeamSectionHeader />
      <div className="max-w-md mx-auto">
        <div className="rounded-2xl border border-red-400/20 bg-red-400/5 backdrop-blur-xl p-8 text-center" dir="rtl">
          <p className="text-red-300 mb-4">{error}</p>
          <button type="button" onClick={onRetry} className="inline-flex items-center gap-2 rounded-xl bg-[var(--smart-primary-light)] text-[var(--smart-bg-dark)] font-bold px-6 py-3 hover:bg-[var(--smart-primary)] transition-colors">
            إعادة المحاولة
          </button>
        </div>
      </div>
    </SectionShell>
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
    <SectionShell tone="dark" pattern="mesh" id="team">
      <TeamSectionHeader />
      <TeamStats members={teamMembers} />

      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-3 order-2 lg:order-1">
          <TeamMemberRail members={teamMembers} activeMember={activeMember} onSelect={setActiveMember} />
        </div>

        <div className="lg:col-span-9 order-1 lg:order-2">
          <FeaturedTeamMember member={activeMember} onOpenProfile={handleOpenProfile} />
        </div>
      </div>

      <TeamProfileDrawer member={profileMember} open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </SectionShell>
  );
}
