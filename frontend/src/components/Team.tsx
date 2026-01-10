"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { publicTeamService } from "../services/team.service";
import type { TeamMember } from "../services/team.service";
import TeamMemberDialog from "./TeamMemberDialog";

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const members = await publicTeamService.getForHomepage();
        setTeamMembers(members);
        setError(null);
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError("فشل تحميل أعضاء الفريق. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <section
        className="relative py-28 bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white overflow-hidden"
        id="team"
      >
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
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary/10 to-transparent" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-t from-primary/5 to-transparent" />
          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-primary/8 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Top Border Accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block rounded-full h-12 w-12 border-2 border-[#008080] border-t-transparent"
            />
            <p className="mt-4 text-gray-300">جاري تحميل أعضاء الفريق...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="relative py-28 bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white overflow-hidden"
        id="team"
      >
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
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary/10 to-transparent" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-t from-primary/5 to-transparent" />
          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-primary/8 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Top Border Accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (teamMembers.length === 0) {
    return null;
  }

  return (
    <section
      className="relative py-28 bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white overflow-hidden"
      id="team"
    >
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
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-t from-primary/5 to-transparent" />
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-primary/8 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Top Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
          dir="rtl"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-[#008080]/20 to-[#008080]/10 text-[#00cccc] mb-6 border border-[#008080]/30 backdrop-blur-sm shadow-lg shadow-[#008080]/20"
          >
            فريقنا
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight"
          >
            تعرف على{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#00cccc] via-[#008080] to-[#00cccc] bg-clip-text text-transparent">
                فريقنا المتميز
              </span>
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-2 bg-[#008080]/20 -z-0 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                viewport={{ once: true }}
              />
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            مجموعة من الخبراء الموهوبين والمتفانين في عملهم
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative aspect-[3/4] rounded-2xl shadow-2xl hover:shadow-[0_20px_60px_rgba(0,128,128,0.3)] transition-all duration-500 overflow-hidden border border-[#008080]/20 hover:border-[#008080]/50 cursor-pointer"
              onClick={() => handleMemberClick(member)}
            >
              {/* صورة العضو - تأخذ المساحة الكاملة */}
              <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#008080]/20 to-[#008080]/10">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.fullName}
                    className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-110 grayscale group-hover:grayscale-0"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-110">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#008080] to-[#00cccc] flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-[#008080]/50">
                      {member.fullName.charAt(0)}
                    </div>
                  </div>
                )}
              </div>

              {/* Overlay خفيف - يظهر عند الـ Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1d1d1d]/30 via-[#1d1d1d]/20 to-[#1d1d1d]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* معلومات العضو - Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
                {/* الاسم والدور */}
                <div className="mb-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
                  <h3 className="text-xl font-bold text-white mb-2 transition-colors duration-300">
                    {member.fullName}
                  </h3>
                  <p className="text-white font-medium transition-colors duration-300 text-left mb-3">
                    {member.role}
                  </p>

                  {/* Fun Fact - في الأسفل مع الاسم والوظيفة */}
                  {member.funFact && (
                    <div className="bg-gradient-to-r from-[#00cccc]/20 to-[#008080]/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-[#00cccc]/30">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">✨</span>
                        <p className="text-white font-medium text-sm leading-relaxed">
                          {member.funFact}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dialog لتفاصيل العضو */}
      {selectedMember && (
        <TeamMemberDialog
          member={selectedMember}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedMember(null);
          }}
        />
      )}
    </section>
  );
}
