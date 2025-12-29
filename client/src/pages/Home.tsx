import { useLibrary } from "@/hooks/use-library";
import { MangaCard } from "@/components/MangaCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Search, Filter, Library } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: libraryItems, isLoading } = useLibrary();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter items based on basic status logic (since we don't have categories table data in seed yet)
  const filteredItems = libraryItems?.filter(item => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return (item.unreadCount || 0) > 0;
    // Mock category filtering for MVP
    return true;
  });

  return (
    <div className="pb-24 pt-4 px-4 max-w-7xl mx-auto space-y-6">
      <header className="flex items-center justify-between py-2">
        <h1 className="text-2xl font-bold tracking-tight">Library</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {!user ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Library className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Your library is empty</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Log in to sync your library across devices and track your reading progress.
          </p>
          <Link href="/api/login">
            <Button size="lg" className="rounded-full px-8 font-semibold shadow-lg shadow-primary/25">
              Log In
            </Button>
          </Link>
        </div>
      ) : filteredItems?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground mb-4">No manga in your library yet.</p>
          <Link href="/browse">
            <Button variant="outline" className="rounded-full">Browse Manga</Button>
          </Link>
        </div>
      ) : (
        <>
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="bg-transparent p-0 gap-2 h-auto flex-wrap justify-start">
              <TabsTrigger 
                value="all" 
                className="rounded-full border border-white/10 bg-white/5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 h-auto text-xs font-medium transition-all"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="unread" 
                className="rounded-full border border-white/10 bg-white/5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 h-auto text-xs font-medium transition-all"
              >
                Unread
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 animate-in fade-in zoom-in-95 duration-500">
            {filteredItems?.map((item) => (
              <MangaCard 
                key={item.id} 
                manga={item.manga} 
                unreadCount={item.unreadCount || 0}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
