"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
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
    { label: "الرئيسية", href: "/" },
    { label: "من نحن", href: "/about" },
    { label: "أعمالنا", href: "/projects" },
  ];

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 sm:px-6"
      dir="rtl"
    >
      {/* الكبسولة العائمة */}
      <motion.div
        className={`relative rounded-full transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-2xl border border-white/20"
            : "bg-white/60 backdrop-blur-md shadow-lg border border-white/30"
        }`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between h-16 md:h-18 px-4 md:px-8">
          {/* اللوجو على اليمين (في RTL) */}
          <Link to="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ duration: 0.3 }}
              className="flex items-center"
            >
              <img
                src="/logo2.png"
                alt="Smart Agency Logo"
                className="h-8 md:h-10 w-auto object-contain"
              />
            </motion.div>
          </Link>

          {/* الروابط في الوسط */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors rounded-full hover:bg-white/50"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* زر "ابدأ مشروعك" على اليسار (في RTL) */}
          <div className="hidden lg:flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/quote"
                className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                ابدأ مشروعك
              </Link>
            </motion.div>
          </div>

          {/* زر القائمة للجوال */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-full text-gray-700 hover:bg-white/50 transition-colors"
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
              <div className="px-4 pb-4 pt-2 border-t border-white/20">
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
                        className="block py-2.5 px-4 rounded-full hover:bg-white/50 text-gray-700 font-medium transition-colors text-sm"
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
                  className="mt-3 pt-3 border-t border-white/20"
                >
                  <Link
                    to="/quote"
                    className="block text-center py-2.5 px-4 rounded-full font-semibold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] shadow-lg hover:shadow-xl transition-all text-sm"
                    onClick={() => setOpen(false)}
                  >
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
