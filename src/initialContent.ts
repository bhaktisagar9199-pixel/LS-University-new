import { SiteConfig, PageData, Course, Certificate, Notice, MediaItem, GalleryAlbum, CertificateTemplate } from "./types";

export const INITIAL_SITE_CONFIG: SiteConfig = {
  universityName: "LAKSHMI SEHGAL UNIVERSITY",
  logoText: "LAKSHMI SEHGAL UNIVERSITY",
  logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&auto=format&fit=crop&q=80",
  accreditationBadge: "Govt Approved UGC Under Sec 2(f) | NAAC A++ Accredited (CGPA 3.82) | NIRF Top 30",
  contactEmail: "admissions@lsu.edu.in",
  contactPhone: "+91-11-4091-6200 | +91-9871-33-2288",
  address: "Lakshmi Sehgal Knowledge Estates, Sector 128, Noida-Greater Noida Expressway, NCR 201304, India",
  goldAccentColor: "#D4AF37", // Premium Gold
  primaryThemeColor: "#58111A", // Royal Burgundy
  seoTitle: "LAKSHMI SEHGAL UNIVERSITY | Admissions, Courses, Placements",
  seoDescription: "LAKSHMI SEHGAL UNIVERSITY offers B.Tech, BCA, MCA, MBA, BBA, BA, B.Com and B.Sc programs with modern campus facilities.",
  socialLinks: {
    facebook: "https://facebook.com/lsu_india",
    twitter: "https://twitter.com/lsu_india",
    linkedin: "https://linkedin.com/school/lakshmi-sehgal-university",
    youtube: "https://youtube.com/lsu_india",
    instagram: "https://instagram.com/lsu_india"
  },
  navigation: [
    { id: "nav-1", label: "Home", url: "/" },
    {
      id: "nav-2",
      label: "About Us",
      url: "/about",
      hasMegaMenu: true,
      megaMenuCategories: [
        {
          title: "Our Heritage",
          links: [
            { label: "University Vision & Legacy", url: "/about", desc: "Our 25-year institutional roadmap" },
            { label: "Advisors & Governing Council", url: "/about", desc: "Elite industry-academic board" }
          ]
        },
        {
          title: "Accreditation",
          links: [
            { label: "UGC Sec 2(f) & NAAC Dossier", url: "/about", desc: "Highest credit scores check" },
            { label: "MoE NIRF Standings", url: "/about", desc: "Proudly classified under top ranks" }
          ]
        }
      ]
    },
    { id: "nav-3", label: "Academic Programs", url: "/courses" },
    { id: "nav-4", label: "Placement Statistics", url: "/placements" },
    { id: "nav-5", label: "Interactive Gallery", url: "/gallery" },
    { id: "nav-6", label: "Portal Consultation", url: "/contact" }
  ],
  footerSections: [
    {
      title: "Academics",
      links: [
        { label: "UGC Course Catalogue", url: "/courses" },
        { label: "Research Centers", url: "/about" },
        { label: "Dean & Faculty Directory", url: "/about" },
        { label: "Empowerment Scholarships", url: "/courses" }
      ]
    },
    {
      title: "Admissions Hub",
      links: [
        { label: "Register Consultation", url: "/contact" },
        { label: "LSU-SAT Entrance Syllabus", url: "/courses" },
        { label: "Private Fee Schedules", url: "/courses" },
        { label: "Hostel & Hostel Life", url: "/contact" }
      ]
    },
    {
      title: "Governance & Registry",
      links: [
        { label: "Credential Verification", url: "/verify" },
        { label: "Digital Certificates Query", url: "/verify" },
        { label: "Secured Administrator access", url: "/admin" }
      ]
    }
  ],
  announcementTicker: "Admissions Open (Academic Session 2026-27). Admissions secured via LSU-SAT entrance. Last date to register is June 28th. NAAC Accreditations officially award LSU highest A++ grade!"
};

export const INITIAL_PAGES: PageData[] = [
  {
    id: "home",
    title: "Home",
    slug: "",
    seoTitle: "LAKSHMI SEHGAL UNIVERSITY | Admissions, Courses, Placements",
    seoDesc: "LAKSHMI SEHGAL UNIVERSITY offers B.Tech, BCA, MCA, MBA, BBA, BA, B.Com and B.Sc programs with modern campus facilities.",
    published: true,
    createdAt: "2026-06-14T00:00:00.000Z",
    updatedAt: "2026-06-14T00:00:00.000Z",
    sections: [
      {
        id: "sec-home-hero",
        type: "hero",
        title: "LAKSHMI SEHGAL UNIVERSITY",
        subtitle: "SHAPING SCIENTIFIC PIONEERS AND TECH ARCHITECTS",
        content: {
          tagline: "An elite smart research campus offering advanced software development pipelines, strategic finance systems, and robust multidisciplinary domains.",
          bgImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80",
          ctaText1: "Explore Academic Programs",
          ctaLink1: "/courses",
          ctaText2: "Connect Admissions Team",
          ctaLink2: "/contact"
        }
      },
      {
        id: "sec-home-stats",
        type: "stats",
        title: "Pillars of Academic Prominence",
        subtitle: "Key quality indicators declaring LSU as one of the premier private research institutions in South Asia.",
        content: {
          items: [
            { label: "NAAC Grade Credentials", value: "A++ Grade", desc: "Consolidated CGPA Score of 3.82/4.00" },
            { label: "Stellar Corporate Placements", value: "₹48.4 LPA", desc: "Highest CSE packages achieved in 2025" },
            { label: "Multidisciplinary R&D Grants", value: "₹18 Crores", desc: "Funded by DST, DST-SERB & IEEE forums" },
            { label: "Advanced Industry Mentorship", value: "100%", desc: "Direct engineering blueprints with tech titans" }
          ]
        }
      },
      {
        id: "sec-home-info",
        type: "infosection",
        title: "The Intellectual Sanctuary of Future Innovators",
        content: {
          desc: "LAKSHMI SEHGAL UNIVERSITY is designed to eliminate academic silos. In partnership with industry leaders, our intensive curricula leverage real-world cases, advanced laboratories, and high-performance research clusters. Our premium spaces and dedicated faculty transition you from a digital consumer to an architect of global tech platforms.",
          imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
          layout: "text-left",
          buttonText: "Accreditation Portfolio",
          buttonLink: "/about"
        }
      },
      {
        id: "sec-home-courses",
        type: "courses",
        title: "Elite Dynamic Course Tracks",
        subtitle: "Programs optimized for strategic job pipelines and research depth. Manage fees online.",
        content: {
          limit: 6,
          showHeading: true
        }
      },
      {
        id: "sec-home-notices",
        type: "notices",
        title: "University Bulletins & Administrative Notifications",
        subtitle: "Live announcements direct from the desk of the Chancellor and the Academic Registry.",
        content: {
          limit: 3
        }
      },
      {
        id: "sec-home-placements",
        type: "placements",
        title: "The Placement Hall of Fame",
        subtitle: "We align academic curricula with the exact operations of global tech corporate agencies.",
        content: {
          limit: 4
        }
      },
      {
        id: "sec-home-testimonials",
        type: "testimonials",
        title: "Testimonials from our LSU Family",
        subtitle: "Real stories from alumni scaling global roles and deans shaping innovative research labs.",
        content: {
          items: [
            {
              name: "Sanya Mahajan",
              designation: "Cloud Systems Engineer, AWS India (B.Tech CSE '24)",
              rating: 5,
              text: "The agile syllabus at LSU prepared me perfectly. Exploring tensor calculus, large language processing models, and direct AWS cloud environments helped me secure an exceptional package.",
              image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80"
            },
            {
              name: "Prof. Dr. Vikram Dev",
              designation: "Dean, Center for Advanced Computing",
              rating: 5,
              text: "At LSU, we drive real-world impact. Undergrad students write active research papers and code prototypes and present in international IEEE sessions.",
              image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80"
            }
          ]
        }
      }
    ]
  },
  {
    id: "about",
    title: "About Us",
    slug: "about",
    seoTitle: "Chancellery Board & Vision | LAKSHMI SEHGAL UNIVERSITY",
    seoDesc: "Discover the leadership team, Chancellor's vision, and National Accreditations of LAKSHMI SEHGAL UNIVERSITY.",
    published: true,
    createdAt: "2026-06-14T00:00:00.000Z",
    updatedAt: "2026-06-14T00:00:00.000Z",
    sections: [
      {
        id: "sec-about-hero",
        type: "hero",
        title: "The LSU Legacy & Creed",
        subtitle: "ACADEMIC INTELLECT, COLLABORATIVE FREEDOM, LEADERSHIP",
        content: {
          tagline: "LAKSHMI SEHGAL UNIVERSITY structures autonomous research teams dedicated to bypassing bureaucratic hoops and engineering state-of-the-art societal frameworks.",
          bgImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80",
          ctaText1: "Explore Course Catalog",
          ctaLink1: "/courses"
        }
      },
      {
        id: "sec-about-vision",
        type: "infosection",
        title: "Desk of the Chancellor: Dr. Arvind Sinha",
        content: {
          desc: "Our mission is to establish an elite academic tech sanctuary, nurturing talent that drives the nation's scientific evolution. By investing in carbon-neutral campuses, modern clean-energy labs, and direct cloud collaborations, we guarantee our graduates lead corporate spheres immediately upon graduation. LAKSHMI SEHGAL UNIVERSITY stands as a monument to scientific persistence.",
          imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80",
          layout: "text-right",
          buttonText: "Register Consultation Profile",
          buttonLink: "/contact"
        }
      },
      {
        id: "sec-about-vc",
        type: "infosection",
        title: "Eminent Academic Director: Vice-Chancellor Prof. G.S. Prasad",
        content: {
          desc: "We ensure our computational structures keep pace with fast industrial shifts. Leading our faculty panel of 80% Ph.D. scholars, we have successfully aligned all courses to global industry metrics. Here, learning is active, dynamic, and authoritative.",
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
          layout: "text-left",
          buttonText: "Explore Dynamic Bulletins",
          buttonLink: "/courses"
        }
      }
    ]
  },
  {
    id: "placements",
    title: "Placements",
    slug: "placements",
    seoTitle: "Placement Records | Career Alignments",
    seoDesc: "Discover recruitment partners and career stats of our university graduates.",
    published: true,
    createdAt: "2026-06-14T00:00:00.000Z",
    updatedAt: "2026-06-14T00:00:00.000Z",
    sections: [
      {
        id: "sec-place-hero",
        type: "hero",
        title: "Corporate Placements",
        subtitle: "BRIDGING SCHOLASTICS WITH ELITE CONGLOMERATES",
        content: {
          tagline: "LSU graduates enjoy active corporate networking alliances, continuous interview simulations, and industry internships from day one.",
          bgImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&auto=format&fit=crop&q=80"
        }
      },
      {
        id: "sec-place-stats",
        type: "stats",
        title: "Global Recruitment Highlights",
        content: {
          items: [
            { label: "Active Enterprise Recruiter Partners", value: "240+", desc: "Yearly campus hiring corporate giants" },
            { label: "Average Corporate Package", value: "₹15.4 LPA", desc: "Top 20% average package: ₹32 LPA" },
            { label: "Highest International Package Offer", value: "₹62.0 LPA", desc: "Settled roles in London & Singapore" },
            { label: "Paid Corporate Summer Internships", value: "100%", desc: "Direct stipends starting up to ₹1.8L/mo" }
          ]
        }
      },
      {
        id: "sec-place-grid",
        type: "placements",
        title: "Recent LSU Placements Hall of Fame",
        subtitle: "A stellar representation of our creative graduates who captured premium packages.",
        content: {}
      }
    ]
  },
  {
    id: "contact",
    title: "Contact",
    slug: "contact",
    seoTitle: "Consultation Registrar | Contact LSU Support",
    seoDesc: "Register eligibility, consult academic supervisors, or schedule high-tech campus visits.",
    published: true,
    createdAt: "2026-06-14T00:00:00.000Z",
    updatedAt: "2026-06-14T00:00:00.000Z",
    sections: [
      {
        id: "sec-contact-hero",
        type: "hero",
        title: "Campus Communications",
        subtitle: "GET IN TOUCH FOR CAMPUS AUDIT RESERVATIONS",
        content: {
          tagline: "We ensure standard compliance guidelines, quick admission advisory loops, and direct programmatic coordination.",
          bgImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80"
        }
      },
      {
        id: "sec-contact-form-block",
        type: "contact",
        title: "E-Consultation Admissions Portal",
        subtitle: "Submit details to receive our official programmatic brochures.",
        content: {}
      }
    ]
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: "course-btech-cse",
    name: "B.Tech Computer Science & Engineering",
    code: "BTECH-CSE",
    level: "UG",
    duration: "4 Years",
    eligibility: "Aggregate 60% in Physics, Chemistry & Math in Class 12, plus qualifying index in LSU-SAT / JEE Main score.",
    fees: "₹2,80,000 per Academic Annum",
    description: "An intensive software development, core mathematical analytics, and algorithms-based system curricula mapping to modern enterprise requirements. Leverages state cloud clusters.",
    branches: ["Artificial Intelligence & Deep Models", "Full-Stack Software Architecture", "Cyber Security & Forensic Auditing"]
  },
  {
    id: "course-mba-digital",
    name: "MBA Digital Business & Strategy",
    code: "MBA-DB",
    level: "PG",
    duration: "2 Years",
    eligibility: "Bachelor's Degree in any discipline with minimum 55% score, plus CAT / MAT / LSU-GMAT entrance evaluation.",
    fees: "₹3,40,000 per Academic Annum",
    description: "Built for futuristic directors and strategic entrepreneurs. Covers decentralized fintech operations, high-performance platform corporate structures, and algorithmic advertising models.",
    branches: ["FinTech & Blockchains", "Data-Driven Marketing Strategy", "Agile Product Management"]
  },
  {
    id: "course-bdes-uiux",
    name: "B.Des User Experience & Interaction Archetypes",
    code: "BDES-UIUX",
    level: "UG",
    duration: "4 Years",
    eligibility: "Class 12 in any stream with qualifying rankings in LSU-DAT / UCEED core evaluations.",
    fees: "₹2,60,000 per Academic Annum",
    description: "Covers front-facing digital aesthetics, information architecture, interface principles, micro-animations, and interactive product blueprints. Taught inside state-of-the-art visual computing labs.",
    branches: ["Interactive Product Blueprint Design", "Creative Front-End Prototyping", "Spatial Systems & AR Experiences"]
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: "cert-1",
    certificateNo: "LSU-9283-1029",
    enrollmentNo: "LSU2022CSE402",
    registrationNo: "REG-2022-CSE-402",
    studentName: "Aditya Vardhan Dixit",
    fatherName: "Shri Rajesh Dixit",
    course: "Bachelor of Technology",
    specialization: "Computer Science & Engineering",
    grade: "First Class with Distinction",
    cgpa: "9.82 CGPA",
    passingYear: "2025",
    issueDate: "June 14, 2025",
    status: "Verified",
    qrCodeValue: "LSU-9283-1029|LSU2022CSE402|Aditya Vardhan Dixit|B.Tech CSE|Verified|LAKSHMI SEHGAL UNIVERSITY Security Registry",
    remarks: "Ranked 3rd in the CSE batch. Recipient of Dean's Scientific Roll of Honour."
  },
  {
    id: "cert-2",
    certificateNo: "LSU-1129-9238",
    enrollmentNo: "LSU2023MBA045",
    registrationNo: "REG-2023-MBA-045",
    studentName: "Priyanka Chandani",
    fatherName: "Shri Kamal Chandani",
    course: "Master of Business Administration",
    specialization: "Digital Business & Strategy",
    grade: "First Class with Distinction",
    cgpa: "9.45 CGPA",
    passingYear: "2025",
    issueDate: "June 14, 2025",
    status: "Verified",
    qrCodeValue: "LSU-1129-9238|LSU2023MBA045|Priyanka Chandani|MBA Digital Business|Verified|LAKSHMI SEHGAL UNIVERSITY Security Registry",
    remarks: "Elected President of LSU Fintech Council. Outstanding Innovation Awardee."
  }
];

export const INITIAL_CERTIFICATE_TEMPLATE: CertificateTemplate = {
  id: "main_template",
  universityName: "LAKSHMI SEHGAL UNIVERSITY",
  address: "Lakshmi Sehgal Knowledge Estates, Sector 128, Noida-Greater Noida Expressway, NCR 201304, India",
  contactNumber: "+91-11-4091-6200 | +91-9871-33-2288",
  website: "www.lsu.edu.in",
  email: "admissions@lsu.edu.in",
  accreditationBadge: "Govt Approved UGC Under Sec 2(f) | NAAC A++ Accredited (CGPA 3.82) | NIRF Top 30",
  logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&auto=format&fit=crop&q=80",
  certificateTitle: "OFFICIAL TRANSCRIPT & DEGREE DECREE",
  certificateContent: "This is to certify that [STUDENT_NAME], child of [FATHER_NAME], having Enrollment Number [ENROLLMENT_NO] and Registration Number [REGISTRATION_NO], has successfully completed the authorized curriculum prescribed for the program [COURSE_NAME] with Specialization in [SPECIALIZATION]. Following strict evaluation of academic accomplishments, this degree certificate is issued with a grade of [GRADE] and CGPA evaluations of [CGPA] in the passing year [PASSING_YEAR]. Conferred with all honors and privileges pertaining thereto.",
  signatureImage1: "", // will support draw/upload and defaults
  registrarName: "Dr. Sandeep Pathak",
  signatureImage2: "",
  viceChancellorName: "Prof. G.S. Prasad",
  sealStampImage: "",
  qrCodePosition: "bottom-right",
  certificateBackground: "classic-border",
  certificateFooter: "This transcript degree record is secured via official LSU Ledger Registry. Check verification coordinates directly via standard portal protocols."
};

export const INITIAL_NOTICES: Notice[] = [
  {
    id: "n-1",
    title: "Official Grade Card and Transcript Dispatch Schedule (Graduates of 2025)",
    category: "Academic",
    date: "2026-06-18",
    priority: "High",
    description: "The registrar's desk advises the core graduates of class 2025 that credentials, validated degree certificates, and global evaluation dossiers are ready for logistics dispatch or physical collection at counter 12 of the administration wing.",
    published: true
  },
  {
    id: "n-2",
    title: "LSU-SAT Entrance Registrations Extended (Academic Cycle 2026)",
    category: "Admissions",
    date: "2026-06-15",
    priority: "High",
    description: "Due to high volume index requests for engineering and design tracks, the registration hotline accepts secure application entries until June 28, 2025. Technical evaluations take place on July 5, 2025.",
    published: true
  },
  {
    id: "n-3",
    title: "DST Research Grant Awarded to Advanced Cloud Architecture Lab",
    category: "Academic",
    date: "2026-06-05",
    priority: "Normal",
    description: "LSU Center for Advanced Computing has been awarded a premium research grant of ₹4.5 Crores by DST to explore automated carbon footprint reductions in hyper-scale cloud grids. B.Tech research slots are open.",
    published: true
  }
];

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  { id: "m-1", name: "Campus Grand Main Auditorium", url: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200", folder: "Gallery", mimeType: "image/jpeg", size: "340 KB", createdAt: "2026-06-14" },
  { id: "m-2", name: "Central Smart Computing Labs", url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200", folder: "Gallery", mimeType: "image/jpeg", size: "280 KB", createdAt: "2026-06-14" },
  { id: "m-3", name: "Official Admission Brochure PDF 2026", url: "/brochure_mock_2026_download.pdf", folder: "Admissions", mimeType: "application/pdf", size: "4.2 MB", createdAt: "2026-06-14" },
  { id: "m-4", name: "Official NAAC Accreditation Document", url: "/naac_accreditation_report.pdf", folder: "Certificates", mimeType: "application/pdf", size: "1.8 MB", createdAt: "2026-06-14" }
];

export const INITIAL_GALLERY_ALBUMS: GalleryAlbum[] = [
  {
    id: "g-alb-1",
    title: "Architecture & Royal Estates",
    type: "Campus",
    order: 1,
    media: [
      { id: "g-arch-1", url: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80", type: "image", caption: "Grand administrative rotunda reflecting classic colonial lines" },
      { id: "g-arch-2", url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80", type: "image", caption: "High-performance computational infrastructure clusters" }
    ]
  },
  {
    id: "g-alb-2",
    title: "Academic Festivities & Convocation",
    type: "Convocation",
    order: 2,
    media: [
      { id: "g-cnv-1", url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80", type: "image", caption: "Graduating engineers celebrating class unity" },
      { id: "g-cnv-2", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80", type: "image", caption: "Chancellor presenting academic honors and gold medals" }
    ]
  }
];
