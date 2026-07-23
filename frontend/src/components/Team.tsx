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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 max-w-3xl mx-auto mb-8 sm:mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-[var(--smart-border-dark)] bg-[var(--smart-bg-dark-card)] px-4 py-4 animate-pulse">
              <div className="h-6 w-14 bg-white/10 rounded mb-2" />
              <div className="h-3.5 w-20 bg-white/5 rounded" />
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-12 gap-5 sm:gap-6">
          <div className="lg:col-span-3 order-1 lg:order-1">
            <div className="flex lg:flex-col gap-2.5 sm:gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="min-w-[200px] xs:min-w-[230px] sm:min-w-[260px] lg:min-w-0 w-full rounded-2xl border border-[var(--smart-border-dark)] bg-[var(--smart-bg-dark-card)] p-2.5 sm:p-3 animate-pulse">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="h-11 w-11 sm:h-14 sm:w-14 rounded-xl bg-white/5 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-24 bg-white/10 rounded" />
                      <div className="h-2.5 w-16 bg-white/5 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-9 order-2 lg:order-2">
            <div className="rounded-2xl sm:rounded-3xl border border-[var(--smart-border-dark)] bg-[var(--smart-bg-dark-card)] min-h-[360px] sm:min-h-[560px] animate-pulse" />
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
      <div className="max-w-md mx-auto px-4">
        <div className="rounded-2xl border border-red-400/20 bg-red-400/5 backdrop-blur-xl p-6 sm:p-8 text-center" dir="rtl">
          <p className="text-red-300 text-sm sm:text-base mb-4">{error}</p>
          <button type="button" onClick={onRetry} className="inline-flex items-center gap-2 rounded-xl bg-[var(--smart-primary-light)] text-[var(--smart-bg-dark)] font-bold px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base hover:bg-[var(--smart-primary)] transition-colors">
            إعادة المحاولة
          </button>
        </div>
      </div>
    </SectionShell>
  );
}

interface TeamProps {
  initialMembers?: TeamMember[];
}

export default function Team({ initialMembers }: TeamProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    initialMembers || [],
  );
  const [activeMember, setActiveMember] = useState<TeamMember | null>(
    initialMembers?.[0] ?? null,
  );
  const [profileMember, setProfileMember] = useState<TeamMember | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(!initialMembers);
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
    if (initialMembers) {
      setTeamMembers(initialMembers);
      setActiveMember(initialMembers[0] ?? null);
      setLoading(false);
      return;
    }

    fetchTeamMembers();
  }, [initialMembers]);

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

      <div className="grid lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        <div className="lg:col-span-3 order-1 lg:order-1">
          <TeamMemberRail members={teamMembers} activeMember={activeMember} onSelect={setActiveMember} />
        </div>

        <div className="lg:col-span-9 order-2 lg:order-2">
          <FeaturedTeamMember member={activeMember} onOpenProfile={handleOpenProfile} />
        </div>
      </div>

      <TeamProfileDrawer member={profileMember} open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </SectionShell>
  );
}
