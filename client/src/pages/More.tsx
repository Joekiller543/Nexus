import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Settings, LogOut, User, Moon, Shield, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function More() {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-6">
      <header className="py-2">
        <h1 className="text-2xl font-bold tracking-tight">More</h1>
      </header>

      {/* User Profile Card */}
      <div className="bg-card rounded-2xl p-4 border border-border flex items-center gap-4 shadow-sm">
        {isAuthenticated && user ? (
          <>
            <Avatar className="h-14 w-14 border-2 border-primary/20">
              <AvatarImage src={user.profileImageUrl || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                {(user.username?.[0] || "U").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <h3 className="font-bold text-lg truncate">{user.username || "User"}</h3>
              <p className="text-sm text-muted-foreground truncate">{user.email || "No email"}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-destructive" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col w-full gap-3">
            <div className="flex items-center gap-4">
               <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
                 <User className="h-6 w-6 text-muted-foreground" />
               </div>
               <div className="flex-1">
                 <h3 className="font-bold text-lg">Guest</h3>
                 <p className="text-sm text-muted-foreground">Log in to sync library</p>
               </div>
            </div>
            <Link href="/api/login" className="w-full">
              <Button className="w-full rounded-xl bg-primary text-primary-foreground">
                Log In / Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Settings Menu */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground px-1 uppercase tracking-wider">App Settings</h2>
        
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <MenuItem icon={Settings} label="General" />
          <div className="h-px bg-border/50 mx-4" />
          <MenuItem icon={Moon} label="Appearance" />
          <div className="h-px bg-border/50 mx-4" />
          <MenuItem icon={Shield} label="Security" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground px-1 uppercase tracking-wider">About</h2>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <MenuItem icon={Info} label="About MangaReader" />
        </div>
      </div>
      
      <div className="text-center text-xs text-muted-foreground pt-4">
        v1.0.0 • Kotatsu-inspired Build
      </div>
    </div>
  );
}

function MenuItem({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <button className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span className="font-medium">{label}</span>
    </button>
  );
}
