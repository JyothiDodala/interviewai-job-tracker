import { User, Mail, MapPin, Briefcase } from "lucide-react";

const Profile = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings</p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-card max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-primary">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Guest User</h2>
            <p className="text-sm text-muted-foreground">Sign up to save your data</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Email not set</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Location not set</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Job title not set</span>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-dashed bg-muted/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            🔒 Enable Lovable Cloud for authentication, persistent storage, and AI features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
