import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, FileText, GraduationCap, Award, Image, Settings, 
  Plus, Trash2, ArrowUp, ArrowDown, Copy, CheckCircle2, Lock, Unlock, 
  RefreshCw, LogOut, FilePlus, Eye, Save, Globe, Info, Edit, Folder,
  Database, ShieldCheck, Mail, Phone, MapPin, Volume2, Users, FileSpreadsheet, Play
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
  SiteConfig, PageData, Course, Certificate, MediaItem, PageSection, Notice, GalleryAlbum, GalleryMediaItem, CertificateTemplate 
} from "../types";
import { 
  INITIAL_SITE_CONFIG, INITIAL_PAGES, INITIAL_COURSES, INITIAL_CERTIFICATES, INITIAL_NOTICES, INITIAL_MEDIA_ITEMS 
} from "../initialContent";
import StorageImageUploader from "./StorageImageUploader";

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
  galleryAlbums: GalleryAlbum[];
  onGalleryAlbumsUpdate: (albums: GalleryAlbum[]) => void;
  certificateTemplate: CertificateTemplate;
  onTemplateUpdate: (template: CertificateTemplate) => void;
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
  onNoticesUpdate,
  galleryAlbums,
  onGalleryAlbumsUpdate,
  certificateTemplate,
  onTemplateUpdate
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
  const [activeTab, setActiveTab] = useState<"summary" | "pages" | "config" | "courses" | "certs" | "media" | "gallery" | "admissions">("summary");
  
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

  const [certSubTab, setCertSubTab] = useState<"list" | "template">("list");
  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [newCert, setNewCert] = useState<Partial<Certificate>>({
    certificateNo: "", 
    enrollmentNo: "", 
    registrationNo: "",
    studentName: "", 
    fatherName: "",
    course: "", 
    specialization: "",
    grade: "First Class with Distinction", 
    cgpa: "9.00 CGPA",
    passingYear: "2026",
    issueDate: new Date().toISOString().split('T')[0],
    status: "Verified", 
    remarks: ""
  });

  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [newNotice, setNewNotice] = useState<Partial<Notice>>({
    title: "", category: "Academic", date: new Date().toISOString().split('T')[0], priority: "Normal", description: "", published: true
  });

  const [mediaItemUrl, setMediaItemUrl] = useState("");
  const [mediaItemFolder, setMediaItemFolder] = useState<any>("Gallery");
  const [mediaItemName, setMediaItemName] = useState("");

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);

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

  useEffect(() => {
    if (!isAdminMode) return;
    const unsubMedia = onSnapshot(collection(db, "media_items"), (snap) => {
      const list: MediaItem[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as MediaItem);
      });
      if (snap.empty) {
        if (isDevMode) {
          INITIAL_MEDIA_ITEMS.forEach((mi) => {
            setDoc(doc(db, "media_items", mi.id), mi).catch((e) => console.warn(e));
          });
          setMediaItems(INITIAL_MEDIA_ITEMS);
        } else {
          setMediaItems([]);
        }
      } else {
        setMediaItems(list);
      }
    });

    const unsubAdmissions = onSnapshot(collection(db, "student_admissions"), (snap) => {
      const list: any[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      list.sort((a, b) => {
        const dateA = a.createdAt || "";
        const dateB = b.createdAt || "";
        return dateB.localeCompare(dateA);
      });
      setAdmissions(list);
    });

    return () => {
      unsubMedia();
      unsubAdmissions();
    };
  }, [isAdminMode]);

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

  // --- ENTERPRISE BACKUP ENGINE (SAFE JSON DUMP AND IMPORT-RESTORE COMPATIBLE WITH VERCEL REDEPLOYMENTS) ---
  const handleExportBackup = () => {
    const backupData = {
      siteConfig,
      pages: allPages,
      courses,
      certificates,
      notices,
      galleryAlbums,
      exportedAt: new Date().toISOString(),
      branding: `${siteConfig?.universityName || "LAKSHMI SEHGAL UNIVERSITY"} Safety Registry`
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lsu_cms_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerNotify("System JSON backup exported successfully.");
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!window.confirm("CRITICAL WARNING:\n\nProceeding will immediately overwrite all Firestore pages, certificate registers, degree databases, and system menus with this backup's content.\n\nDo you want to proceed and permanently import?")) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        setIsSyncing(true);
        
        // 1. Restore Site Config
        if (data.siteConfig) {
          await setDoc(doc(db, "site_config", "main_settings"), data.siteConfig);
          onSiteConfigUpdate(data.siteConfig);
        }
        
        // 2. Restore Pages
        if (Array.isArray(data.pages)) {
          for (const pg of data.pages) {
            await setDoc(doc(db, "pages", pg.id), pg);
          }
          onPagesUpdate(data.pages);
        }

        // 3. Restore Courses
        if (Array.isArray(data.courses)) {
          for (const crs of data.courses) {
            await setDoc(doc(db, "courses", crs.id), crs);
          }
          onCoursesUpdate(data.courses);
        }

        // 4. Restore Certificates
        if (Array.isArray(data.certificates)) {
          for (const cert of data.certificates) {
            await setDoc(doc(db, "certificates", cert.id), cert);
          }
          onCertificatesUpdate(data.certificates);
        }

        // 5. Restore Notices
        if (Array.isArray(data.notices)) {
          for (const n of data.notices) {
            await setDoc(doc(db, "notices", n.id), n);
          }
          onNoticesUpdate(data.notices);
        }

        // 6. Restore Gallery Albums
        if (Array.isArray(data.galleryAlbums)) {
          for (const alb of data.galleryAlbums) {
            await setDoc(doc(db, "gallery_albums", alb.id), alb);
          }
          onGalleryAlbumsUpdate(data.galleryAlbums);
        }
        
        triggerNotify("Administration database restored from Backup.");
      } catch (err) {
        console.error(err);
        triggerNotify("Error parsing backup JSON. Confirm schema integrity.");
      } finally {
        setIsSyncing(false);
      }
    };
    reader.readAsText(file);
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
      seoTitle: `${newPageTitle} | ${siteConfig?.universityName || "LAKSHMI SEHGAL UNIVERSITY"}`,
      seoDesc: `${siteConfig?.universityName || "LAKSHMI SEHGAL UNIVERSITY"} dynamic information page for ${newPageTitle}`,
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
    } catch (e: any) {
      triggerNotify(`Failed to delete page document: ${e?.message || e}`);
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
    } catch (e: any) {
      triggerNotify(`Cloning exception raised: ${e?.message || e}`);
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
    } catch (e: any) {
      triggerNotify(`Publishing toggle failure: ${e?.message || e}`);
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
    } catch (e: any) {
      triggerNotify(`Failed to write section configuration to database: ${e?.message || e}`);
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
    } catch (e: any) {
      triggerNotify(`Exception writing course: ${e?.message || e}`);
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
    } catch (e: any) {
      triggerNotify(`Removal failure: ${e?.message || e}`);
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
    
    // Format the date YYYY-MM-DD into Month DD, YYYY representation
    let formattedIssueDate = newCert.issueDate || "";
    if (formattedIssueDate.includes("-")) {
      try {
        const parts = formattedIssueDate.split("-");
        if (parts.length === 3) {
          const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          formattedIssueDate = dateObj.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        }
      } catch (err) {}
    }

    const finalCert: Certificate = {
      id: certid,
      certificateNo: newCert.certificateNo,
      enrollmentNo: newCert.enrollmentNo,
      registrationNo: newCert.registrationNo || "",
      studentName: newCert.studentName,
      fatherName: newCert.fatherName || "",
      course: newCert.course || "Degree program",
      specialization: newCert.specialization || "General",
      grade: newCert.grade || "First Class with Distinction",
      cgpa: newCert.cgpa || "",
      passingYear: newCert.passingYear || "2026",
      issueDate: formattedIssueDate || new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
      status: (newCert.status as any) || "Verified",
      qrCodeValue: `${window.location.origin}${window.location.pathname}#/verify?id=${encodeURIComponent(newCert.certificateNo)}`,
      remarks: newCert.remarks || ""
    };

    try {
      await setDoc(doc(db, "certificates", certid), finalCert);
      onCertificatesUpdate([...certificates, finalCert]);
      setShowAddCertModal(false);
      setNewCert({ 
        certificateNo: "", 
        enrollmentNo: "", 
        registrationNo: "",
        studentName: "", 
        fatherName: "",
        course: "", 
        specialization: "",
        grade: "First Class with Distinction", 
        cgpa: "9.00 CGPA",
        passingYear: "2026",
        issueDate: new Date().toISOString().split('T')[0],
        status: "Verified",
        remarks: ""
      });
      triggerNotify("Academic Certificate uploaded.");
    } catch (e: any) {
      triggerNotify(`Certificate upload conflict: ${e?.message || e}`);
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
    } catch (e: any) {
      triggerNotify(`Deletion error: ${e?.message || e}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    try {
      await setDoc(doc(db, "certificate_templates", "main_template"), certificateTemplate);
      triggerNotify("Certificate Visual Template saved successfully!");
    } catch (err: any) {
      triggerNotify(`Error updating template settings: ${err?.message || err}`);
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
    } catch (e: any) {
      triggerNotify(`Publish trigger failed: ${e?.message || e}`);
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
    } catch (e: any) {
      triggerNotify(`Exception triggered while scrubbing notice: ${e?.message || e}`);
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
    } catch (e: any) {
      triggerNotify(`Firestore configuration write block: ${e?.message || e}`);
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
              {siteConfig?.universityName || "LAKSHMI SEHGAL UNIVERSITY"} Portal Centralized CMS Gateway
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
        <div className="px-6 py-4 border-b border-[#D4AF37]/10 bg-slate-900/40 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className={`w-2 h-2 rounded-full ${isSyncing ? "bg-amber-500 animate-ping" : "bg-[#D4AF37]"}`} />
            Secure CMS Realtime Sync
          </span>
        </div>

        {/* Tab Selection */}
        <nav className="p-4 flex-1 space-y-1.5 overflow-y-auto">
          <button
            onClick={() => setActiveTab("summary")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "summary" ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/10 font-bold" : "text-gray-300 hover:bg-white/5"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Administrative Dashboard
          </button>

          <button
            onClick={() => setActiveTab("pages")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "pages" ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/10 font-bold" : "text-gray-300 hover:bg-white/5"
            }`}
          >
            <FileText className="w-4 h-4" /> CMS Page Builder
          </button>

          <button
            onClick={() => setActiveTab("media")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "media" ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/10 font-bold" : "text-gray-300 hover:bg-white/5"
            }`}
          >
            <Folder className="w-4 h-4" /> Media Manager
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "gallery" ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/10 font-bold" : "text-gray-300 hover:bg-white/5"
            }`}
          >
            <Image className="w-4 h-4" /> Gallery Manager
          </button>

          <button
            onClick={() => setActiveTab("certs")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "certs" ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/10 font-bold" : "text-gray-300 hover:bg-white/5"
            }`}
          >
            <Award className="w-4 h-4" /> Certificate Manager
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "courses" ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/10 font-bold" : "text-gray-300 hover:bg-white/5"
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Course Manager
          </button>

          <button
            onClick={() => setActiveTab("admissions")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "admissions" ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/10 font-bold" : "text-gray-300 hover:bg-white/5"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> Admission Manager
          </button>

          <button
            onClick={() => setActiveTab("config")}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "config" ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/10 font-bold" : "text-gray-300 hover:bg-white/5"
            }`}
          >
            <Settings className="w-4 h-4" /> Settings & Identity
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
                <p className="text-xs text-gray-400 font-mono mt-1">Real-time status metrics of {siteConfig?.universityName || "LAKSHMI SEHGAL UNIVERSITY"} dynamic database nodes.</p>
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
                The university portal layout renders 100% of its content dynamically. When you alter any text, card, list, fee, or notice inside these CMS tab selectors, the live system propagates changes to all connected visitors instantly using Firestore streaming web-hooks. 
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab("pages")}
                  className="px-4 py-2 bg-[#D4AF37] text-black font-bold text-xs rounded hover:bg-[#C29E30] transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Manage Live Pages
                </button>
                <button
                  onClick={handleExportBackup}
                  className="px-4 py-2 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 font-bold text-xs rounded transition-all cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Export Backup
                </button>
                <label className="px-4 py-2 border border-white/20 hover:bg-white/5 text-gray-300 font-bold text-xs rounded transition-all cursor-pointer uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-4 h-4" /> Import Backup File
                  <input 
                    type="file" 
                    accept=".json" 
                    onChange={handleImportBackup} 
                    className="hidden" 
                  />
                </label>
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
                                      <StorageImageUploader 
                                        currentUrl={secToEdit.content.bgImage || ""}
                                        onUrlChange={(url) => {
                                          const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, bgImage: url } } : s);
                                          handleSavePageContent({ ...activePage, sections: updatedList });
                                        }}
                                        folder="page_sections"
                                        label="Or Upload Cover Graphic"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-3">
                                    <div>
                                      <label className="block text-gray-400 mb-1">Primary CTA Button Text</label>
                                      <input 
                                        type="text"
                                        value={secToEdit.content.ctaText1 || ""}
                                        onChange={(e) => {
                                          const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, ctaText1: e.target.value } } : s);
                                          handleSavePageContent({ ...activePage, sections: updatedList });
                                        }}
                                        className="w-full bg-slate-900 border border-white/15 rounded px-3 py-2 text-white"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-gray-400 mb-1">Primary CTA Button Link</label>
                                      <input 
                                        type="text"
                                        value={secToEdit.content.ctaLink1 || ""}
                                        onChange={(e) => {
                                          const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, ctaLink1: e.target.value } } : s);
                                          handleSavePageContent({ ...activePage, sections: updatedList });
                                        }}
                                        className="w-full bg-slate-900 border border-white/15 rounded px-3 py-2 text-white font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-gray-400 mb-1">Secondary CTA Button Text</label>
                                      <input 
                                        type="text"
                                        value={secToEdit.content.ctaText2 || ""}
                                        onChange={(e) => {
                                          const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, ctaText2: e.target.value } } : s);
                                          handleSavePageContent({ ...activePage, sections: updatedList });
                                        }}
                                        className="w-full bg-slate-900 border border-white/15 rounded px-3 py-2 text-white"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-gray-400 mb-1">Secondary CTA Button Link</label>
                                      <input 
                                        type="text"
                                        value={secToEdit.content.ctaLink2 || ""}
                                        onChange={(e) => {
                                          const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, ctaLink2: e.target.value } } : s);
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
                                        className="w-full h-32 bg-slate-900 border border-white/15 rounded px-3 py-2 text-white leading-relaxed"
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
                                        <StorageImageUploader 
                                          currentUrl={secToEdit.content.imageUrl || ""}
                                          onUrlChange={(url) => {
                                            const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, imageUrl: url } } : s);
                                            handleSavePageContent({ ...activePage, sections: updatedList });
                                          }}
                                          folder="page_sections"
                                          label="Or Upload Panel Graphic"
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
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="block text-gray-400 mb-1">Button Text</label>
                                          <input 
                                            type="text"
                                            value={secToEdit.content.buttonText || ""}
                                            onChange={(e) => {
                                              const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, buttonText: e.target.value } } : s);
                                              handleSavePageContent({ ...activePage, sections: updatedList });
                                            }}
                                            className="w-full bg-slate-900 border border-white/15 rounded px-3 py-2 text-white"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-gray-400 mb-1">Button Link</label>
                                          <input 
                                            type="text"
                                            value={secToEdit.content.buttonLink || ""}
                                            onChange={(e) => {
                                              const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, buttonLink: e.target.value } } : s);
                                              handleSavePageContent({ ...activePage, sections: updatedList });
                                            }}
                                            className="w-full bg-slate-900 border border-white/15 rounded px-3 py-2 text-white font-mono"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {secToEdit.type === "stats" && (
                                <div className="space-y-4 border-t border-white/5 pt-3">
                                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                    <span className="font-bold text-[#D4AF37] uppercase tracking-wider text-[10px]">Stats Indicator Parameters</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const items = secToEdit.content.items || [];
                                        const newItem = { label: "New Slogan", value: "100+", desc: "Metric subtext detail" };
                                        const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, items: [...items, newItem] } } : s);
                                        handleSavePageContent({ ...activePage, sections: updatedList });
                                      }}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1 text-[10px]"
                                    >
                                      <Plus className="w-3.5 h-3.5" /> Add New Stat
                                    </button>
                                  </div>
                                  <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                                    {(secToEdit.content.items || []).map((item: any, idx: number) => (
                                      <div key={idx} className="bg-slate-900 border border-white/10 rounded p-3 space-y-2 relative">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const filteredItems = (secToEdit.content.items || []).filter((_: any, i: number) => i !== idx);
                                            const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, items: filteredItems } } : s);
                                            handleSavePageContent({ ...activePage, sections: updatedList });
                                          }}
                                          className="absolute top-2 right-2 text-rose-400 hover:text-rose-600"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        <div className="grid grid-cols-2 gap-3 pr-6">
                                          <div>
                                            <label className="block text-gray-400 mb-0.5 text-[9px]">Metric Value Accent (e.g. 50+)</label>
                                            <input
                                              type="text"
                                              value={item.value || ""}
                                              onChange={(e) => {
                                                const itemsCopy = [...(secToEdit.content.items || [])];
                                                itemsCopy[idx] = { ...itemsCopy[idx], value: e.target.value };
                                                const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, items: itemsCopy } } : s);
                                                handleSavePageContent({ ...activePage, sections: updatedList });
                                              }}
                                              className="w-full bg-slate-950 border border-white/10 rounded px-2 py-1 text-white font-mono"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-gray-400 mb-0.5 text-[9px]">Slogan / Core Metric Name</label>
                                            <input
                                              type="text"
                                              value={item.label || ""}
                                              onChange={(e) => {
                                                const itemsCopy = [...(secToEdit.content.items || [])];
                                                itemsCopy[idx] = { ...itemsCopy[idx], label: e.target.value };
                                                const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, items: itemsCopy } } : s);
                                                handleSavePageContent({ ...activePage, sections: updatedList });
                                              }}
                                              className="w-full bg-slate-950 border border-white/10 rounded px-2 py-1 text-white"
                                            />
                                          </div>
                                        </div>
                                        <div>
                                          <label className="block text-gray-400 mb-0.5 text-[9px]">Descriptive Subtext Details</label>
                                          <input
                                            type="text"
                                            value={item.desc || ""}
                                            onChange={(e) => {
                                              const itemsCopy = [...(secToEdit.content.items || [])];
                                              itemsCopy[idx] = { ...itemsCopy[idx], desc: e.target.value };
                                              const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, items: itemsCopy } } : s);
                                              handleSavePageContent({ ...activePage, sections: updatedList });
                                            }}
                                            className="w-full bg-slate-950 border border-white/10 rounded px-2 py-1 text-white"
                                          />
                                        </div>
                                      </div>
                                    ))}
                                    {(!secToEdit.content.items || secToEdit.content.items.length === 0) && (
                                      <p className="text-gray-400 text-center py-4">No indicators defined. Click 'Add New Stat' above.</p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {secToEdit.type === "testimonials" && (
                                <div className="space-y-4 border-t border-white/5 pt-3">
                                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                    <span className="font-bold text-[#D4AF37] uppercase tracking-wider text-[10px]">Testimonials & Alumni Reviews</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const items = secToEdit.content.items || [];
                                        const newItem = { name: "Alumni Name", designation: "B.Tech CSE, 2024", rating: 5, text: "The university offered exceptional industry internships and professional tech tracks.", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120" };
                                        const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, items: [...items, newItem] } } : s);
                                        handleSavePageContent({ ...activePage, sections: updatedList });
                                      }}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1 text-[10px]"
                                    >
                                      <Plus className="w-3.5 h-3.5" /> Add Review
                                    </button>
                                  </div>
                                  <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                                    {(secToEdit.content.items || []).map((item: any, idx: number) => (
                                      <div key={idx} className="bg-slate-900 border border-white/10 rounded p-3 space-y-2 relative">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const filteredItems = (secToEdit.content.items || []).filter((_: any, i: number) => i !== idx);
                                            const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, items: filteredItems } } : s);
                                            handleSavePageContent({ ...activePage, sections: updatedList });
                                          }}
                                          className="absolute top-2 right-2 text-rose-400 hover:text-rose-600"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        <div className="grid grid-cols-2 gap-3 pr-6">
                                          <div>
                                            <label className="block text-gray-400 mb-0.5 text-[9px]">Reviewer Name</label>
                                            <input
                                              type="text"
                                              value={item.name || ""}
                                              onChange={(e) => {
                                                const itemsCopy = [...(secToEdit.content.items || [])];
                                                itemsCopy[idx] = { ...itemsCopy[idx], name: e.target.value };
                                                const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, items: itemsCopy } } : s);
                                                handleSavePageContent({ ...activePage, sections: updatedList });
                                              }}
                                              className="w-full bg-slate-950 border border-white/10 rounded px-2 py-1 text-white"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-gray-400 mb-0.5 text-[9px]">Title / Designation</label>
                                            <input
                                              type="text"
                                              value={item.designation || ""}
                                              onChange={(e) => {
                                                const itemsCopy = [...(secToEdit.content.items || [])];
                                                itemsCopy[idx] = { ...itemsCopy[idx], designation: e.target.value };
                                                const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, items: itemsCopy } } : s);
                                                handleSavePageContent({ ...activePage, sections: updatedList });
                                              }}
                                              className="w-full bg-slate-950 border border-white/10 rounded px-2 py-1 text-white"
                                            />
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                          <div>
                                            <label className="block text-gray-400 mb-0.5 text-[9px]">Star Rating Score (1-5)</label>
                                            <select
                                              value={item.rating || 5}
                                              onChange={(e) => {
                                                const itemsCopy = [...(secToEdit.content.items || [])];
                                                itemsCopy[idx] = { ...itemsCopy[idx], rating: Number(e.target.value) };
                                                const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, items: itemsCopy } } : s);
                                                handleSavePageContent({ ...activePage, sections: updatedList });
                                              }}
                                              className="w-full bg-slate-950 border border-white/10 rounded px-2 py-1 text-white font-mono"
                                            >
                                              <option value="5">5 Stars</option>
                                              <option value="4">4 Stars</option>
                                              <option value="3">3 Stars</option>
                                              <option value="2">2 Stars</option>
                                              <option value="1">1 Star</option>
                                            </select>
                                          </div>
                                          <div>
                                            <label className="block text-gray-400 mb-0.5 text-[9px]">User Photo Avatar link</label>
                                            <input
                                              type="text"
                                              value={item.image || ""}
                                              onChange={(e) => {
                                                const itemsCopy = [...(secToEdit.content.items || [])];
                                                itemsCopy[idx] = { ...itemsCopy[idx], image: e.target.value };
                                                const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, items: itemsCopy } } : s);
                                                handleSavePageContent({ ...activePage, sections: updatedList });
                                              }}
                                              className="w-full bg-slate-950 border border-white/10 rounded px-2 py-1 text-white font-mono"
                                            />
                                          </div>
                                        </div>
                                        <div>
                                          <label className="block text-gray-400 mb-0.5 text-[9px]">Text Review Testimonial</label>
                                          <textarea
                                            value={item.text || ""}
                                            onChange={(e) => {
                                              const itemsCopy = [...(secToEdit.content.items || [])];
                                              itemsCopy[idx] = { ...itemsCopy[idx], text: e.target.value };
                                              const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, items: itemsCopy } } : s);
                                              handleSavePageContent({ ...activePage, sections: updatedList });
                                            }}
                                            className="w-full bg-slate-950 border border-white/10 rounded px-2 py-1.5 text-white h-16"
                                          />
                                        </div>
                                      </div>
                                    ))}
                                    {(!secToEdit.content.items || secToEdit.content.items.length === 0) && (
                                      <p className="text-gray-400 text-center py-4">No reviews recorded. Click 'Add Review' above.</p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {secToEdit.type === "placements" && (
                                <div className="space-y-4 border-t border-white/5 pt-3">
                                  <div className="space-y-1.5">
                                    <label className="block text-gray-400 font-semibold">Corporate Partner Logos (Comma-separated text list)</label>
                                    <textarea
                                      value={Array.isArray(secToEdit.content.recruiters) ? secToEdit.content.recruiters.join(", ") : (secToEdit.content.recruiters || "Google India, AWS Research, Microsoft Redmond, NVIDIA Corp, Intel Staging, Deloitte strategy, Morgan Stanley, Oracle Tech")}
                                      onChange={(e) => {
                                        const cleanRecs = e.target.value.split(",").map(r => r.trim()).filter(Boolean);
                                        const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, recruiters: cleanRecs } } : s);
                                        handleSavePageContent({ ...activePage, sections: updatedList });
                                      }}
                                      className="w-full h-16 bg-slate-900 border border-white/15 rounded px-3 py-2 text-white font-mono"
                                      placeholder="Company A, Company B"
                                    />
                                  </div>

                                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                    <span className="font-bold text-[#D4AF37] uppercase tracking-wider text-[10px]">Student Placement Registers</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const currentItems = secToEdit.content.items || [];
                                        const newItem = { studentName: "Student Name", companyName: "Google India", package: "₹48.4 LPA", course: "B.Tech CSE", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120" };
                                        const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, items: [...currentItems, newItem] } } : s);
                                        handleSavePageContent({ ...activePage, sections: updatedList });
                                      }}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1 text-[10px]"
                                    >
                                      <Plus className="w-3.5 h-3.5" /> Add Student Card
                                    </button>
                                  </div>
                                  <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                                    {(secToEdit.content.items || []).map((item: any, idx: number) => (
                                      <div key={idx} className="bg-slate-900 border border-white/10 rounded p-3 space-y-2 relative font-sans">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const filteredItems = (secToEdit.content.items || []).filter((_: any, i: number) => i !== idx);
                                            const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, items: filteredItems } } : s);
                                            handleSavePageContent({ ...activePage, sections: updatedList });
                                          }}
                                          className="absolute top-2 right-2 text-rose-400 hover:text-rose-600"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        <div className="grid grid-cols-2 gap-3 pr-6">
                                          <div>
                                            <label className="block text-gray-400 mb-0.5 text-[9px]">Student Name</label>
                                            <input
                                              type="text"
                                              value={item.studentName || ""}
                                              onChange={(e) => {
                                                const itemsCopy = [...(secToEdit.content.items || [])];
                                                itemsCopy[idx] = { ...itemsCopy[idx], studentName: e.target.value };
                                                const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, items: itemsCopy } } : s);
                                                handleSavePageContent({ ...activePage, sections: updatedList });
                                              }}
                                              className="w-full bg-slate-950 border border-white/10 rounded px-2 py-1 text-white"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-gray-400 mb-0.5 text-[9px]">Recruiting Employer</label>
                                            <input
                                              type="text"
                                              value={item.companyName || ""}
                                              onChange={(e) => {
                                                const itemsCopy = [...(secToEdit.content.items || [])];
                                                itemsCopy[idx] = { ...itemsCopy[idx], companyName: e.target.value };
                                                const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, items: itemsCopy } } : s);
                                                handleSavePageContent({ ...activePage, sections: updatedList });
                                              }}
                                              className="w-full bg-slate-950 border border-white/10 rounded px-2 py-1 text-white"
                                            />
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                          <div>
                                            <label className="block text-gray-400 mb-0.5 text-[9px]">Salary Package Secured (e.g. ₹28 LPA)</label>
                                            <input
                                              type="text"
                                              value={item.package || ""}
                                              onChange={(e) => {
                                                const itemsCopy = [...(secToEdit.content.items || [])];
                                                itemsCopy[idx] = { ...itemsCopy[idx], package: e.target.value };
                                                const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, items: itemsCopy } } : s);
                                                handleSavePageContent({ ...activePage, sections: updatedList });
                                              }}
                                              className="w-full bg-slate-950 border border-white/10 rounded px-2 py-1 text-white font-mono"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-gray-400 mb-0.5 text-[9px]">Degree Track & Year</label>
                                            <input
                                              type="text"
                                              value={item.course || ""}
                                              onChange={(e) => {
                                                const itemsCopy = [...(secToEdit.content.items || [])];
                                                itemsCopy[idx] = { ...itemsCopy[idx], course: e.target.value };
                                                const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, items: itemsCopy } } : s);
                                                handleSavePageContent({ ...activePage, sections: updatedList });
                                              }}
                                              className="w-full bg-slate-950 border border-white/10 rounded px-2 py-1 text-white"
                                            />
                                          </div>
                                        </div>
                                        <div>
                                          <label className="block text-gray-400 mb-0.5 text-[9px]">Placement Student Photo Image URL</label>
                                          <input
                                            type="text"
                                            value={item.image || ""}
                                            onChange={(e) => {
                                              const itemsCopy = [...(secToEdit.content.items || [])];
                                              itemsCopy[idx] = { ...itemsCopy[idx], image: e.target.value };
                                              const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, items: itemsCopy } } : s);
                                              handleSavePageContent({ ...activePage, sections: updatedList });
                                            }}
                                            className="w-full bg-slate-950 border border-white/10 rounded px-2 py-1 text-white font-mono"
                                          />
                                        </div>
                                      </div>
                                    ))}
                                    {(!secToEdit.content.items || secToEdit.content.items.length === 0) && (
                                      <p className="text-gray-400 text-center py-4">No student placements tracked. Click 'Add Student Card' above.</p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {secToEdit.type === "courses" && (
                                <div className="space-y-4 border-t border-white/5 pt-3">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-gray-400 mb-1">Max Degree Cards to show in row</label>
                                      <input 
                                        type="number"
                                        value={secToEdit.content.limit ?? 6}
                                        onChange={(e) => {
                                          const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, limit: Number(e.target.value) } } : s);
                                          handleSavePageContent({ ...activePage, sections: updatedList });
                                        }}
                                        className="w-full bg-slate-900 border border-white/15 rounded px-3 py-2 text-white font-mono"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2 pt-5">
                                      <input
                                        type="checkbox"
                                        id="course-heading-opt"
                                        checked={secToEdit.content.showHeading ?? true}
                                        onChange={(e) => {
                                          const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, showHeading: e.target.checked } } : s);
                                          handleSavePageContent({ ...activePage, sections: updatedList });
                                        }}
                                        className="rounded border-white/15 bg-slate-900 text-[#D4AF37] focus:ring-0 cursor-pointer h-4 w-4"
                                      />
                                      <label htmlFor="course-heading-opt" className="text-gray-300 font-semibold cursor-pointer">Show Category filter links in courses display</label>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {secToEdit.type === "notices" && (
                                <div className="space-y-4 border-t border-white/5 pt-3">
                                  <div>
                                    <label className="block text-gray-400 mb-1 font-semibold">Max announcement items to display</label>
                                    <input 
                                      type="number"
                                      value={secToEdit.content.limit ?? 4}
                                      onChange={(e) => {
                                        const updatedList = activePage.sections.map(s => s.id === selectedSectionId ? { ...s, content: { ...s.content, limit: Number(e.target.value) } } : s);
                                        handleSavePageContent({ ...activePage, sections: updatedList });
                                      }}
                                      className="w-full bg-slate-900 border border-white/15 rounded px-3 py-2 text-white font-mono"
                                    />
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
                  <StorageImageUploader 
                    currentUrl={siteConfig.logoUrl}
                    onUrlChange={(url) => onSiteConfigUpdate({ ...siteConfig, logoUrl: url })}
                    folder="university_identity"
                    label="Or Upload/Drag Logo to Storage"
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

            {/* Social Networks Handles */}
            <div className="bg-slate-900 border border-[#D4AF37]/20 rounded-xl p-6 space-y-6 text-xs">
              <h3 className="text-xs uppercase font-mono tracking-widest text-[#D4AF37] font-bold border-l-2 border-[#D4AF37] pl-2">
                Social Networks Handles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 text-[10px]">Facebook Link</label>
                  <input 
                    type="text"
                    value={siteConfig.socialLinks?.facebook || ""}
                    onChange={(e) => onSiteConfigUpdate({ ...siteConfig, socialLinks: { ...siteConfig.socialLinks, facebook: e.target.value } })}
                    className="w-full bg-slate-950 border border-white/15 rounded px-2.5 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 text-[10px]">Twitter / X Link</label>
                  <input 
                    type="text"
                    value={siteConfig.socialLinks?.twitter || ""}
                    onChange={(e) => onSiteConfigUpdate({ ...siteConfig, socialLinks: { ...siteConfig.socialLinks, twitter: e.target.value } })}
                    className="w-full bg-slate-950 border border-white/15 rounded px-2.5 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 text-[10px]">LinkedIn Link</label>
                  <input 
                    type="text"
                    value={siteConfig.socialLinks?.linkedin || ""}
                    onChange={(e) => onSiteConfigUpdate({ ...siteConfig, socialLinks: { ...siteConfig.socialLinks, linkedin: e.target.value } })}
                    className="w-full bg-slate-950 border border-white/15 rounded px-2.5 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 text-[10px]">YouTube Handle</label>
                  <input 
                    type="text"
                    value={siteConfig.socialLinks?.youtube || ""}
                    onChange={(e) => onSiteConfigUpdate({ ...siteConfig, socialLinks: { ...siteConfig.socialLinks, youtube: e.target.value } })}
                    className="w-full bg-slate-950 border border-white/15 rounded px-2.5 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 text-[10px]">Instagram ID</label>
                  <input 
                    type="text"
                    value={siteConfig.socialLinks?.instagram || ""}
                    onChange={(e) => onSiteConfigUpdate({ ...siteConfig, socialLinks: { ...siteConfig.socialLinks, instagram: e.target.value } })}
                    className="w-full bg-slate-950 border border-white/15 rounded px-2.5 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Global Theme & SEO Parameters */}
            <div className="bg-slate-900 border border-[#D4AF37]/20 rounded-xl p-6 space-y-6 text-xs">
              <h3 className="text-xs uppercase font-mono tracking-widest text-[#D4AF37] font-bold border-l-2 border-[#D4AF37] pl-2">
                Themes & Search Engine Optimizations (SEO)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-1">Global SEO Title Page (Primary)</label>
                    <input 
                      type="text"
                      value={siteConfig.seoTitle || ""}
                      onChange={(e) => onSiteConfigUpdate({ ...siteConfig, seoTitle: e.target.value })}
                      className="w-full bg-slate-950 border border-white/15 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Global SEO Meta Description</label>
                    <textarea 
                      value={siteConfig.seoDescription || ""}
                      onChange={(e) => onSiteConfigUpdate({ ...siteConfig, seoDescription: e.target.value })}
                      className="w-full h-16 bg-slate-950 border border-white/15 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 mb-1">Theme Gold Accent Color</label>
                      <input 
                        type="text"
                        value={siteConfig.goldAccentColor || "#D4AF37"}
                        onChange={(e) => onSiteConfigUpdate({ ...siteConfig, goldAccentColor: e.target.value })}
                        className="w-full bg-slate-950 border border-white/15 rounded px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-1">Theme Primary Color</label>
                      <input 
                        type="text"
                        value={siteConfig.primaryThemeColor || "#58111A"}
                        onChange={(e) => onSiteConfigUpdate({ ...siteConfig, primaryThemeColor: e.target.value })}
                        className="w-full bg-slate-950 border border-white/15 rounded px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">University Accent Text Logo</label>
                    <input 
                      type="text"
                      value={siteConfig.logoText || "LSU"}
                      onChange={(e) => onSiteConfigUpdate({ ...siteConfig, logoText: e.target.value })}
                      className="w-full bg-slate-950 border border-white/15 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Header Navigation Editor */}
            <div className="bg-slate-900 border border-[#D4AF37]/20 rounded-xl p-6 space-y-6 text-xs">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-xs uppercase font-mono tracking-widest text-[#D4AF37] font-bold border-l-2 border-[#D4AF37] pl-2">
                  Header Navigation Menu Structure
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const newItem = { id: `nav-${Date.now()}`, label: "New Route", url: "/new-page", hasMegaMenu: false };
                    onSiteConfigUpdate({ ...siteConfig, navigation: [...(siteConfig.navigation || []), newItem] });
                  }}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1 text-[10px]"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Navigation Tab
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {(siteConfig.navigation || []).map((nav, idx) => (
                  <div key={nav.id} className="bg-slate-950 border border-white/10 rounded p-4 space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => {
                        const updatedNav = (siteConfig.navigation || []).filter((_, i) => i !== idx);
                        onSiteConfigUpdate({ ...siteConfig, navigation: updatedNav });
                      }}
                      className="absolute top-2 right-2 text-rose-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-6">
                      <div>
                        <label className="block text-gray-400 mb-0.5 text-[9px]">Menu Label text</label>
                        <input 
                          type="text"
                          value={nav.label}
                          onChange={(e) => {
                            const navsCopy = [...(siteConfig.navigation || [])];
                            navsCopy[idx] = { ...navsCopy[idx], label: e.target.value };
                            onSiteConfigUpdate({ ...siteConfig, navigation: navsCopy });
                          }}
                          className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-0.5 text-[9px]">Target Slug / URL</label>
                        <input 
                          type="text"
                          value={nav.url}
                          onChange={(e) => {
                            const navsCopy = [...(siteConfig.navigation || [])];
                            navsCopy[idx] = { ...navsCopy[idx], url: e.target.value };
                            onSiteConfigUpdate({ ...siteConfig, navigation: navsCopy });
                          }}
                          className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1 text-white font-mono"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-4">
                        <input 
                          type="checkbox"
                          id={`megamenu-toggle-${idx}`}
                          checked={nav.hasMegaMenu || false}
                          onChange={(e) => {
                            const navsCopy = [...(siteConfig.navigation || [])];
                            const toggled = e.target.checked;
                            navsCopy[idx] = { 
                              ...navsCopy[idx], 
                              hasMegaMenu: toggled,
                              megaMenuCategories: toggled ? (navsCopy[idx].megaMenuCategories || [{ title: "Focus Tracks", links: [] }]) : undefined
                            };
                            onSiteConfigUpdate({ ...siteConfig, navigation: navsCopy });
                          }}
                          className="rounded border-white/15 bg-slate-900 text-[#D4AF37] focus:ring-0 cursor-pointer h-4 w-4"
                        />
                        <label htmlFor={`megamenu-toggle-${idx}`} className="text-gray-400 font-semibold cursor-pointer">Enable Header Mega Menu</label>
                      </div>
                    </div>

                    {/* Nested Mega Menu Editor */}
                    {nav.hasMegaMenu && (
                      <div className="border-t border-white/10 pt-3 space-y-3 pl-3 bg-slate-900/40 rounded p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-[#D4AF37] font-bold font-mono uppercase tracking-wider">Mega Menu Category Columns</span>
                          <button
                            type="button"
                            onClick={() => {
                              const navsCopy = [...(siteConfig.navigation || [])];
                              const cats = navsCopy[idx].megaMenuCategories || [];
                              const newCat = { title: "New Category Column", links: [{ label: "Track Path", url: "/" }] };
                              navsCopy[idx] = { ...navsCopy[idx], megaMenuCategories: [...cats, newCat] };
                              onSiteConfigUpdate({ ...siteConfig, navigation: navsCopy });
                            }}
                            className="px-2 py-0.5 border border-[#D4AF37]/50 text-[#D4AF37] font-semibold rounded text-[9px] cursor-pointer"
                          >
                            + Add Column
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(nav.megaMenuCategories || []).map((cat, catIdx) => (
                            <div key={catIdx} className="bg-slate-950/70 border border-white/5 rounded p-3 space-y-2 relative">
                              <button
                                type="button"
                                onClick={() => {
                                  const navsCopy = [...(siteConfig.navigation || [])];
                                  const cats = (navsCopy[idx].megaMenuCategories || []).filter((_, cI) => cI !== catIdx);
                                  navsCopy[idx] = { ...navsCopy[idx], megaMenuCategories: cats };
                                  onSiteConfigUpdate({ ...siteConfig, navigation: navsCopy });
                                }}
                                className="absolute top-1 right-1 text-rose-450 hover:text-rose-400 text-[10px] cursor-pointer"
                              >
                                Delete
                              </button>
                              <div>
                                <label className="block text-gray-400 mb-0.5 text-[8px] uppercase">Column Title Heading</label>
                                <input 
                                  type="text"
                                  value={cat.title}
                                  onChange={(e) => {
                                    const navsCopy = [...(siteConfig.navigation || [])];
                                    const cats = [...(navsCopy[idx].megaMenuCategories || [])];
                                    cats[catIdx] = { ...cats[catIdx], title: e.target.value };
                                    navsCopy[idx] = { ...navsCopy[idx], megaMenuCategories: cats };
                                    onSiteConfigUpdate({ ...siteConfig, navigation: navsCopy });
                                  }}
                                  className="w-full bg-slate-900 border border-white/10 rounded px-2 py-1 text-white text-[11px]"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="block text-gray-400 text-[8px] uppercase font-mono">Sub-Links (Format: LinkName|url route - one per line)</label>
                                <textarea
                                  value={(cat.links || []).map(l => `${l.label}|${l.url}`).join("\n")}
                                  onChange={(e) => {
                                    const lines = e.target.value.split("\n");
                                    const cleanLinks = lines.map(line => {
                                      const parts = line.split("|");
                                      return { label: parts[0]?.trim() || "Link", url: parts[1]?.trim() || "/" };
                                    }).filter(l => l.label);
                                    const navsCopy = [...(siteConfig.navigation || [])];
                                    const cats = [...(navsCopy[idx].megaMenuCategories || [])];
                                    cats[catIdx] = { ...cats[catIdx], links: cleanLinks };
                                    navsCopy[idx] = { ...navsCopy[idx], megaMenuCategories: cats };
                                    onSiteConfigUpdate({ ...siteConfig, navigation: navsCopy });
                                  }}
                                  placeholder="Degree A|/courses&#10;Degree B|/courses"
                                  className="w-full h-16 bg-slate-900 border border-white/10 rounded p-1.5 font-mono text-[9px] text-gray-300 leading-relaxed"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Navigation Columns Editor */}
            <div className="bg-slate-900 border border-[#D4AF37]/20 rounded-xl p-6 space-y-6 text-xs">
              <h3 className="text-xs uppercase font-mono tracking-widest text-[#D4AF37] font-bold border-l-2 border-[#D4AF37] pl-2">
                Footer Columns & Links Builder
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(siteConfig.footerSections || []).map((footSec, fIdx) => (
                  <div key={fIdx} className="bg-slate-950 border border-white/10 rounded p-4 space-y-3 relative">
                    <div>
                      <label className="block text-gray-400 mb-1 text-[10px] uppercase font-bold">Column Heading Title</label>
                      <input 
                        type="text"
                        value={footSec.title}
                        onChange={(e) => {
                          const footCopy = [...(siteConfig.footerSections || [])];
                          footCopy[fIdx] = { ...footCopy[fIdx], title: e.target.value };
                          onSiteConfigUpdate({ ...siteConfig, footerSections: footCopy });
                        }}
                        className="w-full bg-[#030712] border border-[#D4AF37]/35 rounded px-3 py-1.5 text-white font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1 text-[9px] uppercase">Links list configuration (Name|URL format, one per line)</label>
                      <textarea
                        value={(footSec.links || []).map(l => `${l.label}|${l.url}`).join("\n")}
                        onChange={(e) => {
                          const lines = e.target.value.split("\n");
                          const parsedLinks = lines.map(line => {
                            const parts = line.split("|");
                            return { label: parts[0]?.trim() || "Link", url: parts[1]?.trim() || "/" };
                          }).filter(l => l.label);
                          const footCopy = [...(siteConfig.footerSections || [])];
                          footCopy[fIdx] = { ...footCopy[fIdx], links: parsedLinks };
                          onSiteConfigUpdate({ ...siteConfig, footerSections: footCopy });
                        }}
                        placeholder="Privacy Statement|/about&#10;Admissions Hub|/notices"
                        className="w-full h-32 bg-slate-900 border border-white/10 rounded p-2 text-white font-mono text-[10px] leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
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

        {/* --- CERTIFICATE SECURE REGISTRY & TEMPLATE CMS --- */}
        {activeTab === "certs" && (
          <div className="space-y-6 animate-fadeIn" id="cms-certs-tab">
            
            {/* Header & Master Action */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
              <div>
                <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#D4AF37] uppercase">
                  Academic Credentials Desk
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Issue student degrees, search archival registrations, and configure visual layout design formats.
                </p>
              </div>
              
              {certSubTab === "list" && (
                <button
                  onClick={() => setShowAddCertModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#C29E30] text-black font-bold text-xs rounded uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:brightness-110 active:scale-95 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" /> Issue Certificate
                </button>
              )}
            </div>

            {/* Sub-tab selection */}
            <div className="flex border-b border-white/10 gap-6 text-sm">
              <button
                onClick={() => setCertSubTab("list")}
                className={`pb-3 px-1 font-semibold uppercase tracking-wider text-xs transition-all relative ${
                  certSubTab === "list" ? "text-[#D4AF37] font-bold" : "text-gray-400 hover:text-white"
                }`}
              >
                Issued Registrations ({certificates.length})
                {certSubTab === "list" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />}
              </button>
              <button
                onClick={() => setCertSubTab("template")}
                className={`pb-3 px-1 font-semibold uppercase tracking-wider text-xs transition-all relative ${
                  certSubTab === "template" ? "text-[#D4AF37] font-bold" : "text-gray-400 hover:text-white"
                }`}
              >
                Visual Template CMS
                {certSubTab === "template" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />}
              </button>
            </div>

            {/* 1. Sub-Tab: INDEXED LISTED DEGREES */}
            {certSubTab === "list" && (
              <div className="bg-slate-900 border border-[#D4AF37]/20 rounded-xl overflow-hidden shadow-lg">
                <div className="p-4 bg-slate-950 border-b border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                  <span>Cryptographic Ledger Registries</span>
                  <span>Active Count: {certificates.length}</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950/50 text-[#D4AF37] font-mono border-b border-white/5">
                        <th className="p-4 uppercase tracking-wider">Serial No.</th>
                        <th className="p-4 uppercase tracking-wider">Enrollment ID</th>
                        <th className="p-4 uppercase tracking-wider">Registration Code</th>
                        <th className="p-4 uppercase tracking-wider">Student Name</th>
                        <th className="p-4 uppercase tracking-wider">Degree Track & Specialization</th>
                        <th className="p-4 uppercase tracking-wider">Issue Date</th>
                        <th className="p-4 uppercase tracking-wider">GPA/Class</th>
                        <th className="p-4 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      {certificates.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-gray-500 italic font-mono uppercase">
                            No credentials recorded. Click &quot;Issue Certificate&quot; to seed registry.
                          </td>
                        </tr>
                      ) : (
                        certificates.map((cert) => (
                          <tr key={cert.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-mono font-bold text-white select-all">{cert.certificateNo}</td>
                            <td className="p-4 font-mono text-gray-400 select-all">{cert.enrollmentNo}</td>
                            <td className="p-4 font-mono text-gray-400 select-all">{cert.registrationNo || "N/A"}</td>
                            <td className="p-4 font-semibold text-white">
                              <div>{cert.studentName}</div>
                              {cert.fatherName && <div className="text-[10px] text-gray-400 font-normal">S/o: {cert.fatherName}</div>}
                            </td>
                            <td className="p-4">
                              <div className="font-medium text-slate-200">{cert.course}</div>
                              {cert.specialization && <div className="text-[10px] text-[#D4AF37]/80">{cert.specialization}</div>}
                            </td>
                            <td className="p-4 font-mono text-slate-350">{cert.issueDate}</td>
                            <td className="p-4 font-mono">
                              <div>{cert.grade}</div>
                              {cert.cgpa && <div className="text-[10px] text-gray-400">CGPA: {cert.cgpa}</div>}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex gap-2 justify-end">
                                <a
                                  href={`#/verify?id=${encodeURIComponent(cert.certificateNo)}`}
                                  className="p-1 px-2 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded text-[10px] uppercase font-bold"
                                >
                                  View
                                </a>
                                <button
                                  onClick={() => handleDeleteCert(cert.id)}
                                  className="p-1 px-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white rounded text-[10px] uppercase font-bold transition-all"
                                >
                                  Void
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. Sub-Tab: VISUAL TEMPLATE BUILDER */}
            {certSubTab === "template" && (
              <form onSubmit={handleSaveTemplate} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form controls (Left 6 - col span 6) */}
                <div className="lg:col-span-6 bg-slate-900 border border-[#D4AF37]/20 rounded-xl p-5 md:p-6 space-y-4">
                  <div className="border-b border-white/5 pb-2 flex justify-between items-center">
                    <h3 className="text-xs uppercase font-mono tracking-wider text-[#D4AF37] font-semibold flex items-center gap-2">
                      <Database className="w-4 h-4" /> Layout Parameter controls
                    </h3>
                    <button
                      type="submit"
                      disabled={isSyncing}
                      className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C29E30] text-black font-bold text-xs uppercase rounded tracking-wider flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Changes
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    
                    <div className="md:col-span-2">
                      <label className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">University Official name</label>
                      <input 
                        type="text"
                        value={certificateTemplate.universityName || ""}
                        onChange={(e) => onTemplateUpdate({ ...certificateTemplate, universityName: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white"
                        placeholder="e.g. LAKSHMI SEHGAL UNIVERSITY"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">University Address Section</label>
                      <input 
                        type="text"
                        value={certificateTemplate.address || ""}
                        onChange={(e) => onTemplateUpdate({ ...certificateTemplate, address: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white"
                        placeholder="e.g. Sector 128, Expressway, NCR, Noida 201304"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">Contact Numbers</label>
                      <input 
                        type="text"
                        value={certificateTemplate.contactNumber || ""}
                        onChange={(e) => onTemplateUpdate({ ...certificateTemplate, contactNumber: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white font-mono"
                        placeholder="e.g. +91-11-4091-6200"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">Website coordinate</label>
                      <input 
                        type="text"
                        value={certificateTemplate.website || ""}
                        onChange={(e) => onTemplateUpdate({ ...certificateTemplate, website: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white font-mono"
                        placeholder="e.g. www.lsu.edu.in"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">Official admissions Email</label>
                      <input 
                        type="text"
                        value={certificateTemplate.email || ""}
                        onChange={(e) => onTemplateUpdate({ ...certificateTemplate, email: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white font-mono"
                        placeholder="e.g. admissions@lsu.edu.in"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">logo Image URL</label>
                      <input 
                        type="text"
                        value={certificateTemplate.logoUrl || ""}
                        onChange={(e) => onTemplateUpdate({ ...certificateTemplate, logoUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white font-mono"
                        placeholder="HTTP Image reference"
                      />
                      <StorageImageUploader 
                        currentUrl={certificateTemplate.logoUrl || ""}
                        onUrlChange={(url) => onTemplateUpdate({ ...certificateTemplate, logoUrl: url })}
                        folder="certificate_templates"
                        label="Or Upload/Drag Certificate Logo"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">Accreditations Details</label>
                      <input 
                        type="text"
                        value={certificateTemplate.accreditationBadge || ""}
                        onChange={(e) => onTemplateUpdate({ ...certificateTemplate, accreditationBadge: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white"
                        placeholder="e.g. UGC Sec 2(f) | NAAC A++ Grade (CGPA 3.82)"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">Certificate Display Title</label>
                      <input 
                        type="text"
                        value={certificateTemplate.certificateTitle || ""}
                        onChange={(e) => onTemplateUpdate({ ...certificateTemplate, certificateTitle: e.target.value })}
                        className="w-full bg-[#1A050B] border border-[#D4AF37]/35 rounded px-3 py-2 text-white font-bold"
                        placeholder="e.g. OFFICIAL TRANSCRIPT & DEGREE DECREE"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[#D4AF37] mb-1 font-semibold uppercase tracking-wider text-[9.5px]">
                        Structured Text Content Layout Templates
                      </label>
                      <textarea 
                        value={certificateTemplate.certificateContent || ""}
                        onChange={(e) => onTemplateUpdate({ ...certificateTemplate, certificateContent: e.target.value })}
                        className="w-full h-32 bg-slate-950 border border-white/10 rounded px-3 py-2 text-white text-[11px] leading-relaxed font-serif"
                        placeholder="This is to certify that [STUDENT_NAME] child of [FATHER_NAME]..."
                        required
                      />
                      <span className="text-[9.5px] text-gray-500 leading-relaxed block mt-1">
                        Supported dynamic tokens replaced at render time: <code className="text-[#D4AF37] bg-white/5 font-mono px-0.5 rounded">[STUDENT_NAME]</code>, <code className="text-[#D4AF37] bg-white/5 font-mono px-0.5 rounded">[FATHER_NAME]</code>, <code className="text-[#D4AF37] bg-white/5 font-mono px-0.5 rounded">[ENROLLMENT_NO]</code>, <code className="text-[#D4AF37] bg-white/5 font-mono px-0.5 rounded">[REGISTRATION_NO]</code>, <code className="text-[#D4AF37] bg-white/5 font-mono px-0.5 rounded">[COURSE_NAME]</code>, <code className="text-[#D4AF37] bg-white/5 font-mono px-0.5 rounded">[SPECIALIZATION]</code>, <code className="text-[#D4AF37] bg-white/5 font-mono px-0.5 rounded">[GRADE]</code>, <code className="text-[#D4AF37] bg-white/5 font-mono px-0.5 rounded">[CGPA]</code>, <code className="text-[#D4AF37] bg-white/5 font-mono px-0.5 rounded">[PASSING_YEAR]</code>.
                      </span>
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">Registrar Name</label>
                      <input 
                        type="text"
                        value={certificateTemplate.registrarName || ""}
                        onChange={(e) => onTemplateUpdate({ ...certificateTemplate, registrarName: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white"
                        placeholder="e.g. Dr. Sandeep Pathak"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">Registrar Signature image</label>
                      <input 
                        type="text"
                        value={certificateTemplate.signatureImage1 || ""}
                        onChange={(e) => onTemplateUpdate({ ...certificateTemplate, signatureImage1: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white font-mono"
                        placeholder="Registrar Signature PNG image URL (mix-blend)"
                      />
                      <StorageImageUploader 
                        currentUrl={certificateTemplate.signatureImage1 || ""}
                        onUrlChange={(url) => onTemplateUpdate({ ...certificateTemplate, signatureImage1: url })}
                        folder="certificate_signatures"
                        label="Or Upload/Drag Registrar Signature"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">Vice Chancellor Name</label>
                      <input 
                        type="text"
                        value={certificateTemplate.viceChancellorName || ""}
                        onChange={(e) => onTemplateUpdate({ ...certificateTemplate, viceChancellorName: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white"
                        placeholder="e.g. Prof. G.S. Prasad"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">VC Signature image</label>
                      <input 
                        type="text"
                        value={certificateTemplate.signatureImage2 || ""}
                        onChange={(e) => onTemplateUpdate({ ...certificateTemplate, signatureImage2: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white font-mono"
                        placeholder="VC Signature PNG image URL (mix-blend)"
                      />
                      <StorageImageUploader 
                        currentUrl={certificateTemplate.signatureImage2 || ""}
                        onUrlChange={(url) => onTemplateUpdate({ ...certificateTemplate, signatureImage2: url })}
                        folder="certificate_signatures"
                        label="Or Upload/Drag VC Signature"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">Seal / Stamp visual URL</label>
                      <input 
                        type="text"
                        value={certificateTemplate.sealStampImage || ""}
                        onChange={(e) => onTemplateUpdate({ ...certificateTemplate, sealStampImage: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white font-mono"
                        placeholder="Seal PNG image URL"
                      />
                      <StorageImageUploader 
                        currentUrl={certificateTemplate.sealStampImage || ""}
                        onUrlChange={(url) => onTemplateUpdate({ ...certificateTemplate, sealStampImage: url })}
                        folder="certificate_seals"
                        label="Or Upload/Drag Seal Stamp"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">QR Code Position</label>
                      <select
                        value={certificateTemplate.qrCodePosition || "bottom-right"}
                        onChange={(e) => onTemplateUpdate({ ...certificateTemplate, qrCodePosition: e.target.value as any })}
                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white"
                      >
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-center">Bottom Center</option>
                        <option value="top-right">Top Right (Absolute)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">Frame Border style Preset</label>
                      <select
                        value={certificateTemplate.certificateBackground || "classic-border"}
                        onChange={(e) => onTemplateUpdate({ ...certificateTemplate, certificateBackground: e.target.value as any })}
                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white font-semibold"
                      >
                        <option value="classic-border">Classic Academy (Royal Burgundy & Gold)</option>
                        <option value="modern-gold">Geometric Elegance (Stoneware Dark Gold)</option>
                        <option value="royal-accent">Imperial Velvet Navy (Deep Blue & Silk)</option>
                        <option value="bordered-clean">Corporate Fine double Gold line</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-400 mb-1 font-semibold uppercase tracking-wider text-[9px]">Footer Disclaimer Legend Text</label>
                      <input 
                        type="text"
                        value={certificateTemplate.certificateFooter || ""}
                        onChange={(e) => onTemplateUpdate({ ...certificateTemplate, certificateFooter: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white"
                        placeholder="e.g. Secured via central military blockchain network registry"
                      />
                    </div>

                  </div>
                </div>

                {/* Live visual preview Sandbox (Right 6 - col span 6) */}
                <div className="lg:col-span-6 bg-slate-950 border-2 border-dashed border-[#D4AF37]/35 rounded-xl p-4 md:p-6 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Real-time Visual verification Mock
                    </span>
                    <span className="text-[9px] font-mono bg-white/5 text-gray-350 px-2 py-0.5 rounded">
                      Width Responsive Template Frame
                    </span>
                  </div>

                  {/* Sandbox rendering */}
                  <div className="border border-white/10 shadow-2xl rounded-lg p-4 bg-zinc-900 overflow-hidden relative" id="sandbox-viewport">
                    <div className={`p-4 md:p-6 text-center space-y-3 relative overflow-hidden text-xs rounded border border-light ${
                      certificateTemplate.certificateBackground === "modern-gold" ? "bg-stone-900 border-[8px] border-amber-950 text-stone-300" :
                      certificateTemplate.certificateBackground === "royal-accent" ? "bg-slate-900 border-[8px] border-[#58111A] text-slate-100" :
                      certificateTemplate.certificateBackground === "bordered-clean" ? "bg-zinc-50 border-[4px] border-[#D4AF37] text-stone-900" :
                      "bg-white border-[8px] border-[#58111A] text-gray-700"
                    }`}>
                      
                      {/* Inner hairline */}
                      <div className="absolute inset-1 border border-[#D4AF37]/30 pointer-events-none" />

                      {/* Top Right absolute QR position in Mock preview */}
                      {certificateTemplate.qrCodePosition === "top-right" && (
                        <div className="absolute top-2 right-2 text-[8px] border border-gray-400 p-1 bg-black text-white rounded font-mono uppercase scale-75">
                          QR MOCK
                        </div>
                      )}

                      {/* Logo and Uni details */}
                      <div className="flex flex-col items-center space-y-0.5">
                        {certificateTemplate.logoUrl ? (
                          <img src={certificateTemplate.logoUrl} alt="prev_logo" className="w-8 h-8 rounded-full object-contain mx-auto mix-blend-multiply" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-8 h-8 bg-[#58111A]/20 rounded-full flex items-center justify-center text-[#D4AF37]"><Award className="w-5 h-5" /></div>
                        )}
                        <h4 className="text-xs font-serif font-extrabold uppercase mt-1 leading-tight tracking-wider">
                          {certificateTemplate.universityName || "LAKSHMI SEHGAL UNIVERSITY"}
                        </h4>
                        <p className="text-[7.5px] text-gray-405 leading-none font-mono max-w-sm cut-text">{certificateTemplate.address}</p>
                        {certificateTemplate.accreditationBadge && (
                          <span className="text-[6.5px] scale-90 text-[#D4AF37] font-mono tracking-wide uppercase bg-black/5 px-2 py-0.5 rounded border border-[#D4AF37]/10 inline-block mt-0.5">
                            {certificateTemplate.accreditationBadge}
                          </span>
                        )}
                      </div>

                      {/* Mock Core Student coordinates */}
                      <div className="space-y-1">
                        <span className="text-[8px] text-gray-400 italic block">This is to declare with high credit that</span>
                        <h5 className="text-sm font-serif font-semibold text-[#58111A] tracking-wide">
                          Aditya Vardhan Dixit
                        </h5>
                        <p className="text-[8.5px] text-gray-500 font-sans leading-none">
                          Child of <strong>Shri Rajesh Dixit</strong> &bull; Enrollment: <strong>LSU2022CSE402</strong>
                        </p>
                      </div>

                      {/* Dynamic Substitutions Content preview */}
                      <div className="space-y-1 max-w-md mx-auto py-1 border-t border-b border-gray-150-soft">
                        <h6 className="text-[7.5px] font-mono tracking-widest text-[#D4AF37] font-bold uppercase select-none">
                          {certificateTemplate.certificateTitle || "TRANSCRIPT DEGREE"}
                        </h6>
                        <p className="text-[8.5px] font-serif italic text-gray-500 leading-normal line-clamp-4">
                          {/* Substitute standard mock value fields */}
                          {(certificateTemplate.certificateContent || "")
                            .replace(/\[STUDENT_NAME\]/gi, "Aditya Vardhan Dixit")
                            .replace(/\[FATHER_NAME\]/gi, "Shri Rajesh Dixit")
                            .replace(/\[ENROLLMENT_NO\]/gi, "LSU2022CSE402")
                            .replace(/\[REGISTRATION_NO\]/gi, "REG-2022-CSE-402")
                            .replace(/\[COURSE_NAME\]/gi, "Bachelor of Technology")
                            .replace(/\[SPECIALIZATION\]/gi, "Computer Science & Engineering")
                            .replace(/\[GRADE\]/gi, "First Class with Distinction")
                            .replace(/\[CGPA\]/gi, "9.82 CGPA")
                            .replace(/\[PASSING_YEAR\]/gi, "2025")
                          }
                        </p>
                      </div>

                      {/* Signature block mock */}
                      <div className="grid grid-cols-4 gap-2 text-center pt-2 justify-items-center items-end text-[7px] leading-tight">
                        <div className="w-full">
                          <span className="block border-b border-gray-300 pb-0.5 select-all font-mono">June 14, 2025</span>
                          <span className="text-[5.5px] text-gray-400 uppercase font-mono mt-0.5 block">Issue Date</span>
                        </div>
                        <div className="w-full">
                          <span className="block italic h-4 flex items-end justify-center text-slate-800 font-serif font-medium">{certificateTemplate.registrarName || "Registrar"}</span>
                          <span className="block border-t border-gray-350 select-none font-bold text-gray-900 mt-0.5 uppercase tracking-wide">REGISTRAR</span>
                        </div>
                        <div className="w-full">
                          <span className="block italic h-4 flex items-end justify-center text-slate-800 font-serif font-medium">{certificateTemplate.viceChancellorName || "V.C."}</span>
                          <span className="block border-t border-gray-350 select-none font-bold text-gray-900 mt-0.5 uppercase tracking-wide">VICE CHANCELLOR</span>
                        </div>
                        <div className="w-full flex flex-col items-center">
                          {certificateTemplate.sealStampImage ? (
                            <img src={certificateTemplate.sealStampImage} alt="sealstamp" className="h-4 object-contain mx-auto" />
                          ) : (
                            <div className="w-4 h-4 bg-amber-500/10 rounded-full flex items-center justify-center"><Award className="w-3.5 h-3.5 text-[#D4AF37]/50" /></div>
                          )}
                          <span className="text-[5.5px] text-gray-400 uppercase font-mono mt-0.5 block">Official Seal</span>
                        </div>
                      </div>

                      {/* Bottom row mock */}
                      <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                        {certificateTemplate.qrCodePosition !== "top-right" && (
                          <div className={`text-[8px] font-mono uppercase bg-black text-white p-1 rounded tracking-widest scale-75 select-none ${
                            certificateTemplate.qrCodePosition === "bottom-left" ? "order-1" :
                            certificateTemplate.qrCodePosition === "bottom-center" ? "mx-auto order-2" : "order-3"
                          }`}>
                            QR CODE MOCK
                          </div>
                        )}
                        <p className={`text-[7px] text-gray-400 text-left italic font-serif leading-none mt-1 max-w-xs ${
                          certificateTemplate.qrCodePosition === "bottom-left" ? "order-3" : "order-2"
                        }`}>
                          {certificateTemplate.certificateFooter}
                        </p>
                      </div>

                    </div>
                  </div>

                  <div className="bg-[#1C160C] border border-[#D4AF37]/40 rounded-lg p-4 text-[#D4AF37] space-y-1.5 text-xs">
                    <p className="font-bold flex items-center gap-1"><Info className="w-4 h-4" /> Template Layout Instructions</p>
                    <p className="text-gray-300 leading-normal text-[11px]">
                      The visual styles, borders, text mappings, and positions configured here apply instantly across the whole university platform. Try searching for <code className="bg-black/30 px-1 font-mono rounded">LSU-9283-1029</code> inside the verification page to view the live rendering.
                    </p>
                  </div>
                </div>

              </form>
            )}

          </div>
        )}

        {/* --- MEDIA MANAGER CMS --- */}
        {activeTab === "media" && (
          <MediaManagerPanel 
            mediaItems={mediaItems}
            triggerNotify={triggerNotify} 
          />
        )}

        {/* --- GALLERY MANAGER CMS --- */}
        {activeTab === "gallery" && (
          <GalleryManagerPanel 
            galleryAlbums={galleryAlbums}
            onGalleryAlbumsUpdate={onGalleryAlbumsUpdate}
            triggerNotify={triggerNotify}
          />
        )}

        {/* --- ADMISSION MANAGER --- */}
        {activeTab === "admissions" && (
          <AdmissionManagerPanel 
            admissions={admissions}
            triggerNotify={triggerNotify}
          />
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
        <div className="fixed inset-0 z-50 bg-[#030712]/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleAddCertificate} className="w-full max-w-lg bg-[#0A192F] border-2 border-[#D4AF37] text-white p-6 rounded-xl space-y-4 shadow-2xl my-8">
            <div className="border-b border-white/10 pb-2 flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-[#D4AF37]">Issue Academic credential</h3>
              <button type="button" onClick={() => setShowAddCertModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
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
                  placeholder="e.g. LSU2022CSE402"
                  value={newCert.enrollmentNo || ""}
                  onChange={(e) => setNewCert({ ...newCert, enrollmentNo: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Student Registration No.</label>
                <input 
                  type="text"
                  placeholder="e.g. REG-201-4402"
                  value={newCert.registrationNo || ""}
                  onChange={(e) => setNewCert({ ...newCert, registrationNo: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 font-mono"
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
                <label className="block text-gray-400 mb-1">Father's Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Shri Rajesh Dixit"
                  value={newCert.fatherName || ""}
                  onChange={(e) => setNewCert({ ...newCert, fatherName: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Course / Degree Awarded</label>
                <input 
                  type="text"
                  placeholder="e.g. Bachelor of Technology"
                  value={newCert.course || ""}
                  onChange={(e) => setNewCert({ ...newCert, course: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Specialization Section</label>
                <input 
                  type="text"
                  placeholder="e.g. Computer Science & Engineering"
                  value={newCert.specialization || ""}
                  onChange={(e) => setNewCert({ ...newCert, specialization: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Passing Year</label>
                <input 
                  type="text"
                  placeholder="e.g. 2025"
                  value={newCert.passingYear || ""}
                  onChange={(e) => setNewCert({ ...newCert, passingYear: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 font-mono"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Cumulative Evaluation (CGPA)</label>
                <input 
                  type="text"
                  placeholder="e.g. 9.82 CGPA"
                  value={newCert.cgpa || ""}
                  onChange={(e) => setNewCert({ ...newCert, cgpa: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 font-mono"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Class Grade Division</label>
                <input 
                  type="text"
                  placeholder="e.g. First Class with Distinction"
                  value={newCert.grade || ""}
                  onChange={(e) => setNewCert({ ...newCert, grade: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Dedicated Issue Date Picker</label>
                <input 
                  type="date"
                  value={newCert.issueDate || ""}
                  onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Verification Status</label>
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
              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-1">Dean Remarks / Additional Notes</label>
                <textarea 
                  placeholder="Remarks shown during certificate inspection"
                  value={newCert.remarks || ""}
                  onChange={(e) => setNewCert({ ...newCert, remarks: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 h-16 text-white text-xs focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 text-xs pt-2">
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

/* ========================================================
   MODULAR CMS MANAGERS (MEDIA, GALLERY, ADMISSIONS)
   ======================================================== */

interface MediaManagerPanelProps {
  mediaItems: MediaItem[];
  triggerNotify: (msg: string) => void;
}

function MediaManagerPanel({ mediaItems, triggerNotify }: MediaManagerPanelProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [folder, setFolder] = useState<"Gallery" | "Courses" | "Notices" | "Admissions" | "Certificates" | "Uncategorized">("Gallery");
  const [search, setSearch] = useState("");

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;
    const id = `med-${Date.now()}`;
    const payload: MediaItem = {
      id,
      name,
      url,
      folder,
      mimeType: url.endsWith(".mp4") ? "video/mp4" : "image/jpeg",
      size: "240 KB",
      createdAt: new Date().toISOString().split("T")[0]
    };
    try {
      await setDoc(doc(db, "media_items", id), payload);
      setName("");
      setUrl("");
      triggerNotify("Asset URL logged in administrative database!");
    } catch (err) {
      triggerNotify("Failed to store media record");
    }
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      await deleteDoc(doc(db, "media_items", id));
      triggerNotify("Asset record deleted permanently");
    } catch (err) {
      triggerNotify("Delete error occurred");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    triggerNotify("Direct url link copied to clipboard!");
  };

  const filtered = mediaItems.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.folder.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn" id="media-manager-panel">
      <div>
        <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#D4AF37] uppercase">
          University Centralized Media Vault
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Store reference links/images for the platform. Copy links to embed in dynamic sections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-slate-900/60 border border-[#D4AF37]/25 p-6 rounded-xl space-y-4 h-fit">
          <h3 className="text-sm font-mono tracking-widest text-[#D4AF37] font-bold border-b border-[#D4AF37]/15 pb-2 uppercase">
            Log New Vault Entry
          </h3>
          <form onSubmit={handleAddMedia} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-400 mb-1">Friendly Asset Name</label>
              <input
                type="text"
                placeholder="e.g. Campus Drone Shot"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Direct Resource Link (URL)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37] font-mono"
                required
              />
              <StorageImageUploader 
                currentUrl={url}
                onUrlChange={(uploadedUrl) => {
                  setUrl(uploadedUrl);
                  if (!name) {
                    const filename = uploadedUrl.split("/").pop()?.split("?")[0] || "Uploaded Asset";
                    setName(decodeURIComponent(filename));
                  }
                }}
                folder="media_vault"
                label="Or Drag/Drop to Upload directly to Storage"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Classification Folder</label>
              <select
                value={folder}
                onChange={e => setFolder(e.target.value as any)}
                className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white focus:outline-none"
              >
                <option value="Gallery">Gallery Collections</option>
                <option value="Courses">Courses & Syllabi</option>
                <option value="Notices">Notices & Bulletins</option>
                <option value="Admissions">Admissions</option>
                <option value="Certificates">Certificates</option>
                <option value="Uncategorized">Uncategorized</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#D4AF37] text-black font-extrabold tracking-wider uppercase rounded hover:bg-[#C29E30] transition-colors cursor-pointer text-xs"
            >
              Insert Asset Link
            </button>
          </form>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
            <input
              type="text"
              placeholder="Search file catalog by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-xs text-white border-none outline-none focus:ring-0 w-full"
            />
          </div>
          
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white/[0.01] border border-dashed border-white/10 rounded-lg text-xs text-gray-500">
              No assets found matching query.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#050001] border hover:border-[#D4AF37] border-white/10 rounded-lg p-4 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-mono tracking-widest bg-[#58111A] text-[#D4AF37] border border-[#D4AF37]/25 px-2 py-0.5 rounded uppercase">
                        {item.folder}
                      </span>
                      <button
                        onClick={() => handleDeleteMedia(item.id)}
                        className="text-gray-500 hover:text-rose-400 p-1 rounded hover:bg-white/5 transition-all cursor-pointer"
                        title="Delete asset record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[10px] font-mono text-gray-500 line-clamp-1">
                      {item.url}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(item.url)}
                    className="w-full py-1.5 bg-white/5 border border-[#D4AF37]/20 hover:border-[#D4AF37] text-[10px] tracking-wider uppercase text-gray-300 hover:text-white font-mono rounded flex justify-center items-center gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <Copy className="w-3 h-3" /> Copy Direct Link
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface GalleryManagerPanelProps {
  galleryAlbums: GalleryAlbum[];
  onGalleryAlbumsUpdate: (albums: GalleryAlbum[]) => void;
  triggerNotify: (msg: string) => void;
}

function GalleryManagerPanel({ galleryAlbums, onGalleryAlbumsUpdate, triggerNotify }: GalleryManagerPanelProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);

  // New Album Form
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [newAlbumType, setNewAlbumType] = useState<"Campus" | "Events" | "Convocation" | "Sports" | "Cultural">("Campus");

  // New Media Form
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newMediaType, setNewMediaType] = useState<"image" | "video">("image");
  const [newMediaCaption, setNewMediaCaption] = useState("");

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumTitle) return;
    const id = `alb-${Date.now()}`;
    const newAlbum: GalleryAlbum = {
      id,
      title: newAlbumTitle,
      type: newAlbumType,
      order: galleryAlbums.length + 1,
      media: []
    };
    try {
      await setDoc(doc(db, "gallery_albums", id), newAlbum);
      setNewAlbumTitle("");
      triggerNotify("New gallery album created successfully!");
    } catch (err) {
      triggerNotify("Failed to create database album");
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!window.confirm("Delete this gallery album and all nested images permanently?")) return;
    try {
      await deleteDoc(doc(db, "gallery_albums", id));
      setSelectedAlbum(null);
      triggerNotify("Album deleted permanently");
    } catch (err) {
      triggerNotify("Internal deletion error");
    }
  };

  const handleAddMediaToAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlbum || !newMediaUrl) return;
    const mediaId = `gmed-${Date.now()}`;
    const newItem: GalleryMediaItem = {
      id: mediaId,
      url: newMediaUrl,
      type: newMediaType,
      caption: newMediaCaption
    };

    const updatedMedia = [...(selectedAlbum.media || []), newItem];
    try {
      await updateDoc(doc(db, "gallery_albums", selectedAlbum.id), { media: updatedMedia });
      setSelectedAlbum({ ...selectedAlbum, media: updatedMedia });
      setNewMediaUrl("");
      setNewMediaCaption("");
      triggerNotify("Media catalog item associated!");
    } catch (err) {
      triggerNotify("Could not associate media to album");
    }
  };

  const handleDeleteMediaFromAlbum = async (mediaId: string) => {
    if (!selectedAlbum) return;
    const remaining = (selectedAlbum.media || []).filter(m => m.id !== mediaId);
    try {
      await updateDoc(doc(db, "gallery_albums", selectedAlbum.id), { media: remaining });
      setSelectedAlbum({ ...selectedAlbum, media: remaining });
      triggerNotify("Asset removed from album");
    } catch (err) {
      triggerNotify("Could not remove item");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="gallery-manager-panel">
      <div>
        <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#D4AF37] uppercase">
          Dynamic Campus Exhibition Curator
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Maintain interactive visual albums and photo collages. These align with your homepage and dynamic gallery routes.
        </p>
      </div>

      {selectedAlbum ? (
        <div className="space-y-6 border border-[#D4AF37]/30 bg-slate-900/40 p-6 rounded-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 gap-4">
            <div>
              <button
                onClick={() => setSelectedAlbum(null)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#D4AF37] rounded mb-2 transition-all cursor-pointer"
              >
                ← Return to Albums Catalog
              </button>
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono tracking-widest bg-[#58111A] text-[#D4AF37] border border-[#D4AF37]/35 px-2 py-0.5 rounded uppercase">
                  {selectedAlbum.type}
                </span>
                Editing Album: {selectedAlbum.title}
              </h3>
            </div>
            
            <button
              onClick={() => handleDeleteAlbum(selectedAlbum.id)}
              className="px-3 py-2 bg-rose-950/80 border border-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ml-auto sm:ml-0"
              title="Delete this entire album"
            >
              <Trash2 className="w-3.5 h-3.5" /> TERMINATE ALBUM
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-slate-950/80 p-5 rounded-lg border border-white/5 text-xs space-y-4 h-fit">
              <h4 className="text-[#D4AF37] font-mono font-bold tracking-widest border-b border-white/10 pb-1.5 uppercase">
                Add Photo/Video Asset
              </h4>
              <form onSubmit={handleAddMediaToAlbum} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Direct Resource Link (URL)</label>
                  <input
                    type="url"
                    placeholder="e.g. https://images.unsplash.com/..."
                    value={newMediaUrl}
                    onChange={e => setNewMediaUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-white font-mono focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Asset Format</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1 text-white cursor-pointer select-none">
                      <input
                        type="radio"
                        checked={newMediaType === "image"}
                        onChange={() => setNewMediaType("image")}
                        className="accent-[#D4AF37]"
                      />
                      Photo Image
                    </label>
                    <label className="flex items-center gap-1 text-white cursor-pointer select-none">
                      <input
                        type="radio"
                        checked={newMediaType === "video"}
                        onChange={() => setNewMediaType("video")}
                        className="accent-[#D4AF37]"
                      />
                      Video Link
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Aesthetic Subtitle / Caption</label>
                  <input
                    type="text"
                    placeholder="e.g. Smart digital classroom interior"
                    value={newMediaCaption}
                    onChange={e => setNewMediaCaption(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-white focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#D4AF37] text-black font-extrabold tracking-wider uppercase rounded hover:bg-[#C29E30]"
                >
                  Insert Photo
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <h4 className="text-white font-mono font-bold tracking-wider text-xs border-b border-white/10 pb-2">
                📂 CURRENTLY ENCLOSED ASSETS ({(selectedAlbum.media || []).length})
              </h4>
              {(selectedAlbum.media || []).length === 0 ? (
                <div className="text-center py-16 bg-white/[0.01] border border-dashed border-white/10 rounded-lg text-xs text-gray-500">
                  No images attached. Insert reference links above.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(selectedAlbum.media || []).map((item) => (
                    <div key={item.id} className="relative group bg-[#0D0204] border border-white/10 hover:border-rose-500/40 rounded overflow-hidden aspect-video transition-all">
                      {item.type === "video" ? (
                        <div className="w-full h-full bg-[#58111A]/20 flex justify-center items-center">
                          <Play className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                      ) : (
                        <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
                      )}
                      
                      <div className="absolute inset-0 bg-black/85 flex flex-col justify-between p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[9px] text-gray-300 font-sans line-clamp-2 leading-tight">{item.caption || "No subtitle loaded"}</p>
                        <button
                          onClick={() => handleDeleteMediaFromAlbum(item.id)}
                          className="w-full py-1 text-[9px] font-mono uppercase bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> REMOVE ITEM
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-slate-900/60 border border-[#D4AF37]/25 p-6 rounded-xl space-y-4 h-fit">
            <h3 className="text-sm font-mono tracking-widest text-[#D4AF37] font-bold border-b border-[#D4AF37]/15 pb-2 uppercase">
              Construct New Album
            </h3>
            <form onSubmit={handleCreateAlbum} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Album Display Title</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Sports Day Fest"
                  value={newAlbumTitle}
                  onChange={e => setNewAlbumTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Target Gallery Tab</label>
                <select
                  value={newAlbumType}
                  onChange={e => setNewAlbumType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white font-sans focus:outline-none"
                >
                  <option value="Campus">Campus Infrastructure</option>
                  <option value="Events">Academic Events</option>
                  <option value="Convocation">Convocation Halls</option>
                  <option value="Sports">Sports Leagues</option>
                  <option value="Cultural">Cultural Festivals</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#D4AF37] text-black font-extrabold tracking-wider uppercase rounded hover:bg-[#C29E30] transition-colors cursor-pointer text-xs"
              >
                Assemble Album Record
              </button>
            </form>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {galleryAlbums.map((album) => {
              const coverImg = album.media && album.media.length > 0 
                ? album.media[0].url 
                : "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600";
              return (
                <div
                  key={album.id}
                  onClick={() => setSelectedAlbum(album)}
                  className="group bg-[#040810] border border-white/10 hover:border-[#D4AF37] rounded-xl overflow-hidden cursor-pointer flex flex-col justify-between shadow hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-video bg-slate-950 overflow-hidden">
                    <img src={coverImg} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2.5 right-2.5 bg-[#58111A] border border-[#D4AF37]/35 text-[#D4AF37] text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded-full">
                      {album.type}
                    </div>
                  </div>
                  
                  <div className="p-4 flex flex-col justify-between flex-1 gap-2 border-t border-white/5">
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                        {album.title}
                      </h4>
                      <p className="text-[10px] font-mono text-gray-400 mt-1 uppercase">
                        📂 {(album.media || []).length} Media Entries
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#D4AF37] flex items-center gap-1 uppercase tracking-wider">
                      Expand Exhibition Files →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface AdmissionManagerPanelProps {
  admissions: any[];
  triggerNotify: (msg: string) => void;
}

function AdmissionManagerPanel({ admissions, triggerNotify }: AdmissionManagerPanelProps) {
  const handleDeleteAdmission = async (id: string) => {
    if (!window.confirm("Dismiss this candidate registry permanently?")) return;
    try {
      await deleteDoc(doc(db, "student_admissions", id));
      triggerNotify("Candidate profile dismissed permanently");
    } catch (err) {
      triggerNotify("Failed to delete admissions listing");
    }
  };

  const handleUpdateAdmissionStatus = async (id: string, updatedStatus: string) => {
    try {
      await updateDoc(doc(db, "student_admissions", id), { status: updatedStatus });
      triggerNotify(`Candidate status set to: ${updatedStatus}`);
    } catch (err) {
      triggerNotify("Could not set database candidate status");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="admissions-manager-panel">
      <div>
        <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#D4AF37] uppercase">
          Admission Counseling Desk
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Monitor incoming prospectus submissions, contact queries, and program applications populated in real-time.
        </p>
      </div>

      <div className="bg-slate-900 border border-[#D4AF37]/25 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-950 border-b border-[#D4AF37]/15 text-xs text-gray-400 font-mono flex justify-between items-center">
          <span>Official Candidate Registry Logs</span>
          <span>{admissions.length} active submissions</span>
        </div>

        {admissions.length === 0 ? (
          <div className="text-center py-20 text-xs text-gray-500 font-sans">
            No dynamic candidate submissions registered in Firestore yet.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {admissions.map((adm) => {
              const dateStr = adm.createdAt ? new Date(adm.createdAt).toLocaleString("en-IN") : "Recency Check Logs";
              return (
                <div key={adm.id} className="p-6 hover:bg-white/[0.01] transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold text-white tracking-tight">{adm.name}</span>
                      <span className="text-[10px] font-mono tracking-wider font-extrabold bg-[#58111A] text-[#D4AF37] border border-[#D4AF37]/30 px-2 rounded-full uppercase">
                        {adm.course}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">{dateStr}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-300">
                      <p>📧 Email: <a href={`mailto:${adm.email}`} className="text-[#D4AF37] hover:underline hover:text-white transition-colors">{adm.email}</a></p>
                      <p>📞 Phone Contact: <span className="font-semibold text-white">{adm.phone}</span></p>
                    </div>

                    <div className="p-3 bg-black/40 border border-white/5 rounded text-xs text-gray-400 italic">
                      "{adm.message}"
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-stretch md:items-end gap-3 shrink-0 w-full md:w-auto">
                    <div className="flex items-center gap-2 text-xs ml-auto md:ml-0">
                      <span className="text-gray-400">Status:</span>
                      <select
                        value={adm.status || "Received"}
                        onChange={e => handleUpdateAdmissionStatus(adm.id, e.target.value)}
                        className="bg-slate-950 border border-[#D4AF37]/35 rounded px-2' py-1 text-xs font-semibold text-white focus:outline-none"
                      >
                        <option value="Received">Received</option>
                        <option value="Counseling">Counseling Desk</option>
                        <option value="Admitted">Admitted</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleDeleteAdmission(adm.id)}
                      className="px-3.5 py-1.5 border border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white text-xs font-bold font-mono rounded transition-colors uppercase cursor-pointer ml-auto md:ml-0"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
