import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// Mock AI question generator (replace with real API later)
const mockQuestions: Record<string, string[]> = {
  "frontend developer": [
    "Explain the difference between CSS Grid and Flexbox.",
    "How does React's reconciliation algorithm work?",
    "What are Web Vitals and why do they matter?",
    "Describe the critical rendering path in a browser.",
    "How would you optimize a React application for performance?",
  ],
  "backend developer": [
    "Explain the differences between SQL and NoSQL databases.",
    "How do you handle authentication in a REST API?",
    "What is the CAP theorem?",
    "Describe microservices architecture and its trade-offs.",
    "How would you design a rate limiter?",
  ],
  "full stack developer": [
    "How do you manage state between frontend and backend?",
    "Explain the concept of server-side rendering.",
    "What strategies do you use for API versioning?",
    "How would you implement real-time features in a web app?",
    "Describe your approach to testing full-stack applications.",
  ],
};

const defaultQuestions = [
  "Tell me about a challenging project you've worked on.",
  "How do you prioritize tasks when working on multiple features?",
  "Describe your experience with version control systems.",
  "How do you approach debugging a complex issue?",
  "What's your experience with agile methodologies?",
];

const AIGenerator = () => {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!role.trim()) return;
    setLoading(true);
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1200));
    const key = role.toLowerCase().trim();
    const matched = Object.keys(mockQuestions).find((k) => key.includes(k));
    setQuestions(matched ? mockQuestions[matched] : defaultQuestions);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">AI Question Generator</h1>
        <p className="text-muted-foreground mt-1">Enter a job role to generate interview questions</p>
      </div>

      <div className="flex gap-3">
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          placeholder="e.g., Frontend Developer"
          className="flex-1 rounded-lg border bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={generate}
          disabled={loading || !role.trim()}
          className="inline-flex items-center gap-2 rounded-lg gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Generate
        </button>
      </div>

      {questions.length > 0 && (
        <div className="space-y-3">
          {questions.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border bg-card p-4 shadow-card"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg gradient-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed pt-0.5">{q}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-dashed bg-muted/50 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          💡 Connect an AI API key to get personalized, real-time interview questions powered by AI.
        </p>
      </div>
    </div>
  );
};

export default AIGenerator;
