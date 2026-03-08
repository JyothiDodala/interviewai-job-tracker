import { useState } from "react";
import { useAppData } from "@/context/AppDataContext";
import { Check, ChevronDown, ChevronUp, StickyNote } from "lucide-react";
import { motion } from "framer-motion";

const categories = ["All", "DSA", "JavaScript", "React", "General"] as const;

const InterviewPrep = () => {
  const { questions, toggleQuestion, updateQuestionNotes } = useAppData();
  const [filter, setFilter] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === "All" ? questions : questions.filter((q) => q.category === filter);
  const completedCount = filtered.filter((q) => q.completed).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Interview Prep</h1>
        <p className="text-muted-foreground mt-1">
          {completedCount} of {filtered.length} questions completed
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors border ${
              filter === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full gradient-primary transition-all duration-500"
          style={{ width: `${filtered.length ? (completedCount / filtered.length) * 100 : 0}%` }}
        />
      </div>

      {/* Questions */}
      <div className="space-y-2">
        {filtered.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="rounded-xl border bg-card shadow-card overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4">
              <button
                onClick={() => toggleQuestion(q.id)}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
                  q.completed
                    ? "bg-success border-success text-success-foreground"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {q.completed && <Check className="h-3.5 w-3.5" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${q.completed ? "line-through text-muted-foreground" : ""}`}>
                  {q.question}
                </p>
                <span className="text-xs text-muted-foreground">{q.category}</span>
              </div>
              <button
                onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors"
              >
                {expandedId === q.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
            {expandedId === q.id && (
              <div className="border-t px-4 py-3">
                <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                  <StickyNote className="h-3.5 w-3.5" /> Personal Notes
                </div>
                <textarea
                  value={q.notes}
                  onChange={(e) => updateQuestionNotes(q.id, e.target.value)}
                  placeholder="Write your notes here..."
                  rows={3}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InterviewPrep;
