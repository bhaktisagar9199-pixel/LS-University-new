import React, { useState } from "react";
import { 
  ArrowRight, Award, GraduationCap, Briefcase, Calendar, ShieldAlert, 
  ChevronRight, Users, Sparkles, BookOpen, Clock, Globe, ArrowUpRight, 
  Mail, Phone, MapPin, Send, CheckCircle2, Bookmark, FileText,
  Image, Play, ChevronLeft, ChevronRight as ChevronRightIcon, X
} from "lucide-react";
import { PageSection, Course, Notice, GalleryAlbum, SiteConfig } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const DEMO_PLACEMENTS = [
  { studentName: "Siddharth Goel", companyName: "Google India", package: "₹48.4 LPA", course: "B.Tech CSE, 2024", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80" },
  { studentName: "Avni Kapoor", companyName: "Amazon Web Services", package: "₹34.5 LPA", course: "B.Tech IT, 2025", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80" },
  { studentName: "Ritvik Sharma", companyName: "NVIDIA Corp Research", package: "₹42.0 LPA", course: "M.Tech AI, 2024", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80" },
  { studentName: "Simran Johar", companyName: "Deloitte Core strategy", package: "₹18.0 LPA", course: "MBA Digital Business, 2025", image: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=120&auto=format&fit=crop&q=80" }
];

interface SectionRendererProps {
  sections: PageSection[];
  courses: Course[];
  notices: Notice[];
  onNavigate: (slug: string) => void;
  galleryAlbums?: GalleryAlbum[];
  config?: SiteConfig;
}

export default function SectionRenderer({ 
  sections, 
  courses, 
  notices, 
  onNavigate, 
  galleryAlbums,
  config
}: SectionRendererProps) {
  
  // Selected course details modal state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseFilter, setCourseFilter] = useState<"ALL" | "UG" | "PG" | "PhD">("ALL");

  // Contact form submission states
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", course: "BTECH-CSE", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Expanded notice bulletins State
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    const id = `adm-${Date.now()}`;
    const payload = {
      id,
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
      course: contactForm.course,
      message: contactForm.message,
      status: "Received",
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, "student_admissions", id), payload);
    } catch (err) {
      console.warn("Could not record live admission application:", err);
    }
    setTimeout(() => {
      setIsSubmitted(false);
      setContactForm({ name: "", email: "", phone: "", course: "BTECH-CSE", message: "" });
    }, 4500);
  };

  const filteredCourses = courseFilter === "ALL" 
    ? courses 
    : courses.filter(c => c.level === courseFilter);

  return (
    <div className="w-full text-white" id="section-renderer-workspace">
      {sections.map((section) => {
        const { id, type, title, subtitle, content } = section;

        switch (type) {
          
          // ==========================================
          // 1. HERO SECTION (Theme 1: Royal Burgundy & Gold)
          // ==========================================
          case "hero":
            return (
              <section 
                key={id} 
                className="w-full relative min-h-[700px] flex items-center justify-center pt-28 pb-20 px-4 text-center overflow-hidden border-b border-[#D4AF37]/20 bg-radial from-[#3B0914] via-[#1E0307] to-[#0E0103]"
                id={`sec-hero-${id}`}
              >
                {/* Immersive Dark Burgundy & Gold Ambient Lights */}
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#58111A]/15 rounded-full blur-[150px] pointer-events-none" />

                {/* Cover Collage Layer */}
                <div className="absolute inset-0 z-0 opacity-25">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1C0409]/60 via-[#0C0103]/90 to-[#0A0001] z-10" />
                  <img 
                    src={content?.bgImage || "https://images.unsplash.com/photo-1562774053-701939374585?w=1600"} 
                    alt="University Landmark Facade"
                    className="w-full h-full object-cover object-center scale-102 filter contrast-[1.12] brightness-[0.75] saturate-[0.80]"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.15
                      }
                    }
                  }}
                  className="relative z-10 max-w-5xl mx-auto space-y-10 px-2" 
                  id="hero-core-content"
                >
                  
                  {/* Luxury Academic Badge with Gold Trim */}
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, y: -15, scale: 0.95 },
                      visible: { opacity: 1, y: 0, scale: 1 }
                    }}
                    transition={{ type: "spring", stiffness: 90 }}
                    className="inline-flex items-center gap-2.5 px-4.5 py-2 bg-gradient-to-r from-[#D4AF37]/15 via-[#58111A]/30 to-transparent border border-[#D4AF37]/45 text-[10px] text-[#F4E6C1] font-mono tracking-[3px] uppercase rounded-full shadow-lg backdrop-blur-md"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" /> NAAC GRADE A++ ACCREDITED UNIVERSITY
                  </motion.div>

                  <div className="space-y-6">
                    <motion.h1 
                      variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
                      className="text-4xl sm:text-6xl lg:text-8xl font-serif font-extrabold tracking-tight text-white leading-none"
                    >
                      <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-[#F4E6C1]">
                        {(title === "Lakshmi Sehgal University" || title === "LS University new" || !title) ? (config?.universityName || "Lakshmi Sehgal University") : title}
                      </span>
                    </motion.h1>
                    
                    <motion.p 
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 }
                      }}
                      className="text-xs sm:text-base md:text-lg font-mono tracking-[4px] text-[#D4AF37] uppercase font-bold"
                    >
                      {subtitle || "Establishment of Advanced Scholastics & Global Directives"}
                    </motion.p>
                  </div>

                  <motion.p 
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="text-gray-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed font-sans font-light"
                  >
                    {content?.tagline || "Preparing next-generation technology architects and computational innovators through deep ecosystem synergies and NAAC grade leadership."}
                  </motion.p>

                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, y: 25 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6" 
                    id="hero-ctas"
                  >
                    {content?.ctaText1 && (
                      <motion.button 
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNavigate(content.ctaLink1.replace("/", ""))}
                        className="w-full sm:w-auto px-10 py-4.5 bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#C29E30] text-[#0A0103] font-mono font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-xl shadow-[#D4AF37]/10 cursor-pointer flex items-center justify-center gap-2.5 border border-[#D4AF37]/40"
                      >
                        {content.ctaText1}
                        <ArrowRight className="w-4 h-4 text-[#0A0103]" />
                      </motion.button>
                    )}
                    {content?.ctaText2 && (
                      <motion.button 
                        whileHover={{ scale: 1.05, y: -2, border: "1px solid #D4AF37", bg: "rgba(88, 17, 26, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNavigate(content.ctaLink2.replace("/", ""))}
                        className="w-full sm:w-auto px-10 py-4.5 bg-gradient-to-r from-black/80 to-[#2A050D] border border-[#D4AF37]/35 text-[#F4E6C1] font-mono font-bold text-xs uppercase tracking-widest rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 backdrop-blur-md"
                      >
                        {content.ctaText2}
                      </motion.button>
                    )}
                  </motion.div>

                </motion.div>

                {/* Luxury Royal Accent Bottom Border Line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
              </section>
            );

          // ==========================================
          // 2. STATS SUMMARY GRID (Theme 5: Executive Carbon Black & Gold)
          // ==========================================
          case "stats":
            return (
              <section key={id} className="w-full py-20 bg-gradient-to-b from-[#0F0F11] via-[#050506] to-[#0D0D10] relative overflow-hidden border-b border-[#D4AF37]/10" id={`sec-stats-${id}`}>
                {/* Executive subtle grid-mesh overlay or gold background blurs */}
                <div className="absolute right-0 bottom-0 w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
                  
                  {title && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-center space-y-3"
                    >
                      <span className="block text-[10px] uppercase tracking-[4px] font-mono text-[#D4AF37] font-extrabold">Executive Performance Index</span>
                      <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white">{title}</h2>
                      {subtitle && <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">{subtitle}</p>}
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="stats-numbers-index">
                    {content?.items?.map((item: any, i: number) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: i * 0.08 }}
                        whileHover={{ 
                          y: -8, 
                          borderColor: "#D4AF37", 
                          boxShadow: "0 20px 35px -15px rgba(212, 175, 55, 0.18)" 
                        }}
                        className="p-6.5 bg-[#141416] border border-[#2D2D31] hover:bg-[#1A1A1E] rounded-xl shadow-2xl space-y-5 relative group transition-all duration-300"
                      >
                        <div className="absolute top-4 right-4 p-2 bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 border border-[#D4AF37]/15 rounded group-hover:rotate-6 transition-transform">
                          <Bookmark className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </div>
                        
                        <span className="block text-4xl font-sans font-black text-[#D4AF37] tracking-tight group-hover:scale-105 transition-transform duration-300">
                          {item.value || "97%"}
                        </span>
                        
                        <div className="space-y-1">
                          <h4 className="text-xs uppercase tracking-wider font-mono text-gray-200 font-bold">{item.label}</h4>
                          {item.desc && <p className="text-[11px] text-gray-400 leading-relaxed font-light">{item.desc}</p>}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                </div>
              </section>
            );

          // ==========================================
          // 3. EDITABLE INFO BLOCKS (LEFT/RIGHT LAYOUTS - Section Specific Themes)
          // ==========================================
          case "infosection":
            const isLeft = content?.layout === "text-left";
            const isHomeInfo = id === "sec-home-info";
            
            // Assign specific luxury theme classes based on domain
            const sectionBg = isHomeInfo 
              ? "bg-gradient-to-tr from-[#091122] via-[#050A15] to-[#020409]" // Midnight Navy & Platinum
              : "bg-gradient-to-br from-[#161a23] via-[#242c3d] to-[#121622]"; // Faculty: Steel-Platinum Slate & Navy
              
            const accentTextClass = isHomeInfo 
              ? "text-blue-400 font-mono tracking-widest" 
              : "text-[#E2E8F0] font-mono tracking-widest border-b border-[#D4AF37]/30 pb-1";
              
            const imgBorderClass = isHomeInfo 
              ? "bg-gradient-to-r from-blue-500/40 via-purple-500/20 to-slate-500/30" 
              : "bg-gradient-to-br from-[#D4AF37] via-slate-400 to-[#1e3a8a]/20";

            return (
              <section 
                key={id} 
                className={`w-full py-24 ${sectionBg} relative overflow-hidden border-b border-white/5`}
                id={`sec-info-${id}`}
              >
                {/* Ambience particles based on selected palette */}
                {isHomeInfo ? (
                  <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
                ) : (
                  <>
                    <div className="absolute top-10 left-10 w-[250px] h-[250px] bg-[#D4AF37]/5 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
                  </>
                )}

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center`}>
                    
                    {/* Column Image */}
                    <motion.div 
                      initial={{ opacity: 0, x: isLeft ? 40 : -40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className={`lg:col-span-5 ${isLeft ? "lg:order-last" : ""} space-y-4`}
                    >
                      <div className={`relative group p-1.5 ${imgBorderClass} rounded-2xl shadow-2xl`}>
                        <img 
                          src={content?.imageUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"} 
                          alt="University Core Landmarks"
                          className="w-full h-[360px] object-cover rounded-xl scale-100 group-hover:scale-[1.02] transition-transform duration-500 filter brightness-[0.92] contrast-[1.05]"
                          referrerPolicy="no-referrer"
                        />
                        {/* Elite Corner Shield Highlight */}
                        <div className="absolute top-4 left-4 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded border border-white/10 text-[9px] font-mono tracking-widest text-slate-300">
                          LEADERSHIP PROFILE
                        </div>
                      </div>
                    </motion.div>

                    {/* Column Text */}
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="lg:col-span-7 space-y-6"
                    >
                      <div className="space-y-3">
                        <span className={`block text-xs uppercase font-semibold ${accentTextClass}`}>
                          {isHomeInfo ? "Institutional Blueprint & Crest" : "Prestigious Governance Council"}
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight text-white leading-tight">
                          {title}
                        </h2>
                      </div>
                      
                      <p className="text-slate-300 text-sm leading-relaxed max-w-2xl font-light">
                        {content?.desc || (config?.universityName ? `Welcome to ${config.universityName}. Discover our advanced academic curriculum and stellar career tracks.` : "Delivering high fidelity educational layouts structured to bypass traditional limits.")}
                      </p>
                      
                      {content?.buttonText && (
                        <motion.button
                          whileHover={{ x: 6 }}
                          onClick={() => onNavigate(content.buttonLink?.replace("/", "") || "courses")}
                          className={`px-6 py-3 bg-transparent border-b-2 font-mono text-xs uppercase tracking-widest cursor-pointer transition-all flex items-center gap-2 ${
                            isHomeInfo 
                              ? "border-blue-400 text-blue-300 hover:text-white hover:border-white" 
                              : "border-[#D4AF37] text-[#D4AF37] hover:text-white hover:border-white"
                          }`}
                        >
                          {content.buttonText}
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      )}
                    </motion.div>

                  </div>
                </div>
              </section>
            );

          // ==========================================
          // 4. PREMIER COURSE CATALOG WITH FILTERS + DETAIL MODAL (Theme 3: Emerald Prestige Green & Gold)
          // ==========================================
          case "courses":
            return (
              <section key={id} className="w-full py-20 bg-gradient-to-b from-[#03150C] via-[#010804] to-[#020D06] relative overflow-hidden border-b border-emerald-500/10" id={`sec-courses-${id}`}>
                {/* Emerald Ambient Lights */}
                <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[130px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-10 w-[300px] h-[300px] bg-[#DFBA5A]/5 rounded-full blur-[110px] pointer-events-none" />

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
                  
                  {title && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-center space-y-3"
                    >
                      <span className="block text-[10px] uppercase tracking-[4px] font-mono text-[#DFBA5A] font-extrabold">Professional Course Tracks</span>
                      <h2 className="text-3xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white block to-[#DFBA5A]">{title}</h2>
                      {subtitle && <p className="text-xs sm:text-sm text-emerald-200/60 max-w-xl mx-auto leading-relaxed font-light">{subtitle}</p>}
                    </motion.div>
                  )}

                  {/* Level filters tabs */}
                  <div className="flex justify-center flex-wrap gap-2.5" id="course-filter-triggers">
                    {(["ALL", "UG", "PG", "PhD"] as const).map((lvl) => (
                      <motion.button
                        key={lvl}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCourseFilter(lvl)}
                        className={`px-5 py-2 text-xs font-mono font-bold rounded-full border transition-all cursor-pointer uppercase tracking-wider ${
                          courseFilter === lvl
                            ? "bg-[#DFBA5A] text-[#010804] border-[#DFBA5A] font-extrabold shadow-lg shadow-emerald-500/10"
                            : "bg-emerald-950/20 border-emerald-500/20 text-emerald-300/80 hover:text-white hover:border-[#DFBA5A]/60"
                        }`}
                      >
                        {lvl === "ALL" ? "All Pathways" : `${lvl} Programs`}
                      </motion.button>
                    ))}
                  </div>

                  {/* Program Cards Grid */}
                  <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                    id="course-cards-catalog"
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredCourses.map((crs) => (
                        <motion.div 
                          layout
                          key={crs.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95, y: 15 }}
                          whileHover={{ 
                            y: -8, 
                            borderColor: "#DFBA5A",
                            boxShadow: "0 22px 40px -15px rgba(223, 186, 90, 0.15)"
                          }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="bg-[#05150C]/80 border border-emerald-500/20 rounded-xl p-6 shadow-2xl backdrop-blur-md transition-all flex flex-col justify-between space-y-5"
                        >
                          <div className="space-y-3.5">
                            <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                              <span className="text-[#DFBA5A] bg-[#DFBA5A]/10 border border-[#DFBA5A]/30 px-2.5 py-0.5 rounded font-bold">{crs.code}</span>
                              <span className="bg-emerald-900/40 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold">{crs.level}</span>
                            </div>
                            <h3 className="text-lg font-serif font-bold text-white tracking-tight line-clamp-1 group-hover:text-[#DFBA5A]">{crs.name}</h3>
                            <p className="text-xs text-emerald-100/70 leading-relaxed line-clamp-3 font-light">{crs.description}</p>
                          </div>

                          <div className="pt-4 border-t border-emerald-500/10 space-y-4">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-emerald-300/80 font-mono">Academic Fee Rate</span>
                              <span className="font-extrabold text-[#DFBA5A] bg-[#DFBA5A]/5 px-2.5 py-1 rounded border border-[#DFBA5A]/10 font-mono">{crs.fees}</span>
                            </div>
                            
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedCourse(crs)}
                              className="w-full py-2.5 bg-gradient-to-r from-emerald-950 to-emerald-900 hover:from-emerald-900 hover:to-emerald-850 text-xs font-mono font-bold border border-emerald-500/25 hover:border-[#DFBA5A] text-emerald-300 hover:text-white rounded transition-all cursor-pointer text-center block uppercase tracking-wider"
                            >
                              Explore Syllabus & Criteria
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                </div>

                {/* ========================================================
                    DYNAMIC SYLLABUS DETAIL MODAL 
                    ======================================================== */}
                <AnimatePresence>
                  {selectedCourse && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 bg-[#010804]/94 backdrop-blur-md flex items-center justify-center p-4"
                    >
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-2xl bg-[#05150C] border-2 border-[#DFBA5A] text-white rounded-xl shadow-2xl overflow-hidden relative"
                      >
                        
                        <div className="p-6 bg-[#020A06] border-b border-emerald-500/20 flex justify-between items-center">
                          <div>
                            <span className="text-[10px] uppercase font-mono tracking-widest text-[#DFBA5A] bg-[#DFBA5A]/10 border border-[#DFBA5A]/20 px-2 py-0.5 rounded font-bold mr-2">{selectedCourse.code}</span>
                            <span className="text-[10px] uppercase font-mono tracking-widest bg-emerald-900/30 text-emerald-300 px-2 py-0.5 rounded font-bold">{selectedCourse.level}</span>
                            <h3 className="text-xl font-serif font-bold text-white mt-2.5">{selectedCourse.name}</h3>
                          </div>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedCourse(null)}
                            className="p-1 px-2.5 bg-emerald-950 border border-emerald-500/30 text-xs text-emerald-400 rounded hover:bg-white/5 cursor-pointer"
                          >
                            ✕
                          </motion.button>
                        </div>

                        <div className="p-6 space-y-6 text-sm overflow-y-auto max-h-[70vh]">
                          <div className="space-y-1.5">
                            <h4 className="text-xs uppercase font-mono text-[#DFBA5A] font-bold">Eligibility Requirements</h4>
                            <p className="text-emerald-100/90 leading-relaxed text-xs font-light">{selectedCourse.eligibility}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 border-y border-emerald-500/15 py-4 text-xs font-mono">
                            <div>
                              <span className="text-emerald-300/70 block mb-0.5">Program Duration</span>
                              <span className="text-white font-bold text-sm flex items-center gap-1"><Clock className="w-4 h-4 text-[#DFBA5A]" /> {selectedCourse.duration}</span>
                            </div>
                            <div>
                              <span className="text-emerald-300/70 block mb-0.5">Tuition Fees Rate</span>
                              <span className="text-[#DFBA5A] font-bold text-sm">{selectedCourse.fees}</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-xs uppercase font-mono text-[#DFBA5A] font-semibold">Specialization Streams Offered</h4>
                            <div className="flex flex-wrap gap-2 text-xs">
                              {selectedCourse.branches && selectedCourse.branches.length > 0 ? (
                                selectedCourse.branches.map((b, i) => (
                                  <span key={i} className="px-3 py-1 bg-emerald-900/10 border border-emerald-500/20 rounded-full text-emerald-200 font-mono text-[11px]">
                                    {b}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400 italic">Continuous core multidisciplinary thesis stream.</span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-xs uppercase font-mono text-[#DFBA5A] font-bold">Academic Description</h4>
                            <p className="text-emerald-100/80 leading-relaxed text-xs font-light max-w-2xl">{selectedCourse.description}</p>
                          </div>

                          <div className="pt-4 border-t border-emerald-500/10">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => { setSelectedCourse(null); onNavigate("contact"); }}
                              className="w-full py-3.5 bg-gradient-to-r from-[#DFBA5A] via-[#E5C158] to-[#C29E30] text-[#010804] font-mono font-bold uppercase tracking-wider text-xs rounded-lg text-center cursor-pointer block border border-[#DFBA5A]/35 shadow-lg shadow-emerald-500/5 hover:-translate-y-[1px]"
                            >
                              Apply for Admission 2026-27
                            </motion.button>
                          </div>
                        </div>

                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            );

          // ==========================================
          // 5. BULLET BOARD ADMINISTRATION BULLETIN NOTICES (Theme 4: Imperial Purple)
          // ==========================================
          case "notices":
            const topNotices = notices.slice(0, content?.limit || 4);
            return (
              <section key={id} className="w-full py-20 bg-gradient-to-b from-[#14031E] via-[#08010C] to-[#0D0214] relative overflow-hidden border-b border-purple-500/10" id={`sec-notices-${id}`}>
                {/* Purple subtle radial ambience lights */}
                <div className="absolute top-1/4 left-10 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[110px] pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#D4AF37]/5 rounded-full blur-[130px] pointer-events-none" />

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
                  
                  {title && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-center space-y-3"
                    >
                      <span className="block text-[10px] uppercase tracking-[4px] font-mono text-[#D4AF37] font-extrabold">Official LSU Bulletin Board</span>
                      <h2 className="text-3xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white block to-[#D4AF37]">{title}</h2>
                      {subtitle && <p className="text-xs sm:text-sm text-purple-200/60 max-w-2xl mx-auto leading-relaxed font-light">{subtitle}</p>}
                    </motion.div>
                  )}

                  <div className="max-w-4xl mx-auto space-y-4" id="bulletin-list">
                    {topNotices.map((notice, index) => {
                      const isExpanded = expandedNoticeId === notice.id;
                      return (
                        <motion.div 
                          key={notice.id} 
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.08 }}
                          className="bg-[#100318]/90 border border-purple-500/20 hover:border-purple-400 rounded-xl overflow-hidden transition-all shadow-2xl"
                        >
                          <div 
                            onClick={() => setExpandedNoticeId(isExpanded ? null : notice.id)}
                            className="p-5 flex justify-between items-center cursor-pointer text-left focus:outline-none bg-[#14051D]/30 hover:bg-[#1C0929]/30 transition-colors"
                          >
                            <div className="space-y-2 flex-1 pr-6">
                              <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono">
                                <span className={`px-2.5 py-0.5 rounded uppercase font-bold tracking-wider ${
                                  notice.priority === "High" 
                                    ? "bg-rose-950 text-rose-300 animate-pulse border border-rose-500/30 font-bold" 
                                    : "bg-purple-950/50 text-[#D4AF37] border border-purple-500/20 font-bold"
                                }`}>
                                  {notice.category}
                                </span>
                                <span className="text-purple-300/80 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> {notice.date}</span>
                              </div>
                              <h3 className="text-sm sm:text-base font-serif font-bold text-white tracking-tight">{notice.title}</h3>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-[#D4AF37] border border-[#D4AF37]/35 rounded px-2 py-1 bg-[#D4AF37]/5 hover:bg-[#D4AF37] hover:text-black transition-all shrink-0">
                              {isExpanded ? "COLLAPSE" : "VIEW DETAILED"}
                            </span>
                          </div>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="p-6 bg-purple-950/15 border-t border-purple-500/10 space-y-4">
                                  <p className="text-xs sm:text-sm text-purple-100/80 leading-relaxed max-w-3xl font-light">{notice.description}</p>
                                  <div className="pt-2">
                                    <a 
                                      href="#downloads" 
                                      onClick={(e) => { e.preventDefault(); console.log("Preparing PDF Package...") }}
                                      className="inline-flex items-center gap-2 text-xs text-[#D4AF37] hover:text-white font-mono font-bold"
                                    >
                                      <FileText className="w-4 h-4 text-[#D4AF37]" /> Download Official Directive Dossier (PDF Archive)
                                    </a>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>

                </div>
              </section>
            );

          // ==========================================
          // 6. RECRUITER BRANDING CORRIDORS (Theme 2: Navy + Emerald Theme)
          // ==========================================
          case "placements":
            return (
              <section key={id} className="w-full py-20 bg-gradient-to-b from-[#040D1F] via-[#02050E] to-[#010815] relative overflow-hidden border-b border-emerald-500/10" id={`sec-placements-${id}`}>
                {/* Ambience glow elements */}
                <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
                  
                  {title && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-center space-y-3"
                    >
                      <span className="block text-[10px] uppercase tracking-[4px] font-mono text-emerald-400 font-extrabold">Executive Corporate Alignment</span>
                      <h2 className="text-3xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white block to-[#D4AF37]">{title}</h2>
                      {subtitle && <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed font-light">{subtitle}</p>}
                    </motion.div>
                  )}

                  {/* recruiter lists */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center border-b border-emerald-500/10 pb-12 animate-fadeIn" id="corporate-partners">
                    {(content?.recruiters || ["Google India", "AWS Research", "Microsoft Redmond", "NVIDIA Corp", "Intel Staging", "Deloitte strategy", "Morgan Stanley", "Oracle Tech"]).map((partner: string, i: number) => (
                      <motion.div 
                        key={i} 
                        whileHover={{ y: -3, borderColor: "rgba(16, 185, 129, 0.45)" }}
                        className="py-6 px-4 bg-[#061124]/60 border border-emerald-500/15 hover:border-emerald-450 rounded-xl text-center shadow-2xl font-mono font-bold tracking-[2px] text-xs text-slate-400 hover:text-white transition-all cursor-default"
                      >
                        {partner.toUpperCase()}
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xs uppercase tracking-[3px] font-mono text-[#D4AF37] text-center font-bold">Hall of Fame Corporate Placements</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {(content?.items || DEMO_PLACEMENTS).map((rec: any, i: number) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ y: -6, borderColor: "#DFBA5A" }}
                          className="bg-[#071329]/90 border border-emerald-500/10 hover:border-emerald-500/40 rounded-xl p-6.5 text-center space-y-4 shadow-2xl transition-all"
                        >
                          <img 
                            src={rec.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120"} 
                            alt={rec.studentName} 
                            className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#D4AF37] shadow-xl"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-0.5">
                            <h4 className="text-base font-serif font-bold text-white leading-tight">{rec.studentName}</h4>
                            <p className="text-[10px] text-emerald-300 font-mono tracking-wider">{rec.course}</p>
                          </div>
                          <div className="bg-[#040C1A] border border-emerald-500/20 p-2.5 rounded">
                            <span className="block text-[9px] uppercase tracking-wider text-emerald-400 font-bold">Salary Package Secured</span>
                            <span className="block text-md font-mono font-extrabold text-[#D4AF37]">{rec.package}</span>
                          </div>
                          <p className="text-xs font-mono font-bold text-white tracking-wide uppercase">{rec.companyName}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                </div>
              </section>
            );

          // ==========================================
          // 7. CLIENT TESTIMONIAL PANEL (Theme 1: Royal Burgundy & Champagne Theme)
          // ==========================================
          case "testimonials":
            return (
              <section key={id} className="w-full py-20 bg-gradient-to-b from-[#2A050D] via-[#120105] to-[#0A0002] relative overflow-hidden" id={`sec-test-${id}`}>
                {/* Visual Glow Ambient filters */}
                <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#58111A]/15 rounded-full blur-[130px] pointer-events-none" />

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
                  
                  {title && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-center space-y-3"
                    >
                      <span className="block text-[10px] uppercase tracking-[4px] font-mono text-[#D4AF37] font-extrabold">Alumni & Scholar Voice</span>
                      <h2 className="text-3xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white block to-[#D4AF37]">{title}</h2>
                      {subtitle && <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed font-light">{subtitle}</p>}
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {content?.items?.map((item: any, i: number) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.55 }}
                        whileHover={{ y: -5, borderColor: "#D4AF37", boxShadow: "0 20px 35px -15px rgba(212, 175, 55, 0.12)" }}
                        className="p-8 bg-[#180308]/90 border border-[#D4AF37]/15 rounded-2xl relative shadow-2xl space-y-6 flex flex-col justify-between transition-all duration-300"
                      >
                        {/* Quote mark visual placeholder */}
                        <span className="absolute top-4 right-6 text-7xl font-serif text-[#D4AF37]/10 select-none">“</span>
                        
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic relative z-10 font-light">
                          "{item.text || "Direct testimonial outlining educational paradigm gains."}"
                        </p>

                        <div className="flex items-center gap-4 pt-5 border-t border-[#D4AF37]/10">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37] shadow-lg"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <div>
                            <h4 className="text-xs sm:text-sm font-serif font-bold text-white tracking-wide">{item.name}</h4>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">{item.designation}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                </div>
              </section>
            );

          // ==========================================
          // 8. ADMISSIONS CONTACT FORM (Theme 4: Royal Purple & Rose Gold)
          // ==========================================
          case "contact":
            return (
              <section key={id} className="w-full py-20 bg-gradient-to-b from-[#16021F] via-[#090114] to-[#050009] relative overflow-hidden border-b border-purple-500/10" id={`sec-contact-${id}`}>
                {/* Ambience glowing spheres */}
                <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
                <div className="absolute bottom-1/4 left-10 w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[110px] pointer-events-none" />

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
                    
                    {/* Visual left contact widget */}
                    <div className="lg:col-span-5 space-y-7">
                      <div className="space-y-3">
                        <span className="block text-[10px] uppercase tracking-[4px] font-mono text-[#D4AF37] font-extrabold">Executive Consultation Desk</span>
                        <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white leading-tight">{title || "Admissions Desk"}</h2>
                        {subtitle && <p className="text-xs text-purple-300 font-mono tracking-wider bg-purple-950/40 border border-purple-500/20 rounded px-2.5 py-1 inline-block mt-1">{subtitle}</p>}
                      </div>
                      
                      <p className="text-purple-100/80 text-sm leading-relaxed max-w-md font-light">
                        Submit your academic credentials and JEE/academic percentile to commence candidate profile profiling. An expert academic registrar is allocated to map your pathway.
                      </p>

                      <div className="space-y-4 pt-3 text-xs font-mono">
                        <div className="flex items-center gap-3.5">
                          <div className="p-2.5 bg-purple-950/30 border border-purple-500/20 rounded-lg shadow">
                            <Phone className="w-4 h-4 text-[#D4AF37]" />
                          </div>
                          <span className="text-purple-200">{config?.contactPhone || "+91-11-4920-3022"} | Executive Admissions Hotline</span>
                        </div>
                        <div className="flex items-center gap-3.5">
                          <div className="p-2.5 bg-purple-950/30 border border-purple-500/20 rounded-lg shadow">
                            <Mail className="w-4 h-4 text-[#D4AF37]" />
                          </div>
                          <span className="text-purple-200">{config?.contactEmail || "admissions@lsu.edu.in"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive validation form */}
                    <div className="lg:col-span-7">
                      <div className="bg-[#12041D]/90 border border-[#D4AF37]/35 p-6 sm:p-8 rounded-2xl shadow-2xl relative backdrop-blur-xl">
                        
                        {isSubmitted ? (
                          <div className="py-14 text-center space-y-4 animate-scaleIn">
                            <div className="w-14 h-14 bg-emerald-950/40 border border-emerald-500 rounded-full flex items-center justify-center mx-auto">
                              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-serif font-bold text-white uppercase tracking-wider">Candidate Registry Logged</h3>
                            <p className="text-xs text-emerald-200/90 max-w-sm mx-auto">
                              Academic profile logged into secure admissions database. Consultation ticket details dispatched to candidate registry: <strong className="text-white block mt-1 font-mono">{contactForm.email}</strong>
                            </p>
                          </div>
                        ) : (
                          <form onSubmit={handleContactSubmit} className="space-y-5 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="block text-purple-200 font-mono font-bold uppercase tracking-wider text-[10px]">Student Full Name</label>
                                <input 
                                  type="text" 
                                  value={contactForm.name}
                                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                  className="w-full bg-[#050109] border border-purple-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                                  placeholder="Candidate Name"
                                  required
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-purple-200 font-mono font-bold uppercase tracking-wider text-[10px]">Communication Email</label>
                                <input 
                                  type="email" 
                                  value={contactForm.email}
                                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                  className="w-full bg-[#050109] border border-purple-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                                  placeholder="name@gmail.com"
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="block text-purple-200 font-mono font-bold uppercase tracking-wider text-[10px]">Mobile Hotline Phone</label>
                                <input 
                                  type="tel" 
                                  value={contactForm.phone}
                                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                  className="w-full bg-[#050109] border border-purple-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                                  placeholder="+91-"
                                  required
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-purple-200 font-mono font-bold uppercase tracking-wider text-[10px]">Preferred Program Stream</label>
                                <select 
                                  value={contactForm.course}
                                  onChange={(e) => setContactForm({ ...contactForm, course: e.target.value })}
                                  className="w-full bg-[#050109] border border-purple-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all cursor-pointer"
                                >
                                  {courses.map((crs) => (
                                    <option key={crs.id} value={crs.code} className="bg-[#12041D] text-white font-mono">{crs.name} ({crs.code})</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-purple-200 font-mono font-bold uppercase tracking-wider text-[10px]">Brief Academic summary / inquiries</label>
                              <textarea 
                                value={contactForm.message}
                                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                className="w-full h-24 bg-[#050109] border border-purple-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                                placeholder="Detail scores (e.g. JEE percentile), questions regarding hostel services or fee schedules."
                                required
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#C29E30] text-[#0A0103] font-mono font-extrabold uppercase tracking-widest text-xs rounded-lg transition-all flex justify-center items-center gap-1.5 shadow-xl hover:-translate-y-[1px] cursor-pointer"
                            >
                              <Send className="w-4 h-4 text-[#0A0103]" /> Submit Admission Application
                            </button>
                          </form>
                        )}

                      </div>
                    </div>

                  </div>
                </div>
              </section>
            );

          case "gallery":
            return (
              <GallerySectionBlock 
                key={id}
                title={title}
                subtitle={subtitle}
                galleryAlbums={galleryAlbums || []}
                config={config}
              />
            );

          default:
            return null;
        }

      })}
    </div>
  );
}

// ============================================================================
// LUXURY GALLERY INTERACTIVE PRESENTATION MODULE
// ============================================================================
interface GallerySectionBlockProps {
  key?: string;
  title?: string;
  subtitle?: string;
  galleryAlbums: GalleryAlbum[];
  config?: SiteConfig;
}

function GallerySectionBlock({ title, subtitle, galleryAlbums, config }: GallerySectionBlockProps) {
  const [activeCategory, setActiveCategory] = useState<"ALL" | "Campus" | "Events" | "Convocation" | "Sports" | "Cultural">("ALL");
  const [activeAlbum, setActiveAlbum] = useState<GalleryAlbum | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories: ("ALL" | "Campus" | "Events" | "Convocation" | "Sports" | "Cultural")[] = [
    "ALL", "Campus", "Events", "Convocation", "Sports", "Cultural"
  ];

  const filteredAlbums = activeCategory === "ALL" 
    ? galleryAlbums 
    : galleryAlbums.filter(a => a.type === activeCategory);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handlePrevMedia = () => {
    if (activeAlbum && lightboxIndex !== null) {
      const prevIdx = lightboxIndex === 0 ? activeAlbum.media.length - 1 : lightboxIndex - 1;
      setLightboxIndex(prevIdx);
    }
  };

  const handleNextMedia = () => {
    if (activeAlbum && lightboxIndex !== null) {
      const nextIdx = lightboxIndex === activeAlbum.media.length - 1 ? 0 : lightboxIndex + 1;
      setLightboxIndex(nextIdx);
    }
  };

  return (
    <div className="w-full bg-[#050001] py-16 px-4 sm:px-6 lg:px-8 relative min-h-screen" id="gallery-render-block">
      {/* Background radial accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#58111A]/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Title Block */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] font-mono text-xs uppercase rounded-full">
            <Image className="w-3.5 h-3.5" /> LUXURY PICTURES & ARCHIVES
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#EAE0D5] to-[#D4AF37] tracking-tight">
            {title || (config?.universityName ? `${config.logoText || config.universityName.toUpperCase()} Royal Archives` : "Royal Archives & Gallery")}
          </h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed font-sans">
            {subtitle || `Exploring the palatial research structures, academic festivities, state councils, and athletic triumphs of ${config?.universityName || "the university"}.`}
          </p>
        </div>

        {/* If viewing a specific album's media grid */}
        {activeAlbum ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Header / Back row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#D4AF37]/25 pb-6">
              <div>
                <button
                  type="button"
                  onClick={() => { setActiveAlbum(null); handleCloseLightbox(); }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#D4AF37] hover:text-[#EAE0D5] transition-all bg-white/5 border border-[#D4AF37]/20 px-3 py-1.5 rounded-lg mb-2 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Albums Catalog
                </button>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-white flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest font-mono bg-[#58111A] text-[#D4AF37] border border-[#D4AF37]/20 px-2.5 py-0.5 rounded-md">
                    {activeAlbum.type}
                  </span>
                  {activeAlbum.title}
                </h3>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Showing {activeAlbum.media.length} official items in catalog
              </p>
            </div>

            {/* Media Items Mosaic */}
            {activeAlbum.media.length === 0 ? (
              <div className="text-center py-24 bg-white/5 border border-[#D4AF37]/10 rounded-xl">
                <p className="text-sm text-gray-400 font-sans">This album is currently empty. CMS uploads pending.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {activeAlbum.media.map((mediaItem, index) => (
                  <div
                    key={mediaItem.id}
                    onClick={() => handleOpenLightbox(index)}
                    className="group bg-[#0D0204]/80 border border-[#D4AF37]/25 hover:border-[#D4AF37] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer relative aspect-video"
                  >
                    {mediaItem.type === "video" ? (
                      <div className="w-full h-full relative">
                        <div className="absolute inset-0 bg-[#58111A]/20 group-hover:bg-[#58111A]/5 transition-all z-10" />
                        <div className="absolute inset-0 flex justify-center items-center z-20">
                          <div className="p-3 bg-black/60 rounded-full border border-[#D4AF37]/45 text-[#D4AF37] group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-current" />
                          </div>
                        </div>
                        {mediaItem.url.includes("embed") ? (
                          <iframe
                            src={mediaItem.url}
                            className="w-full h-full object-cover pointer-events-none"
                            title={mediaItem.caption}
                          />
                        ) : (
                          <img
                            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
                            alt="Video Thumbnail Placeholder"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:opacity-0 transition-opacity z-10" />
                        <img
                          src={mediaItem.url}
                          alt={mediaItem.caption || "Gallery archive"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* Floating Caption text overlay */}
                    {mediaItem.caption && (
                      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-[11px] font-sans text-gray-200 line-clamp-1">{mediaItem.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-10 animate-fadeIn">
            {/* Category selection Tabs */}
            <div className="flex flex-wrap justify-center items-center gap-2 border-b border-[#D4AF37]/15 pb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded-lg border transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-[#58111A] text-[#D4AF37] border-[#D4AF37] shadow-md shadow-[#58111A]/20"
                      : "bg-[#0A0D10]/50 text-gray-400 border-white/5 hover:border-white/15 hover:text-white"
                  }`}
                >
                  {cat === "ALL" ? "All Archives" : `${cat} Gallery`}
                </button>
              ))}
            </div>

            {/* List of albums matching the active category */}
            {filteredAlbums.length === 0 ? (
              <div className="text-center py-24 bg-white/5 border border-dashed border-[#D4AF37]/10 rounded-xl max-w-md mx-auto">
                <Image className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No albums published under this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {filteredAlbums.map((album) => {
                  const coverImage = album.media && album.media.length > 0 
                    ? album.media[0].url 
                    : "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600";
                  return (
                    <div
                      key={album.id}
                      onClick={() => setActiveAlbum(album)}
                      className="group bg-[#0F0205] border border-[#D4AF37]/20 hover:border-[#D4AF37] rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full transform hover:-translate-y-1"
                    >
                      {/* Cover wrapper */}
                      <div className="relative aspect-video overflow-hidden border-b border-[#D4AF37]/20">
                        <div className="absolute inset-0 bg-[#58111A]/10 group-hover:bg-transparent transition-colors z-10" />
                        <img
                          src={coverImage}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 right-3 bg-[#58111A]/90 border border-[#D4AF37]/35 text-[#D4AF37] text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full z-20">
                          {album.type}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <h4 className="text-base font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug line-clamp-2">
                            {album.title}
                          </h4>
                          <p className="text-xs text-gray-400 font-mono">
                            📂 Dynamic Collection containing {album.media?.length || 0} media assets
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#D4AF37] uppercase group-hover:text-[#EAE0D5]">
                          Open Album Archives <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Lightbox / Video Modal Immersive Slider Overlay */}
        {lightboxIndex !== null && activeAlbum && (
          <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-6 animate-fadeIn transition-all">
            {/* Upper control row */}
            <div className="flex justify-between items-center text-white">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#D4AF37] font-mono uppercase tracking-widest">{activeAlbum.title}</span>
                <p className="text-xs text-gray-300 font-mono">Asset {lightboxIndex + 1} of {activeAlbum.media.length}</p>
              </div>
              <button
                type="button"
                onClick={handleCloseLightbox}
                className="p-2.5 bg-white/5 border border-white/10 hover:border-white/30 rounded-full transition-all text-gray-400 hover:text-white cursor-pointer"
                title="Close overlay"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Middle Media display with arrows */}
            <div className="relative flex-1 flex justify-center items-center h-full my-4">
              
              {/* Prev key */}
              <button
                type="button"
                onClick={handlePrevMedia}
                className="absolute left-2 sm:left-4 z-10 p-3 bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 rounded-full text-white/75 hover:text-[#D4AF37] transition-all cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Main asset view */}
              <div className="max-w-4xl max-h-[70vh] w-full flex items-center justify-center relative select-none">
                {activeAlbum.media[lightboxIndex].type === "video" ? (
                  <div className="w-full aspect-video rounded-lg overflow-hidden border border-[#D4AF37]/35 shadow-2xl">
                    <iframe
                      src={activeAlbum.media[lightboxIndex].url}
                      className="w-full h-full object-cover"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      title={activeAlbum.media[lightboxIndex].caption || "LSU video presentation"}
                    />
                  </div>
                ) : (
                  <img
                    src={activeAlbum.media[lightboxIndex].url}
                    alt={activeAlbum.media[lightboxIndex].caption || "Lightbox presentation item"}
                    className="max-h-[70vh] max-w-full rounded-lg border border-[#D4AF37]/25 shadow-2xl object-contain animate-scaleIn select-none"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

              {/* Next key */}
              <button
                type="button"
                onClick={handleNextMedia}
                className="absolute right-2 sm:right-4 z-10 p-3 bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 rounded-full text-white/75 hover:text-[#D4AF37] transition-all cursor-pointer"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>

            </div>

            {/* Lower Caption text representation */}
            <div className="text-center text-white space-y-1.5 max-w-xl mx-auto pb-4">
              {activeAlbum.media[lightboxIndex].caption && (
                <p className="text-sm tracking-wide text-slate-100 font-sans">{activeAlbum.media[lightboxIndex].caption}</p>
              )}
              <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">LSU Authorized Media Vault</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
