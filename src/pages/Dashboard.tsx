import { Briefcase, Calendar, Trophy, XCircle } from "lucide-react";
import StatCard from "@/components/StatCard";
import { useAppData } from "@/context/AppDataContext";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { jobs, questions } = useAppData();

  const stats = {
    total: jobs.length,
    interviews: jobs.filter((j) => j.status === "Interview").length,
    offers: jobs.filter((j) => j.status === "Offer").length,
    rejected: jobs.filter((j) => j.status === "Rejected").length,
  };

  const completedQuestions = questions.filter((q) => q.completed).length;
  const recentJobs = jobs.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your job search progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <StatCard title="Total Applied" value={stats.total} icon={<Briefcase className="h-5 w-5" />} variant="primary" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard title="Interviews" value={stats.interviews} icon={<Calendar className="h-5 w-5" />} variant="info" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard title="Offers" value={stats.offers} icon={<Trophy className="h-5 w-5" />} variant="success" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatCard title="Rejected" value={stats.rejected} icon={<XCircle className="h-5 w-5" />} variant="destructive" />
        </motion.div>
      </div>

      {/* Progress & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interview Prep Progress */}
        <div className="rounded-xl border bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold mb-4">Interview Prep Progress</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Questions completed</span>
              <span className="font-medium">{completedQuestions} / {questions.length}</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full gradient-primary transition-all duration-500"
                style={{ width: `${questions.length ? (completedQuestions / questions.length) * 100 : 0}%` }}
              />
            </div>
            {["DSA", "JavaScript", "React", "General"].map((cat) => {
              const catQ = questions.filter((q) => q.category === cat);
              const catDone = catQ.filter((q) => q.completed).length;
              return (
                <div key={cat} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{cat}</span>
                  <span className="text-foreground font-medium">{catDone}/{catQ.length}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="rounded-xl border bg-card p-6 shadow-card">
          <h2 className="text-lg font-semibold mb-4">Recent Applications</h2>
          {recentJobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No applications yet. Start tracking your job search!</p>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{job.company}</p>
                    <p className="text-xs text-muted-foreground">{job.role}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const statusColors = {
  Applied: "bg-info/10 text-info border-info/20",
  Interview: "bg-warning/10 text-warning border-warning/20",
  Offer: "bg-success/10 text-success border-success/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
    {status}
  </span>
);

export { StatusBadge };
export default Dashboard;
