import { useState } from "react";
import { useAppData } from "@/context/AppDataContext";
import { JobApplication, JobStatus } from "@/types";
import { StatusBadge } from "./Dashboard";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const statuses: JobStatus[] = ["Applied", "Interview", "Rejected", "Offer"];

const JobTracker = () => {
  const { jobs, addJob, updateJob, deleteJob } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filtered = filterStatus === "All" ? jobs : jobs.filter((j) => j.status === filterStatus);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const job = {
      company: data.get("company") as string,
      role: data.get("role") as string,
      status: data.get("status") as JobStatus,
      dateApplied: data.get("dateApplied") as string,
      notes: data.get("notes") as string,
    };

    if (editingJob) {
      updateJob({ ...job, id: editingJob.id });
      setEditingJob(null);
    } else {
      addJob(job);
    }
    setShowForm(false);
    form.reset();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Tracker</h1>
          <p className="text-muted-foreground mt-1">Manage your job applications</p>
        </div>
        <button
          onClick={() => { setEditingJob(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-lg gradient-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Add Job
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["All", ...statuses].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors border ${
              filterStatus === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Job Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 glass p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-xl border bg-card p-6 shadow-card-hover"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold">{editingJob ? "Edit" : "Add"} Application</h2>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="company" defaultValue={editingJob?.company} placeholder="Company name" required className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                <input name="role" defaultValue={editingJob?.role} placeholder="Job role" required className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                <select name="status" defaultValue={editingJob?.status || "Applied"} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input name="dateApplied" type="date" defaultValue={editingJob?.dateApplied || new Date().toISOString().split("T")[0]} required className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                <textarea name="notes" defaultValue={editingJob?.notes} placeholder="Notes (optional)" rows={3} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring resize-none" />
                <button type="submit" className="w-full rounded-lg gradient-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
                  {editingJob ? "Update" : "Add"} Application
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Job List */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center shadow-card">
          <p className="text-muted-foreground">No applications found. Start tracking your job search!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border bg-card p-4 shadow-card hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-sm truncate">{job.company}</h3>
                    <StatusBadge status={job.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">{job.role} • {job.dateApplied}</p>
                  {job.notes && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{job.notes}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => { setEditingJob(job); setShowForm(true); }}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteJob(job.id)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobTracker;
