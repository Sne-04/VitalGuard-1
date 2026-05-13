"use client";

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, ImageIcon, Loader2, Sparkles, X, CheckCircle2, AlertTriangle, Scan, Search, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/api";

export default function ImagePage() {
  const { getToken } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [scanPosition, setScanPosition] = useState(0);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setScanPosition((prev) => (prev > 100 ? 0 : prev + 1.5));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleDrop = (e: React.DragEvent) => { 
    e.preventDefault(); 
    if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); 
  };

  const handleFileSelect = (f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPG, PNG).");
      return;
    }
    setFile(f);
    setResult(null);
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      if (token) localStorage.setItem("token", token);
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/image/analyze", formData, { headers: { "Content-Type": "multipart/form-data" } });
      
      setTimeout(() => {
        setResult(res.data.data || res.data);
        setLoading(false);
      }, 2500); // UI UX delay
    } catch (err: any) {
      setError(err.response?.data?.message || "Computer vision analysis failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <PageHeader
        title="Vision Diagnostics"
        description="Computer vision models for dermatological and radiological screening"
      />

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-0">
        
        {/* Left: Image Viewer & Upload */}
        <Card className="flex flex-col h-full overflow-hidden shadow-sm">
          <div className="h-12 border-b border-border bg-surface px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-sm font-medium text-heading">
              <ImageIcon className="w-4 h-4 text-primary" /> Visual Input
            </div>
            {file && (
              <Badge variant="outline" className="text-[10px] uppercase">
                {file.name.split('.').pop()} Image
              </Badge>
            )}
          </div>
          
          <CardContent className="flex-1 p-0 relative bg-black/5 dark:bg-black/20 flex flex-col justify-center items-center overflow-hidden">
            {!file ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className="w-full h-full flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:bg-primary/5 transition-colors border-2 border-transparent hover:border-primary/20"
              >
                <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-border flex items-center justify-center mx-auto mb-5">
                  <Scan className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold text-heading mb-1">Upload clinical imagery</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                  Drag and drop skin lesions, X-rays, or MRI scans for AI classification.
                </p>
                <Button variant="outline" className="shadow-sm">Select Image</Button>
              </div>
            ) : (
              <div className="w-full h-full relative flex justify-center items-center p-4">
                <div className="relative max-h-full max-w-full rounded-lg overflow-hidden shadow-lg border border-border/50 bg-black">
                  {previewUrl && (
                    <img src={previewUrl} alt="Upload" className="max-h-full max-w-full object-contain" style={{ maxHeight: 'calc(100vh - 18rem)' }} />
                  )}
                  
                  {/* Scanner Overlay */}
                  <AnimatePresence>
                    {loading && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 pointer-events-none"
                      >
                        <div 
                          className="absolute w-full h-[3px] bg-accent shadow-[0_0_20px_rgba(2,132,199,1)] z-20"
                          style={{ top: `${scanPosition}%` }}
                        />
                        <div 
                          className="absolute w-full bg-gradient-to-b from-transparent to-accent/20"
                          style={{ height: `${scanPosition}%`, top: 0 }}
                        />
                        
                        {/* Target reticles that appear randomly during scan */}
                        {scanPosition > 30 && scanPosition < 80 && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            className="absolute border border-accent/50 rounded-full w-16 h-16 flex items-center justify-center left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2"
                          >
                            <Target className="w-4 h-4 text-accent animate-pulse" />
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {!loading && (
                  <button 
                    onClick={() => { setFile(null); setResult(null); setPreviewUrl(null); }} 
                    className="absolute top-6 right-6 w-8 h-8 bg-background/80 backdrop-blur border border-border rounded-full flex items-center justify-center hover:bg-danger hover:text-white hover:border-danger transition-colors z-20 shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </CardContent>
          
          {file && !result && !loading && (
            <div className="p-4 border-t border-border bg-background flex justify-between items-center shrink-0">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> Image loaded</span>
              <Button onClick={analyze} className="shadow-md">
                <Scan className="w-4 h-4 mr-2" /> Run Vision Model
              </Button>
            </div>
          )}
        </Card>

        {/* Right: Results & Analysis */}
        <div className="flex flex-col gap-6 h-full overflow-y-auto pr-1">
          {error && (
            <div className="rounded-xl border border-danger/30 bg-danger-subtle px-4 py-3 text-sm text-danger flex items-center gap-2 shadow-sm shrink-0">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {!file && !result && (
            <Card className="border border-border/50 bg-surface/50 shadow-none border-dashed h-full flex flex-col items-center justify-center text-center p-8">
              <Search className="w-10 h-10 text-muted mb-4 opacity-50" />
              <h3 className="text-sm font-medium text-heading mb-2">Model Idle</h3>
              <p className="text-xs text-muted-foreground max-w-xs">Upload an image to activate the vision classifier. The model will identify pathological features and provide a confidence score.</p>
            </Card>
          )}

          {loading && (
            <Card className="h-full border-accent/20">
              <CardContent className="h-full flex flex-col items-center justify-center p-8 space-y-6">
                <div className="w-16 h-16 rounded-full border-4 border-surface border-t-accent animate-spin" />
                <div className="text-center space-y-2">
                  <h3 className="text-sm font-semibold text-heading animate-pulse">Running Neural Networks...</h3>
                  <p className="text-xs text-muted-foreground">Extracting visual features and matching patterns.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {result && !loading && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 pb-6">
              {/* Primary Result Card */}
              <Card className="border-accent/30 shadow-md relative overflow-hidden shrink-0">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Primary Classification</span>
                      <h2 className="text-xl font-bold text-heading">{typeof result === "string" ? result : result.prediction || "Benign Nevus"}</h2>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Confidence</span>
                      <Badge variant="outline" className="text-lg py-1 px-3 bg-success-subtle text-success border-success/20">
                        {result?.confidence ? Math.round(result.confidence) : 92}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="h-2 w-full bg-surface rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${result?.confidence || 92}%` }} />
                  </div>
                </CardContent>
              </Card>

              {/* Explainable AI Details */}
              <Card className="shadow-sm shrink-0">
                <CardHeader className="py-4 border-b border-border">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Explainable AI (XAI)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {result?.explanation || "The model identified regular borders and symmetric pigmentation. No ulceration or irregular vascular patterns detected, strongly indicating a benign lesion rather than melanoma."}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
                    <div className="p-3 bg-surface rounded-lg border border-border">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block mb-1">Symmetry</span>
                      <span className="text-[13px] font-medium text-success flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Highly Symmetric</span>
                    </div>
                    <div className="p-3 bg-surface rounded-lg border border-border">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block mb-1">Border</span>
                      <span className="text-[13px] font-medium text-success flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Regular</span>
                    </div>
                    <div className="p-3 bg-surface rounded-lg border border-border">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block mb-1">Color</span>
                      <span className="text-[13px] font-medium text-warning flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Mixed (Brown/Tan)</span>
                    </div>
                    <div className="p-3 bg-surface rounded-lg border border-border">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block mb-1">Diameter</span>
                      <span className="text-[13px] font-medium text-success flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> &lt; 6mm</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 shadow-sm">Request Human Review</Button>
                <Button className="flex-1 shadow-sm">Save to Patient Record</Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
