import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, FileText, GraduationCap, Award, Image, Settings, 
  Plus, Trash2, ArrowUp, ArrowDown, Copy, CheckCircle2, Lock, Unlock, 
  RefreshCw, LogOut, FilePlus, Eye, Save, Globe, Info, Edit, Folder,
  Database, ShieldCheck, Mail, Phone, MapPin, Volume2, Users, FileSpreadsheet
} from "lucide-react";
import { auth, db, handleFirestoreError, OperationType, firebaseMetadata, isDevMode } from "../firebase";
import { 
  signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword
} from "firebase/auth";
import { 
  collection, doc, setDoc, getDocs, deleteDoc, updateDoc, writeBatch, onSnapshot
} from "firebase/firestore";
import { 
  SiteConfig, PageData, Course, Certificate, MediaItem, PageSection, Notice 
} from "../types";
import { 
  DEFAULT_SITE_CONFIG, DEFAULT_PAGES, DEMO_COURSES, DEMO_CERTIFICATES, DEMO_NOTICES, DEMO_MEDIA_ITEMS, DEMO_PLACEMENTS 
} from "../demoData";

interface AdminDashboardProps {
  onSiteConfigUpdate: (config: SiteConfig) => void;
  onPagesUpdate: (pages: PageData[]) => void;
  onCoursesUpdate: (courses: Course[]) => void;
  onCertificatesUpdate: (certs: Certificate[]) => void;
  siteConfig: SiteConfig;
  allPages: PageData[];
  courses: Course[];
  certificates: Certificate[];
  notices: Notice[];
  onNoticesUpdate: (notices: Notice[]) => void;
}

export default function AdminDashboard({
  onSiteConfigUpdate,
  onPagesUpdate,
  onCoursesUpdate,
  onCertificatesUpdate,
  siteConfig,
  allPages,
  courses,
  certificates,
  notices,
  onNoticesUpdate
}: AdminDashboardProps) {
  
  // Auth States
  const [user, setUser] = useState<any>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // CMS Interface Tab
  const [activeTab, setActiveTab] = useState<"summary" | "pages" | "config" | "courses" | "certs" | "media" | "notices">("summary");
  
  // Feedback States
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Entity selection for page builder
  const [selectedPageId, setSelectedPageId] = useState<string>("home");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // New item modal states
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");

  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    name: "", code: "", level: "UG", duration: "4 Years", eligibility: "", fees: "", description: "", branches: []
  });

  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [newCert, setNewCert] = useState<Partial<Certificate>>({
    certificateNo: "", enrollmentNo: "", studentName: "", course: "", grade: "9.0 CGPA", status: "Verified", remarks: ""
  });

  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [newNotice, setNewNotice] = useState<Partial<Notice>>({
    title: "", category: "Academic", date: new Date().toISOString().split('T')[0], priority: "Normal", description: "", published: true
  });

  const [mediaItemUrl, setMediaItemUrl] = useState("");
  const [mediaItemFolder, setMediaItemFolder] = useState<any>("Gallery");
  const [mediaItemName, setMediaItemName] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (curr) => {
      if (curr) {
        setUser(curr);
        setIsAdminMode(true);
      } else {
        setUser(null);
        setIsAdminMode(false);
      }
      setIsInitializing(false);
    });
    return () => unsub();
  }, []);

  const triggerNotify = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => setActiveNotification(null), 3000);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setAuthError("Please fill in all credentials.");
      return;
    }
    setIsAuthLoading(true);
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      triggerNotify("Successful administration validation.");
    } catch (err: any) {
      console.error("Login failure: ", err);
      let errorMsg = "Credentials mismatch or unauthorized administrator.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        errorMsg = "Invalid Email ID or Password. Access Denied.";
      } else if (err.code === "auth/invalid-email") {
        errorMsg = "Please enter a valid administrative Email ID.";
      } else if (err?.message) {
        errorMsg = err.message;
      }
      setAuthError(errorMsg);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setUser(null);
    setIsAdminMode(false);
    triggerNotify("Administrative session terminated.");
  };

  // --- SEED DATABASE UTILITY (RESTORING DEMO DATA IN FIRESTORE FOR ZERO CONFIG STARTS) ---
  const handleRestoreDemoContent = async () => {
    setIsSyncing(true);
    try {
      // 1. Site Config Set Doc
      await setDoc(doc(db, "site_config", "main_settings"), siteConfig || DEFAULT_SITE_CONFIG);
      onSiteConfigUpdate(DEFAULT_SITE_CONFIG);

      // 2. Courses Catalog loop
      for (const crs of DEMO_COURSES) {
        await setDoc(doc(db, "courses", crs.id), crs);
      }
      onCoursesUpdate(DEMO_COURSES);

      // 3. Certificates Registry loop
      for (const cert of DEMO_CERTIFICATES) {
        await setDoc(doc(db, "certificates", cert.id), cert);
      }
      onCertificatesUpdate(DEMO_CERTIFICATES);

      // 4. Notices
      for (const n of DEMO_NOTICES) {
        await setDoc(doc(db, "notices", n.id), n);
      }
      onNoticesUpdate(DEMO_NOTICES);

      // 5. Pages loop
      for (const pg of DEFAULT_PAGES) {
        await setDoc(doc(db, "pages", pg.id), pg);
      }
      onPagesUpdate(DEFAULT_PAGES);

      triggerNotify("Firestore populated with premier templates.");
    } catch (error) {
      console.error(error);
      triggerNotify("Sync failure: Configure Firestore Rules first.");
    } finally {
      setIsSyncing(false);
    }
  };

  // --- PAGE BUILDER CRUD ---
  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle || !newPageSlug) return;
    
    setIsSyncing(true);
    const slugPlain = newPageSlug.replace(/\//g, "").trim().toLowerCase();
    const cleanId = `page-${slugPlain || "home"}-${Date.now().toString().slice(-4)}`;
    
    const newPage: PageData = {
      id: cleanId,
      title: newPageTitle,
      slug: slugPlain,
      seoTitle: `${newPageTitle} | LS University new`,
      seoDesc: `LS University new dynamic information page for ${newPageTitle}`,
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          id: `sec-${cleanId}-hero`,
          type: "hero",
          title: newPageTitle,
          subtitle: "DYNAMIC PORTAL SECTION",
          content: {
            tagline: "Feel free to customize this layout from the admin page builder panel.",
            bgImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200",
            ctaText1: "Home Base",
            ctaLink1: "/"
          }
        }
      ]
    };

    try {
      await setDoc(doc(db, "pages", cleanId), newPage);
      const updatedPages = [...allPages, newPage];
      onPagesUpdate(updatedPages);
      setShowAddPageModal(false);
      setNewPageTitle("");
      setNewPageSlug("");
      setSelectedPageId(cleanId);
      triggerNotify(`Page ${newPageTitle} engineered successfully.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `pages/${cleanId}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (pageId === "home") {
      triggerNotify("Deleting the home slug page is locked for safety.");
      return;
    }
    if (!window.confirm("Delete this page and all associated sections?")) return;

    setIsSyncing(true);
    try {
      await deleteDoc(doc(db, "pages", pageId));
      const res = allPages.filter(p => p.id !== pageId);
      onPagesUpdate(res);
      setSelectedPageId("home");
      triggerNotify("Page wiped from campus directory.");
    } catch (e) {
      triggerNotify("Failed to delete page document.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDuplicatePage = async (srcPage: PageData) => {
    setIsSyncing(true);
    const newId = `page-copy-${Date.now().toString().slice(-4)}`;
    const duplicate: PageData = {
      ...srcPage,
      id: newId,
      title: `${srcPage.title} (Copy)`,
      slug: `${srcPage.slug}-copy`,
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "pages", newId), duplicate);
      onPagesUpdate([...allPages, duplicate]);
      triggerNotify("Dynamic clone created.");
    } catch (e) {
      triggerNotify("Cloning exception raised.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleTogglePublishPage = async (page: PageData) => {
    setIsSyncing(true);
    try {
      await updateDoc(doc(db, "pages", page.id), { published: !page.published });
      const patch = allPages.map(p => p.id === page.id ? { ...p, published: !p.published } : p);
      onPagesUpdate(patch);
      triggerNotify(`Status updated: ${!page.published ? "Live" : "Draft"}`);
    } catch (e) {
      triggerNotify("Publishing toggle failure.");
    } finally {
      setIsSyncing(false);
    }
  };

  // --- SECTION BUILDER (DRAG & DROP SWAPPING RE-ARRANGERS) ---
  const activePage = allPages.find(p => p.id === selectedPageId) || allPages[0];

  const handleSavePageContent = async (updatedPage: PageData) => {
    setIsSyncing(true);
    try {
      await setDoc(doc(db, "pages", updatedPage.id), updatedPage);
      const res = allPages.map(p => p.id === updatedPage.id ? updatedPage : p);
      onPagesUpdate(res);
      triggerNotify("Section configuration committed to Cloud Firestore.");
    } catch (e) {
      triggerNotify("Failed to write to database.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    if (!activePage) return;
    const list = [...activePage.sections];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    // Swap positions
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const modifiedPage = { ...activePage, sections: list, updatedAt: new Date().toISOString() };
    handleSavePageContent(modifiedPage);
  };

  const handleDuplicateSection = (index: number) => {
    if (!activePage) return;
    const list = [...activePage.sections];
    const original = list[index];
    const clone: PageSection = {
      ...original,
      id: `sec-clone-${Date.now().toString().slice(-4)}`,
      title: original.title ? `${original.title} (Clone)` : undefined
    };
    list.splice(index + 1, 0, clone);
    
    const modifiedPage = { ...activePage, sections: list, updatedAt: new Date().toISOString() };
    handleSavePageContent(modifiedPage);
  };

  const handleRemoveSection = (index: number) => {
    if (!activePage) return;
    if (activePage.sections.length <= 1) {
      triggerNotify("A page must possess at least one layout section.");
      return;
    }
    if (!window.confirm("Remove this section?")) return;

    const list = activePage.sections.filter((_, idx) => idx !== index);
    const modifiedPage = { ...activePage, sections: list, updatedAt: new Date().toISOString() };
    setSelectedSectionId(null);
    handleSavePageContent(modifiedPage);
  };

  const handleAddSection = (type: any) => {
    if (!activePage) return;
    
    let defaultContent = {};
    switch (type) {
      case "hero":
        defaultContent = { tagline: "New Hero Layout Statement", bgImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200", ctaText1: "Explore", ctaLink1: "/" };
        break;
      case "stats":
        defaultContent = { items: [{ label: "Metric Stat Score", value: "100%", desc: "Sample dynamic data tracker" }] };
        break;
      case "infosection":
        defaultContent = { desc: "Custom paragraph edit detailing institutional paradigms.", imageUrl: "https://images.unsplash.com/photo-1521791136368-1a46827d0515?w=800", layout: "text-left", buttonText: "Information link", buttonLink: "/" };
        break;
      case "testimonials":
        defaultContent = { items: [{ name: "Review Author", designation: "Graduate Class", rating: 5, text: "Truly empowering experience", image: "" }] };
        break;
      default:
        defaultContent = { limit: 4 };
    }

    const newSec: PageSection = {
      id: `sec-${type}-${Date.now().toString().slice(-4)}`,
      type,
      title: `Dynamic ${type.toUpperCase()} Section`,
      content: defaultContent
    };

    const modifiedPage = {
      ...activePage,
      sections: [...activePage.sections, newSec],
      updatedAt: new Date().toISOString()
    };
    handleSavePageContent(modifiedPage);
  };

  // --- PROGRAM COURSE CRUD ---
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.name || !newCourse.code) return;

    setIsSyncing(true);
    const cid = `course-${newCourse.code.toLowerCase().replace(/\s+/g, '-')}`;
    const cleanCourse: Course = {
      id: cid,
      name: newCourse.name,
      code: newCourse.code,
      level: (newCourse.level as any) || "UG",
      duration: newCourse.duration || "4 Years",
      eligibility: newCourse.eligibility || "Standard qualification metrics",
      fees: newCourse.fees || "₹1,00,000 per year",
      description: newCourse.description || "Course description text goes here",
      branches: newCourse.branches || []
    };

    try {
      await setDoc(doc(db, "courses", cid), cleanCourse);
      onCoursesUpdate([...courses, cleanCourse]);
      setShowAddCourseModal(false);
      setNewCourse({ name: "", code: "", level: "UG", duration: "4 Years", eligibility: "", fees: "", description: "" });
      triggerNotify("Program integrated into degree schema.");
    } catch (e) {
      triggerNotify("Exception writing course.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm("Remove this degree program permanently?")) return;
    setIsSyncing(true);
    try {
      await deleteDoc(doc(db, "courses", courseId));
      onCoursesUpdate(courses.filter(c => c.id !== courseId));
      triggerNotify("Course purged.");
    } catch (e) {
      triggerNotify("Removal failure.");
    } finally {
      setIsSyncing(false);
    }
  };

  // --- CERTIFICATE REGISTRY CRUD ---
  const handleAddCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.certificateNo || !newCert.enrollmentNo || !newCert.studentName) return;

    setIsSyncing(true);
    const certid = `cert-${newCert.certificateNo.toLowerCase().replace(/\//g, "-")}`;
    const finalCert: Certificate = {
      id: certid,
      certificateNo: newCert.certificateNo,
      enrollmentNo: newCert.enrollmentNo,
      studentName: newCert.studentName,
      course: newCert.course || "Degree program",
      issueDate: newCert.issueDate || new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
      grade: newCert.grade || "9.0 CGPA",
      status: (newCert.status as any) || "Verified",
      qrCodeValue: `${newCert.certificateNo}|${newCert.enrollmentNo}|${newCert.studentName}|Verified|LS University new Security Registry`,
      remarks: newCert.remarks || ""
    };

    try {
      await setDoc(doc(db, "certificates", certid), finalCert);
      onCertificatesUpdate([...certificates, finalCert]);
      setShowAddCertModal(false);
      setNewCert({ certificateNo: "", enrollmentNo: "", studentName: "", course: "", grade: "9.0 CGPA", status: "Verified" });
      triggerNotify("Academic Certificate uploaded.");
    } catch (e) {
      triggerNotify("Upload conflict.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteCert = async (id: string) => {
    if (!window.confirm("Revoke / Delete this student credential parameter?")) return;
    setIsSyncing(true);
    try {
      await deleteDoc(doc(db, "certificates", id));
      onCertificatesUpdate(certificates.filter(c => c.id !== id));
      triggerNotify("Certificate removed.");
    } catch (e) {
      triggerNotify("Deletion error.");
    } finally {
      setIsSyncing(false);
    }
  };

  // --- NOTICES BULLENTIN CRUD ---
  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.description) return;
    setIsSyncing(true);
    const nid = `notice-${Date.now()}`;
    const noticeObj: Notice = {
      id: nid,
      title: newNotice.title,
      category: newNotice.category || "Academic",
      date: newNotice.date || new Date().toISOString().split('T')[0],
      priority: newNotice.priority || "Normal",
      description: newNotice.description,
      published: true
    };
    try {
      await setDoc(doc(db, "notices", nid), noticeObj);
      onNoticesUpdate([noticeObj, ...notices]);
      setShowAddNoticeModal(false);
      setNewNotice({ title: "", category: "Academic", priority: "Normal", description: "" });
      triggerNotify("Administration announcement registered.");
    } catch (e) {
      triggerNotify("Publish trigger failed.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!window.confirm("Remove this announcement permanently?")) return;
    setIsSyncing(true);
    try {
      await deleteDoc(doc(db, "notices", id));
      onNoticesUpdate(notices.filter(n => n.id !== id));
      triggerNotify("Notice scrubbed.");
    } catch (e) {
      triggerNotify("Exception triggered.");
    } finally {
      setIsSyncing(false);
    }
  };

  // --- GLOBAL SITE CONFIG UPDATER ---
  const handleSaveGlobalConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    try {
      await setDoc(doc(db, "site_config", "main_settings"), siteConfig);
      onSiteConfigUpdate(siteConfig);
      triggerNotify("Site-wide configuration compiled.");
    } catch (e) {
      triggerNotify("Firestore configuration write block.");
    } finally {
      setIsSyncing(false);
    }
  };


  if (isInitializing) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#030712] text-white">
        <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin mb-4" />
        <span className="text-xs font-mono tracking-widest text-[#D4AF37] animate-pulse">RESTORING SECURE CMS ADMINISTRATION NODE...</span>
      </div>
    );
  }

  // If admin not verified, present high-fidelity login lock visual
  if (!isAdminMode) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-[#030712] py-12 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden" id="admin-login-lockscreen">
        
        {/* Ambient background accent clouds */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-slate-900/40 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-md w-full space-y-6 bg-[#0A192F]/80 backdrop-blur-md p-8 sm:p-10 rounded-2xl border border-[#D4AF37]/35 shadow-2xl relative z-10">
          
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center animate-pulse">
              <Lock className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#D4AF37] uppercase font-serif">
              CMS ADMINISTRATIVE ACCESS
            </h2>
            <p className="text-xs text-gray-400 font-mono">
              LS University new Portal Centralized CMS Gateway
            </p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4" id="admin-login-credentials-form">
            
            {authError && (
              <div className="p-3.5 bg-red-950/40 border border-red-500/30 text-rose-300 rounded-lg text-xs leading-relaxed font-mono">
                {authError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label htmlFor="login-email" className="block text-xs uppercase tracking-widest text-[#9CA3AF] mb-1 font-mono">
                  Email Address
                </label>
                <input 
                  id="login-email"
                  type="email" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-[#D4AF37]/20 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all font-mono"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-xs uppercase tracking-widest text-[#9CA3AF] mb-1 font-mono">
                  Password
                </label>
                <input 
                  id="login-password"
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-[#D4AF37]/20 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all font-mono"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#D4AF37] to-[#C29E30] hover:scale-[1.01] active:scale-[0.99] text-black font-extrabold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#D4AF37]/10 cursor-pointer disabled:opacity-50"
            >
              {isAuthLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  AUTHENTICATING CREDENTIALS...
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  LOG IN TO DASHBOARD
                </>
              )}
            </button>

          </form>

          <p className="text-center text-[10px] text-gray-500 font-mono uppercase tracking-widest border-t border-white/5 pt-4">
            Security Status: Zero Trust Verified Gateway
          </p>

        </div>
      </div>
    );
  }

  // --- RENDERING FULL ACTIVE CMS CONTROL PANEL ---
  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col lg:flex-row relative" id="admin-cms-workspace">
      
      {/* Toast Notification Box */}
      {activeNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A192F] border-2 border-[#D4AF37] text-white text-xs font-mono px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2 animate-slideIn" id="admin-toast">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37] animate-spin" />
          <span>{activeNotification}</span>
        </div>
      )}

      {/* Admin Sidebar Control Board */}
      <aside className="w-full lg:w-72 bg-[#0A192F]/90 border-b lg:border-b-0 lg:border-r border-[#D4AF37]/20 flex flex-col shrink-0" id="admin-sidebar">
        {/* Banner */}
        <div className="p-6 border-b border-[#D4AF37]/20 bg-[#030712]/50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-sm font-bold font-mono tracking-wider text-[#D4AF37]">LS SECURE CMS</span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono mt-0.5 line-clamp-1">{user?.email}</p>
          </div>
          <button 
            onClick={handleSignOut}
            className="p-1.5 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer border border-white/5 rounded hover:bg-white/5"
            title="Sign out of Admin session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Sync Indicator */}
        <div className="px-6 py-3 border-b border-[#D4AF37]/10 bg-slate-900/40 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className={`w-2 h-2 rounded-full ${isSyncing ? "bg-amber-500 animate-ping" : "bg-[#D4AF37]"}`} />
            Firestore Sync
          </span>
          <button
            onClick={handleRestoreDemoContent}
            className="text-[10px] tracking-widest text-[#D4AF37] flex items-center gap-1 font-mono font-bold hover:scale-105 transition-all"
            title="Populate dynamic template collections to empty firestore"
          >
            <RefreshCw className="w-3 h-3" /> SEED DEMO
          </button>
        </div>

        {/* Tab Selection */}
        <nav className="p-4 flex-1 space-y-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab("summary")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all ${
              activeTab === "summary" ? "bg-[#D4AF37] text-black shadow-lg" : "text-gray-300 hover:bg-white/5"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Staging Summary
          </button>

          <button
            onClick={() => setActiveTab("pages")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all ${
              activeTab === "pages" ? "bg-[#D4AF37] text-black shadow-lg" : "text-gray-300 hover:bg-white/5"
            }`}
          >
            <FileText className="w-4 h-4" /> Dynamic Page Builder
          </button>

          <button
            onClick={() => setActiveTab("config")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all ${
              activeTab === "config" ? "bg-[#D4AF37] text-black shadow-lg" : "text-gray-300 hover:bg-white/5"
            }`}
          >
            <Settings className="w-4 h-4" /> Site Identity & Menus
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all ${
              activeTab === "courses" ? "bg-[#D4AF37] text-black shadow-lg" : "text-gray-300 hover:bg-white/5"
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Degree Catalogue
          </button>

          <button
            onClick={() => setActiveTab("certs")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all ${
              activeTab === "certs" ? "bg-[#D4AF37] text-black shadow-lg" : "text-gray-300 hover:bg-white/5"
            }`}
          >
            <Award className="w-4 h-4" /> Academic Credentials
          </button>

          <button
            onClick={() => setActiveTab("notices")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all ${
              activeTab === "notices" ? "bg-[#D4AF37] text-black shadow-lg" : "text-gray-300 hover:bg-white/5"
            }`}
          >
            <Volume2 className="w-4 h-4" /> Bulletin Announcements
          </button>
        </nav>
      </aside>

      {/* Main CMS Tab panels */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto" id="admin-main-panel">
        
        {/* --- SUMMARY STAGE --- */}
        {activeTab === "summary" && (
          <div className="space-y-8 animate-fadeIn" id="cms-summary-tab">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D4AF37]/20 pb-6">
              <div>
                <h1 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white block to-[#D4AF37]">
                  ADMINISTRATION SUMMARY
                </h1>
                <p className="text-xs text-gray-400 font-mono mt-1">Real-time status metrics of LS University new dynamic database nodes.</p>
              </div>
              <div className="text-xs font-mono bg-slate-900 border border-[#D4AF37]/20 rounded px-3 py-1.5 flex items-center gap-1.5 text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Active Schema: v1.0.4 Web Flow
              </div>
            </div>

            {/* Quick dashboard figures */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 bg-[#0B1B3D]/40 border border-[#D4AF37]/10 rounded-xl space-y-2">
                <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">Dynamic Pages</span>
                <span className="block text-2xl font-bold font-serif text-[#D4AF37]">{allPages.length}</span>
              </div>
              <div className="p-5 bg-[#0B1B3D]/40 border border-[#D4AF37]/10 rounded-xl space-y-2">
                <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">Degrees Offered</span>
                <span className="block text-2xl font-bold font-serif text-[#D4AF37]">{courses.length}</span>
              </div>
              <div className="p-5 bg-[#0B1B3D]/40 border border-[#D4AF37]/10 rounded-xl space-y-2">
                <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">Issued Credentials</span>
                <span className="block text-2xl font-bold font-serif text-[#D4AF37]">{certificates.length}</span>
              </div>
              <div className="p-5 bg-[#0B1B3D]/40 border border-[#D4AF37]/10 rounded-xl space-y-2">
                <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">Active Bulletins</span>
                <span className="block text-2xl font-bold font-serif text-[#D4AF37]">{notices.length}</span>
              </div>
            </div>

            {/* Active Firebase Connection Node Status */}
            {isDevMode && (
              <div className="p-5 bg-slate-950 border border-[#D4AF37]/20 rounded-xl space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2 border-b border-[#D4AF37]/10 pb-2">
                  <Database className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-sans font-bold text-white uppercase tracking-wider text-[11px]">Active Firebase Node Integration</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-gray-300">
                  <div className="flex items-center justify-between p-2 bg-[#0B1B3D]/15 border border-white/5 rounded">
                    <span className="text-gray-400">Firebase Project ID:</span>
                    <span className="text-white font-bold">{firebaseMetadata.projectId}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#0B1B3D]/15 border border-white/5 rounded">
                    <span className="text-gray-400">Firestore Database:</span>
                    <span className="text-[#D4AF37] font-bold">{firebaseMetadata.databaseName}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-500 pt-1">
                  <span>Verification State: Secure default listener active</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> Connected & Active</span>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-[#0B1B3D]/30 to-[#030712] border border-[#D4AF37]/20 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#D4AF37] flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                Zero-Code Staging Integration
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                LS University new's layout renders 100% of its content dynamically. When you alter any text, card, list, fee, or notice inside these CMS tab selectors, the live system propagates changes to all connected visitors instantly using Firestore streaming web-hooks. 
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab("pages")}
                  className="px-4 py-2 bg-[#D4AF37] text-black font-bold text-xs rounded hover:bg-[#C29E30] transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Manage Live Pages
                </button>
                <button
                  onClick={handleRestoreDemoContent}
                  className="px-4 py-2 border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-xs rounded hover:bg-[#D4AF37]/10 transition-all cursor-pointer uppercase tracking-wider"
                >
                  Restore Premier Pre-sets
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- PAGES MANAGER --- */}
        {activeTab === "pages" && (
          <div className="space-y-8 animate-fadeIn" id="cms-pages-tab">
            
            {/* Headers and CTAs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#D4AF37]">
                  ADVANCED DYNAMIC PAGE BUILDER
                </h1>
                <p className="text-xs text-gray-400 mt-1">Add, clone, restructure, reorder layouts, or unpublish campus URLs.</p>
              </div>
              <button
                onClick={() => setShowAddPageModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#C29E30] text-black font-bold text-xs rounded uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <FilePlus className="w-4 h-4" /> Create Custom Page
              </button>
            </div>

            {/* Sitemap index selector */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              
              <div className="bg-[#0A192F]/80 border border-[#D4AF37]/20 rounded-xl overflow-hidden shadow-lg">
                <div className="p-3.5 bg-slate-900 border-b border-[#D4AF37]/10 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Sitemap Dynamic Pages
                </div>
                <div className="divide-y divide-white/5">
                  {allPages.map((page) => (
                    <div 
                      key={page.id}
                      onClick={() => { setSelectedPageId(page.id); setSelectedSectionId(null); }}
                      className={`p-3.5 text-xs text-left cursor-pointer transition-all flex justify-between items-center ${
                        selectedPageId === page.id ? "bg-[#D4AF37]/10 border-l-2 border-[#D4AF37] text-[#D4AF37]" : "text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      <div>
                        <div className="font-semibold block">{page.title}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-0.5">/{page.slug}</div>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => handleTogglePublishPage(page)}
                          className={`w-2 h-2 rounded-full ${page.published ? "bg-emerald-500" : "bg-zinc-600"}`}
                          title={page.published ? "Live status and indexable" : "Staged private draft"}
                        />
                        <button
                          onClick={() => handleDuplicatePage(page)}
                          className="p-1 hover:text-[#D4AF37] text-gray-500 grayscale hover:grayscale-0"
                          title="Duplicate sitemap settings and rows"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePage(page.id)}
                          className="p-1 hover:text-rose-500 text-gray-500"
                          title="Purge page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layout Editor Panel (Right) */}
              <div className="md:col-span-3 space-y-6">
                
                {activePage ? (
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-900 border border-[#D4AF37]/25 rounded-xl space-y-4 shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-xs uppercase font-mono tracking-widest text-[#D4AF37] font-bold">PAGE SEO METADATA</span>
                        <span className="text-[10px] font-mono text-gray-400">ID: {activePage.id}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-gray-400 mb-1">Page Title</label>
                          <input 
                            type="text" 
                            value={activePage.title}
                            onChange={(e) => {
                              const updated = { ...activePage, title: e.target.value };
                              handleSavePageContent(updated);
                            }}
                            className="w-full bg-[#030712] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 mb-1">URL slug (Keep empty for home)</label>
                          <input 
                            type="text" 
                            value={activePage.slug}
                            onChange={(e) => {
                              const updated = { ...activePage, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") };
                              handleSavePageContent(updated);
                            }}
                            className="w-full bg-[#030712] border border-white/10 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 mb-1">SEO Page Title Tag</label>
                          <input 
                            type="text" 
                            value={activePage.seoTitle || ""}
                            onChange={(e) => {
                              const updated = { ...activePage, seoTitle: e.target.value };
                              handleSavePageContent(updated);
                            }}
                            className="w-full bg-[#030712] border border-white/10 rounded px-3 py-2 text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 mb-1">SEO Description Tag</label>
                          <input 
                            type="text" 
                            value={activePage.seoDesc || ""}
                            onChange={(e) => {
                              const updated = { ...activePage, seoDesc: e.target.value };
                              handleSavePageContent(updated);
                            }}
                            className="w-full bg-[#030712] border border-white/10 rounded px-3 py-2 text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section Builder Layout list */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm uppercase tracking-wider font-mono text-[#D4AF37] font-bold">Dynamic Layout Structure</h3>
                        <div className="flex gap-2">
                          {["hero", "stats", "infosection", "courses", "notices", "placements", "testimonials", "contact"].map((lay) => (
                            <button
                              key={lay}
                              onClick={() => handleAddSection(lay as any)}
                              className="px-2 py-1.5 bg-slate-900 border border-[#D4AF37]/30 text-[10px] font-mono hover:bg-[#D4AF37]/20 rounded transition-all cursor-pointer text-gray-300"
                            >
                              + {lay.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {activePage.sections.map((sec, idx) => (
                          <div 
                            key={sec.id}
                            className={`p-4 bg-slate-900/60 border border-white/10 rounded-xl flex items-center justify-between shadow ${
                              selectedSectionId === sec.id ? "border-[#D4AF37]/50 ring-1 ring-[#D4AF37]/20" : ""
                            }`}
                          >
                            <div className="space-y-1">
                              <span className="inline-block text-[10px] uppercase tracking-widest font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                                {sec.type}
                              </span>
                              <h4 className="text-xs font-bold text-white mt-1">
                                {sec.title || "Customized Page layout space"}
                              </h4>
                            </div>

                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => handleMoveSection(idx, "up")}
                                className="p-1 hover:text-[#D4AF37] cursor-pointer text-gray-500"
                                title="Move up"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleMoveSection(idx, "down")}
                                className="p-1 hover:text-[#D4AF37] cursor-pointer text-gray-500"
                                title="Move down"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDuplicateSection(idx)}
                                className="p-1 hover:text-emerald-400 cursor-pointer text-gray-500"
                                title="Duplicate layout"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setSelectedSectionId(sec.id)}
                                className="p-1 px-2 text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded transition-all font-semibold font-mono"
                              >
                                EDIT DATA
                              </button>
                              <button 
                                onClick={() => handleRemoveSection(idx)}
                                className="p-1 hover:text-rose-500 cursor-pointer text-gray-500"
                                title="Wipe out"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section field editor (Opens inline at selection) */}
                    {selectedSectionId && (
                      <div className="p-6 bg-slate-950 border-2 border-[#D4AF37] rounded-xl space-y-6 shadow-2xl animate-fadeIn">
                        {(() => {
                          const secToEdit = activePage.sections.find(s => s.id === selectedSectionId);
                          if (!secToEdit) return <p className="text-xs text-gray-400">Loading editor node...</p>;

                          return (
                            <div className="space-y-4 text-xs">
                              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                <h3 className="text-xs font-bold font-mono text-[#D4AF37] uppercase">
                                  Editor Workspace: [{secToEdit.id}] ({secToEdit.type.toUpperCase()})
                                </h3>
                                <button 
                                  onClick={() => setSelectedSectionId(null)}
                                  className="text-gray-400 hover:text-white"
                                >
                                  Close
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-gray-400 mb-1 font-semibold">Section Heading Title</label>
                                  <input 
                                    type="text"
                                    value={secToEdit.title || ""}
                                    onChange={(e) => {
                                      const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, title: e.target.value } : s);
                                      handleSavePageContent({ ...activePage, sections: updatedList });
                                    }}
                                    className="w-full bg-slate-900 border border-white/15 rounded px-3 py-2 text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-gray-400 mb-1 font-semibold">Section Slogan Subtitle</label>
                                  <input 
                                    type="text"
                                    value={secToEdit.subtitle || ""}
                                    onChange={(e) => {
                                      const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, subtitle: e.target.value } : s);
                                      handleSavePageContent({ ...activePage, sections: updatedList });
                                    }}
                                    className="w-full bg-slate-900 border border-white/15 rounded px-3 py-2 text-white"
                                  />
                                </div>
                              </div>

                              {/* Form controls conditioned on layout section type */}
                              {secToEdit.type === "hero" && (
                                <div className="space-y-4 border-t border-white/5 pt-3">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-gray-400 mb-1">Tagline Pitch</label>
                                      <textarea 
                                        value={secToEdit.content.tagline || ""}
                                        onChange={(e) => {
                                          const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, tagline: e.target.value } } : s);
                                          handleSavePageContent({ ...activePage, sections: updatedList });
                                        }}
                                        className="w-full h-20 bg-slate-900 border border-white/15 rounded px-3 py-2 text-white"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-gray-400 mb-1">Background Image URL</label>
                                      <input 
                                        type="text"
                                        value={secToEdit.content.bgImage || ""}
                                        onChange={(e) => {
                                          const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, bgImage: e.target.value } } : s);
                                          handleSavePageContent({ ...activePage, sections: updatedList });
                                        }}
                                        className="w-full bg-slate-900 border border-white/15 rounded px-3 py-2 text-white font-mono"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}

                              {secToEdit.type === "infosection" && (
                                <div className="space-y-4 border-t border-white/5 pt-3">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-gray-400 mb-1">Interactive Description Pitch</label>
                                      <textarea 
                                        value={secToEdit.content.desc || ""}
                                        onChange={(e) => {
                                          const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, desc: e.target.value } } : s);
                                          handleSavePageContent({ ...activePage, sections: updatedList });
                                        }}
                                        className="w-full h-24 bg-slate-900 border border-white/15 rounded px-3 py-2 text-white leading-relaxed"
                                      />
                                    </div>
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-gray-400 mb-1">Framer Panel Graphic Link</label>
                                        <input 
                                          type="text"
                                          value={secToEdit.content.imageUrl || ""}
                                          onChange={(e) => {
                                            const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, imageUrl: e.target.value } } : s);
                                            handleSavePageContent({ ...activePage, sections: updatedList });
                                          }}
                                          className="w-full bg-slate-900 border border-white/15 rounded px-3 py-2 text-white cursor-pointer"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-gray-400 mb-1">Visual Alignment Layout</label>
                                        <select
                                          value={secToEdit.content.layout || "text-left"}
                                          onChange={(e) => {
                                            const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, layout: e.target.value } } : s);
                                            handleSavePageContent({ ...activePage, sections: updatedList });
                                          }}
                                          className="w-full bg-slate-900 border border-white/15 rounded px-3 py-2 text-white"
                                        >
                                          <option value="text-left">Text on Left / Image on Right</option>
                                          <option value="text-right">Text on Right / Image on Left</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="flex justify-start text-xs">
                                <span className="text-[#D4AF37] font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> CMS updates auto-save dynamically on modification.
                                </span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                  </div>
                ) : (
                  <p className="text-gray-400 text-xs text-center p-12 select-none">No digital sitemap selected.</p>
                )}

              </div>

            </div>

          </div>
        )}

        {/* --- GLOBAL CONFIG & MENUS --- */}
        {activeTab === "config" && (
          <form onSubmit={handleSaveGlobalConfig} className="space-y-8 animate-fadeIn" id="cms-config-tab">
            <div>
              <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#D4AF37] uppercase">
                BRAND SETTINGS & MAIN MENUS
              </h1>
              <p className="text-xs text-gray-400 mt-1">Configure global university logos, color schemes, hotline and mega navigation models.</p>
            </div>

            <div className="bg-slate-900 border border-[#D4AF37]/20 rounded-xl p-6 space-y-6">
              <h3 className="text-xs uppercase font-mono tracking-widest text-[#D4AF37] font-bold border-l-2 border-[#D4AF37] pl-2">
                University Brand Identity
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Administrative University Name</label>
                  <input 
                    type="text"
                    value={siteConfig.universityName}
                    onChange={(e) => onSiteConfigUpdate({ ...siteConfig, universityName: e.target.value })}
                    className="w-full bg-slate-950 border border-white/15 rounded px-3 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Official Logo Image URL</label>
                  <input 
                    type="text"
                    value={siteConfig.logoUrl}
                    onChange={(e) => onSiteConfigUpdate({ ...siteConfig, logoUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-white/15 rounded px-3 py-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">National Accreditations & Slogans (NIRF/NAAC/NBA)</label>
                  <input 
                    type="text"
                    value={siteConfig.accreditationBadge}
                    onChange={(e) => onSiteConfigUpdate({ ...siteConfig, accreditationBadge: e.target.value })}
                    className="w-full bg-slate-950 border border-white/15 rounded px-3 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Announcements ticker ticker line</label>
                  <input 
                    type="text"
                    value={siteConfig.announcementTicker || ""}
                    onChange={(e) => onSiteConfigUpdate({ ...siteConfig, announcementTicker: e.target.value })}
                    className="w-full bg-slate-950 border border-white/15 rounded px-3 py-2.5 text-white text-yellow-300"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-[#D4AF37]/20 rounded-xl p-6 space-y-6">
              <h3 className="text-xs uppercase font-mono tracking-widest text-[#D4AF37] font-bold border-l-2 border-[#D4AF37] pl-2">
                Coordinates & Registrations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Admissions Hotline Line</label>
                  <input 
                    type="text"
                    value={siteConfig.contactPhone}
                    onChange={(e) => onSiteConfigUpdate({ ...siteConfig, contactPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-white/15 rounded px-3 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Official Admission Email</label>
                  <input 
                    type="text"
                    value={siteConfig.contactEmail}
                    onChange={(e) => onSiteConfigUpdate({ ...siteConfig, contactEmail: e.target.value })}
                    className="w-full bg-slate-950 border border-white/15 rounded px-3 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Geographic Campus Address</label>
                  <input 
                    type="text"
                    value={siteConfig.address}
                    onChange={(e) => onSiteConfigUpdate({ ...siteConfig, address: e.target.value })}
                    className="w-full bg-slate-950 border border-white/15 rounded px-3 py-2.5 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="submit"
                className="px-8 py-3 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#C29E30] transition-colors cursor-pointer shadow-lg flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Global Configuration
              </button>
            </div>
          </form>
        )}

        {/* --- COURSE MANAGER --- */}
        {activeTab === "courses" && (
          <div className="space-y-8 animate-fadeIn" id="cms-courses-tab">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#D4AF37] uppercase">
                  Degree Catalogue Management
                </h1>
                <p className="text-xs text-gray-400 mt-1">Configure admission fees, levels, eligibility specifications for flagship degrees.</p>
              </div>
              <button
                onClick={() => setShowAddCourseModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#C29E30] text-black font-bold text-xs rounded uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Degree Track
              </button>
            </div>

            <div className="bg-slate-900 border border-[#D4AF37]/20 rounded-xl overflow-hidden shadow-lg">
              <div className="p-4 bg-slate-950 border-b border-[#D4AF37]/15 flex justify-between items-center text-xs font-mono text-gray-400 uppercase">
                <span>Active University Programs</span>
                <span>Count: {courses.length}</span>
              </div>
              
              <div className="divide-y divide-white/5">
                {courses.map((course) => (
                  <div key={course.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/[0.02] transition-colors">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded">
                          {course.code}
                        </span>
                        <span className="text-[10px] uppercase font-mono tracking-widest bg-slate-800 text-white px-2 py-0.5 rounded">
                          {course.level}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white tracking-tight">{course.name}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed text-slate-300 line-clamp-2">{course.description}</p>
                      
                      <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-[#9CA3AF]">
                        <span>Duration: <strong className="text-white">{course.duration}</strong></span>
                        <span>Fees: <strong className="text-[#D4AF37]">{course.fees}</strong></span>
                        <span>Eligibility: <strong className="text-white">{course.eligibility}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-all cursor-pointer"
                        title="Purge program"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- CERTIFICATE SECURE REGISTRY --- */}
        {activeTab === "certs" && (
          <div className="space-y-8 animate-fadeIn" id="cms-certs-tab">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#D4AF37] uppercase">
                  Academic Credentials Registry
                </h1>
                <p className="text-xs text-gray-400 mt-1">Upload issued student degrees, CGPA, serial metrics and generate verified QR records.</p>
              </div>
              <button
                onClick={() => setShowAddCertModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#C29E30] text-black font-bold text-xs rounded uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Issue Certificate
              </button>
            </div>

            <div className="bg-slate-900 border border-[#D4AF37]/20 rounded-xl overflow-hidden shadow-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-[#D4AF37] font-mono border-b border-[#D4AF37]/15">
                    <th className="p-4 uppercase tracking-wider">Credential ID</th>
                    <th className="p-4 uppercase tracking-wider">Enrollment ID</th>
                    <th className="p-4 uppercase tracking-wider">Student Name</th>
                    <th className="p-4 uppercase tracking-wider">Degree track / Course</th>
                    <th className="p-4 uppercase tracking-wider">CGPA/Division</th>
                    <th className="p-4 uppercase tracking-wider">Status</th>
                    <th className="p-4 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-mono font-bold text-white">{cert.certificateNo}</td>
                      <td className="p-4 font-mono text-gray-400">{cert.enrollmentNo}</td>
                      <td className="p-4 font-semibold text-white">{cert.studentName}</td>
                      <td className="p-4">{cert.course}</td>
                      <td className="p-4 font-mono">{cert.grade}</td>
                      <td className="p-4">
                        <span className="bg-emerald-900/30 text-emerald-400 px-2 py-0.5 border border-emerald-500/20 rounded font-semibold text-[10px]">
                          {cert.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteCert(cert.id)}
                          className="p-1 px-1.5 text-rose-400 hover:text-white hover:bg-rose-600 rounded transition-colors text-[10px]"
                          title="Revoke credential"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- BULLETIN NOTICES CMS --- */}
        {activeTab === "notices" && (
          <div className="space-y-8 animate-fadeIn" id="cms-notices-tab">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#D4AF37] uppercase">
                  Bulletin Board Announcements
                </h1>
                <p className="text-xs text-gray-400 mt-1">Manage standard bulletins, academic schedule changes, admission details, and research grants.</p>
              </div>
              <button
                onClick={() => setShowAddNoticeModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#C29E30] text-black font-bold text-xs rounded uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Publish Announcement
              </button>
            </div>

            <div className="bg-slate-900 border border-[#D4AF37]/20 rounded-xl overflow-hidden shadow-lg">
              <div className="p-4 bg-slate-950 border-b border-[#D4AF37]/15 text-xs text-gray-400 font-mono">
                Recent Announcements
              </div>
              <div className="divide-y divide-white/5">
                {notices.map((notice) => (
                  <div key={notice.id} className="p-5 flex justify-between items-start gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono tracking-widest bg-slate-950 border border-[#D4AF37]/30 text-[#D4AF37] px-2 py-0.5 rounded">
                          {notice.category}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">{notice.date}</span>
                      </div>
                      <h3 className="text-base font-semibold text-white">{notice.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed text-slate-350">{notice.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="p-1.5 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================
          ADD CUSTOM PAGE MODAL WIDGET 
          ======================================================== */}
      {showAddPageModal && (
        <div className="fixed inset-0 z-50 bg-[#030712]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreatePage} className="w-full max-w-md bg-[#0A192F] border-2 border-[#D4AF37] text-white p-6 rounded-xl space-y-6 shadow-2xl">
            <div className="border-b border-white/10 pb-3 flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-[#D4AF37]">Engine New Sitemap URL</h3>
              <button type="button" onClick={() => setShowAddPageModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Display Navigation Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Life at Campus"
                  value={newPageTitle}
                  onChange={(e) => {
                    setNewPageTitle(e.target.value);
                    setNewPageSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                  className="w-full bg-slate-950 border border-white/10 focus:border-[#D4AF37] rounded px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">URL Path Slug (No spaces)</label>
                <input 
                  type="text"
                  placeholder="e.g. campus-life"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value.replace(/\s+/g, "-").toLowerCase())}
                  className="w-full bg-slate-950 border border-white/10 focus:border-[#D4AF37] rounded px-3 py-2 text-white focus:outline-none font-mono"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <button 
                type="button" 
                onClick={() => setShowAddPageModal(false)} 
                className="px-4 py-2 bg-slate-800 text-xs rounded hover:bg-slate-700 transition-colors uppercase tracking-wider"
              >
                Abort
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 bg-[#D4AF37] text-black font-bold text-xs rounded hover:bg-[#C29E30] transition-colors uppercase tracking-wider"
              >
                Compile Node
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================
          ADD DEGREE TRACK MODAL WIDGET
          ======================================================== */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 bg-[#030712]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddCourse} className="w-full max-w-lg bg-[#0A192F] border-2 border-[#D4AF37] text-white p-6 rounded-xl space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="border-b border-white/10 pb-3 flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-[#D4AF37]">Integrate New Course track</h3>
              <button type="button" onClick={() => setShowAddCourseModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Degree Name</label>
                <input 
                  type="text"
                  placeholder="e.g. M.Tech Computer Science"
                  value={newCourse.name || ""}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Degree Code</label>
                <input 
                  type="text"
                  placeholder="e.g. MTECH-CS"
                  value={newCourse.code || ""}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 font-mono uppercase"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Academic Level</label>
                <select
                  value={newCourse.level || "UG"}
                  onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value as any })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white"
                >
                  <option value="UG">UG (Undergraduate)</option>
                  <option value="PG">PG (Postgraduate)</option>
                  <option value="Diploma">Diploma Program</option>
                  <option value="PhD">PhD / Doctorate Research</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Degree Duration</label>
                <input 
                  type="text"
                  placeholder="e.g. 4 Years (8 Semesters)"
                  value={newCourse.duration || ""}
                  onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Fees parameter</label>
                <input 
                  type="text"
                  placeholder="e.g. ₹1,20,000 per year"
                  value={newCourse.fees || ""}
                  onChange={(e) => setNewCourse({ ...newCourse, fees: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Eligibility Criteria</label>
                <input 
                  type="text"
                  placeholder="e.g. JEE scores class 12th math min 60%"
                  value={newCourse.eligibility || ""}
                  onChange={(e) => setNewCourse({ ...newCourse, eligibility: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-1">Course Description Details</label>
                <textarea 
                  placeholder="Brief syllabus outline and department highlights"
                  value={newCourse.description || ""}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full h-24 bg-slate-950 border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 text-xs">
              <button type="button" onClick={() => setShowAddCourseModal(false)} className="px-4 py-2 bg-slate-800 rounded">Abort</button>
              <button type="submit" className="px-5 py-2 bg-[#D4AF37] text-black font-semibold rounded hover:bg-[#C29E30]">Compile Course</button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================
          ADD STUDENT CERTIFICATE WIDGET
          ======================================================== */}
      {showAddCertModal && (
        <div className="fixed inset-0 z-50 bg-[#030712]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddCertificate} className="w-full max-w-md bg-[#0A192F] border-2 border-[#D4AF37] text-white p-6 rounded-xl space-y-6 shadow-2xl">
            <div className="border-b border-white/10 pb-3 flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-[#D4AF37]">Issue Academic credential</h3>
              <button type="button" onClick={() => setShowAddCertModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-1 gap-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Unique Serial Code (No spaces)</label>
                <input 
                  type="text"
                  placeholder="e.g. LSU-4920-1029"
                  value={newCert.certificateNo || ""}
                  onChange={(e) => setNewCert({ ...newCert, certificateNo: e.target.value.toUpperCase().replace(/\s+/g, '-') })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Student Enrollment ID</label>
                <input 
                  type="text"
                  placeholder="e.g. LS2023CSE011"
                  value={newCert.enrollmentNo || ""}
                  onChange={(e) => setNewCert({ ...newCert, enrollmentNo: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Student Full Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Aditya Vardhan Dixit"
                  value={newCert.studentName || ""}
                  onChange={(e) => setNewCert({ ...newCert, studentName: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Course awarded</label>
                <input 
                  type="text"
                  placeholder="e.g. B.Tech in CSE (Artificial Intelligence)"
                  value={newCert.course || ""}
                  onChange={(e) => setNewCert({ ...newCert, course: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Grade / Class division</label>
                  <input 
                    type="text"
                    placeholder="e.g. 9.6 CGPA"
                    value={newCert.grade || ""}
                    onChange={(e) => setNewCert({ ...newCert, grade: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Status</label>
                  <select
                    value={newCert.status || "Verified"}
                    onChange={(e) => setNewCert({ ...newCert, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Revoked">Revoked / Suspended</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 text-xs">
              <button type="button" onClick={() => setShowAddCertModal(false)} className="px-4 py-2 bg-slate-800 rounded">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-[#D4AF37] text-black font-semibold rounded hover:bg-[#C29E30]">Issue Node</button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================
          ADD NOTICE BULLETIN MODAL WIDGET
          ======================================================== */}
      {showAddNoticeModal && (
        <div className="fixed inset-0 z-50 bg-[#030712]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddNotice} className="w-full max-w-md bg-[#0A192F] border-2 border-[#D4AF37] text-white p-6 rounded-xl space-y-6 shadow-2xl">
            <div className="border-b border-white/10 pb-3 flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-[#D4AF37]">Push Campus Bulletin</h3>
              <button type="button" onClick={() => setShowAddNoticeModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-1 gap-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Announcement Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Schedule for LS-SAT entrance clearance"
                  value={newNotice.title || ""}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Category</label>
                  <select
                    value={newNotice.category || "Academic"}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Admissions">Admissions</option>
                    <option value="Examinations">Examinations</option>
                    <option value="Events">Events</option>
                    <option value="Careers">Careers</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Priority Level</label>
                  <select
                    value={newNotice.priority || "Normal"}
                    onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value as any })}
                    className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2"
                  >
                    <option value="Normal">Normal Priority</option>
                    <option value="High">🚨 High Alert (Immediate Announcement)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Detailed description announcement</label>
                <textarea 
                  placeholder="Full bulletin outline detail..."
                  value={newNotice.description || ""}
                  onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                  className="w-full h-24 bg-slate-950 border border-white/10 rounded px-3 py-2 text-white"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 text-xs">
              <button type="button" onClick={() => setShowAddNoticeModal(false)} className="px-4 py-2 bg-slate-800 rounded">Abort</button>
              <button type="submit" className="px-5 py-2 bg-[#D4AF37] text-black font-semibold rounded hover:bg-[#C29E30]">Broadcast</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
export { DEFAULT_SITE_CONFIG, DEFAULT_PAGES };
export { DEMO_COURSES, DEMO_CERTIFICATES, DEMO_NOTICES, DEMO_MEDIA_ITEMS, DEMO_PLACEMENTS };
