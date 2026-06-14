import React, { useState, useEffect } from "react";
import { onSnapshot, collection, doc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";
import { SiteConfig, PageData, Course, Certificate, Notice } from "./types";
import { 
  DEFAULT_SITE_CONFIG, DEFAULT_PAGES, DEMO_COURSES, DEMO_CERTIFICATES, DEMO_NOTICES 
} from "./demoData";
import { motion, AnimatePresence } from "motion/react";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import SectionRenderer from "./components/SectionRenderer";
import CertificateVerification from "./components/CertificateVerification";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  
  // Realtime Database Synchronized States
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [pages, setPages] = useState<PageData[]>(DEFAULT_PAGES);
  const [courses, setCourses] = useState<Course[]>(DEMO_COURSES);
  const [certificates, setCertificates] = useState<Certificate[]>(DEMO_CERTIFICATES);
  const [notices, setNotices] = useState<Notice[]>(DEMO_NOTICES);

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

  // --- FIRESTORE REALTIME SYNC (onSnapshot) ---
  useEffect(() => {
    
    // 1. Site Config Sync
    const unsubConfig = onSnapshot(doc(db, "site_config", "main_settings"), (snap) => {
      if (snap.exists()) {
        setSiteConfig(snap.data() as SiteConfig);
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
      }
    }, (err) => {
      console.warn("Using offline administration bulletin timeline.", err);
    });

    setIsDbLoaded(true);

    return () => {
      unsubConfig();
      unsubPages();
      unsubCourses();
      unsubCerts();
      unsubNotices();
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
        />
      );
    }

    // B. Explicit Route: Secure Admin CMS Dashboard
    if (activeSlug === "admin") {
      return (
        <AdminDashboard
          siteConfig={siteConfig}
          allPages={pages}
          courses={courses}
          certificates={certificates}
          notices={notices}
          onSiteConfigUpdate={setSiteConfig}
          onPagesUpdate={setPages}
          onCoursesUpdate={setCourses}
          onCertificatesUpdate={setCertificates}
          onNoticesUpdate={setNotices}
        />
      );
    }

    // C. Dynamic CMS Page Rendering
    if (currentPage) {
      return (
        <SectionRenderer 
          sections={currentPage.sections}
          courses={courses}
          notices={notices}
          onNavigate={navigateTo}
        />
      );
    }

    // D. 404/Missing route fallback: render dynamic homepage
    const homePage = pages.find(p => p.slug === "") || DEFAULT_PAGES[0];
    return (
      <SectionRenderer 
        sections={homePage.sections}
        courses={courses}
        notices={notices}
        onNavigate={navigateTo}
      />
    );
  };

  const isCmsLayout = activeSlug === "admin";

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black" id="applet-root">
      
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

    </div>
  );
}
export { DEFAULT_SITE_CONFIG, DEFAULT_PAGES };
