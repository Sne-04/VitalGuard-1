"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Activity, X, Loader2, Sparkles, Send, Brain, AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

const SUGGESTIONS = [
  "I have a fever and dry cough",
  "Severe headache for 2 days",
  "Chest pain when I breathe deeply",
  "Feeling tired and dizzy",
  "Stomach ache after eating"
];

const COMMON_SYMPTOMS = [
  "Fever", "Cough", "Fatigue", "Headache", "Sore Throat", "Shortness of Breath",
  "Chest Pain", "Nausea", "Muscle Pain", "Joint Pain", "Chills", "Dizziness"
];

type Message = {
  id: string;
  role: "ai" | "user";
  content: string | React.ReactNode;
};

export default function SymptomsPage() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "ai",
      content: "Hello! I'm your VitalGuard AI diagnostic assistant. How are you feeling today? Please describe your symptoms or select from the common ones below."
    }
  ]);
  const [input, setInput] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState("");
  const [phase, setPhase] = useState<"symptoms" | "duration" | "confirm" | "analyzing">("symptoms");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (role: "ai" | "user", content: string | React.ReactNode) => {
    setMessages(prev => [...prev, { id: Math.random().toString(), role, content }]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    addMessage("user", input);
    const userInput = input;
    setInput("");

    if (phase === "symptoms") {
      setTimeout(() => {
        const extracted = [userInput.toLowerCase().replace(/i have a |i have |severe |mild |my |is hurting/gi, "").trim()];
        setSymptoms(prev => [...prev, ...extracted.filter(s => !prev.includes(s))]);
        addMessage("ai", `I've noted: ${extracted.join(", ")}. Any other symptoms? If not, how many days have you been experiencing this?`);
        setPhase("duration");
      }, 600);
    } else if (phase === "duration") {
      const match = userInput.match(/\d+/);
      const days = match ? match[0] : userInput;
      setDuration(days);
      addMessage("ai", `Noted, for ${days} days. I am ready to run the full diagnostic analysis on these symptoms. Shall we proceed?`);
      setPhase("confirm");
    } else if (phase === "confirm") {
      if (userInput.toLowerCase().includes("yes") || userInput.toLowerCase().includes("proceed")) {
        runAnalysis();
      } else {
        addMessage("ai", "Okay, we can wait. Let me know when you are ready to proceed, or if you want to add more symptoms.");
      }
    }
  };

  const addSymptom = (s: string) => {
    if (!symptoms.includes(s)) {
      setSymptoms([...symptoms, s]);
      addMessage("user", `Added: ${s}`);
      setTimeout(() => {
        addMessage("ai", `I've added ${s}. How many days have you been experiencing this?`);
        setPhase("duration");
      }, 500);
    }
  };

  const removeSymptom = (s: string) => {
    setSymptoms(symptoms.filter((x) => x !== s));
  };

  const runAnalysis = async () => {
    setPhase("analyzing");
    addMessage("ai", <div className="flex items-center gap-2 text-primary"><Loader2 className="w-4 h-4 animate-spin" /> Running deep diagnostic analysis...</div>);
    
    try {
      const token = await getToken();
      if (token) localStorage.setItem("token", token);
      const response = await api.post("/predict", {
        symptoms, duration: parseInt(duration) || 3, age: 30, gender: "Not specified", comorbidities: ["none"],
      });
      const id = response.data.data._id || response.data.data.id;
      
      setTimeout(() => {
        addMessage("ai", "Analysis complete. Redirecting you to the results report.");
        setTimeout(() => {
          router.push(`/dashboard/results/${id}`);
        }, 1000);
      }, 1500);
    } catch (err: any) {
      addMessage("ai", <span className="text-danger">Failed to process. Please check your connection and try again.</span>);
      setPhase("confirm");
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <PageHeader
        title="AI Symptom Checker"
        description="Conversational diagnostic assistant powered by machine learning"
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-5 min-h-0">
        
        {/* Chat Interface */}
        <Card className="lg:col-span-2 flex flex-col h-full overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />
          
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-5 flex flex-col scroll-smooth">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[12px] font-semibold ${
                    msg.role === "ai" 
                      ? "bg-primary text-white" 
                      : "bg-surface border border-border text-foreground"
                  }`}>
                    {msg.role === "ai" ? <Sparkles className="w-4 h-4" /> : user?.firstName?.charAt(0) || "U"}
                  </div>
                  <div className={`rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === "ai" 
                      ? "bg-surface border border-border text-foreground rounded-tl-none" 
                      : "bg-primary text-white rounded-tr-none"
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
            {phase === "symptoms" && messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => { setInput(s); }} className="text-[11px] px-3 py-1.5 rounded-full border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-card-hover transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="relative flex items-center">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                placeholder={
                  phase === "symptoms" ? "Describe your symptoms..." :
                  phase === "duration" ? "How many days? (e.g. 3)" :
                  "Type your response..."
                }
                disabled={phase === "analyzing"}
                className="pr-12 h-11 rounded-xl text-[13px]"
              />
              <Button 
                size="icon" 
                onClick={handleSend}
                disabled={!input.trim() || phase === "analyzing"}
                className="absolute right-1.5 h-8 w-8 rounded-lg"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Right Sidebar - Context Panel */}
        <div className="flex flex-col gap-4 h-full">
          <Card className="flex-none">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4 text-primary" />
                <h3 className="text-[13px] font-semibold text-heading">Diagnostic Context</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">Identified Symptoms</span>
                  {symptoms.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground italic">No symptoms recorded yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      <AnimatePresence>
                        {symptoms.map(s => (
                          <motion.div key={s} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                            <Badge className="pl-2 pr-1 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 transition-colors text-[11px]">
                              {s}
                              <button onClick={() => removeSymptom(s)} className="ml-1 hover:bg-primary/20 rounded p-0.5">
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Duration</span>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-muted" />
                    <span className="text-[13px] font-medium">{duration ? `${duration} days` : "—"}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Confidence</span>
                  <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 ease-out rounded-full" 
                      style={{ width: `${symptoms.length > 0 ? Math.min(symptoms.length * 20 + (duration ? 10 : 0), 95) : 0}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 text-right">
                    {symptoms.length > 0 ? "Ready for analysis" : "Needs more context"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 overflow-hidden flex flex-col min-h-0">
            <CardContent className="p-5 flex-1 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-muted" />
                <h3 className="text-[13px] font-semibold text-heading">Quick Add</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_SYMPTOMS.map((s) => (
                  <button
                    key={s}
                    onClick={() => addSymptom(s)}
                    disabled={symptoms.includes(s.toLowerCase()) || symptoms.includes(s)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      symptoms.includes(s.toLowerCase()) || symptoms.includes(s)
                        ? "bg-surface text-muted cursor-default"
                        : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 cursor-pointer"
                    }`}
                  >
                    {symptoms.includes(s.toLowerCase()) || symptoms.includes(s) 
                      ? <CheckCircle2 className="w-3 h-3 inline mr-1 opacity-50" /> 
                      : <Plus className="w-3 h-3 inline mr-1 opacity-50" />}
                    {s}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {phase === "confirm" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Button onClick={runAnalysis} className="w-full h-11 text-[13px] font-semibold group rounded-xl">
                <Sparkles className="w-4 h-4 mr-2 group-hover:animate-pulse" /> Run Deep Analysis
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
