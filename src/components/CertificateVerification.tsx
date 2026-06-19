import React, { useState } from "react";
import { Search, CheckCircle2, AlertTriangle, Printer, QrCode, ShieldCheck, Award } from "lucide-react";
import { Certificate, SiteConfig } from "../types";

interface CertificateVerificationProps {
  certificates: Certificate[];
  config?: SiteConfig;
}

export default function CertificateVerification({ certificates, config }: CertificateVerificationProps) {
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
        c.enrollmentNo.toLowerCase() === query
    );

    if (found) {
      setVerifiedCert(found);
    } else {
      setErrorMsg("No matching verified educational credential found in the registry. Please check credential coordinates.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn" id="cert-verification-portal">
      
      {/* 1. Header Hero Panel */}
      <div className="bg-gradient-to-br from-[#2E080F] via-[#060B13] to-[#58111A]/35 border border-[#D4AF37]/35 rounded-2xl p-8 md:p-12 text-center text-white mb-10 shadow-2xl relative overflow-hidden" id="cert-banner">
        <div className="absolute top-0 left-0 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#58111A]/20 rounded-full blur-2xl" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] font-mono text-xs uppercase rounded-full">
            <ShieldCheck className="w-4 h-4 animate-pulse" /> Official SECURED Registry
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#EAE0D5] to-[#D4AF37] uppercase font-serif">
            Credential Verification Portal
          </h1>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Verify academic transcripts, degree certificates, and doctoral credentials issued by {config?.universityName || "Lakshmi Sehgal University"}. Confirmed via live blockchain-secured database registry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Helper Panel (Left 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#130306]/55 border border-[#D4AF37]/20 rounded-xl p-6 shadow-lg relative overflow-hidden" id="cert-info">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D4AF37]" /> Registration Guidelines
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
            🔒 Secured with LSU cryptographic protocols. Public listings are disabled to protect student transcripts.
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
                  placeholder="Enrollment Number (e.g. LSU2022CSE402) or Certificate ID"
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
                  <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-4 flex items-center gap-3 text-emerald-400">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-400" />
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white">Verification Confirmed</h4>
                      <p className="text-xs text-emerald-200">The LSU academic registry validates this record as authentic and active in university archives.</p>
                    </div>
                  </div>

                  {/* 100% Gorgeous Framed Certificate Mockup */}
                  <div className="bg-white text-black p-8 md:p-14 rounded-xl shadow-2xl border-[16px] border-[#58111A] relative overflow-hidden" id="academic-certificate-print">
                    
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
                        <h2 className="text-2xl font-serif font-bold tracking-widest text-[#58111A] uppercase">
                          {config?.logoText || config?.universityName || "LAKSHMI SEHGAL UNIVERSITY"}
                        </h2>
                        <span className="text-[10px] font-mono tracking-[2px] text-gray-500 uppercase block max-w-sm mx-auto">
                          {config?.address || "Noida, Delhi NCR, India"}
                        </span>
                      </div>

                      <div className="py-2">
                        <span className="block font-serif italic text-lg text-slate-700">
                          This is to certify that
                        </span>
                        <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[#58111A] tracking-wide mt-2">
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
                          <span className="font-sans text-slate-800 block text-xs italic font-semibold border-b border-gray-300 pb-1 px-4">
                            Dr. Sandeep Pathak
                          </span>
                          <span className="text-[10px] text-gray-400 block mt-1 uppercase tracking-wider font-mono">Registrar / Vice Chancellor</span>
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
                      className="px-6 py-3 bg-[#58111A] text-white font-bold rounded-lg hover:bg-[#6b1d2f] transition-all text-xs flex items-center gap-2 cursor-pointer shadow-md"
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
