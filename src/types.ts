export type UserRole = "Super Admin" | "Admin" | "Editor";

export interface AdminUser {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
}

export interface SiteConfig {
  universityName: string;
  logoUrl: string;
  logoText: string;
  accreditationBadge: string; // e.g. "NAAC A++ Grade | NIRF Top 50"
  contactEmail: string;
  contactPhone: string;
  address: string;
  goldAccentColor: string; // HEX or tailwind class
  primaryThemeColor: string; // HEX or tailwind class
  seoTitle: string;
  seoDescription: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    instagram?: string;
  };
  navigation: NavigationItem[];
  footerSections: {
    title: string;
    links: { label: string; url: string }[];
  }[];
  announcementTicker?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  hasMegaMenu?: boolean;
  megaMenuCategories?: {
    title: string;
    links: { label: string; url: string; desc?: string }[];
  }[];
}

export interface PageSection {
  id: string;
  type: "hero" | "stats" | "slider" | "infosection" | "courses" | "placements" | "gallery" | "testimonials" | "notices" | "contact";
  title?: string;
  subtitle?: string;
  content: any; // section type specific data
}

export interface PageData {
  id: string;
  title: string;
  slug: string;
  seoTitle: string;
  seoDesc: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  sections: PageSection[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  level: "UG" | "PG" | "Diploma" | "PhD";
  duration: string; // e.g. "4 Years"
  eligibility: string;
  fees: string; // e.g. "₹1,20,000 per annum"
  description: string;
  syllabus?: string; // outline
  branches?: string[]; // e.g. ["Computer Science", "Information Technology", "AI & ML"]
}

export interface Certificate {
  id: string;
  certificateNo: string;
  enrollmentNo: string;
  registrationNo?: string;
  studentName: string;
  fatherName?: string;
  course: string;
  specialization?: string;
  grade: string;
  cgpa?: string;
  passingYear?: string;
  issueDate: string;
  status: "Verified" | "Revoked" | "Suspended";
  qrCodeValue: string;
  remarks?: string;
}

export interface CertificateTemplate {
  id: string; // static ID like "main_template"
  universityName: string;
  address: string;
  contactNumber: string;
  website: string;
  email: string;
  accreditationBadge: string;
  logoUrl: string;
  certificateTitle: string;
  certificateContent: string;
  signatureImage1: string;
  registrarName: string;
  signatureImage2: string;
  viceChancellorName: string;
  sealStampImage: string;
  qrCodePosition: "top-right" | "bottom-left" | "bottom-right" | "bottom-center";
  certificateBackground: "classic-border" | "modern-gold" | "royal-accent" | "bordered-clean";
  certificateFooter: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  folder: "Gallery" | "Courses" | "Notices" | "Admissions" | "Certificates" | "Uncategorized";
  mimeType: string;
  size: string;
  createdAt: string;
}

export interface Notice {
  id: string;
  title: string;
  category: "Academic" | "Admissions" | "Examinations" | "Events" | "Careers";
  date: string;
  priority: "High" | "Normal";
  description: string;
  pdfUrl?: string;
  published: boolean;
}

export interface GalleryMediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  caption?: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  type: "Campus" | "Events" | "Convocation" | "Sports" | "Cultural";
  order: number;
  media: GalleryMediaItem[];
}
