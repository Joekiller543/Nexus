import { Link, useLocation } from "wouter";
import { Library, Compass, History, Settings, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Library, label: "Library", href: "/" },
    { icon: Compass, label: "Browse", href: "/browse" },
    { icon: History, label: "History", href: "/history" },
    { icon: MoreHorizontal, label: "More", href: "/more" },
  ];

  // Don't show nav on reader page
  if (location.startsWith("/read/")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-white/5 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-7xl mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200",
                isActive 
                  ? "text-primary scale-105" 
                  : "text-muted-foreground hover:text-foreground active:scale-95"
              )}
            >
              <item.icon className={cn("h-6 w-6", isActive && "fill-current/20")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
