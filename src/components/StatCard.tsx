import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  variant?: "primary" | "success" | "warning" | "destructive" | "info";
}

const variantStyles = {
  primary: "border-primary/20 bg-primary/5",
  success: "border-success/20 bg-success/5",
  warning: "border-warning/20 bg-warning/5",
  destructive: "border-destructive/20 bg-destructive/5",
  info: "border-info/20 bg-info/5",
};

const iconStyles = {
  primary: "text-primary bg-primary/10",
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/10",
  destructive: "text-destructive bg-destructive/10",
  info: "text-info bg-info/10",
};

const StatCard = ({ title, value, icon, variant = "primary" }: StatCardProps) => {
  return (
    <div className={`rounded-xl border p-5 shadow-card transition-all hover:shadow-card-hover ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconStyles[variant]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
