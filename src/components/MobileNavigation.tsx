import { Home, TrendingUp, BarChart3, BookOpen, Briefcase } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: TrendingUp, label: "Recommend", path: "/recommend" },
  { icon: Briefcase, label: "Portfolio", path: "/portfolio" },
  { icon: BarChart3, label: "Live Stocks", path: "/stocks" },
  { icon: BookOpen, label: "Explore", path: "/explore" },
];

export const MobileNavigation = () => {
  const location = useLocation();
  const emitNavigating = (path: string) => {
    try {
      const ev = new CustomEvent('routeNavigating', { detail: { path } });
      window.dispatchEvent(ev);
    } catch {}
  };
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => emitNavigating(item.path)}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200",
                "hover:bg-accent min-w-[60px]",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};