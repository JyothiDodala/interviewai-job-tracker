// Types for the AI Interview Prep & Job Tracker application

export type JobStatus = "Applied" | "Interview" | "Rejected" | "Offer";

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  dateApplied: string;
  notes: string;
}

export interface InterviewQuestion {
  id: string;
  category: "DSA" | "JavaScript" | "React" | "General";
  question: string;
  completed: boolean;
  notes: string;
}

export interface DashboardStats {
  totalApplied: number;
  interviews: number;
  offers: number;
  rejected: number;
}
