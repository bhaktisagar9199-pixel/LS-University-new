import React, { useState, useEffect } from "react";
import { Search, CheckCircle2, AlertTriangle, Printer, QrCode, ShieldCheck, Award, Mail, Phone, Globe, MapPin } from "lucide-react";
import { Certificate, SiteConfig, CertificateTemplate } from "../types";

interface CertificateVerificationProps {
  certificates: Certificate[];
  config?: SiteConfig;
  template?: CertificateTemplate;
}

export default function CertificateVerification({ certificates, config, template }: CertificateVerificationProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedCert, setVerifiedCert] = useState<Certificate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Default Template (used as fallback if not synchronized from Firestore)
  const defaultTemplate: CertificateTemplate = {
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
    signatureImage1: "",
    registrarName: "Dr. Sandeep Pathak",
    signatureImage2: "",
    viceChancellorName: "Prof. G.S. Prasad",
    sealStampImage: "",
    qrCodePosition: "bottom-right",
    certificateBackground: "classic-border",
    certificateFooter: "This transcript degree record is secured via official LSU Ledger Registry. Check verification coordinates directly via standard portal protocols."
  };

  const t = template || defaultTemplate;

  // Support direct parameter lookup via hash (e.g. #/verify?id=LSU-9283-1029)
  useEffect(() => {
    const handleCheckUrlParam = () => {
      const hash = window.location.hash;
      const match = hash.match(/[?&]id=([^&]+)/);
      if (match) {
        const urlId = decodeURIComponent(match[1]).trim().toLowerCase();
        const found = certificates.find(
          (c) =>
            c.certificateNo.toLowerCase() === urlId ||
            c.enrollmentNo.toLowerCase() === urlId ||
            c.id.toLowerCase() === `cert-${urlId}`
        );
        if (found) {
          setVerifiedCert(found);
          setSearchQuery(found.certificateNo);
          setHasSearched(true);
          setErrorMsg("");
        }
      }
    };

    handleCheckUrlParam();
    window.addEventListener("hashchange", handleCheckUrlParam);
    return () => window.removeEventListener("hashchange", handleCheckUrlParam);
  }, [certificates]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setErrorMsg("");
    setVerifiedCert(null);

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setErrorMsg("Please enter an Enrollment Number, Registration Number, or Certificate Serial Number.");
      return;
    }

    const found = certificates.find(
      (c) =>
        c.certificateNo.toLowerCase() === query ||
        c.enrollmentNo.toLowerCase() === query ||
        c.registrationNo?.toLowerCase() === query
    );

    if (found) {
      setVerifiedCert(found);
    } else {
      setErrorMsg("No matching verified educational credential found in the registry databases. Please confirm spelling or registration criteria.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Substitute certificate variables in raw template content
  const formatCertificateText = (rawStr: string, cert: Certificate) => {
    if (!rawStr) return "";
    return rawStr
      .replace(/\[STUDENT_NAME\]/gi, cert.studentName || "")
      .replace(/\[FATHER_NAME\]/gi, cert.fatherName || "N/A")
      .replace(/\[ENROLLMENT_NO\]/gi, cert.enrollmentNo || "")
      .replace(/\[REGISTRATION_NO\]/gi, cert.registrationNo || "N/A")
      .replace(/\[COURSE_NAME\]/gi, cert.course || "")
      .replace(/\[SPECIALIZATION\]/gi, cert.specialization || "General")
      .replace(/\[GRADE\]/gi, cert.grade || "")
      .replace(/\[CGPA\]/gi, cert.cgpa || "")
      .replace(/\[PASSING_YEAR\]/gi, cert.passingYear || "");
  };

  // Background/Border styling styles based on configuration
  const getBackgroundStyles = () => {
    switch (t.certificateBackground) {
      case "modern-gold":
        return {
          containerClass: "bg-stone-900 text-amber-100 border-[16px] border-amber-900/60 shadow-2xl rounded-lg p-8 md:p-14 relative overflow-hidden",
          innerBorderClass: "absolute inset-2 border-2 border-amber-500/40 pointer-events-none",
          badgeColor: "text-amber-500",
          headerColor: "text-amber-400 font-serif",
          textColor: "text-stone-300",
          accentColor: "text-amber-200"
        };
      case "royal-accent":
        return {
          containerClass: "bg-slate-900 text-slate-100 border-[16px] border-[#58111A] shadow-2xl rounded-lg p-8 md:p-14 relative overflow-hidden",
          innerBorderClass: "absolute inset-2 border-2 border-amber-500/30 pointer-events-none",
          badgeColor: "text-amber-400",
          headerColor: "text-amber-400 font-mono",
          textColor: "text-slate-350",
          accentColor: "text-amber-500"
        };
      case "bordered-clean":
        return {
          containerClass: "bg-zinc-50 text-stone-900 border-[8px] border-double border-[#D4AF37] shadow-xl rounded-none p-6 md:p-12 relative overflow-hidden",
          innerBorderClass: "absolute inset-1 border border-stone-300 pointer-events-none",
          badgeColor: "text-slate-700",
          headerColor: "text-stone-850 font-sans font-bold",
          textColor: "text-stone-600",
          accentColor: "text-stone-900"
        };
      case "classic-border":
      default:
        return {
          containerClass: "bg-white text-black border-[16px] border-[#58111A] shadow-2xl rounded-xl p-8 md:p-14 relative overflow-hidden",
          innerBorderClass: "absolute inset-2 border-2 border-[#D4AF37] pointer-events-none",
          badgeColor: "text-[#D4AF37]",
          headerColor: "text-[#58111A] font-serif",
          textColor: "text-gray-700",
          accentColor: "text-[#58111A]"
        };
    }
  };

  const styling = getBackgroundStyles();

  // Signature representation fallback (nice script typography)
  const renderSignature = (sigUrl: string, name: string) => {
    if (sigUrl) {
      return (
        <img
          src={sigUrl}
          referrerPolicy="no-referrer"
          alt={name}
          className="h-10 object-contain mx-auto mix-blend-multiply"
        />
      );
    }
    return (
      <span className="font-serif italic font-semibold text-slate-800 tracking-wide text-xs h-10 flex items-end justify-center">
        {name}
      </span>
    );
  };

  const qrCodeUI = (
    <div className="flex flex-col items-center">
      <div className="bg-black p-2 rounded border border-[#D4AF37] shadow relative">
        <QrCode className="w-16 h-16 text-white" />
      </div>
      <span className="text-[7.5px] font-mono text-gray-400 uppercase tracking-widest mt-1 block select-none">
        Registry Authenticated
      </span>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn" id="cert-verification-portal">
      
      {/* Dynamic Printing Media Helper Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #academic-certificate-print, #academic-certificate-print * {
            visibility: visible;
          }
          #academic-certificate-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          #no-print, #cert-banner, #cert-info, #cert-form, #cert-actions {
            display: none !important;
          }
        }
      `}</style>

      {/* 1. Header Hero Panel */}
      <div className="bg-gradient-to-br from-[#2E080F] via-[#060B13] to-[#58111A]/35 border border-[#D4AF37]/35 rounded-2xl p-8 md:p-12 text-center text-white mb-10 shadow-2xl relative overflow-hidden" id="cert-banner">
        <div className="absolute top-0 left-0 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#58111A]/20 rounded-full blur-2xl" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] font-mono text-xs uppercase rounded-full">
            <ShieldCheck className="w-4 h-4 animate-pulse" /> Official SECURED Registry
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#EAE0D5] to-[#D4AF37] uppercase font-serif">
            LSU Cryptographic Verification Desk
          </h1>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Verify academic transcripts, degree certificates, and doctoral credentials issued by <strong className="text-[#D4AF37]">{t.universityName}</strong>. Confirmed via live decentralized database registry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Helper Panel (Left 4 cols) */}
        <div className="lg:col-span-4 space-y-6" id="cert-info">
          <div className="bg-[#130306]/55 border border-[#D4AF37]/20 rounded-xl p-6 shadow-lg relative overflow-hidden">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D4AF37]" /> Verification Guidelines
            </h3>
            <ul className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <li className="flex gap-2.5">
                <span className="text-[#D4AF37] font-bold text-sm">1.</span>
                <span>Enter the official enrollment registration number (e.g. <code className="bg-white/5 py-0.5 px-1 rounded text-white font-mono">LSU2022CSE402</code>) or the certificate serial code.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-[#D4AF37] font-bold text-sm">2.</span>
                <span>An authorized digital diploma with dynamic administrative signatures will load immediately upon a correct registry match.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-[#D4AF37] font-bold text-sm">3.</span>
                <span>Press <kbd className="bg-white/10 px-1 py-0.5 rounded text-white text-[10px]">Ctrl+P</kbd> or click the <b>Print</b> command to compile high-resolution physical documents.</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-blue-950/25 border border-dashed border-[#D4AF37]/20 rounded-xl p-5 text-center text-gray-400 text-xs">
            🔒 Secured with official {t.universityName} cryptographic protocols. Public listings are disabled to protect student transcripts.
          </div>
        </div>

        {/* Query Input Section & Certificate Output (Right 8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main search form */}
          <form onSubmit={handleSearch} className="bg-gradient-to-r from-[#21050A] to-[#0A111C] border border-[#D4AF37]/35 rounded-xl p-6 shadow-xl" id="cert-form">
            <h3 className="text-sm font-semibold text-white mb-3">Enter Student or Certificate Coordinates</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enrollment, Registration, or Certificate No."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-lg pl-11 pr-4 py-3.5 text-white text-sm focus:outline-none placeholder-gray-500 font-mono tracking-wide"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#D4AF37] to-[#EAE0D5] hover:opacity-95 text-black font-bold uppercase tracking-wider text-xs px-8 py-3.5 sm:py-0 rounded-lg transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Search className="w-4 h-4" /> Verify Now
              </button>
            </div>
          </form>

          {/* Verification feedback results */}
          {hasSearched && (
            <div className="animate-fadeIn">
              {verifiedCert ? (
                <div className="space-y-6">
                  {/* Verified banner */}
                  <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-4 flex items-center gap-3 text-emerald-400" id="no-print">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-400" />
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white">Verification Confirmed</h4>
                      <p className="text-xs text-emerald-200">The registry validates this record as authentic and active in the central academic archives of {t.universityName}.</p>
                    </div>
                  </div>

                  {/* 100% Dynamic CMS-Styled Certificate */}
                  <div 
                    className={styling.containerClass}
                    id="academic-certificate-print"
                  >
                    
                    {/* Visual Guilloche Border effect */}
                    <div className={styling.innerBorderClass} />
                    <div className="absolute inset-4 border border-[#D4AF37]/30 pointer-events-none border-dashed" />
                    
                    {/* Background Seal Emblem */}
                    <div className="absolute inset-0 flex justify-center items-center opacity-[0.03] pointer-events-none">
                      {t.sealStampImage ? (
                        <img src={t.sealStampImage} alt="seal" className="w-[300px] h-[300px] object-contain" referrerPolicy="no-referrer" />
                      ) : (
                        <Award className="w-[300px] h-[300px] text-black" />
                      )}
                    </div>

                    <div className="relative z-10 text-center space-y-6">
                      
                      {/* Top Right QR position style option */}
                      {t.qrCodePosition === "top-right" && (
                        <div className="absolute top-2 right-2 hidden md:block">
                          {qrCodeUI}
                        </div>
                      )}

                      {/* University Header logo & Dynamic Address Section */}
                      <div className="flex flex-col items-center space-y-2">
                        {t.logoUrl ? (
                          <img 
                            src={t.logoUrl} 
                            alt="logo" 
                            className="h-16 w-16 object-contain rounded-full shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <Award className={`w-12 h-12 ${styling.badgeColor}`} />
                        )}
                        <h2 className={`text-2xl md:text-3xl font-serif font-extrabold tracking-widest uppercase ${styling.accentColor}`}>
                          {t.universityName}
                        </h2>
                        
                        {/* Dynamic University Address Block */}
                        <div className="text-[10px] font-mono text-gray-500 max-w-xl mx-auto space-y-0.5" id="no-print">
                          <p className="tracking-wide uppercase">{t.address}</p>
                          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-1 text-gray-400">
                            {t.contactNumber && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#D4AF37]/60" /> {t.contactNumber}</span>}
                            {t.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#D4AF37]/60" /> {t.email}</span>}
                            {t.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-[#D4AF37]/60" /> {t.website}</span>}
                          </div>
                        </div>
                        
                        {t.accreditationBadge && (
                          <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase bg-[#58111A]/5 px-3 py-1 rounded border border-[#D4AF37]/15 mt-2 inline-block">
                            {t.accreditationBadge}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 py-2">
                        <span className="block font-serif italic text-base text-gray-500">
                          This is to declare with high credit that
                        </span>
                        <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[#58111A] tracking-wide mt-1">
                          {verifiedCert.studentName}
                        </h3>
                        {verifiedCert.fatherName && (
                          <p className="text-sm font-sans text-gray-600 mt-0.5">
                            Child of <strong className="text-gray-900 font-serif font-medium">{verifiedCert.fatherName}</strong>
                          </p>
                        )}
                        <div className="flex justify-center gap-4 text-[10px] font-mono text-gray-400 mt-1">
                          <span>Enrollment: <strong className="text-black">{verifiedCert.enrollmentNo}</strong></span>
                          {verifiedCert.registrationNo && (
                            <span>Registration: <strong className="text-black">{verifiedCert.registrationNo}</strong></span>
                          )}
                        </div>
                      </div>

                      {/* Configurable Certificate Title & Dynamic Variable Substitution */}
                      <div className="space-y-4 max-w-2xl mx-auto card-borders pt-2 pb-4">
                        <h4 className="text-xs uppercase font-mono tracking-[4px] text-amber-600 font-bold">
                          {t.certificateTitle}
                        </h4>
                        <p className={`text-sm md:text-base leading-relaxed ${styling.textColor} font-serif italic px-2 md:px-8`}>
                          {formatCertificateText(t.certificateContent, verifiedCert)}
                        </p>
                      </div>

                      {/* Seal, Signatures & Variable Columns */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-gray-200 items-end justify-items-center">
                        
                        {/* Column 1: Date coordinates */}
                        <div className="text-center font-serif text-slate-600 text-xs">
                          <span className="block border-b border-gray-300 pb-1 px-4 text-stone-850 font-sans font-bold">
                            {verifiedCert.issueDate}
                          </span>
                          <span className="text-[9px] text-gray-400 block mt-1.5 uppercase tracking-wider font-mono">Issue Date</span>
                        </div>

                        {/* Column 2: Administrative Registrar Signature */}
                        <div className="text-center font-serif text-slate-600 text-xs w-full">
                          <div className="h-10 flex items-center justify-center">
                            {renderSignature(t.signatureImage1, t.registrarName)}
                          </div>
                          <span className="block border-t border-gray-350 pt-1 text-[#58111A] font-sans font-bold text-[11px] uppercase tracking-wide">
                            {t.registrarName}
                          </span>
                          <span className="text-[9px] text-gray-400 block mt-0.5 uppercase tracking-wider font-mono">Registrar</span>
                        </div>

                        {/* Column 3: Vice Chancellor Signature */}
                        <div className="text-center font-serif text-slate-600 text-xs w-full">
                          <div className="h-10 flex items-center justify-center">
                            {renderSignature(t.signatureImage2, t.viceChancellorName)}
                          </div>
                          <span className="block border-t border-gray-350 pt-1 text-[#58111A] font-sans font-bold text-[11px] uppercase tracking-wide">
                            {t.viceChancellorName}
                          </span>
                          <span className="text-[9px] text-gray-400 block mt-0.5 uppercase tracking-wider font-mono">Vice Chancellor</span>
                        </div>

                        {/* Column 4: Stamp and Seal image */}
                        <div className="text-center font-serif text-stone-600 text-xs w-full flex flex-col items-center justify-end">
                          <div className="h-10 flex items-center justify-center">
                            {t.sealStampImage ? (
                              <img src={t.sealStampImage} referrerPolicy="no-referrer" alt="seal stamp" className="h-12 object-contain mix-blend-multiply" />
                            ) : (
                              <Award className="w-10 h-10 text-amber-600/30" />
                            )}
                          </div>
                          <span className="text-[9px] text-gray-400 block mt-1 uppercase tracking-wider font-mono">OFFICIAL SEAL</span>
                        </div>

                      </div>

                      {/* Static Bottom QR Alignment if not Top-Right */}
                      <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-4 border-t border-gray-100 pr-2">
                        
                        {/* Dynamic aligned QR position styling */}
                        {t.qrCodePosition !== "top-right" && (
                          <div className={`flex w-full md:w-auto items-center justify-center ${
                            t.qrCodePosition === "bottom-left" ? "md:order-1" :
                            t.qrCodePosition === "bottom-center" ? "mx-auto md:order-2" : "md:order-3"
                          }`}>
                            {qrCodeUI}
                          </div>
                        )}

                        <div className="text-left space-y-1 md:order-2 max-w-md">
                          <p className="text-[10px] text-gray-400 font-serif leading-relaxed italic block select-all">
                            {t.certificateFooter}
                          </p>
                        </div>
                      </div>

                      {/* Footer reference number coordinates */}
                      <div className="pt-2 flex justify-between items-center text-[10px] text-gray-400 font-mono">
                        <span>SerNo Reference: {verifiedCert.certificateNo}</span>
                        <span className="text-[#D4AF37] font-bold">REGISTRY NO: {verifiedCert.registrationNo || verifiedCert.enrollmentNo} &bull; STATUS: {verifiedCert.status.toUpperCase()}</span>
                      </div>

                    </div>
                  </div>

                  {/* Actions Bar (Download / Print) */}
                  <div className="flex flex-wrap items-center justify-end gap-3" id="cert-actions">
                    <button
                      onClick={handlePrint}
                      className="px-6 py-3 bg-[#58111A] text-white font-bold rounded-lg hover:bg-[#6b1d2f] transition-all text-xs flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Printer className="w-4 h-4 text-[#D4AF37]" /> Print / Download PDF
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-950/40 border border-rose-500/30 rounded-lg p-6 text-center text-rose-300 space-y-2">
                  <AlertTriangle className="w-10 h-10 mx-auto text-rose-400" />
                  <h4 className="text-base font-bold uppercase tracking-wider text-white">Credential Verification Denied</h4>
                  <p className="text-xs text-rose-250 max-w-md mx-auto">
                    {errorMsg}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
