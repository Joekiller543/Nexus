import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { BottomNav } from "@/components/BottomNav";

// Pages
import Home from "@/pages/Home";
import Browse from "@/pages/Browse";
import HistoryPage from "@/pages/History";
import More from "@/pages/More";
import MangaDetails from "@/pages/MangaDetails";
import Reader from "@/pages/Reader";

function Router() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/browse" component={Browse} />
        <Route path="/history" component={HistoryPage} />
        <Route path="/more" component={More} />
        <Route path="/manga/:id" component={MangaDetails} />
        <Route path="/read/:mangaId/:chapterId" component={Reader} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
