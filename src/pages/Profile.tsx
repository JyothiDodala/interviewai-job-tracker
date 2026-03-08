import { useState, useMemo } from "react";
import {
  User, Mail, MapPin, Briefcase, GraduationCap, Pencil, X, Plus, Check,
  Github, Linkedin, Globe, ExternalLink, FileText, MessageSquare,
  Target, Award, TrendingUp, Clock, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useProfile } from "@/context/ProfileContext";
import { useAppData } from "@/context/AppDataContext";
import { useToast } from "@/hooks/use-toast";

const experienceLevels = ["Entry Level", "Junior", "Mid-Level", "Senior", "Lead", "Staff", "Principal"];

const Profile = () => {
  const { profile, updateProfile, addSkill, removeSkill } = useProfile();
  const { jobs, questions } = useAppData();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile);
  const [newSkill, setNewSkill] = useState("");
  const [editingSummary, setEditingSummary] = useState(false);
  const [summaryDraft, setSummaryDraft] = useState(profile.summary);
  const [editingLinks, setEditingLinks] = useState(false);
  const [linksDraft, setLinksDraft] = useState({ github: profile.github, linkedin: profile.linkedin, portfolio: profile.portfolio });

  // Stats
  const stats = useMemo(() => ({
    totalApplied: jobs.length,
    interviews: jobs.filter((j) => j.status === "Interview").length,
    offers: jobs.filter((j) => j.status === "Offer").length,
    questionsCompleted: questions.filter((q) => q.completed).length,
    totalQuestions: questions.length,
  }), [jobs, questions]);

  // Recent activity
  const recentActivity = useMemo(() => {
    const activities: { icon: typeof Briefcase; text: string; time: string; color: string }[] = [];
    jobs.slice(0, 3).forEach((j) => {
      activities.push({ icon: Briefcase, text: `Applied to ${j.company} — ${j.role}`, time: j.dateApplied, color: "text-primary" });
    });
    const completed = questions.filter((q) => q.completed).slice(0, 2);
    completed.forEach((q) => {
      activities.push({ icon: Check, text: `Completed: ${q.question.slice(0, 50)}...`, time: "Recently", color: "text-success" });
    });
    return activities.slice(0, 5);
  }, [jobs, questions]);

  const handleStartEdit = () => { setEditData(profile); setIsEditing(true); };
  const handleCancelEdit = () => setIsEditing(false);
  const handleSaveEdit = () => {
    updateProfile(editData);
    setIsEditing(false);
    toast({ title: "Profile updated", description: "Your profile has been saved." });
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) { addSkill(newSkill); setNewSkill(""); }
  };

  const handleSaveSummary = () => {
    updateProfile({ summary: summaryDraft });
    setEditingSummary(false);
    toast({ title: "Summary updated" });
  };

  const handleSaveLinks = () => {
    updateProfile(linksDraft);
    setEditingLinks(false);
    toast({ title: "Links updated" });
  };

  const displayName = profile.fullName || "Guest User";
  const displayEmail = profile.email || "Email not set";
  const displayLocation = profile.location || "Location not set";
  const displayRole = profile.jobRole || "Job role not set";

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">Your professional dashboard</p>
      </div>

      {/* Top section: Profile card + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 rounded-xl border bg-card p-6 shadow-card"
        >
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold">Edit Profile</h2>
                  <Button variant="ghost" size="icon" onClick={handleCancelEdit}><X className="h-4 w-4" /></Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                    <Input value={editData.fullName} onChange={(e) => setEditData({ ...editData, fullName: e.target.value })} placeholder="John Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Email</label>
                    <Input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} placeholder="john@example.com" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Location</label>
                    <Input value={editData.location} onChange={(e) => setEditData({ ...editData, location: e.target.value })} placeholder="San Francisco, CA" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Job Role</label>
                    <Input value={editData.jobRole} onChange={(e) => setEditData({ ...editData, jobRole: e.target.value })} placeholder="Frontend Developer" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">Experience Level</label>
                    <Select value={editData.experienceLevel} onValueChange={(v) => setEditData({ ...editData, experienceLevel: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSaveEdit} className="gradient-primary text-primary-foreground"><Check className="h-4 w-4 mr-1" />Save Changes</Button>
                  <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-primary text-primary-foreground text-xl font-bold shadow-lg">
                      {profile.avatarInitials}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{displayName}</h2>
                      <p className="text-sm text-muted-foreground">{displayRole}</p>
                      <Badge variant="secondary" className="mt-1.5 text-xs">
                        <GraduationCap className="h-3 w-3 mr-1" />{profile.experienceLevel}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleStartEdit}>
                    <Pencil className="h-3.5 w-3.5 mr-1" />Edit Profile
                  </Button>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3">
                  <div className="flex items-center gap-2 text-sm min-w-0">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className={`truncate ${profile.email ? "text-foreground" : "text-muted-foreground"}`}>{displayEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm min-w-0">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className={`truncate ${profile.location ? "text-foreground" : "text-muted-foreground"}`}>{displayLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm min-w-0">
                    <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className={`truncate ${profile.jobRole ? "text-foreground" : "text-muted-foreground"}`}>{displayRole}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Interview Progress */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-card p-6 shadow-card"
        >
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />Interview Progress
          </h3>
          <div className="space-y-3">
            {[
              { label: "Questions Done", value: stats.questionsCompleted, total: stats.totalQuestions, icon: Check, color: "text-success" },
              { label: "Jobs Applied", value: stats.totalApplied, icon: Briefcase, color: "text-primary" },
              { label: "Interviews", value: stats.interviews, icon: MessageSquare, color: "text-warning" },
              { label: "Offers", value: stats.offers, icon: Award, color: "text-accent" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                  <span className="text-muted-foreground">{stat.label}</span>
                </div>
                <span className="text-sm font-semibold">
                  {stat.value}{stat.total !== undefined && <span className="text-muted-foreground font-normal">/{stat.total}</span>}
                </span>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="mt-4 pt-3 border-t">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Prep completion</span>
              <span className="font-medium">{stats.totalQuestions > 0 ? Math.round((stats.questionsCompleted / stats.totalQuestions) * 100) : 0}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full gradient-primary"
                initial={{ width: 0 }}
                animate={{ width: `${stats.totalQuestions > 0 ? (stats.questionsCompleted / stats.totalQuestions) * 100 : 0}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Middle row: Summary + Social Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Professional Summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border bg-card p-6 shadow-card"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />Professional Summary
            </h3>
            {!editingSummary && (
              <Button variant="ghost" size="sm" onClick={() => { setSummaryDraft(profile.summary); setEditingSummary(true); }}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          {editingSummary ? (
            <div className="space-y-3">
              <Textarea
                value={summaryDraft}
                onChange={(e) => setSummaryDraft(e.target.value)}
                placeholder="Aspiring Full Stack Developer with experience in MERN stack and AI-based projects..."
                className="min-h-[100px] bg-background/50 text-sm"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{summaryDraft.length}/500</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditingSummary(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleSaveSummary} className="gradient-primary text-primary-foreground">Save</Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {profile.summary || "No summary yet. Click the edit button to add a professional summary about yourself."}
            </p>
          )}
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border bg-card p-6 shadow-card"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />Social Links
            </h3>
            {!editingLinks && (
              <Button variant="ghost" size="sm" onClick={() => { setLinksDraft({ github: profile.github, linkedin: profile.linkedin, portfolio: profile.portfolio }); setEditingLinks(true); }}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          {editingLinks ? (
            <div className="space-y-3">
              {[
                { key: "github" as const, icon: Github, placeholder: "https://github.com/username" },
                { key: "linkedin" as const, icon: Linkedin, placeholder: "https://linkedin.com/in/username" },
                { key: "portfolio" as const, icon: Globe, placeholder: "https://yourportfolio.com" },
              ].map(({ key, icon: Icon, placeholder }) => (
                <div key={key} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    value={linksDraft[key]}
                    onChange={(e) => setLinksDraft({ ...linksDraft, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="text-sm"
                  />
                </div>
              ))}
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditingLinks(false)}>Cancel</Button>
                <Button size="sm" onClick={handleSaveLinks} className="gradient-primary text-primary-foreground">Save</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { key: "github", icon: Github, label: "GitHub", url: profile.github },
                { key: "linkedin", icon: Linkedin, label: "LinkedIn", url: profile.linkedin },
                { key: "portfolio", icon: Globe, label: "Portfolio", url: profile.portfolio },
              ].map(({ icon: Icon, label, url }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className={url ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                  </div>
                  {url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1">
                      Visit <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not set</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom row: Skills + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border bg-card p-6 shadow-card"
        >
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />Skills
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.skills.length === 0 && (
              <p className="text-sm text-muted-foreground">No skills added yet.</p>
            )}
            <AnimatePresence>
              {profile.skills.map((skill) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Badge variant="secondary" className="gap-1 pr-1.5 text-xs">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 transition-colors">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              className="text-sm"
              maxLength={30}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddSkill(); }}
            />
            <Button size="sm" variant="outline" onClick={handleAddSkill} disabled={!newSkill.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border bg-card p-6 shadow-card"
        >
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />Recent Activity
          </h3>
          {recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Clock className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">No recent activity yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Start applying to jobs or completing interview questions!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-start gap-3 text-sm"
                >
                  <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted`}>
                    <activity.icon className={`h-3 w-3 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground truncate">{activity.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
