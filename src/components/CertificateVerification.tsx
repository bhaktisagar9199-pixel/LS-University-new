import React, { useState } from "react";
import { Search, CheckCircle2, AlertTriangle, Printer, QrCode, ShieldCheck, Download, Award, FileSpreadsheet } from "lucide-react";
import { Certificate } from "../types";

interface CertificateVerificationProps {
  certificates: Certificate[];
  onSearch?: (query: string) => Promise<Certificate | null>;
}

export default function CertificateVerification({ certificates }: CertificateVerificationProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedCert, setVerifiedCert] = useState<Certificate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setErrorMsg("");
    setVerifiedCert(null);

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setErrorMsg("Please enter an Enrollment Number or Certificate Number.");
      return;
    }

    // Direct local search against synced firestore certificates list
    const found = certificates.find(
      (c) =>
        c.certificateNo.toLowerCase() === query ||
        c.enrollmentNo.toLowerCase() === query ||
        c.studentName.toLowerCase().includes(query)
    );

    if (found) {
      setVerifiedCert(found);
    } else {
      setErrorMsg("No matching verified educational credential found. Please check credential coordinates.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Safe Excel Export representation in Client State
  const handleExportCSV = () => {
    if (certificates.length === 0) return;
    const headers = ["Certificate ID", "Enrollment ID", "Student Name", "Course Track", "Division/Grade", "Issue Date", "Status"];
    const rows = certificates.map(c => [c.certificateNo, c.enrollmentNo, c.studentName, c.course, c.grade, c.issueDate, c.status]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LSURL_Verified_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="cert-verification-portal">
      
      {/* 1. Header Hero Panel */}
      <div className="bg-gradient-to-br from-[#0A192F] via-[#030712] to-[#1E3A8A]/30 border border-[#D4AF37]/30 rounded-2xl p-8 md:p-12 text-center text-white mb-10 shadow-2xl relative overflow-hidden" id="cert-banner">
        <div className="absolute top-0 left-0 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#1E3A8A]/20 rounded-full blur-2xl" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-4 y-1 border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] font-mono text-xs uppercase rounded-full">
            <ShieldCheck className="w-4 h-4 animate-pulse" /> Secure Block Audit
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E5E7EB] to-[#D4AF37] uppercase">
            Credential Verification Portal
          </h1>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Verify academic transcripts, degree certificates, and doctoral credentials issued by Laxmi Shanker University. Confirmed via live database registry.
          </p>
          
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-slate-900 border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37] rounded-lg hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow"
              title="Export complete database layout for audit verification"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Registry Metadata (CSV)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Helper Panel (Left 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0B1B3D]/30 border border-[#D4AF37]/10 rounded-xl p-6 shadow-lg relative overflow-hidden" id="cert-info">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D4AF37]" /> Verification Guidelines
            </h3>
            <ul className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-[#D4AF37] font-bold">1.</span>
                <span>Type in the official enrollment/roll parameter (e.g. <code className="bg-white/5 py-0.5 px-1 rounded text-white">LS2022CSE402</code>) or the certificate credential serial.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#D4AF37] font-bold">2.</span>
                <span>A fully compliant academic award layout will materialize with QR verification logs.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#D4AF37] font-bold">3.</span>
                <span>Press <kbd className="bg-white/10 px-1 py-0.5 rounded text-white text-[10px]">Ctrl+P</kbd> or click the <b>Print</b> icon to produce high-resolution hard copies.</span>
              </li>
            </ul>
          </div>

          {/* Quick Demo Preloads */}
          <div className="bg-[#030712]/40 border border-[#D4AF37]/10 rounded-xl p-5" id="cert-presets">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] mb-3">Sample Credentials</h4>
            <div className="space-y-2">
              <button 
                onClick={() => setSearchQuery("LS2022CSE402")}
                className="w-full text-left p-2.5 bg-slate-900 hover:bg-slate-800 border-l-2 border-[#D4AF37] rounded text-xs text-gray-300 transition-all flex justify-between items-center cursor-pointer"
              >
                <span>B.Tech CSE: Aditya Vardhan</span>
                <span className="text-[10px] font-mono text-[#D4AF37]">Preload</span>
              </button>
              <button 
                onClick={() => setSearchQuery("LSU-1129-9238")}
                className="w-full text-left p-2.5 bg-slate-900 hover:bg-slate-800 border-l-2 border-[#D4AF37] rounded text-xs text-gray-300 transition-all flex justify-between items-center cursor-pointer"
              >
                <span>MBA: Priyanka Chandani</span>
                <span className="text-[10px] font-mono text-[#D4AF37]">Preload</span>
              </button>
            </div>
          </div>
        </div>

        {/* Query Input Section & Certificate Output (Right 8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main search form */}
          <form onSubmit={handleSearch} className="bg-gradient-to-r from-[#0A192F] to-[#030712] border border-[#D4AF37]/30 rounded-xl p-6 shadow-xl" id="cert-form">
            <h3 className="text-sm font-semibold text-white mb-3">Enter Student or Certificate Coordinates</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enrollment Number (e.g. LS2022CSE402) or Certificate ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-lg pl-11 pr-4 py-3.5 text-white text-sm focus:outline-none placeholder-gray-500 font-mono tracking-wide"
                />
              </div>
              <button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#C29E30] text-black font-bold uppercase tracking-wider text-xs px-8 py-3.5 sm:py-0 rounded-lg transition-all cursor-pointer shadow-lg active:scale-95"
              >
                Verify Now
              </button>
            </div>
          </form>

          {/* Verification feedback results */}
          {hasSearched && (
            <div className="animate-fadeIn">
              {verifiedCert ? (
                <div className="space-y-6">
                  {/* Verified banner */}
                  <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-4 flex items-center gap-3 text-emerald-400">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-400" />
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white">Verification Confirmed</h4>
                      <p className="text-xs text-emerald-200">The academic registry validates this record as authentic and active in campus archives.</p>
                    </div>
                  </div>

                  {/* 100% Gorgeous Framed Certificate Mockup */}
                  <div className="bg-white text-black p-8 md:p-14 rounded-xl shadow-2xl border-[16px] border-[#0A192F] relative overflow-hidden" id="academic-certificate-print">
                    
                    {/* Visual Guilloche Border effect with css lines */}
                    <div className="absolute inset-2 border-2 border-[#D4AF37] pointer-events-none" />
                    <div className="absolute inset-4 border border-[#D4AF37]/60 pointer-events-none border-dashed" />
                    
                    {/* Background Seal Emblem */}
                    <div className="absolute inset-0 flex justify-center items-center opacity-[0.03] pointer-events-none">
                      <Award className="w-[300px] h-[300px] text-black" />
                    </div>

                    <div className="relative z-10 text-center space-y-6">
                      
                      {/* University Header logo */}
                      <div className="flex flex-col items-center space-y-2">
                        <Award className="w-12 h-12 text-[#D4AF37]" />
                        <h2 className="text-2xl font-serif font-bold tracking-widest text-slate-900">
                          LAXMI SHANKER UNIVERSITY
                        </h2>
                        <span className="text-[10px] font-mono tracking-[4px] text-gray-500 uppercase">
                          Noida, Delhi NCR, India
                        </span>
                      </div>

                      <div className="py-2">
                        <span className="block font-serif italic text-lg text-slate-700">
                          This is to certify that
                        </span>
                        <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[#0A192F] tracking-wide mt-2">
                          {verifiedCert.studentName}
                        </h3>
                        <p className="text-xs font-mono text-gray-400 mt-1">
                          Enrollment Code: {verifiedCert.enrollmentNo}
                        </p>
                      </div>

                      <div className="space-y-2 max-w-lg mx-auto">
                        <span className="block font-serif italic text-sm text-slate-700">
                          having completed the authorized academic requirements of study is hereby awarded the degree of
                        </span>
                        <h4 className="text-xl font-bold font-sans text-slate-800 tracking-normal border-b border-[#D4AF37] pb-2 max-w-md mx-auto">
                          {verifiedCert.course}
                        </h4>
                        <span className="block font-sans text-xs text-gray-500 uppercase tracking-widest mt-2">
                          Grade Secured: <strong className="text-black">{verifiedCert.grade}</strong>
                        </span>
                      </div>

                      {/* Seal, Signature & QR Verification columns */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-150 items-center justify-items-center">
                        
                        {/* 1. Date */}
                        <div className="text-center font-serif text-slate-600 text-xs">
                          <span className="block border-b border-gray-300 pb-1 px-4">{verifiedCert.issueDate}</span>
                          <span className="text-[10px] text-gray-400 block mt-1 uppercase tracking-wider font-mono">Issue Date</span>
                        </div>

                        {/* 2. QR Code Verification Seal */}
                        <div className="flex flex-col items-center">
                          <div className="bg-[#030712] p-2.5 rounded-lg border border-[#D4AF37]/40 shadow-sm relative group">
                            <QrCode className="w-16 h-16 text-white" />
                          </div>
                          <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mt-1.5 flex items-center gap-1">
                            <QrCode className="w-2.5 h-2.5 text-emerald-600" /> SECURE REGISTRY QR
                          </span>
                        </div>

                        {/* 3. Signature */}
                        <div className="text-center font-serif text-slate-600 text-xs">
                          <span className="font-cursive text-slate-800 block text-sm italic font-semibold border-b border-gray-300 pb-1 px-4">
                            Dr. L. S. Dixit
                          </span>
                          <span className="text-[10px] text-gray-400 block mt-1 uppercase tracking-wider font-mono">Registrar / VC</span>
                        </div>

                      </div>

                      {/* Footer reference number */}
                      <div className="pt-4 flex justify-between items-center text-[10px] text-gray-400 font-mono">
                        <span>SerNo: {verifiedCert.certificateNo}</span>
                        <span className="text-[#D4AF37] font-bold">STATUS: {verifiedCert.status.toUpperCase()}</span>
                      </div>

                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex justify-end gap-3" id="cert-actions">
                    <button
                      onClick={handlePrint}
                      className="px-6 py-3 bg-[#0A192F] text-white font-bold rounded-lg hover:bg-slate-800 transition-all text-xs flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Printer className="w-4 h-4 text-[#D4AF37]" /> Print Certificate Archive
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
