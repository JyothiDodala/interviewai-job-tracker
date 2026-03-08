import { ReactNode, useState, useEffect } from "react";
import AppSidebar from "./AppSidebar";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      <main className="ml-[68px] md:ml-[240px] transition-all duration-300">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
