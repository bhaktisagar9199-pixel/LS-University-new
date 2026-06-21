import React, { useState, useRef } from "react";
import { Upload, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

interface StorageImageUploaderProps {
  currentUrl: string;
  onUrlChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function StorageImageUploader({
  currentUrl,
  onUrlChange,
  folder = "cms_assets",
  label = "Upload Image (Supports Drag & Drop)"
}: StorageImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setError(null);

    // Validate if it is an image
    if (!file.type.startsWith("image/")) {
      setError("Only image files are permitted.");
      setIsUploading(false);
      return;
    }

    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const storageRef = ref(storage, `images/${folder}/${Date.now()}_${cleanFileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      
      // Append a cache-buster query parameter to force reactive updates
      const updatedUrl = `${downloadUrl}${downloadUrl.includes("?") ? "&" : "?"}t=${Date.now()}`;
      onUrlChange(updatedUrl);
    } catch (err: any) {
      console.error("Firebase Storage Upload Error: ", err);
      setError(err?.message || "Storage write permission or network error.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2 mt-1.5" id={`uploader-container-${folder}`}>
      <label className="block text-gray-400 text-[10px] uppercase font-mono tracking-wider font-semibold">
        {label}
      </label>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300 min-h-[100px] flex flex-col items-center justify-center space-y-2 ${
          isDragActive 
            ? "border-[#D4AF37] bg-[#D4AF37]/5" 
            : currentUrl 
              ? "border-[#D4AF37]/30 bg-slate-950/40 hover:border-[#D4AF37]/60" 
              : "border-gray-700 bg-slate-950/20 hover:border-gray-500"
        }`}
        id={`drop-zone-${folder}`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
          id={`file-input-${folder}`}
        />

        {isUploading ? (
          <div className="flex flex-col items-center space-y-1.5 animate-pulse">
            <RefreshCw className="w-5 h-5 text-[#D4AF37] animate-spin" />
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">
              Uploading file...
            </span>
          </div>
        ) : currentUrl ? (
          <div className="flex flex-col items-center space-y-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <div className="flex items-center gap-1.5">
              <img 
                src={currentUrl} 
                alt="preview" 
                className="w-10 h-10 object-cover rounded border border-[#D4AF37]/30"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="text-[10px] font-mono text-gray-300 truncate max-w-[150px]">
                {currentUrl.split("/").pop()?.split("?")[0] || "Image Uploaded"}
              </span>
            </div>
            <span className="text-[9px] text-[#D4AF37]/70 font-mono">
              Click or drag another image to replace
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-1">
            <Upload className="w-5 h-5 text-gray-400 group-hover:text-white" />
            <span className="text-[10px] text-gray-300 font-sans">
              Drag file here or <span className="text-[#D4AF37] font-semibold">browse files</span>
            </span>
            <span className="text-[8px] text-gray-500 font-mono">
              PNG, JPG, JPEG, GIF up to 5MB
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 bg-rose-950/30 border border-rose-500/20 rounded p-2 text-[10px] text-rose-400 font-mono">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
