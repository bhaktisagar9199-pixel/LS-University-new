import React from "react";
import { GraduationCap, Mail, Phone, MapPin, Award, ArrowUpRight } from "lucide-react";
import { SiteConfig } from "../types";

interface FooterProps {
  config: SiteConfig;
  onNavigate: (slug: string) => void;
}

export default function Footer({ config, onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (url: string) => {
    const slug = url === "/" ? "" : url.replace("/", "");
    onNavigate(slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#030712] text-[#E5E7EB] border-t border-[#D4AF37]/20 relative overflow-hidden" id="footer-main">
      {/* Luxury Background Ambient Gradients */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#1E3A8A]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Top Segment: Brand & Key Certification */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-[#D4AF37]/10" id="footer-top">
          
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 border border-[#D4AF37]/20 rounded">
                <GraduationCap className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <span className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white block to-[#D4AF37]">
                {config.universityName.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Establishing advanced technology foundations, scientific leadership, and enterprise agility. NAAC Grade A++ Credentialed Entity.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#D4AF37]/5 border border-[#D4AF37]/20 text-xs text-[#D4AF37] font-semibold rounded-full shadow">
              <Award className="w-3.5 h-3.5" />
              {config.accreditationBadge}
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {config.footerSections.map((sect, i) => (
              <div key={i} className="space-y-4">
                <h4 className="text-xs uppercase font-mono tracking-widest text-[#D4AF37] font-bold border-l-2 border-[#D4AF37] pl-2">
                  {sect.title}
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  {sect.links.map((link, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => handleLinkClick(link.url)}
                        className="hover:text-[#D4AF37] transition-all flex items-center gap-1 group cursor-pointer text-left focus:outline-none"
                      >
                        <span className="border-b border-transparent group-hover:border-[#D4AF37]">
                          {link.label}
                        </span>
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Middle Segment: Coordinates and Maps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 text-sm text-gray-300 border-b border-[#D4AF37]/10" id="footer-mid">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/5 border border-white/10 rounded">
              <MapPin className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h5 className="font-bold text-white mb-0.5 uppercase tracking-wider text-xs">University Campus</h5>
              <p className="text-gray-400 text-xs leading-relaxed">{config.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/5 border border-white/10 rounded">
              <Mail className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h5 className="font-bold text-white mb-0.5 uppercase tracking-wider text-xs">Academic Registrations</h5>
              <p className="text-gray-400 text-xs">{config.contactEmail}</p>
              <p className="text-gray-500 text-[11px] mt-0.5">Response turnaround: 12 Hours</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/5 border border-white/10 rounded">
              <Phone className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h5 className="font-bold text-white mb-0.5 uppercase tracking-wider text-xs">Admissions Hotline</h5>
              <p className="text-gray-400 text-xs leading-relaxed">{config.contactPhone}</p>
            </div>
          </div>
        </div>

        {/* Bottom Segment: Copyright & Tech credits */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4" id="footer-bottom">
          <p>© {currentYear} {config.universityName}. All content managed securely under real-time university CMS. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#about" className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="text-gray-700">|</span>
            <a href="#about" className="hover:text-white transition-colors">Terms of Operations</a>
            <span className="text-gray-700">|</span>
            <button onClick={() => onNavigate("admin")} className="hover:text-[#D4AF37] transition-colors font-mono font-bold uppercase tracking-wider">CMS Access Panel🔒</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
