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

  const ctaLinks = [
    { label: "طلب عرض سعر", href: "/quote", primary: true },
    { label: "تواصل معنا", href: "#contact", primary: false },
  ];

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg" : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* شعار الوكالة */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-bold text-gray-900 group"
          >
            <motion.div
              whileHover={{ rotate: -15 }}
              transition={{ duration: 0.3 }}
              className="text-primary"
            >
<img
  src="/logo2.png" // مسار الصورة داخل مجلد public
  alt="Launch Icon"
  width={200}
  height={50}
/>            </motion.div>
          
          </Link>

          {/* قائمة سطح المكتب */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="relative text-gray-700 hover:text-primary transition-colors font-medium text-md after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4 ml-6">
              {ctaLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-md font-medium transition-all ${
                    link.primary
                      ? "bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white shadow hover:shadow-md"
                      : "text-primary hover:bg-primary/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* زر القائمة للجوال */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="فتح القائمة"
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
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
            <div className="px-4 pb-4 bg-white shadow-lg">
              <ul className="space-y-2 py-3 border-t border-gray-100">
                {navLinks.map((link) => (
                  <motion.li
                    key={link.href}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      to={link.href}
                      className="block py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
                {ctaLinks.map((link) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Link
                      to={link.href}
                      className={`block text-center py-3 px-4 rounded-lg font-medium transition-colors ${
                        link.primary
                          ? "bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary-dark))] text-white shadow hover:shadow-md"
                          : "text-primary border border-primary hover:bg-primary/10"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}