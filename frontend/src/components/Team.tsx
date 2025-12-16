"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiLinkedin,
  FiGithub,
  FiTwitter,
  FiGlobe,
  FiMail,
} from "react-icons/fi";
import { publicTeamService } from "../services/team.service";
import type { TeamMember } from "../services/team.service";

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <section
        className="relative py-28 bg-gradient-to-br from-[#0a0e27] via-[#0f1629] to-[#0a0e27] overflow-hidden"
        id="team"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
        className="relative py-28 bg-gradient-to-br from-[#0a0e27] via-[#0f1629] to-[#0a0e27] overflow-hidden"
        id="team"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
      className="relative py-28 bg-gradient-to-br from-[#0a0e27] via-[#0f1629] to-[#0a0e27] overflow-hidden"
      id="team"
    >
      {/* تأثيرات الخلفية الداكنة */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0a0e27]/80 via-[#0f1629]/50 to-[#0a0e27]/80" />
        <motion.div
          className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#008080]/20 to-[#00b3b3]/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#008080]/15 to-[#00cccc]/8 blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        {/* خطوط متوهجة */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#008080]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#008080]/20 to-transparent" />
      </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative aspect-[3/4] rounded-2xl shadow-2xl hover:shadow-[0_20px_60px_rgba(0,128,128,0.3)] transition-all duration-500 overflow-hidden border border-[#008080]/20 hover:border-[#008080]/50 cursor-pointer"
            >
              {/* صورة العضو - تأخذ المساحة الكاملة */}
              <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#008080]/20 to-[#008080]/10">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.fullName}
                    className="w-full h-full object-cover transition-all duration-500 ease-out grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:brightness-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-110">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#008080] to-[#00cccc] flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-[#008080]/50">
                      {member.fullName.charAt(0)}
                    </div>
                  </div>
                )}
              </div>

              {/* Overlay داكن - يظهر عند الـ Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27]/95 via-[#0a0e27]/80 to-[#0a0e27]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* خط علوي متوهج */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#008080] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Fun Fact - يظهر في الأعلى بشكل بارز ومميز */}
              {member.funFact && (
                <div className="absolute top-4 left-4 right-4 z-20 opacity-0 group-hover:opacity-100 transform translate-y-[-30px] group-hover:translate-y-0 transition-all duration-700 delay-100 ease-out">
                  <div className="relative bg-gradient-to-br from-[#00cccc] via-[#008080] to-[#00cccc] backdrop-blur-xl rounded-2xl px-5 py-4 shadow-[0_10px_40px_rgba(0,204,204,0.4)] border-2 border-[#00e6e6]/60 overflow-hidden">
                    {/* تأثير متوهج متحرك */}
                    <motion.div
                      animate={{
                        background: [
                          "linear-gradient(90deg, rgba(0,204,204,0.3) 0%, rgba(0,128,128,0.4) 50%, rgba(0,204,204,0.3) 100%)",
                          "linear-gradient(90deg, rgba(0,128,128,0.4) 0%, rgba(0,204,204,0.3) 50%, rgba(0,128,128,0.4) 100%)",
                          "linear-gradient(90deg, rgba(0,204,204,0.3) 0%, rgba(0,128,128,0.4) 50%, rgba(0,204,204,0.3) 100%)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 rounded-2xl"
                    />

                    {/* محتوى */}
                    <div className="relative flex items-center gap-3">
                      {/* أيقونة متوهجة */}
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm border-2 border-white/40 shadow-lg flex-shrink-0"
                      >
                        <span className="text-2xl">✨</span>
                      </motion.div>

                      {/* النص */}
                      <p className="text-white font-bold text-base flex-1 text-center leading-relaxed drop-shadow-lg">
                        {member.funFact}
                      </p>
                    </div>

                    {/* خطوط متوهجة في الخلفية */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  </div>
                </div>
              )}

              {/* معلومات العضو - Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
                {/* الاسم والدور */}
                <div className="mb-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#00cccc] transition-colors duration-300">
                    {member.fullName}
                  </h3>
                  <p className="text-[#00cccc] font-medium group-hover:text-[#00e6e6] transition-colors duration-300">
                    {member.role}
                  </p>
                </div>

                {/* روابط التواصل */}
                {(member.linkedinUrl ||
                  member.githubUrl ||
                  member.twitterUrl ||
                  member.websiteUrl ||
                  member.email) && (
                  <div className="flex items-center justify-center gap-3 mb-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-[#008080] hover:text-white flex items-center justify-center transition-all duration-300 text-white transform hover:scale-110 hover:shadow-lg hover:shadow-[#008080]/50 border border-white/20 hover:border-[#008080]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiLinkedin className="text-lg" />
                      </a>
                    )}
                    {member.githubUrl && (
                      <a
                        href={member.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-gray-800 hover:text-white flex items-center justify-center transition-all duration-300 text-white transform hover:scale-110 hover:shadow-lg border border-white/20 hover:border-gray-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiGithub className="text-lg" />
                      </a>
                    )}
                    {member.twitterUrl && (
                      <a
                        href={member.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-300 text-white transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 border border-white/20 hover:border-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiTwitter className="text-lg" />
                      </a>
                    )}
                    {member.websiteUrl && (
                      <a
                        href={member.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-[#008080] hover:text-white flex items-center justify-center transition-all duration-300 text-white transform hover:scale-110 hover:shadow-lg hover:shadow-[#008080]/50 border border-white/20 hover:border-[#008080]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiGlobe className="text-lg" />
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-[#008080] hover:text-white flex items-center justify-center transition-all duration-300 text-white transform hover:scale-110 hover:shadow-lg hover:shadow-[#008080]/50 border border-white/20 hover:border-[#008080]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiMail className="text-lg" />
                      </a>
                    )}
                  </div>
                )}

                {/* التخصصات */}
                {member.specializations &&
                  member.specializations.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-125">
                      {member.specializations.slice(0, 4).map((spec, i) => (
                        <span
                          key={i}
                          className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/20"
                        >
                          {spec}
                        </span>
                      ))}
                      {member.specializations.length > 4 && (
                        <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/20">
                          +{member.specializations.length - 4}
                        </span>
                      )}
                    </div>
                  )}
              </div>

              {/* تأثير متوهج عند الـ Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#008080]/0 via-[#008080]/0 to-[#008080]/0 group-hover:from-[#008080]/10 group-hover:via-[#008080]/5 group-hover:to-[#008080]/10 transition-all duration-500 rounded-2xl pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
