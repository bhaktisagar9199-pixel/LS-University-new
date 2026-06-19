import { SiteConfig, PageData, Course, Certificate, Notice, MediaItem, GalleryAlbum } from "./types";

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  universityName: "Lakshmi Sehgal University",
  logoText: "LAKSHMI SEHGAL UNIVERSITY",
  logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&auto=format&fit=crop&q=80",
  accreditationBadge: "Govt Approved UGC Under Sec 2(f) | NAAC A++ Accredited (CGPA 3.82) | NIRF Top 30",
  contactEmail: "admissions@lsu.edu.in",
  contactPhone: "+91-11-4091-6200 | +91-9871-33-2288",
  address: "Lakshmi Sehgal Knowledge Estates, Sector 128, Noida-Greater Noida Expressway, NCR 201304, India",
  goldAccentColor: "#D4AF37", // Premium Gold
  primaryThemeColor: "#58111A", // Royal Burgundy
  seoTitle: "Lakshmi Sehgal University | Elite Educational Excellence & Leadership",
  seoDescription: "An elite Indian institution committed to high-fidelity computing, global management, liberal sciences, and path-breaking multidisciplinary research.",
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
  announcementTicker: "🚨 Admissions Open (Academic Session 2026-27)! Admissions secured via LSU-SAT entrance. Last date to register is June 28th. NAAC Accreditations officially award LSU highest A++ grade!"
};

export const DEFAULT_PAGES: PageData[] = [
  {
    id: "home",
    title: "Home",
    slug: "",
    seoTitle: "Lakshmi Sehgal University | Premium Tech Campus NCR",
    seoDesc: "Experience high-fidelity learning models at Lakshmi Sehgal University. Advanced computer labs, direct placement tracks.",
    published: true,
    createdAt: "2026-06-14T00:00:00.000Z",
    updatedAt: "2026-06-14T00:00:00.000Z",
    sections: [
      {
        id: "sec-home-hero",
        type: "hero",
        title: "Lakshmi Sehgal University",
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
          desc: "Lakshmi Sehgal University is designed to eliminate academic silos. In partnership with industry leaders, our intensive curricula leverage real-world cases, advanced laboratories, and high-performance research clusters. Our premium spaces and dedicated faculty transition you from a digital consumer to an architect of global tech platforms.",
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
    seoTitle: "Chancellery Board & Vision | Lakshmi Sehgal University",
    seoDesc: "Discover the leadership team, Chancellor's vision, and National Accreditations of Lakshmi Sehgal University.",
    published: true,
    createdAt: "2026-06-14T00:00:00.000Z",
    updatedAt: "2026-06-14T00:00:00.000Z",
    sections: [
      {
        id: "sec-about-hero",
        type: "hero",
        title: "The LSU Legacy & Creed",
        subtitle: "ACADEMIC INTELLECT, COLLABORATIVE FREEDOM, PATRIARCHICAL LEADERSHIP",
        content: {
          tagline: "Lakshmi Sehgal University structures autonomous research teams dedicated to bypassing bureaucratic hoops and engineering state-of-the-art societal frameworks.",
          bgImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80",
          ctaText1: "Explore Course Catalog",
          ctaLink1: "/courses"
        }
      },
      {
        id: "sec-about-vision",
        type: "infosection",
        title: "Desk of the Chancellor: Dr. Arvind Sehgal",
        content: {
          desc: "Our mission is to establish a ₹200-Crore academic tech sanctuary right in the heart of NCR, nurturing talent that drives the nation's scientific evolution. By investing in carbon-neutral campuses, modern clean-energy labs, and direct cloud collaborations, we guarantee our graduates lead corporate spheres immediately upon graduation. Lakshmi Sehgal University stands as a monument to scientific persistence.",
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

export const DEMO_COURSES: Course[] = [
  {
    id: "course-btech-cse",
    name: "B.Tech in Computer Science & Engineering",
    code: "BTECH-CSE",
    level: "UG",
    duration: "4 Years (8 Semesters)",
    eligibility: "12th standard (PCM board aggregate: min 60% score) + LSU-SAT Rank",
    fees: "₹2,60,000 per annum",
    description: "An elite engineering program specializing in machine systems, automated compilers, blockchain scaling, cloud nodes, and multi-modal neural network configurations.",
    branches: ["Artificial Intelligence & ML", "Cybersecurity & Cryptography", "Data Science & Warehousing", "Core Systems Architecture"]
  },
  {
    id: "course-btech-ece",
    name: "B.Tech in Electronics & Communication Engineering",
    code: "BTECH-ECE",
    level: "UG",
    duration: "4 Years (8 Semesters)",
    eligibility: "12th standard (PCM board aggregate: min 60% score) + JEE or LSU-SAT Rank",
    fees: "₹1,95,000 per annum",
    description: "Deep dive into microprocessors, IoT network nodes, next-gen 6G signal algorithms, and quantum semiconductor hardware setups.",
    branches: ["Micro-embedded Robotics", "VLSI Research", "Optical Node Comms"]
  },
  {
    id: "course-btech-me",
    name: "B.Tech in Mechanical & Automation Engineering",
    code: "BTECH-ME",
    level: "UG",
    duration: "4 Years (8 Semesters)",
    eligibility: "12th standard (PCM boards) with minimum 55% score",
    fees: "₹1,65,000 per annum",
    description: "Covers automated machinery design, clean thermodynamic loops, electric drivelines, and AI production analytics.",
    branches: ["Advanced Drone Robotics", "Green Energy Powertrains", "Fluid Dynamics CAD"]
  },
  {
    id: "course-bca",
    name: "Bachelor of Computer Applications (BCA)",
    code: "BCA-AP",
    level: "UG",
    duration: "3 Years (6 Semesters)",
    eligibility: "12th standard in any stream (Commerce, Science, Humanities) with Mathematics/Computer Science",
    fees: "₹1,30,000 per annum",
    description: "Practical development methodologies prioritizing modern web applications, relational databases, cloud configurations, and mobile tool chains.",
    branches: ["Full Stack Engineering", "Mobile App Development", "UI/UX Engineering"]
  },
  {
    id: "course-mca",
    name: "Master of Computer Applications (MCA)",
    code: "MCA-PM",
    level: "PG",
    duration: "2 Years (4 Semesters)",
    eligibility: "BCA or B.Sc in Computer Science with minimum 50% score",
    fees: "₹1,45,000 per annum",
    description: "Advanced computational structures specializing in distributed servers, cybersecurity protocols, DevOps automations, and scalable SaaS models.",
    branches: ["Cloud Systems & Architecting", "Intelligent Systems Integration"]
  },
  {
    id: "course-bba",
    name: "Bachelor of Business Administration (BBA)",
    code: "BBA-DM",
    level: "UG",
    duration: "3 Years (6 Semesters)",
    eligibility: "12th standard in any stream (minimum 50% score)",
    fees: "₹1,55,000 per annum",
    description: "Modern startup and corporate incubation strategies covering digital branding, financial markets, CRM, and venture workflows.",
    branches: ["Venture Scale & Operations", "Marketing Analytics", "Global HR Commerce"]
  },
  {
    id: "course-mba",
    name: "Master of Business Administration (MBA - Digital Business)",
    code: "MBA-DB",
    level: "PG",
    duration: "2 Years (4 Semesters)",
    eligibility: "Graduation degree with min 50% score + qualifying CAT / MAT / GMAT score + LSU-SAT interview",
    fees: "₹3,40,000 per annum",
    description: "LSU Business School's flagship MBA track exploring product management pipelines, SaaS venture finances, capital fundraising, and corporate governance systems.",
    branches: ["Tech Ventures & SaaS Metrics", "Strategic Capital & Investment Management", "AI Decision Analytics"]
  },
  {
    id: "course-ba",
    name: "BA (Hons) in Interdisciplinary Liberal Arts",
    code: "BA-LA",
    level: "UG",
    duration: "3 Years (6 Semesters)",
    eligibility: "12th standard in any board (minimum 55% score)",
    fees: "₹1,20,000 per annum",
    description: "Broad-spectrum studies in international relations, behavioral metrics, psychology, history of science, and public administration principles.",
    branches: ["Global Geopolitics", "Creative Writing & Journalism", "Organizational Psychology"]
  },
  {
    id: "course-bcom",
    name: "B.Com (Hons) Professional",
    code: "BCOM-PR",
    level: "UG",
    duration: "3 Years (6 Semesters)",
    eligibility: "12th standard in commerce or science streams (minimum 60% agg)",
    fees: "₹1,40,000 per annum",
    description: "Intensive accountancy training aligned with international corporate practices, investment systems, portfolio strategies, and digital taxation laws.",
    branches: ["Investment Banking", "Corporate Taxation & Auditing"]
  },
  {
    id: "course-bsc",
    name: "B.Sc (Hons) in Applied Biotechnology",
    code: "BSC-AB",
    level: "UG",
    duration: "3 Years (6 Semesters)",
    eligibility: "12th standard in science (PCB board aggregate: min 55% score)",
    fees: "₹1,25,000 per annum",
    description: "Practical genetic sequencing, food production security, cell cultures, and biopharmaceutical chemistry pipelines.",
    branches: ["Genomic Informatics", "Biopharmaceutics Analysis"]
  },
  {
    id: "course-msc",
    name: "M.Sc in Advanced Food & Bio-Technologies",
    code: "MSC-BT",
    level: "PG",
    duration: "2 Years (4 Semesters)",
    eligibility: "B.Sc (Hons) in biological or allied sciences (min 50% score)",
    fees: "₹1,35,000 per annum",
    description: "Advanced master's curriculum focusing on genetic engineering models, cell-line scaling, and vaccine engineering processes.",
    branches: ["Computational Proteomics", "Immuno-molecular Research"]
  },
  {
    id: "course-ma",
    name: "MA in Clinical & Counseling Psychology",
    code: "MA-CP",
    level: "PG",
    duration: "2 Years (4 Semesters)",
    eligibility: "Bachelors with min 50% score (preference to Psychology graduates)",
    fees: "₹98,000 per annum",
    description: "Extensive study covering cognitive therapeutic models, child psychopathology, clinical assessment loops, and corporate HR counseling.",
    branches: ["Cognitive Behavioral Therapy", "Corporate Counseling Studies"]
  },
  {
    id: "course-diploma",
    name: "Diploma in Advanced Cloud Computing & Cybersecurity",
    code: "DIP-CCC",
    level: "Diploma",
    duration: "1 Year (Fast Track)",
    eligibility: "10th or 12th standard passing with strong computational affinity",
    fees: "₹80,000 per annum",
    description: "Hands-on certified pathway to get corporate ready. Covers server setups, active network monitoring, cloud infrastructure scaling, and pen-testing.",
    branches: ["AWS & Azure Cloud Operations", "Secured Linux Administration"]
  },
  {
    id: "course-phd-cs",
    name: "Ph.D. in Computer Science & Generative AI",
    code: "PHD-CS",
    level: "PhD",
    duration: "3 to 5 Years",
    eligibility: "M.Tech or equivalent research credits with publications in indexed journals",
    fees: "₹60,000 per annum",
    description: "Doctorate candidates join fully-funded R&D groups to engineering next-generation multi-modal scaling systems and robust algorithmic decoders.",
    branches: ["Neural Language Architectures", "Secure Decentralized Nodes"]
  }
];

export const DEMO_CERTIFICATES: Certificate[] = [
  {
    id: "cert-2025-1021",
    certificateNo: "LSU-9283-1029",
    enrollmentNo: "LSU2022CSE402",
    studentName: "Aditya Vardhan Dixit",
    course: "B.Tech in Computer Science & Engineering",
    issueDate: "July 12, 2025",
    grade: "9.62 CGPA (First Class with Distinction)",
    status: "Verified",
    qrCodeValue: "LSU-9283-1029|LSU2022CSE402|Aditya Vardhan Dixit|B.Tech CSE|Verified|Lakshmi Sehgal University Security Registry",
    remarks: "Ranked 3rd in the CSE batch. Recipient of Dean's Scientific Roll of Honour."
  },
  {
    id: "cert-2025-5801",
    certificateNo: "LSU-1129-9238",
    enrollmentNo: "LSU2023MBA045",
    studentName: "Priyanka Chandani",
    course: "Master of Business Administration (Digital Business)",
    issueDate: "June 28, 2025",
    grade: "8.95 CGPA (First Class)",
    status: "Verified",
    qrCodeValue: "LSU-1129-9238|LSU2023MBA045|Priyanka Chandani|MBA Digital Business|Verified|Lakshmi Sehgal University Security Registry",
    remarks: "Corporate Leadership representative. Cleared the global case study league."
  }
];

export const DEMO_NOTICES: Notice[] = [
  {
    id: "notice-sat-2026",
    title: "Revised Guidelines for LSU-SAT Stage 1 Online Entrance Examinations",
    category: "Academic",
    date: "2026-06-12",
    priority: "High",
    description: "The official timeline for the LSU-SAT entrance test has been finalized. Registered applicants must select slots online before June 24. A mock portal simulator link has been pushed to registration accounts.",
    published: true
  },
  {
    id: "notice-accred-naac",
    title: "Accreditation Dossier: UGC & NAAC CGPA Team Findings",
    category: "Academic",
    date: "2026-06-08",
    priority: "Normal",
    description: "The National Assessment and Accreditation Council (NAAC) has completed its peer review audit, officially grading Lakshmi Sehgal University with the highest grade: A++ (CGPA Score: 3.82/4.00). Document available for verification.",
    published: true
  },
  {
    id: "notice-ieee-grant",
    title: "Research Grant: Dept of Science & Technology Sanctions ₹4.5 Crores",
    category: "Events",
    date: "2026-06-05",
    priority: "Normal",
    description: "LSU Center for Advanced Computing has been awarded a premium research grant of ₹4.5 Crores by DST to explore automated carbon footprint reductions in hyper-scale cloud grids. B.Tech research slots are open.",
    published: true
  }
];

export const DEMO_PLACEMENTS = [
  { studentName: "Siddharth Goel", companyName: "Google India", package: "₹48.4 LPA", course: "B.Tech CSE, 2024", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80" },
  { studentName: "Avni Kapoor", companyName: "Amazon Web Services", package: "₹34.5 LPA", course: "B.Tech IT, 2025", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80" },
  { studentName: "Ritvik Sharma", companyName: "NVIDIA Corp Research", package: "₹42.0 LPA", course: "M.Tech AI, 2024", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80" },
  { studentName: "Simran Johar", companyName: "Deloitte Core strategy", package: "₹18.0 LPA", course: "MBA Digital Business, 2025", image: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=120&auto=format&fit=crop&q=80" }
];

export const DEMO_MEDIA_ITEMS: MediaItem[] = [
  { id: "m-1", name: "Campus Grand Main Auditorium", url: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200", folder: "Gallery", mimeType: "image/jpeg", size: "340 KB", createdAt: "2026-06-14" },
  { id: "m-2", name: "Central Smart Computing Labs", url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200", folder: "Gallery", mimeType: "image/jpeg", size: "280 KB", createdAt: "2026-06-14" },
  { id: "m-3", name: "Official Admission Brochure PDF 2026", url: "/brochure_mock_2026_download.pdf", folder: "Admissions", mimeType: "application/pdf", size: "4.2 MB", createdAt: "2026-06-14" },
  { id: "m-4", name: "Official NAAC Accreditation Document", url: "/naac_accreditation_report.pdf", folder: "Certificates", mimeType: "application/pdf", size: "1.8 MB", createdAt: "2026-06-14" }
];

export const DEMO_GALLERY_ALBUMS: GalleryAlbum[] = [
  {
    id: "album-infra",
    title: "Campus Infrastructure & Academic Blocks",
    type: "Campus",
    order: 1,
    media: [
      { id: "g-inf-1", url: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80", type: "image", caption: "The LSU Grand Academic Block Front Facade" },
      { id: "g-inf-2", url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80", type: "image", caption: "Central Courtyard & Executive Library Block" },
      { id: "g-inf-3", url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80", type: "image", caption: "Advanced Quantum Computing & Embedded AI Labs" }
    ]
  },
  {
    id: "album-fest",
    title: "Imperial Academic Fest & Tech Conclave",
    type: "Events",
    order: 2,
    media: [
      { id: "g-fst-1", url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80", type: "image", caption: "Inaugural Session of Tech Conclave 2026" },
      { id: "g-fst-2", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80", type: "image", caption: "Over 5,000 delegates joining live in Main Arena" }
    ]
  },
  {
    id: "album-convo",
    title: "24th Annual Convocation Ceremony",
    type: "Convocation",
    order: 3,
    media: [
      { id: "g-cnv-1", url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80", type: "image", caption: "B.Tech CSE graduating batch of 2025" },
      { id: "g-cnv-2", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80", type: "image", caption: "Chancellor Dr. Arvind Sehgal presenting gold academic medals" }
    ]
  },
  {
    id: "album-sports",
    title: "Inter-University Cricket & Athletic League",
    type: "Sports",
    order: 4,
    media: [
      { id: "g-spt-1", url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80", type: "image", caption: "LSU Cricket squad securing the State Championship Trophy" },
      { id: "g-spt-2", url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80", type: "image", caption: "Track athletes clocking personal bests in NCR tournaments" }
    ]
  },
  {
    id: "album-cultural",
    title: "Sanskriti & Imperial Music Showcases",
    type: "Cultural",
    order: 5,
    media: [
      { id: "g-cul-1", url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80", type: "image", caption: "LSU Fusion band headlining the annual Sanskriti rock night" },
      { id: "g-cul-2", url: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=1200&auto=format&fit=crop&q=80", type: "image", caption: "Indian musical play presented by final year arts candidates" }
    ]
  }
];
