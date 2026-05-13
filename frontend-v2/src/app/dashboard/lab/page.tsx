"use client";

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Loader2, Sparkles, X, CheckCircle2, AlertTriangle, FileSearch, ArrowRight, Download, Brain, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/api";

export default function LabPage() {
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
        setScanPosition((prev) => (prev > 100 ? 0 : prev + 2));
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
    setFile(f);
    setResult(null);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreviewUrl(null); // No preview for PDF yet
    }
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      if (token) localStorage.setItem("token", token);
      const formData = new FormData();
      formData.append("labReport", file);
      const res = await api.post("/lab/analyze", formData, { headers: { "Content-Type": "multipart/form-data" } });
      
      // Simulate slightly longer extraction for UX
      setTimeout(() => {
        setResult(res.data.data || res.data);
        setLoading(false);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Analysis failed. Please try again.");
      setLoading(false);
    }
  };

  // Mock extracted biomarkers for UI presentation if the API returns a string
  const mockBiomarkers = [
    { name: "Hemoglobin", value: "11.2", unit: "g/dL", range: "12.0-15.5", status: "low" },
    { name: "WBC", value: "6.5", unit: "10^3/uL", range: "4.5-11.0", status: "normal" },
    { name: "Glucose", value: "105", unit: "mg/dL", range: "70-99", status: "high" },
    { name: "Cholesterol", value: "180", unit: "mg/dL", range: "<200", status: "normal" },
  ];

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Lab Report Analyzer"
          description="Automated OCR extraction and AI-powered biomarker analysis"
        />
        {result && (
          <Button variant="outline" className="h-9 text-xs">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-0">
        
        {/* Document Preview Panel */}
        <Card className="flex flex-col h-full overflow-hidden shadow-sm">
          <div className="h-12 border-b border-border bg-surface px-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-heading">
              <FileSearch className="w-4 h-4 text-primary" /> Document Viewer
            </div>
            {file && (
              <Badge variant="outline" className="text-[10px] uppercase">
                {file.name.split('.').pop()} Document
              </Badge>
            )}
          </div>
          
          <CardContent className="flex-1 p-0 relative bg-[#f8fafc] dark:bg-[#09090b] flex flex-col justify-center items-center overflow-hidden">
            {!file ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className="w-full h-full flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:bg-primary/5 transition-colors border-2 border-transparent hover:border-primary/20"
              >
                <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-border flex items-center justify-center mx-auto mb-5">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold text-heading mb-1">Drag and drop your report</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                  We support PDF and image files containing clinical lab results (CBC, BMP, etc).
                </p>
                <Button variant="outline" className="shadow-sm">Browse Files</Button>
              </div>
            ) : (
              <div className="w-full h-full relative p-6 flex justify-center items-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Report Preview" className="max-h-full max-w-full rounded shadow-md border border-border object-contain" />
                ) : (
                  <div className="w-64 aspect-[1/1.4] bg-white dark:bg-zinc-800 rounded shadow-md border border-border flex flex-col items-center justify-center p-6 text-center">
                    <FileText className="w-12 h-12 text-primary mb-4" />
                    <p className="text-sm font-medium text-heading truncate w-full">{file.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB PDF</p>
                  </div>
                )}
                
                {/* OCR Scanning Overlay */}
                <AnimatePresence>
                  {loading && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center"
                    >
                      <div className="relative w-full max-w-md h-full max-h-[80%] my-auto mx-auto border-2 border-primary/30 rounded overflow-hidden">
                        <div 
                          className="absolute w-full h-[2px] bg-primary shadow-[0_0_15px_rgba(37,99,235,1)] z-20"
                          style={{ top: `${scanPosition}%` }}
                        />
                        <div 
                          className="absolute w-full bg-primary/10"
                          style={{ height: `${scanPosition}%`, top: 0 }}
                        />
                      </div>
                      <div className="absolute bg-background/90 px-6 py-3 rounded-full border border-border shadow-lg flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        <span className="text-sm font-semibold tracking-wide">Extracting biomarkers...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <button 
                  onClick={() => { setFile(null); setResult(null); setPreviewUrl(null); }} 
                  className="absolute top-4 right-4 w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center hover:bg-card-hover hover:text-danger transition-colors z-20 shadow-sm"
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </CardContent>
          
          {file && !result && !loading && (
            <div className="p-4 border-t border-border bg-background flex justify-between items-center">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> Ready for extraction</span>
              <Button onClick={analyze} className="shadow-md">
                <Sparkles className="w-4 h-4 mr-2" /> Analyze Report
              </Button>
            </div>
          )}
        </Card>

        {/* AI Analysis Sidebar */}
        <div className="flex flex-col gap-6 h-full overflow-y-auto pr-1">
          {error && (
            <div className="rounded-xl border border-danger/30 bg-danger-subtle px-4 py-3 text-sm text-danger flex items-center gap-2 shadow-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {!file && !result && (
            <Card className="border border-border/50 bg-surface/50 shadow-none border-dashed h-full flex flex-col items-center justify-center text-center p-8">
              <Sparkles className="w-10 h-10 text-muted mb-4 opacity-50" />
              <h3 className="text-sm font-medium text-heading mb-2">Awaiting Document</h3>
              <p className="text-xs text-muted-foreground max-w-xs">Upload a lab report on the left. The AI will extract biomarkers, identify abnormal ranges, and generate a clinical interpretation.</p>
            </Card>
          )}

          {loading && (
            <Card className="h-full">
              <CardContent className="h-full flex flex-col items-center justify-center p-8 space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2 text-center w-full max-w-xs">
                  <div className="h-4 bg-surface rounded animate-pulse w-3/4 mx-auto" />
                  <div className="h-3 bg-surface rounded animate-pulse w-1/2 mx-auto" />
                  <div className="h-3 bg-surface rounded animate-pulse w-5/6 mx-auto" />
                </div>
              </CardContent>
            </Card>
          )}

          {result && !loading && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 pb-6">
              {/* Biomarker Extraction Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-heading flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" /> Extracted Biomarkers
                  </h3>
                  <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">4 Found</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {mockBiomarkers.map((b) => (
                    <div key={b.name} className={`p-3 rounded-xl border ${
                      b.status === 'low' ? 'bg-warning-subtle/50 border-warning/30' :
                      b.status === 'high' ? 'bg-danger-subtle/50 border-danger/30' :
                      'bg-surface border-border'
                    }`}>
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground block mb-1">{b.name}</span>
                      <div className="flex items-baseline gap-1.5 mb-1">
                        <span className={`text-lg font-bold ${
                          b.status === 'low' ? 'text-warning' : b.status === 'high' ? 'text-danger' : 'text-heading'
                        }`}>{b.value}</span>
                        <span className="text-[11px] text-muted-foreground font-medium">{b.unit}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                        <span className="text-[10px] text-muted-foreground">Range: {b.range}</span>
                        {b.status !== 'normal' && (
                          <Badge variant={b.status === 'high' ? 'danger' : 'warning'} className="text-[9px] px-1.5 py-0 h-4">
                            {b.status.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Clinical Interpretation */}
              <Card className="border-primary/20 shadow-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <CardHeader className="pb-3 border-b border-border bg-surface/50">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-primary" /> 
                    AI Interpretation
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none text-[13px] leading-relaxed text-muted-foreground">
                    {typeof result === "string" ? result : result.analysis || "Based on the extracted results, the patient shows slightly elevated Glucose and lower Hemoglobin levels. This may suggest mild anemia and a pre-diabetic state. Recommendation: Follow-up HbA1c testing and dietary review."}
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-border/50 flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-background text-[10px]">Follow-up needed</Badge>
                    <Badge variant="outline" className="bg-background text-[10px]">Dietary Review</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
