import React, { useState, useEffect } from "react";
import { onSnapshot, collection, doc, setDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType, firebaseMetadata, firebaseEnvError, isDevMode } from "./firebase";
import { SiteConfig, PageData, Course, Certificate, Notice, GalleryAlbum } from "./types";
import { 
  INITIAL_SITE_CONFIG, INITIAL_PAGES, INITIAL_COURSES, INITIAL_CERTIFICATES, INITIAL_NOTICES, INITIAL_GALLERY_ALBUMS 
} from "./initialContent";
import { motion, AnimatePresence } from "motion/react";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import SectionRenderer from "./components/SectionRenderer";
import CertificateVerification from "./components/CertificateVerification";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  
  // Realtime Database Synchronized States
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_SITE_CONFIG);
  const [pages, setPages] = useState<PageData[]>(INITIAL_PAGES);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [galleryAlbums, setGalleryAlbums] = useState<GalleryAlbum[]>(INITIAL_GALLERY_ALBUMS);

  // Connection & Loading indicators
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  // Hash-based Staging Safe Navigation Routing (Immune to Frame limits)
  const [activeSlug, setActiveSlug] = useState<string>(() => {
    const raw = window.location.hash.replace("#/", "").replace("#", "").split("?")[0];
    return raw;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const raw = window.location.hash.replace("#/", "").replace("#", "").split("?")[0];
      setActiveSlug(raw);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (slug: string) => {
    window.location.hash = slug === "" ? "/" : `/${slug}`;
    setActiveSlug(slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- FIRESTORE REALTIME SYNC (onSnapshot) WITH AUTOMATIC PERSISTENT INITIAL SEEDING ---
  useEffect(() => {
    
    // 1. Site Config Sync
    const unsubConfig = onSnapshot(doc(db, "site_config", "main_settings"), (snap) => {
      if (snap.exists()) {
        setSiteConfig(snap.data() as SiteConfig);
      } else if (isDevMode) {
        // Automatically seed empty Firestore only in local development
        setDoc(doc(db, "site_config", "main_settings"), INITIAL_SITE_CONFIG).catch((err) => console.warn(err));
      }
    }, (err) => {
      console.warn("Using offline brand config template.", err);
    });

    // 2. Dynamic Pages Collection Sync
    const unsubPages = onSnapshot(collection(db, "pages"), (snap) => {
      if (!snap.empty) {
        const list: PageData[] = [];
        snap.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as PageData);
        });
        // Sort home first if available, otherwise chronologically
        list.sort((a, b) => (a.slug === "" ? -1 : b.slug === "" ? 1 : 0));
        setPages(list);
      } else if (isDevMode) {
        // Automatically seed empty Firestore only in local development
        INITIAL_PAGES.forEach((pg) => {
          setDoc(doc(db, "pages", pg.id), pg).catch((err) => console.warn(err));
        });
      }
    }, (err) => {
      console.warn("Using offline dynamic sitemap pages.", err);
    });

    // 3. Courses Collection Sync
    const unsubCourses = onSnapshot(collection(db, "courses"), (snap) => {
      if (!snap.empty) {
        const list: Course[] = [];
        snap.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Course);
        });
        setCourses(list);
      } else if (isDevMode) {
        // Automatically seed empty Firestore only in local development
        INITIAL_COURSES.forEach((crs) => {
          setDoc(doc(db, "courses", crs.id), crs).catch((err) => console.warn(err));
        });
      }
    }, (err) => {
      console.warn("Using offline degree curriculum catalog.", err);
    });

    // 4. Certificates Collection Sync
    const unsubCerts = onSnapshot(collection(db, "certificates"), (snap) => {
      if (!snap.empty) {
        const list: Certificate[] = [];
        snap.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Certificate);
        });
        setCertificates(list);
      } else if (isDevMode) {
        // Automatically seed empty Firestore only in local development
        INITIAL_CERTIFICATES.forEach((cert) => {
          setDoc(doc(db, "certificates", cert.id), cert).catch((err) => console.warn(err));
        });
      }
    }, (err) => {
      console.warn("Using offline academic verification certificates.", err);
    });

    // 5. Notices Collection Sync
    const unsubNotices = onSnapshot(collection(db, "notices"), (snap) => {
      if (!snap.empty) {
        const list: Notice[] = [];
        snap.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Notice);
        });
        // Sort newest published date first
        list.sort((a, b) => b.date.localeCompare(a.date));
        setNotices(list);
      } else if (isDevMode) {
        // Automatically seed empty Firestore only in local development
        INITIAL_NOTICES.forEach((n) => {
          setDoc(doc(db, "notices", n.id), n).catch((err) => console.warn(err));
        });
      }
    }, (err) => {
      console.warn("Using offline administration bulletin timeline.", err);
    });

    // 6. Gallery Albums Collection Sync
    const unsubGallery = onSnapshot(collection(db, "gallery_albums"), (snap) => {
      if (!snap.empty) {
        const list: GalleryAlbum[] = [];
        snap.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as GalleryAlbum);
        });
        list.sort((a, b) => a.order - b.order);
        setGalleryAlbums(list);
      } else if (isDevMode) {
        // Automatically seed empty Firestore only in local development
        INITIAL_GALLERY_ALBUMS.forEach((album) => {
          setDoc(doc(db, "gallery_albums", album.id), album).catch((err) => console.warn(err));
        });
      }
    }, (err) => {
      console.warn("Using offline gallery albums.", err);
    });

    setIsDbLoaded(true);

    return () => {
      unsubConfig();
      unsubPages();
      unsubCourses();
      unsubCerts();
      unsubNotices();
      unsubGallery();
    };
  }, []);

  // Determine current active page object from our dynamic pages sitemap
  const currentPage = pages.find((p) => p.slug === activeSlug && p.published) 
                     || pages.find((p) => p.slug === "" && p.published); // Fallback to Home if draft

  // Render conditional router paths
  const renderContent = () => {
    
    // A. Explicit Route: Credentials Verification Portal
    if (activeSlug === "verify") {
      return (
        <CertificateVerification 
          certificates={certificates} 
          config={siteConfig}
        />
      );
    }

    // B. Explicit Route: Interactive Dynamic Campus Gallery Segment
    if (activeSlug === "gallery") {
      return (
        <SectionRenderer 
          sections={[{
            id: "gallery-page-container",
            type: "gallery",
            title: `${siteConfig.logoText || "LSU"} Royal Archives & Gallery`,
            subtitle: `EXPLORING THE PALATIAL ESTATES OF ${(siteConfig.universityName || "LAKSHMI SEHGAL UNIVERSITY").toUpperCase()}`,
            content: {}
          }]}
          courses={courses}
          notices={notices}
          onNavigate={navigateTo}
          galleryAlbums={galleryAlbums}
          config={siteConfig}
        />
      );
    }

    // C. Explicit Route: Secure Admin CMS Dashboard
    if (activeSlug === "admin") {
      return (
        <AdminDashboard
          siteConfig={siteConfig}
          allPages={pages}
          courses={courses}
          certificates={certificates}
          notices={notices}
          galleryAlbums={galleryAlbums}
          onSiteConfigUpdate={setSiteConfig}
          onPagesUpdate={setPages}
          onCoursesUpdate={setCourses}
          onCertificatesUpdate={setCertificates}
          onNoticesUpdate={setNotices}
          onGalleryAlbumsUpdate={setGalleryAlbums}
        />
      );
    }

    // D. Dynamic CMS Page Rendering
    if (currentPage) {
      return (
        <SectionRenderer 
          sections={currentPage.sections}
          courses={courses}
          notices={notices}
          onNavigate={navigateTo}
          galleryAlbums={galleryAlbums}
          config={siteConfig}
        />
      );
    }

    // E. 404/Missing route fallback: render dynamic homepage
    const homePage = pages.find(p => p.slug === "") || INITIAL_PAGES[0];
    return (
      <SectionRenderer 
        sections={homePage.sections}
        courses={courses}
        notices={notices}
        onNavigate={navigateTo}
        galleryAlbums={galleryAlbums}
        config={siteConfig}
      />
    );
  };

  const isCmsLayout = activeSlug === "admin";

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black" id="applet-root">
      
      {isDevMode && firebaseEnvError && (
        <div className="bg-[#1C160C] border-b border-[#D4AF37]/30 text-white p-4 font-mono text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg backdrop-blur-md" id="firebase-env-error-banner">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold uppercase tracking-wider text-[11px]">
              <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse inline-block" />
              Environment Configuration Guide
            </div>
            <p className="text-gray-300 leading-relaxed max-w-4xl font-sans text-[11px]">
              The application is currently running with standard fallback values. To connect your production database instance, specify these values as Environment Variables in your project dashboard (e.g., local <code className="text-[#D4AF37] bg-black/40 px-1 py-0.5 rounded font-mono font-bold">.env</code> configuration or <code className="text-[#D4AF37] font-bold">Vercel &rarr; Settings &rarr; Environment Variables</code>):
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {firebaseEnvError.split("\n").slice(1).map((errLine, i) => {
                const varName = errLine.replace("- ", "");
                return (
                  <span key={i} className="bg-black/40 border border-[#D4AF37]/20 text-[#D4AF37] px-2.5 py-1 rounded text-[9px] uppercase font-bold tracking-wider">
                    {varName}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="text-[10px] text-gray-400 font-mono text-left md:text-right border-l md:border-l-0 md:border-r border-white/10 pl-3 md:pl-0 md:pr-4 py-1 self-stretch flex flex-col justify-center">
            <div>Verification: <span className="text-[#D4AF37] font-bold">Awaiting Setup</span></div>
            <div>Platform: <span className="text-indigo-400 font-bold">Vercel Compatible</span></div>
          </div>
        </div>
      )}

      {/* Renders global header navigation unless user is operating the specialized tall CMS workspace */}
      {!isCmsLayout && (
        <Header 
          config={siteConfig}
          allPages={pages.filter(p => p.published).map(p => ({ title: p.title, slug: p.slug }))}
          activeSlug={activeSlug}
          onNavigate={navigateTo}
          isAdminLoggedIn={false}
        />
      )}

      {/* Primary Portal Body viewport */}
      <main className="flex-1 w-full overflow-x-hidden" id="root-viewport">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlug || "home"}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Renders dynamic coordinate details unless user is inside the exclusive full-screen admin panel */}
      {!isCmsLayout && (
        <Footer 
          config={siteConfig}
          onNavigate={navigateTo}
        />
      )}

      {/* Persistent Floating System Connection & Configuration Info (Startup Validation Badge) */}
      {isDevMode && (
        <div 
          className="fixed bottom-4 left-4 z-40 bg-[#0A192F]/95 backdrop-blur-md border border-[#D4AF37]/40 hover:border-[#D4AF37]/75 px-3.5 py-2 rounded-lg shadow-2xl flex items-center gap-2.5 text-[10px] font-mono transition-all duration-300"
          id="firebase-system-validation-badge"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-gray-400">PROJ:</span>
          <span className="text-white font-bold">{firebaseMetadata.projectId}</span>
          <span className="text-[#D4AF37]/40">|</span>
          <span className="text-gray-400">DB:</span>
          <span className="text-[#D4AF37] font-bold">{firebaseMetadata.databaseName}</span>
        </div>
      )}

    </div>
  );
}
