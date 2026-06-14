import React, { useState } from "react";
import { Menu, X, ChevronDown, GraduationCap, Lock, Award, Volume2 } from "lucide-react";
import { SiteConfig } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  config: SiteConfig;
  allPages: { title: string; slug: string }[];
  activeSlug: string;
  onNavigate: (slug: string) => void;
  isAdminLoggedIn: boolean;
}

export default function Header({ config, allPages, activeSlug, onNavigate, isAdminLoggedIn }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  const handleLinkClick = (slug: string) => {
    onNavigate(slug);
    setIsMobileMenuOpen(false);
    setActiveMegaMenu(null);
  };

  return (
    <header className="w-full z-50 sticky top-0 bg-[#0A192F]/95 backdrop-blur-md border-b border-[#D4AF37]/20 text-white shadow-xl" id="header-main">
      {/* 1. Ticker and Credentials Banner */}
      {config.announcementTicker && (
        <div className="w-full bg-[#030712] border-b border-[#D4AF37]/10 py-1.5 px-4 text-xs font-mono flex items-center gap-2 overflow-hidden" id="header-ticker">
          <span className="flex items-center gap-1.5 shrink-0 bg-[#D4AF37] text-black px-2 py-0.5 rounded font-bold uppercase animate-pulse">
            <Volume2 className="w-3.5 h-3.5" />
            LIVE
          </span>
          <div className="animate-marquee whitespace-nowrap text-[#E5E7EB] scroll-smooth">
            {config.announcementTicker}
          </div>
        </div>
      )}

      {/* 2. Top Info & Accreditation Badging */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:flex justify-between items-center text-[11px] text-[#9CA3AF] border-b border-[#D4AF37]/5 hidden" id="header-topline">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-[#D4AF37]" /> {config.accreditationBadge}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Inquiries: <a href={`mailto:${config.contactEmail}`} className="hover:text-[#D4AF37] transition-colors">{config.contactEmail}</a></span>
          <span>Hotline: <span className="text-[#E5E7EB] font-bold">{config.contactPhone}</span></span>
        </div>
      </div>

      {/* 3. Main Navigation Hub */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="header-navbar">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Branding */}
          <button 
            onClick={() => handleLinkClick("")}
            className="flex items-center gap-3 cursor-pointer text-left focus:outline-none"
            id="header-logo-btn"
          >
            <div className="p-2.5 bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-lg shadow-md hover:scale-105 transition-transform">
              <GraduationCap className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <div>
              <span className="block text-lg font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#D4AF37]">
                {config.universityName.toUpperCase()}
              </span>
              <span className="block text-[9px] font-mono tracking-[4px] text-gray-400">
                CAMPUS DIGITAL GATEWAY
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2" id="header-desktop-nav">
            {config.navigation.map((item) => {
              const matchedPage = allPages.find(p => p.slug === item.url.replace("/", ""));
              const hasSub = item.hasMegaMenu && item.megaMenuCategories && item.megaMenuCategories.length > 0;
              
              return (
                <div 
                  key={item.id} 
                  className="relative group py-2"
                  onMouseEnter={() => hasSub && setActiveMegaMenu(item.id)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <button
                    onClick={() => {
                      if (!hasSub) {
                        const targetSlug = item.url === "/" ? "" : item.url.replace("/", "");
                        handleLinkClick(targetSlug);
                      }
                    }}
                    className={`relative px-4 py-2.5 text-sm font-medium rounded-md flex items-center gap-1 transition-all pointer-events-auto ${
                      (activeSlug === "" && item.url === "/") || (activeSlug !== "" && item.url.replace("/", "") === activeSlug)
                        ? "text-[#D4AF37] font-semibold"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {((activeSlug === "" && item.url === "/") || (activeSlug !== "" && item.url.replace("/", "") === activeSlug)) && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute inset-x-2 bottom-0 h-[2px] bg-[#D4AF37]"
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      />
                    )}
                    {item.label}
                    {hasSub && <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 text-gray-400 group-hover:text-[#D4AF37]" />}
                  </button>

                  {/* Mega Menu Overlay */}
                  {hasSub && activeMegaMenu === item.id && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[720px] bg-[#030712] border border-[#D4AF37]/20 rounded-xl shadow-2xl p-6 grid grid-cols-2 gap-8 z-50 animate-fadeIn pointer-events-auto">
                      {item.megaMenuCategories?.map((cat, ci) => (
                        <div key={ci} className="space-y-4">
                          <h4 className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold border-b border-[#D4AF37]/20 pb-1.5">
                            {cat.title}
                          </h4>
                          <ul className="space-y-3">
                            {cat.links.map((link, li) => (
                              <li key={li}>
                                <button
                                  onClick={() => {
                                    const pathslug = link.url === "/" ? "" : link.url.replace("/", "");
                                    handleLinkClick(pathslug);
                                  }}
                                  className="block text-left w-full hover:bg-white/5 p-2 rounded-lg transition-all"
                                >
                                  <span className="block text-sm font-semibold text-white group-hover:text-[#D4AF37]">
                                    {link.label}
                                  </span>
                                  {link.desc && (
                                    <span className="block text-xs text-gray-400 mt-0.5 line-clamp-1">
                                      {link.desc}
                                    </span>
                                  )}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Admin Console Switcher */}
            <button
              onClick={() => handleLinkClick("admin")}
              className={`ml-4 px-4 py-2 border rounded-md text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                activeSlug === "admin"
                  ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20"
                  : "border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37]"
              }`}
              id="header-admin-cta"
            >
              <Lock className="w-3.5 h-3.5" />
              {isAdminLoggedIn ? "CMS PANEL" : "ADMIN LOGIN"}
            </button>
          </nav>

          {/* Mobile Menu Icon */}
          <div className="flex lg:hidden items-center gap-4" id="header-mobile-triggers">
            <button
              onClick={() => handleLinkClick("admin")}
              className="p-2 border border-[#D4AF37]/40 rounded text-[#D4AF37]"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-white/5 border border-white/15 rounded-md hover:bg-white/10"
              id="header-hamburger-btn"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-[#D4AF37]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden w-full bg-[#030712] border-t border-[#D4AF37]/20 p-6 space-y-4 overflow-hidden" 
            id="header-mobile-drawer"
          >
            <div className="space-y-1.5">
              {config.navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    const targetSlug = item.url === "/" ? "" : item.url.replace("/", "");
                    handleLinkClick(targetSlug);
                  }}
                  className={`block w-full text-left px-4 py-3 rounded text-sm ${
                    (activeSlug === "" && item.url === "/") || (activeSlug !== "" && item.url.replace("/", "") === activeSlug)
                      ? "text-[#D4AF37] bg-white/5 font-semibold border-l-2 border-[#D4AF37]"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-[#D4AF37]/10">
              <p className="text-xs text-[#9CA3AF] mb-3">{config.accreditationBadge}</p>
              <button
                onClick={() => handleLinkClick("admin")}
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#C29E30] text-black font-bold uppercase tracking-wider rounded-md text-xs flex justify-center items-center gap-2 shadow-lg"
              >
                <Lock className="w-4 h-4" />
                {isAdminLoggedIn ? "CMS Control Dashboard" : "Privileged Login"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
