import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { JobApplication, InterviewQuestion } from "@/types";

// Sample interview questions
const defaultQuestions: InterviewQuestion[] = [
  { id: "1", category: "DSA", question: "Explain time complexity of common sorting algorithms", completed: false, notes: "" },
  { id: "2", category: "DSA", question: "Implement a binary search algorithm", completed: false, notes: "" },
  { id: "3", category: "DSA", question: "What is a hash table and how does it work?", completed: false, notes: "" },
  { id: "4", category: "DSA", question: "Explain the difference between BFS and DFS", completed: false, notes: "" },
  { id: "5", category: "JavaScript", question: "What is the event loop in JavaScript?", completed: false, notes: "" },
  { id: "6", category: "JavaScript", question: "Explain closures with an example", completed: false, notes: "" },
  { id: "7", category: "JavaScript", question: "What are Promises and async/await?", completed: false, notes: "" },
  { id: "8", category: "JavaScript", question: "Explain prototypal inheritance", completed: false, notes: "" },
  { id: "9", category: "React", question: "What is the Virtual DOM and how does it work?", completed: false, notes: "" },
  { id: "10", category: "React", question: "Explain React hooks and their rules", completed: false, notes: "" },
  { id: "11", category: "React", question: "What is the difference between useEffect and useLayoutEffect?", completed: false, notes: "" },
  { id: "12", category: "React", question: "How does React reconciliation work?", completed: false, notes: "" },
  { id: "13", category: "General", question: "Tell me about yourself and your experience", completed: false, notes: "" },
  { id: "14", category: "General", question: "Why do you want to work at this company?", completed: false, notes: "" },
  { id: "15", category: "General", question: "Describe a challenging project you worked on", completed: false, notes: "" },
];

interface AppDataContextType {
  jobs: JobApplication[];
  addJob: (job: Omit<JobApplication, "id">) => void;
  updateJob: (job: JobApplication) => void;
  deleteJob: (id: string) => void;
  questions: InterviewQuestion[];
  toggleQuestion: (id: string) => void;
  updateQuestionNotes: (id: string, notes: string) => void;
}

const AppDataContext = createContext<AppDataContextType | null>(null);

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
};

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem("jobs");
    return saved ? JSON.parse(saved) : [];
  });

  const [questions, setQuestions] = useState<InterviewQuestion[]>(() => {
    const saved = localStorage.getItem("questions");
    return saved ? JSON.parse(saved) : defaultQuestions;
  });

  useEffect(() => { localStorage.setItem("jobs", JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem("questions", JSON.stringify(questions)); }, [questions]);

  const addJob = (job: Omit<JobApplication, "id">) => {
    setJobs((prev) => [{ ...job, id: crypto.randomUUID() }, ...prev]);
  };

  const updateJob = (job: JobApplication) => {
    setJobs((prev) => prev.map((j) => (j.id === job.id ? job : j)));
  };

  const deleteJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const toggleQuestion = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, completed: !q.completed } : q))
    );
  };

  const updateQuestionNotes = (id: string, notes: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, notes } : q))
    );
  };

  return (
    <AppDataContext.Provider value={{ jobs, addJob, updateJob, deleteJob, questions, toggleQuestion, updateQuestionNotes }}>
      {children}
    </AppDataContext.Provider>
  );
};
