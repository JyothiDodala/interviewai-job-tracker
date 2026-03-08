import { FileText, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

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
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Resume Tips</h1>
        <p className="text-muted-foreground mt-1">Best practices for a standout resume</p>
      </div>

      {/* Upload placeholder */}
      <div className="rounded-xl border-2 border-dashed bg-card p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
          <FileText className="h-7 w-7 text-primary" />
        </div>
        <h3 className="font-semibold mb-1">Upload Your Resume</h3>
        <p className="text-sm text-muted-foreground mb-4">PDF or DOCX format, max 5MB</p>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
          Choose File
          <input type="file" accept=".pdf,.docx" className="hidden" />
        </label>
        <p className="text-xs text-muted-foreground mt-3">
          🔒 Enable Lovable Cloud for persistent file storage
        </p>
      </div>

      {/* Tips Grid */}
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
  );
};

export default ResumeTips;
