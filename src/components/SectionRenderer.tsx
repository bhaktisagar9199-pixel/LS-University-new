import React, { useState } from "react";
import { 
  ArrowRight, Award, GraduationCap, Briefcase, Calendar, ShieldAlert, 
  ChevronRight, Users, Sparkles, BookOpen, Clock, Globe, ArrowUpRight, 
  Mail, Phone, MapPin, Send, CheckCircle2, Bookmark, FileText
} from "lucide-react";
import { PageSection, Course, Notice } from "../types";
import { DEMO_PLACEMENTS } from "../demoData";
import { motion, AnimatePresence } from "motion/react";

interface SectionRendererProps {
  sections: PageSection[];
  courses: Course[];
  notices: Notice[];
  onNavigate: (slug: string) => void;
}

export default function SectionRenderer({ sections, courses, notices, onNavigate }: SectionRendererProps) {
  
  // Selected course details modal state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseFilter, setCourseFilter] = useState<"ALL" | "UG" | "PG" | "PhD">("ALL");

  // Contact form submission states
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", course: "BTECH-CSE", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Expanded notice bulletins State
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
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
          // 1. HERO SECTION
          // ==========================================
          case "hero":
            return (
              <section 
                key={id} 
                className="w-full relative min-h-[650px] flex items-center justify-center pt-24 pb-16 px-4 text-center overflow-hidden border-b border-[#D4AF37]/25"
                id={`sec-hero-${id}`}
              >
                {/* Visual Backdrop Overlay with dynamic CSS filters */}
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/50 via-[#0A192F]/90 to-[#030712] z-10" />
                  <img 
                    src={content?.bgImage || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600"} 
                    alt="University Staging Landmark"
                    className="w-full h-full object-cover object-center scale-105 filter saturate-[0.85] contrast-[1.10]"
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
                  className="relative z-10 max-w-5xl mx-auto space-y-8" 
                  id="hero-core-content"
                >
                  
                  {/* Accreditation Micro-pill */}
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, y: -12, scale: 0.95 },
                      visible: { opacity: 1, y: 0, scale: 1 }
                    }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/40 text-xs text-[#D4AF37] font-semibold rounded-full shadow tracking-wider uppercase font-mono"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-spin" /> Staging Elite University
                  </motion.div>

                  <div className="space-y-4">
                    <motion.h1 
                      variants={{
                        hidden: { opacity: 0, y: 24 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                      className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-[#D4AF37]"
                    >
                      {title?.toUpperCase() || "LS UNIVERSITY"}
                    </motion.h1>
                    <motion.p 
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 }
                      }}
                      className="text-sm sm:text-lg md:text-xl font-sans tracking-[3px] text-gray-300 uppercase font-medium max-w-3xl mx-auto leading-relaxed"
                    >
                      {subtitle || "Nurturing Leaders for Next-Gen Tech Architectures"}
                    </motion.p>
                  </div>

                  <motion.p 
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-sans font-light"
                  >
                    {content?.tagline || "LS prepares modern minds to develop advanced computing platforms and robust business models."}
                  </motion.p>

                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4" 
                    id="hero-ctas"
                  >
                    {content?.ctaText1 && (
                      <motion.button 
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNavigate(content.ctaLink1.replace("/", ""))}
                        className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C29E30] text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-shadow shadow-xl shadow-[#D4AF37]/10 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {content.ctaText1}
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    )}
                    {content?.ctaText2 && (
                      <motion.button 
                        whileHover={{ scale: 1.04, y: -2, borderColor: "#D4AF37" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNavigate(content.ctaLink2.replace("/", ""))}
                        className="w-full sm:w-auto px-8 py-3.5 bg-slate-900/80 border-2 border-[#D4AF37]/40 text-[#D4AF37] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        {content.ctaText2}
                      </motion.button>
                    )}
                  </motion.div>

                </motion.div>

                {/* Micro Gold Accent Line footer */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
              </section>
            );

          // ==========================================
          // 2. legacy STATS SUMMARY GRID
          // ==========================================
          case "stats":
            return (
              <section key={id} className="w-full py-16 bg-[#030712] relative overflow-hidden" id={`sec-stats-${id}`}>
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
                  
                  {title && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-center space-y-2"
                    >
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">{title}</h2>
                      {subtitle && <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">{subtitle}</p>}
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="stats-numbers-index">
                    {content?.items?.map((item: any, i: number) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1, type: "spring", stiffness: 60 }}
                        whileHover={{ 
                          y: -6, 
                          borderColor: "rgba(214, 175, 55, 0.55)", 
                          boxShadow: "0 12px 24px -10px rgba(214, 175, 55, 0.12)" 
                        }}
                        className="p-5 bg-gradient-to-br from-[#0A192F] to-[#030712] border border-[#D4AF37]/15 rounded-xl shadow-lg space-y-3 relative group"
                      >
                        <div className="absolute top-3 right-3 p-1.5 bg-white/5 border border-white/10 rounded">
                          <Bookmark className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </div>
                        <span className="block text-3xl font-serif font-extrabold text-[#D4AF37] tracking-tight group-hover:scale-105 transition-transform duration-300">
                          {item.value || "97%"}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-white">{item.label}</h4>
                          {item.desc && <p className="text-xs text-gray-400 mt-1">{item.desc}</p>}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                </div>
              </section>
            );

          // ==========================================
          // 3. EDITABLE INFO BLOCKS (LEFT/RIGHT LAYOUTS)
          // ==========================================
          case "infosection":
            const isLeft = content?.layout === "text-left";
            return (
              <section key={id} className="w-full py-20 bg-[#0A192F]/40 relative overflow-hidden" id={`sec-info-${id}`}>
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center`}>
                    
                    {/* Column Image */}
                    <motion.div 
                      initial={{ opacity: 0, x: isLeft ? 35 : -35 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                      className={`lg:col-span-5 ${isLeft ? "lg:order-last" : ""} space-y-3`}
                    >
                      <div className="relative group p-1 bg-gradient-to-r from-[#D4AF37] to-[#1E3A8A] rounded-2xl shadow-2xl">
                        <img 
                          src={content?.imageUrl || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800"} 
                          alt="University Core Landmarks"
                          className="w-full h-[320px] object-cover rounded-xl scale-100 group-hover:scale-[1.01] transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </motion.div>

                    {/* Column Text */}
                    <motion.div 
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="lg:col-span-7 space-y-6"
                    >
                      <div className="space-y-2">
                        <span className="block text-xs uppercase tracking-widest font-mono text-[#D4AF37] font-semibold">Institutional Blueprint</span>
                        <h2 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight text-white">{title}</h2>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
                        {content?.desc || "LS University new delivers high fidelity educational layouts structured to bypass traditional limits."}
                      </p>
                      {content?.buttonText && (
                        <motion.button
                          whileHover={{ x: 6 }}
                          onClick={() => onNavigate(content.buttonLink?.replace("/", "") || "courses")}
                          className="px-6 py-2.5 bg-transparent border-b-2 border-[#D4AF37] hover:border-white text-[#D4AF37] hover:text-white font-mono text-xs uppercase tracking-widest cursor-pointer transition-all flex items-center gap-1"
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
          // 4. PREMIER COURSE CATALOG WITH FILTERS + DETAIL MODAL
          // ==========================================
          case "courses":
            return (
              <section key={id} className="w-full py-16 bg-[#030712] relative overflow-hidden" id={`sec-courses-${id}`}>
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
                  
                  {title && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-center space-y-2"
                    >
                      <h2 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white block to-[#D4AF37]">{title}</h2>
                      {subtitle && <p className="text-xs text-gray-400 max-w-xl mx-auto leading-relaxed">{subtitle}</p>}
                    </motion.div>
                  )}

                  {/* Level filters tabs */}
                  <div className="flex justify-center gap-2" id="course-filter-triggers">
                    {(["ALL", "UG", "PG", "PhD"] as const).map((lvl) => (
                      <motion.button
                        key={lvl}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setCourseFilter(lvl)}
                        className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer uppercase tracking-wider ${
                          courseFilter === lvl
                            ? "bg-[#D4AF37] text-black border-[#D4AF37] font-extrabold shadow"
                            : "border-[#D4AF37]/20 text-gray-400 hover:text-white hover:border-[#D4AF37]/50"
                        }`}
                      >
                        {lvl === "ALL" ? "All Pathways" : lvl}
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
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.92, y: 12 }}
                          whileHover={{ 
                            y: -6, 
                            borderColor: "rgba(212, 175, 55, 0.5)",
                            boxShadow: "0 12px 24px -10px rgba(212, 175, 55, 0.15)"
                          }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="bg-[#0A192F]/60 border border-[#D4AF37]/15 rounded-xl p-6 shadow-xl transition-colors flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                              <span className="text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded font-bold">{crs.code}</span>
                              <span className="bg-slate-800 text-white px-2 py-0.5 rounded font-semibold">{crs.level}</span>
                            </div>
                            <h3 className="text-base font-bold text-white tracking-tight line-clamp-1">{crs.name}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{crs.description}</p>
                          </div>

                          <div className="pt-4 border-t border-[#D4AF37]/10 space-y-3">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-400">Fees:</span>
                              <span className="font-bold text-[#D4AF37]">{crs.fees}</span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedCourse(crs)}
                              className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-xs font-semibold border border-[#D4AF37]/35 text-[#D4AF37] hover:text-white rounded transition-colors cursor-pointer text-center block"
                            >
                              Explore Syllabus & Eligibility
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
                      className="fixed inset-0 z-50 bg-[#030712]/92 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.93, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.93, y: 20 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-2xl bg-[#0A192F] border-2 border-[#D4AF37] text-white rounded-xl shadow-2xl overflow-hidden relative"
                      >
                        
                        <div className="p-6 bg-slate-950 border-b border-[#D4AF37]/20 flex justify-between items-center">
                          <div>
                            <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded font-bold mr-2">{selectedCourse.code}</span>
                            <span className="text-[10px] uppercase font-mono tracking-widest bg-slate-800 text-white px-2 py-0.5 rounded font-bold">{selectedCourse.level}</span>
                            <h3 className="text-lg font-bold text-white mt-2">{selectedCourse.name}</h3>
                          </div>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedCourse(null)}
                            className="p-1 px-2.5 bg-slate-900 border border-[#D4AF37]/30 text-xs text-[#D4AF37] rounded hover:bg-white/5 cursor-pointer"
                          >
                            ✕
                          </motion.button>
                        </div>

                        <div className="p-6 space-y-5 text-sm overflow-y-auto max-h-[70vh]">
                          <div className="space-y-1">
                            <h4 className="text-xs uppercase font-mono text-[#D4AF37] font-semibold">Eligibility Requirements</h4>
                            <p className="text-gray-300 leading-relaxed text-xs">{selectedCourse.eligibility}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 border-y border-[#D4AF37]/10 py-4 text-xs font-mono">
                            <div>
                              <span className="text-gray-400 block mb-0.5">Duration</span>
                              <span className="text-white font-bold text-sm flex items-center gap-1"><Clock className="w-4 h-4 text-[#D4AF37]" /> {selectedCourse.duration}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block mb-0.5">Tuition Fees</span>
                              <span className="text-[#D4AF37] font-bold text-sm">{selectedCourse.fees}</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-xs uppercase font-mono text-[#D4AF37] font-semibold">Specialization Streams Offered</h4>
                            <div className="flex flex-wrap gap-2 text-xs">
                              {selectedCourse.branches && selectedCourse.branches.length > 0 ? (
                                selectedCourse.branches.map((b, i) => (
                                  <span key={i} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-slate-300">
                                    {b}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-gray-500 italic">Continuous core multidisciplinary thesis stream.</span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-xs uppercase font-mono text-[#D4AF37] font-semibold font-bold">Academic Description</h4>
                            <p className="text-gray-300 leading-relaxed text-xs max-w-2xl">{selectedCourse.description}</p>
                          </div>

                          <div className="pt-4 border-t border-white/5">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => { setSelectedCourse(null); onNavigate("contact"); }}
                              className="w-full py-3 bg-[#D4AF37] hover:bg-[#C29E30] text-black font-bold uppercase tracking-wider text-xs rounded-lg text-center cursor-pointer block"
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
          // 5. BULLET BOARD ADMINISTRATION BULLETIN NOTICES
          // ==========================================
          case "notices":
            const topNotices = notices.slice(0, content?.limit || 4);
            return (
              <section key={id} className="w-full py-16 bg-[#0A192F]/40 relative overflow-hidden" id={`sec-notices-${id}`}>
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
                  
                  {title && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-center space-y-2"
                    >
                      <h2 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white block to-[#D4AF37]">{title}</h2>
                      {subtitle && <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">{subtitle}</p>}
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
                          className="bg-[#030712] border border-[#D4AF37]/15 hover:border-[#D4AF37]/35 rounded-xl overflow-hidden transition-all shadow-md"
                        >
                          <div 
                            onClick={() => setExpandedNoticeId(isExpanded ? null : notice.id)}
                            className="p-5 flex justify-between items-center cursor-pointer text-left focus:outline-none"
                          >
                            <div className="space-y-1.5 flex-1 pr-6">
                              <div className="flex items-center gap-3 text-[10px] font-mono">
                                <span className={`px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                                  notice.priority === "High" ? "bg-rose-950 text-rose-300 animate-pulse border border-rose-500/30" : "bg-slate-850 text-[#D4AF37]"
                                }`}>
                                  {notice.category}
                                </span>
                                <span className="text-gray-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {notice.date}</span>
                              </div>
                              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">{notice.title}</h3>
                            </div>
                            <span className="text-xs font-mono font-bold text-[#D4AF37] hover:text-white shrink-0">
                              {isExpanded ? "COLLAPSE" : "READ FULL"}
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
                                <div className="p-6 bg-slate-900/55 border-t border-white/5 space-y-3">
                                  <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">{notice.description}</p>
                                  <div className="pt-2">
                                    <a 
                                      href="#downloads" 
                                      onClick={(e) => { e.preventDefault(); console.log("Preparing PDF Package...") }}
                                      className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:text-white font-mono font-bold"
                                    >
                                      <FileText className="w-3.5 h-3.5" /> Download Attached Dossier (PDF)
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
          // 6. RECRUITER BRANDING corridors
          // ==========================================
          case "placements":
            return (
              <section key={id} className="w-full py-16 bg-[#030712] relative overflow-hidden" id={`sec-placements-${id}`}>
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
                  
                  {title && (
                    <div className="text-center space-y-2">
                      <h2 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white block to-[#D4AF37]">{title}</h2>
                      {subtitle && <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">{subtitle}</p>}
                    </div>
                  )}

                  {/* recruiter lists */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center border-b border-[#D4AF37]/15 pb-10" id="corporate-partners">
                    {["Google India", "AWS Research", "Microsoft Redmond", "NVIDIA Corp", "Intel Staging", "Deloitte strategy", "Morgan Stanley", "Oracle Tech"].map((partner, i) => (
                      <div 
                        key={i} 
                        className="py-6 px-4 bg-[#0A192F]/40 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 rounded-xl text-center shadow font-mono font-bold tracking-widest text-xs text-gray-400 hover:text-white transition-all cursor-default"
                      >
                        {partner.toUpperCase()}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest font-mono text-[#D4AF37] text-center font-bold">Hall of Fame Recruits</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {DEMO_PLACEMENTS.map((rec, i) => (
                        <div key={i} className="bg-[#0A192F]/50 border border-white/5 rounded-xl p-5 text-center space-y-3 shadow shadow-xl">
                          <img 
                            src={rec.image} 
                            alt={rec.studentName} 
                            className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-[#D4AF37]"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-white">{rec.studentName}</h4>
                            <p className="text-[10px] text-gray-500 font-mono mt-0.5">{rec.course}</p>
                          </div>
                          <div className="bg-slate-900 border border-[#D4AF37]/20 p-2 rounded">
                            <span className="block text-[10px] uppercase text-[#D4AF37] font-semibold">Salary Package</span>
                            <span className="block text-sm font-mono font-bold text-white">{rec.package}</span>
                          </div>
                          <p className="text-xs font-semibold text-[#D4AF37]/90">{rec.companyName}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </section>
            );

          // ==========================================
          // 7. CLIENT TESTIMONIAL PANEL
          // ==========================================
          case "testimonials":
            return (
              <section key={id} className="w-full py-16 bg-[#0A192F]/30 relative overflow-hidden font-sans" id={`sec-test-${id}`}>
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
                  
                  {title && (
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#D4AF37] block uppercase">{title}</h2>
                      {subtitle && <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">{subtitle}</p>}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {content?.items?.map((item: any, i: number) => (
                      <div 
                        key={i} 
                        className="p-8 bg-[#030712]/80 border border-white/5 rounded-2xl relative shadow-xl space-y-6 flex flex-col justify-between"
                      >
                        {/* Quote mark visual placeholder */}
                        <span className="absolute top-4 right-4 text-6xl font-serif text-[#D4AF37]/10 select-none">“</span>
                        
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic relative z-10">
                          "{item.text || "Direct testimonial outlining educational paradigm gains."}"
                        </p>

                        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]/50 shadow"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white">{item.name}</h4>
                            <p className="text-[10px] text-gray-500 font-mono mt-0.5">{item.designation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </section>
            );

          // ==========================================
          // 8. ADMISSIONS CONTACT FORM 
          // ==========================================
          case "contact":
            return (
              <section key={id} className="w-full py-16 bg-[#030712] relative overflow-hidden" id={`sec-contact-${id}`}>
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
                    
                    {/* Visual left contact widget */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="space-y-2">
                        <span className="block text-xs uppercase tracking-widest font-mono text-[#D4AF37]">Consultation Center</span>
                        <h2 className="text-3xl font-serif font-extrabold tracking-tight text-white">{title || "Admissions Desk"}</h2>
                        {subtitle && <p className="text-xs text-gray-400 capitalize">{subtitle}</p>}
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-md">
                        Submit your academic credentials and clear the preliminary review. An official academic coordinator will be assigned to guide you on syllabus pathways and fee schedules.
                      </p>

                      <div className="space-y-4 pt-2 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/5 border border-white/10 rounded">
                            <Phone className="w-4 h-4 text-[#D4AF37]" />
                          </div>
                          <span>+91-11-4920-3022 | Executive Helpline</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/5 border border-white/10 rounded">
                            <Mail className="w-4 h-4 text-[#D4AF37]" />
                          </div>
                          <span>admissions@lsuniversity.edu.in</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive validation form */}
                    <div className="lg:col-span-7">
                      <div className="bg-[#0A192F]/80 border border-[#D4AF37]/35 p-6 sm:p-8 rounded-2xl shadow-2xl relative">
                        
                        {isSubmitted ? (
                          <div className="py-12 text-center space-y-4 animate-scaleIn">
                            <div className="w-12 h-12 bg-emerald-950/40 border border-emerald-500 rounded-full flex items-center justify-center mx-auto">
                              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white uppercase font-mono tracking-wider">Candidate Registry Recorded</h3>
                            <p className="text-xs text-emerald-200/90 max-w-sm mx-auto">
                              Your academic profile has been logged in Admissions database. Consultation ticket coordinates sent to email: <strong className="text-white">{contactForm.email}</strong>.
                            </p>
                          </div>
                        ) : (
                          <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-gray-400 mb-1">Student Full Name</label>
                                <input 
                                  type="text" 
                                  value={contactForm.name}
                                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                                  placeholder="Candidate Name"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-gray-400 mb-1">Communication Email</label>
                                <input 
                                  type="email" 
                                  value={contactForm.email}
                                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                                  placeholder="name@gmail.com"
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-gray-400 mb-1">Mobile Hotline Phone</label>
                                <input 
                                  type="tel" 
                                  value={contactForm.phone}
                                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                                  placeholder="+91-"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-[#9CA3AF] mb-1">Preferred Program Stream</label>
                                <select 
                                  value={contactForm.course}
                                  onChange={(e) => setContactForm({ ...contactForm, course: e.target.value })}
                                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                                >
                                  {courses.map((crs) => (
                                    <option key={crs.id} value={crs.code}>{crs.name} ({crs.code})</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-gray-400 mb-1">Brief Academic summary / inquiries</label>
                              <textarea 
                                value={contactForm.message}
                                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                className="w-full h-24 bg-slate-950 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                                placeholder="Detail scores (e.g. JEE percentile), questions regarding hostel services or fee schedules."
                                required
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full py-3 bg-[#D4AF37] hover:bg-[#C29E30] text-black font-extrabold uppercase tracking-widest text-[11px] rounded-lg transition-all flex justify-center items-center gap-1.5 shadow shadow-lg hover:scale-[1.01] cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" /> Submit Admission Application
                            </button>
                          </form>
                        )}

                      </div>
                    </div>

                  </div>
                </div>
              </section>
            );

          default:
            return null;
        }

      })}
    </div>
  );
}
