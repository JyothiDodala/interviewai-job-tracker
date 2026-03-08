import { useState, useEffect, createContext, useContext, ReactNode } from "react";

export interface UserProfile {
  fullName: string;
  email: string;
  location: string;
  jobRole: string;
  experienceLevel: string;
  summary: string;
  skills: string[];
  github: string;
  linkedin: string;
  portfolio: string;
  avatarInitials: string;
}

const defaultProfile: UserProfile = {
  fullName: "",
  email: "",
  location: "",
  jobRole: "",
  experienceLevel: "Entry Level",
  summary: "",
  skills: [],
  github: "",
  linkedin: "",
  portfolio: "",
  avatarInitials: "GU",
};

interface ProfileContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
};

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("userProfile");
    return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      // Auto-generate initials from name
      if (updates.fullName !== undefined) {
        const parts = updates.fullName.trim().split(/\s+/);
        updated.avatarInitials = parts.length >= 2
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : updates.fullName.slice(0, 2).toUpperCase() || "GU";
      }
      return updated;
    });
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    setProfile((prev) =>
      prev.skills.includes(trimmed) ? prev : { ...prev, skills: [...prev.skills, trimmed] }
    );
  };

  const removeSkill = (skill: string) => {
    setProfile((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, addSkill, removeSkill }}>
      {children}
    </ProfileContext.Provider>
  );
};
