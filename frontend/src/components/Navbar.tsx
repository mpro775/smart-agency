"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "الرئيسية", href: "/", active: true },
    { label: "من نحن", href: "/about" },
    { label: "أعمالنا", href: "/projects" },
    { label: "مدونة", href: "/blog" },
    { label: "تواصل معنا", href: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 sm:px-6"
      dir="rtl"
    >
      <motion.div
        className={`relative rounded-full transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/40"
            : "bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/50"
        }`}
      >
        <div className="flex items-center justify-between h-16 md:h-[68px] px-5 md:px-8">
          {/* اللوجو على اليمين */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo2.png" alt="وكالة سمارت" className="h-10 w-auto" />
          </Link>

          {/* الروابط في الوسط */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  to={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                    link.active
                      ? "text-[#008080]"
                      : "text-gray-500 hover:text-[#008080]"
                  }`}
                >
                  {link.label}
                  {link.active && (
                    <motion.span
                      layoutId="navActive"
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-[#008080]"
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* زر CTA على اليسار */}
          <div className="hidden lg:flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/quote"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-[#008080] shadow-lg shadow-[#008080]/20 hover:shadow-xl hover:shadow-[#008080]/30 transition-all duration-300 hover:scale-105"
              >
                <Rocket size={15} />
                ابدأ مشروعك
              </Link>
            </motion.div>
          </div>

          {/* زر القائمة للجوال */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-full text-gray-600 hover:bg-white/50 transition-colors"
            aria-label="فتح القائمة"
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* قائمة الجوال */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                <ul className="space-y-1 py-2">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Link
                        to={link.href}
                        className={`block py-2.5 px-4 rounded-full font-medium transition-colors text-sm ${
                          link.active
                            ? "text-[#008080] bg-[#008080]/5"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mt-3 pt-3 border-t border-gray-100"
                >
                  <Link
                    to="/quote"
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full font-bold text-white bg-[#008080] shadow-lg text-sm"
                    onClick={() => setOpen(false)}
                  >
                    <Rocket size={14} />
                    ابدأ مشروعك
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.nav>
  );
}
