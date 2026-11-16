import { tr } from "@/i18n";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Languages, Rocket } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLocale } from "@/localization/LocaleLayout";

export default function Navbar() {
  const { locale, direction, localePath, switchLocale } = useLocale();
  const { pathname } = useLocation();
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
    { label: tr("الرئيسية"), href: localePath("/") },
    { label: tr("من نحن"), href: localePath("/about") },
    { label: tr("أعمالنا"), href: localePath("/projects") },
    { label: tr("مدونة"), href: localePath("/blog") },
    { label: tr("تواصل معنا"), href: localePath("/contact") },
  ];

  return (
    <nav
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 sm:px-6"
      dir={direction}
    >
      <div
        className={`relative rounded-full transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/40"
            : "bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/50"
        }`}
      >
        <div className="flex items-center justify-between h-16 md:h-[68px] px-5 md:px-8">
          {/* اللوجو على اليمين */}
          <Link to={localePath("/")} className="flex items-center gap-3 group">
            <img
              src="/logo2.v1.webp"
              width={348}
              height={66}
              alt={tr("وكالة سمارت")}
              className="h-10 w-auto"
            />
          </Link>

          {/* الروابط في الوسط */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  to={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                    pathname === link.href
                      ? "text-[#008080]"
                      : "text-gray-500 hover:text-[#008080]"
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-[#008080]" />
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* زر CTA على اليسار */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              type="button"
              onClick={switchLocale}
              className="inline-flex items-center gap-2 rounded-full border border-[#008080]/20 px-3 py-2 text-sm font-semibold text-[#008080] hover:bg-[#008080]/5"
              aria-label={
                locale === "ar" ? "EN — Switch to English" : tr("العربية")
              }
            >
              <Languages size={16} />
              {locale === "ar" ? "EN" : tr("العربية")}
            </button>
            <div>
              <Link
                to={localePath("/quote")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-[#008080] shadow-lg shadow-[#008080]/20 hover:shadow-xl hover:shadow-[#008080]/30 transition-all duration-300 hover:scale-105"
              >
                <Rocket size={15} />
                {tr("ابدأ مشروعك")}
              </Link>
            </div>
          </div>

          {/* زر القائمة للجوال */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-full text-gray-600 hover:bg-white/50 transition-colors"
            aria-label={tr("فتح القائمة")}
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* قائمة الجوال */}
        <>
          {open && (
            <div className="lg:hidden overflow-hidden">
              <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                <ul className="space-y-1 py-2">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className={`block py-2.5 px-4 rounded-full font-medium transition-colors text-sm ${
                          pathname === link.href
                            ? "text-[#008080] bg-[#008080]/5"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      switchLocale();
                    }}
                    className="mb-2 flex w-full items-center justify-center gap-2 rounded-full border border-[#008080]/20 py-2.5 px-4 font-semibold text-[#008080] text-sm"
                  >
                    <Languages size={14} />
                    {locale === "ar" ? "English" : tr("العربية")}
                  </button>
                  <Link
                    to={localePath("/quote")}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full font-bold text-white bg-[#008080] shadow-lg text-sm"
                    onClick={() => setOpen(false)}
                  >
                    <Rocket size={14} />
                    {tr("ابدأ مشروعك")}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      </div>
    </nav>
  );
}
