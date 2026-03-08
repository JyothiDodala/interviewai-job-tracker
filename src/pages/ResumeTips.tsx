import { useState, useRef } from "react";
import { FileText, CheckCircle, AlertCircle, Lightbulb, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const tips = [
  { icon: CheckCircle, title: "Use Action Verbs", description: "Start bullet points with strong action verbs like 'Developed', 'Led', 'Optimized', 'Implemented'." },
  { icon: CheckCircle, title: "Quantify Achievements", description: "Include numbers: 'Reduced load time by 40%' or 'Managed a team of 5 engineers'." },
  { icon: CheckCircle, title: "Tailor to Job Description", description: "Customize your resume keywords to match each job posting's requirements." },
  { icon: CheckCircle, title: "Keep it Concise", description: "Aim for 1-2 pages max. Recruiters spend ~6 seconds on initial scan." },
  { icon: AlertCircle, title: "Avoid Common Mistakes", description: "No typos, no generic objectives, no irrelevant experience. Proofread carefully." },
  { icon: Lightbulb, title: "Add a Skills Section", description: "List relevant technical skills, tools, and frameworks prominently." },
  { icon: Lightbulb, title: "Include Projects", description: "Showcase personal projects with links to live demos or GitHub repos." },
  { icon: Lightbulb, title: "Use ATS-Friendly Format", description: "Avoid complex layouts, images, or headers that ATS systems can't parse." },
];

const ResumeTips = () => {
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const analysisRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (resumeText.trim().length < 20) {
      toast({ title: "Too short", description: "Please paste at least 20 characters of resume content.", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis("");

    try {
      const response = await supabase.functions.invoke("analyze-resume", {
        body: { resumeText: resumeText.trim() },
      });

      if (response.error) {
        throw new Error(response.error.message || "Analysis failed");
      }

      // Handle streaming response
      const reader = response.data as ReadableStream;
      if (reader && typeof reader.getReader === "function") {
        const streamReader = reader.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let fullText = "";

        while (true) {
          const { done, value } = await streamReader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullText += content;
                setAnalysis(fullText);
              }
            } catch {
              buffer = line + "\n" + buffer;
              break;
            }
          }
        }
        // Final flush
        if (buffer.trim()) {
          for (let raw of buffer.split("\n")) {
            if (!raw || raw.startsWith(":") || raw.trim() === "") continue;
            if (!raw.startsWith("data: ")) continue;
            const jsonStr = raw.slice(6).trim();
            if (jsonStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullText += content;
                setAnalysis(fullText);
              }
            } catch { /* ignore */ }
          }
        }

        if (!fullText) {
          throw new Error("No analysis received");
        }
      } else if (typeof response.data === "string") {
        setAnalysis(response.data);
      } else if (response.data?.error) {
        throw new Error(response.data.error);
      }

      analysisRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error: any) {
      console.error("Resume analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Resume Analyzer</h1>
        <p className="text-muted-foreground mt-1">Paste your resume to get AI-powered improvement suggestions</p>
      </div>

      {/* Resume Input */}
      <div className="rounded-xl border bg-card p-6 shadow-card space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Paste Your Resume</h3>
            <p className="text-xs text-muted-foreground">Copy and paste your resume text below for analysis</p>
          </div>
        </div>
        <Textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder={"Paste your resume content here...\n\nExample:\nJohn Doe\nSoftware Engineer\n\nExperience:\n- Built scalable web apps at Acme Corp..."}
          className="min-h-[200px] bg-background/50 text-sm"
          maxLength={5000}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{resumeText.length}/5000 characters</span>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || resumeText.trim().length < 20}
            className="gradient-primary text-primary-foreground"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze Resume
              </>
            )}
          </Button>
        </div>
      </div>

      {/* AI Analysis Results */}
      {analysis && (
        <motion.div
          ref={analysisRef}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border bg-card p-6 shadow-card"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">AI Analysis</h3>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {analysis}
          </div>
        </motion.div>
      )}

      {/* Tips Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-3">General Resume Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border bg-card p-4 shadow-card hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <tip.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{tip.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{tip.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeTips;
