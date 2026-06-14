import { SiteConfig, PageData, Course, Certificate, Notice, MediaItem } from "./types";

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  universityName: "Laxmi Shanker University",
  logoText: "LS UNIVERSITY NEW",
  logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&auto=format&fit=crop&q=80",
  accreditationBadge: "QS 5-Star Rated | Govt Approved UGC Section 2(f) | NAAC A++ Grade",
  contactEmail: "admissions@lsuniversity.edu.in",
  contactPhone: "+91-11-4920-3022 | +91-9810-52-9011",
  address: "LS Knowledge Boulevard, Sector 62, Noida, NCR 201301, India",
  goldAccentColor: "#D4AF37", // Premium Gold
  primaryThemeColor: "#0A192F", // Midnight Blue/Navy
  seoTitle: "LS University new | Lead the Technological Paradigm Shift",
  seoDescription: "An elite Indian institution committed to architectural engineering, advanced computing, global management, and path-breaking research.",
  socialLinks: {
    facebook: "https://facebook.com/lsuniversity",
    twitter: "https://twitter.com/lsuniversity",
    linkedin: "https://linkedin.com/school/lsuniversity",
    youtube: "https://youtube.com/lsuniversity",
    instagram: "https://instagram.com/lsuniversity"
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
            { label: "University Vision & Values", url: "/about", desc: "Our 25-year institutional roadmap" },
            { label: "Leadership Desk (VC & Chancellor)", url: "/about", desc: "A message of scientific persistence" },
            { label: "Board of Governors", url: "/about", desc: "Elite industry-academic advisors" }
          ]
        },
        {
          title: "Accreditation",
          links: [
            { label: "NAAC A++ Certificates & Reports", url: "/about", desc: "Highest grade from National Bureau" },
            { label: "NIRF Rankings", url: "/about", desc: "Proudly listed under top engineering leagues" },
            { label: "International GIE Links", url: "/about", desc: "Partner institutions in Europe & USA" }
          ]
        }
      ]
    },
    { id: "nav-3", label: "Courses & Admissions", url: "/courses" },
    { id: "nav-4", label: "Placement Records", url: "/placements" },
    { id: "nav-5", label: "Verify Credentials", url: "/verify" },
    { id: "nav-6", label: "Get In Touch", url: "/contact" }
  ],
  footerSections: [
    {
      title: "Academics",
      links: [
        { label: "Course Catalog 2026", url: "/courses" },
        { label: "Research Publications", url: "/about" },
        { label: "Faculty Directory", url: "/about" },
        { label: "Scholarships 2026", url: "/courses" }
      ]
    },
    {
      title: "Admissions Center",
      links: [
        { label: "Apply Online Registration", url: "/contact" },
        { label: "Fee Structures", url: "/courses" },
        { label: "Admission Guidelines", url: "/courses" },
        { label: "LS-SAT Entrance Test", url: "/courses" }
      ]
    },
    {
      title: "Verification & Portals",
      links: [
        { label: "Employers Credential Verify", url: "/verify" },
        { label: "Generate QR Certificates", url: "/verify" },
        { label: "Alumni Association", url: "/verify" },
        { label: "Admin CMS Dashboard", url: "/admin" }
      ]
    }
  ],
  announcementTicker: "🚨 Admissions open for Academic Session 2026-27! Register for LS-SAT entrance before June 28th. NAAC declares LS University new with CGPA of 3.82/4 (A++)."
};

export const DEFAULT_PAGES: PageData[] = [
  {
    id: "home",
    title: "Home",
    slug: "",
    seoTitle: "Laxmi Shanker University | Elite Tech Campus",
    seoDesc: "Discover excellence in computer science, business design, and engineering sciences at LS University new. ₹50 Crore Smart Tech Campus NCR.",
    published: true,
    createdAt: "2026-06-14T00:00:00.000Z",
    updatedAt: "2026-06-14T00:00:00.000Z",
    sections: [
      {
        id: "sec-home-hero",
        type: "hero",
        title: "Laxmi Shanker University",
        subtitle: "NURTURING SHAPERS OF THE GLOBAL FUTURE TECH CODES",
        content: {
          tagline: "Unleash your potential at North India's premier ₹50Cr institutional sanctuary. Merging machine intelligence with business architecture.",
          bgImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80",
          ctaText1: "Explore Programs",
          ctaLink1: "/courses",
          ctaText2: "Verify Certifications",
          ctaLink2: "/verify"
        }
      },
      {
        id: "sec-home-stats",
        type: "stats",
        title: "LS Legacy in Numbers",
        subtitle: "A stellar footprint of outstanding educational results and international stature.",
        content: {
          items: [
            { label: "Guaranteed Placement Placement Score", value: "97.4%", desc: "Batch of 2025 Placement index" },
            { label: "Highest Package Secured", value: "₹64.2 LPA", desc: "Offered by global software giant (London)" },
            { label: "Renowned Ph.D. Faculty Scholars", value: "380+", desc: "Ex-industry experts and researchers" },
            { label: "High-Tech Corporate Labs", value: "24", desc: "NVIDIA AI, CISCO Networking, Google Sandbox Labs" }
          ]
        }
      },
      {
        id: "sec-home-intro",
        type: "infosection",
        title: "Pioneering the Intellectual Paradigm",
        content: {
          desc: "LS University new stands as a sanctuary of multidisciplinary research and top-tier industrial alignment. In synergy with top-tier international institutions, our curricula leverage real-world case practices, machine learning labs, and extensive product development workshops. Here, you transition from consumer to architect of global ecosystems.",
          imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
          layout: "text-left",
          buttonText: "Our Scientific Core",
          buttonLink: "/about"
        }
      },
      {
        id: "sec-home-courses",
        type: "courses",
        title: "World-Class Academic Programs",
        subtitle: "Industry-focused degree tracks managed entirely under live university CMS regulation.",
        content: {
          limit: 6,
          showHeading: true
        }
      },
      {
        id: "sec-home-notices",
        type: "notices",
        title: "Academic Bulletins & Notices",
        subtitle: "Real-time updates straight from the Chancellor and Administrative Registry.",
        content: {
          limit: 3
        }
      },
      {
        id: "sec-home-placements",
        type: "placements",
        title: "Enterprise Placements Hub",
        subtitle: "We connect our stellar students with international software and corporate innovators.",
        content: {
          limit: 4
        }
      },
      {
        id: "sec-home-testimonials",
        type: "testimonials",
        title: "What the LS Elite Say",
        subtitle: "Listen to our alumni and leading global faculty members share their LS experiences.",
        content: {
          items: [
            {
              name: "Sanya Mahajan",
              designation: "Software Architect, Microsoft Seattle (B.Tech CSE '24)",
              rating: 5,
              text: "The sheer speed of tech evolution requires an agile curriculum. LS University new's focus on deep-learning models, cloud structures, and direct internships equipped me perfectly.",
              image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
            },
            {
              name: "Prof. Dr. Vikram Dev",
              designation: "Dean of AI Research & Advanced Computing",
              rating: 5,
              text: "At LS, our researchers don't sleep. We teach how to challenge paradigms. With a funded grant of INR 12 Crores in NLP, our undergrad students are writing IEEE standards.",
              image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&auto=format&fit=crop&q=80"
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
    seoTitle: "Legacy & Accreditation | LS University new",
    seoDesc: "Learn about the visionary curriculum, NAAC accreditation, and standard facilities at Laxmi Shanker University.",
    published: true,
    createdAt: "2026-06-14T00:00:00.000Z",
    updatedAt: "2026-06-14T00:00:00.000Z",
    sections: [
      {
        id: "sec-about-hero",
        type: "hero",
        title: "The LS Scientific Creed",
        subtitle: "ACADEMIC FREEDOM, COLLABORATIVE INNOVATION, SOCIAL RESPONSIBILITY",
        content: {
          tagline: "LS University new is structured around autonomous research clusters designed to eliminate bureaucratic hurdles and foster path-breaking science.",
          bgImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80",
          ctaText1: "Our Programs",
          ctaLink1: "/courses"
        }
      },
      {
        id: "sec-about-vision",
        type: "infosection",
        title: "Chancellor's vision for 2030",
        content: {
          desc: "Our vision is to rank within the top 50 global innovative higher education centers. By investing in carbon-neutral campuses, solar-grid research, and fully cloud-synchronized virtual engineering twins, we are enabling our students to master future architectures before they even land in their post-campus careers.",
          imageUrl: "https://images.unsplash.com/photo-1521791136368-1a46827d0515?w=800&auto=format&fit=crop&q=80",
          layout: "text-right",
          buttonText: "Join Our Faculty Team",
          buttonLink: "/contact"
        }
      }
    ]
  },
  {
    id: "placements",
    title: "Placements",
    slug: "placements",
    seoTitle: "Elite Student Recruitments | LS Placements",
    seoDesc: "Discover the companies hiring at LS University new — Amazon, Google, Deloitte, NVidia research. Unravel placement tracks.",
    published: true,
    createdAt: "2026-06-14T00:00:00.000Z",
    updatedAt: "2026-06-14T00:00:00.000Z",
    sections: [
      {
        id: "sec-place-hero",
        type: "hero",
        title: "Enterprise Ecosystem",
        subtitle: "MATCHING EXCEPTIONAL MINDS WITH WORLD-CLASS CONGLOMERATES",
        content: {
          tagline: "An active center of corporate networking, direct career mentoring, and continuous industry simulations.",
          bgImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&auto=format&fit=crop&q=80"
        }
      },
      {
        id: "sec-place-stats",
        type: "stats",
        title: "Unmatched Global Placements",
        content: {
          items: [
            { label: "Recruiting Corporate Giants", value: "220+", desc: "Yearly active hiring companies" },
            { label: "Average Package (B.Tech)", value: "₹14.2 LPA", desc: "Top 25% average: ₹28 LPA" },
            { label: "International Placements", value: "48+", desc: "Offers in London, Amsterdam, Singapore" },
            { label: "Premium Summer Internships", value: "100%", desc: "Direct stipends up to ₹1.5L per month" }
          ]
        }
      },
      {
        id: "sec-place-grid",
        type: "placements",
        title: "Latest Placement Hall of Fame",
        subtitle: "Few of our proud alumni who secured premium tech packages this placement cycle.",
        content: {}
      }
    ]
  },
  {
    id: "contact",
    title: "Contact",
    slug: "contact",
    seoTitle: "Connect with Admissions | LS University new",
    seoDesc: "Looking to schedule a tech campus tour or have questions about eligibility? Speak with our dean or admissions team today.",
    published: true,
    createdAt: "2026-06-14T00:00:00.000Z",
    updatedAt: "2026-06-14T00:00:00.000Z",
    sections: [
      {
        id: "sec-contact-hero",
        type: "hero",
        title: "Connect with the LS Administration",
        subtitle: "WE ORIENT YOUR HIGH-TECH EDUCATIONAL EXPLORATION",
        content: {
          tagline: "Get in touch for campus reservations, admissions counseling, and certificate accreditation parameters.",
          bgImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80"
        }
      },
      {
        id: "sec-contact-form-block",
        type: "contact",
        title: "Digital Consultation Portal",
        subtitle: "Submit your academic profile for immediate consultation assessment.",
        content: {}
      }
    ]
  }
];

export const DEMO_COURSES: Course[] = [
  {
    id: "course-btech-cse",
    name: "Bachelor of Technology in Computer Science & Engineering",
    code: "BTECH-CSE",
    level: "UG",
    duration: "4 Years (8 Semesters)",
    eligibility: "12th Standard or equivalent with Physics, Chemistry, Mathematics (Min 60% aggregate)",
    fees: "₹1,85,000 per annum",
    description: "An intensive engineering track deeply focused on modern machine systems, core architectures, blockchain, compiler construction, and state art artificial intelligence algorithms.",
    branches: ["Artificial Intelligence & ML", "Cybersecurity & Cloud Systems", "Data Science & Big Data", "Core Software Engineering"]
  },
  {
    id: "course-mtech-ai",
    name: "Master of Technology in Artificial Intelligence",
    code: "MTECH-AI",
    level: "PG",
    duration: "2 Years (4 Semesters)",
    eligibility: "B.Tech/B.E. in CSE/IT/ECE or MCA (Min 55% score) + valid qualifying score",
    fees: "₹1,25,000 per annum",
    description: "A specialized PG research pathway in natural language processing (NLP), computer vision pipelines, multi-modal generative agents, and advanced tensor calculus architectures.",
    branches: ["Autonomous Systems", "Generative Modeling & LLMs", "Robotics Research"]
  },
  {
    id: "course-mba",
    name: "Master of Business Administration (MBA - Digital Business)",
    code: "MBA-DB",
    level: "PG",
    duration: "2 Years (4 Semesters)",
    eligibility: "Graduation in any discipline with minimum 50% score + entrance interview clearance",
    fees: "₹2,10,000 per annum",
    description: "LS Business School's flagship digital governance curriculum. Covering data analytics, product management, VC fund operations, and scaling digital SaaS corporate platforms.",
    branches: ["Product & Technology Management", "Digital Marketing & Analytics", "Strategic Capital & Finance"]
  },
  {
    id: "course-bca",
    name: "Bachelor of Computer Applications (BCA)",
    code: "BCA-AP",
    level: "UG",
    duration: "3 Years (6 Semesters)",
    eligibility: "12th Standard in any stream (Commerce, Science, Humanities) with Mathematics/CS as a paper",
    fees: "₹95,000 per annum",
    description: "Undergraduate track emphasizing practical web stack deployment, database normalization, system administration, and modern cloud deployment architectures.",
    branches: ["Full Stack Development", "Mobile Applications", "Cloud Operations"]
  },
  {
    id: "course-phd-cs",
    name: "Doctor of Philosophy (Ph.D. in Computer Science)",
    code: "PHD-CS",
    level: "PhD",
    duration: "3 to 5 Years",
    eligibility: "M.Tech/M.E./MS Research in CSE or allied branch with strong research publication portfolio",
    fees: "₹45,000 per year (Fully Funded Stipends Available)",
    description: "Our elite doctorate programs designed to yield core technological breakthroughs. Candidates conduct funded research in next-gen quantum computations, decentralization layers, or neural processors."
  }
];

export const DEMO_CERTIFICATES: Certificate[] = [
  {
    id: "cert-2025-1021",
    certificateNo: "LSU-9283-1029",
    enrollmentNo: "LS2022CSE402",
    studentName: "Aditya Vardhan Dixit",
    course: "B.Tech in Computer Science & Engineering",
    issueDate: "July 12, 2025",
    grade: "9.62 CGPA (First Class with Distinction)",
    status: "Verified",
    qrCodeValue: "LSU-9283-1029|LS2022CSE402|Aditya Vardhan Dixit|B.Tech CSE|Verified|LS University new Accreditation Portal",
    remarks: "Ranked 3rd in the CSE batch. Recipient of Dean's Scientific Roll"
  },
  {
    id: "cert-2025-5801",
    certificateNo: "LSU-1129-9238",
    enrollmentNo: "LS2023MBA045",
    studentName: "Priyanka Chandani",
    course: "Master of Business Administration (Digital Business)",
    issueDate: "June 28, 2025",
    grade: "8.95 CGPA (First Class)",
    status: "Verified",
    qrCodeValue: "LSU-1129-9238|LS2023MBA045|Priyanka Chandani|MBA Digital Business|Verified",
    remarks: "Corporate Leadership representative. Cleared the global case study league."
  }
];

export const DEMO_NOTICES: Notice[] = [
  {
    id: "notice-sat-2026",
    title: "Revised Guidelines for LS-SAT Stage 1 Entrance Examinations",
    category: "Academic",
    date: "2026-06-12",
    priority: "High",
    description: "The schedule for online LS-SAT entrance examinations has been updated. Candidates must complete portal slot booking by June 24, 2026. Official virtual exam links and instructions have been emailed.",
    published: true
  },
  {
    id: "notice-accred-naac",
    title: "Official Notification of NAAC CGPA Score Announcement",
    category: "Examinations",
    date: "2026-06-08",
    priority: "Normal",
    description: "The National Assessment and Accreditation Council (NAAC) peer team has officially awarded LS University new the highest grade: A++ with a CGPA score of 3.82. The detailed quality assessment dossier is attached in Downloads.",
    published: true
  },
  {
    id: "notice-ieee-grant",
    title: "Funded Research Grant Announcement from Dept of Science & Technology",
    category: "Academic",
    date: "2026-06-05",
    priority: "Normal",
    description: "LS AI Research Lab has been awarded a grant of INR 4.2 Crores for the design of carbon footprint predictions using hybrid deep-learning engines. Undergraduate CSE slots are open for stipend-based research assistantships.",
    published: true
  }
];

export const DEMO_PLACEMENTS = [
  { studentName: "Siddharth Goel", companyName: "Google India", package: "₹48.4 LPA", course: "B.Tech CSE, 2024", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80" },
  { studentName: "Avni Kapoor", companyName: "Amazon Web Services", package: "₹34.5 LPA", course: "B.Tech IT, 2025", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80" },
  { studentName: "Ritvik Sharma", companyName: "NVIDIA Corp Research", package: "₹42.0 LPA", course: "M.Tech AI, 2024", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80" },
  { studentName: "Simran Johar", companyName: "Deloitte Core strategy", package: "₹18.0 LPA", course: "MBA Digital Business, 2025", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80" }
];

export const DEMO_MEDIA_ITEMS: MediaItem[] = [
  { id: "m-1", name: "Campus Front Entrance View", url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200", folder: "Gallery", mimeType: "image/jpeg", size: "340 KB", createdAt: "2026-06-14" },
  { id: "m-2", name: "Central Smart Engineering Labs", url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200", folder: "Gallery", mimeType: "image/jpeg", size: "280 KB", createdAt: "2026-06-14" },
  { id: "m-3", name: "Official Admission Brochure PDF 2026", url: "/brochure_mock_2026_download.pdf", folder: "Admissions", mimeType: "application/pdf", size: "4.2 MB", createdAt: "2026-06-14" },
  { id: "m-4", name: "Official NAAC Accreditation Document", url: "/naac_accreditation_report.pdf", folder: "Certificates", mimeType: "application/pdf", size: "1.8 MB", createdAt: "2026-06-14" }
];
