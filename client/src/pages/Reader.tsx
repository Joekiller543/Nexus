import { useMangaDetails } from "@/hooks/use-manga";
import { useRoute, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, Settings as SettingsIcon, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateHistory } from "@/hooks/use-library";
import { useAuth } from "@/hooks/use-auth";

// Simulated page images for demo
const DEMO_PAGES = [
  "https://images.unsplash.com/photo-1614531341773-3bff8b7cb3fc?w=800&q=80",
  "https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=800&q=80",
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
];

export default function Reader() {
  const [match, params] = useRoute("/read/:mangaId/:chapterId");
  const [, setLocation] = useLocation();
  const mangaId = parseInt(params?.mangaId || "0");
  const chapterId = parseInt(params?.chapterId || "0");
  
  const { data: manga } = useMangaDetails(mangaId);
  const { user } = useAuth();
  const updateHistory = useUpdateHistory();
  
  const [controlsVisible, setControlsVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Find current chapter index to determine prev/next
  const currentChapterIndex = manga?.chapters?.findIndex(c => c.id === chapterId) ?? -1;
  const prevChapter = manga?.chapters?.[currentChapterIndex + 1]; // Older chapters usually later in array
  const nextChapter = manga?.chapters?.[currentChapterIndex - 1]; // Newer chapters usually earlier

  // Update history when chapter loads
  useEffect(() => {
    if (user && mangaId && chapterId) {
      updateHistory.mutate({
        userId: user.id as unknown as number,
        mangaId,
        chapterId,
        lastPage: currentPage + 1
      });
    }
  }, [user, mangaId, chapterId]);

  const toggleControls = () => setControlsVisible(!controlsVisible);

  const handleNextChapter = () => {
    if (nextChapter) {
      setLocation(`/read/${mangaId}/${nextChapter.id}`);
      setCurrentPage(0);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevChapter = () => {
    if (prevChapter) {
      setLocation(`/read/${mangaId}/${prevChapter.id}`);
      setCurrentPage(0);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="bg-black min-h-screen relative flex flex-col">
      {/* Top Bar */}
      <div className={cn(
        "fixed top-0 left-0 right-0 p-4 bg-black/90 backdrop-blur text-white z-50 transition-transform duration-300 flex justify-between items-center border-b border-white/10",
        !controlsVisible && "-translate-y-full"
      )}>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex flex-col">
            <span className="font-bold text-sm line-clamp-1">{manga?.title}</span>
            <span className="text-xs text-white/60">Chapter {manga?.chapters?.find(c => c.id === chapterId)?.chapterNumber}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Reader Content - Vertical Scroll */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 w-full max-w-3xl mx-auto min-h-screen cursor-pointer tap-highlight-transparent"
        onClick={toggleControls}
      >
        {/* Placeholder images since we don't have real pages in DB */}
        {DEMO_PAGES.map((src, index) => (
          <img 
            key={index}
            src={src} 
            className="w-full h-auto block"
            alt={`Page ${index + 1}`}
            loading="lazy"
          />
        ))}

        {/* Navigation Buttons at bottom */}
        <div className="p-8 space-y-4 pb-32">
          <div className="flex gap-4">
            <Button 
              variant="secondary" 
              className="flex-1 h-12"
              disabled={!prevChapter}
              onClick={(e) => { e.stopPropagation(); handlePrevChapter(); }}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous Chapter
            </Button>
            <Button 
              className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!nextChapter}
              onClick={(e) => { e.stopPropagation(); handleNextChapter(); }}
            >
              Next Chapter <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur text-white z-50 transition-transform duration-300 border-t border-white/10 flex justify-between items-center",
        !controlsVisible && "translate-y-full"
      )}>
        <span className="text-xs font-mono text-white/50">Page 1 / {DEMO_PAGES.length}</span>
        <div className="flex gap-2">
           <Button variant="ghost" size="icon" className="h-8 w-8">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
