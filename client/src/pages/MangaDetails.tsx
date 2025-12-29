import { useMangaDetails } from "@/hooks/use-manga";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, BookOpen, Heart, Share2, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAddToLibrary, useRemoveFromLibrary, useLibrary } from "@/hooks/use-library";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function MangaDetails() {
  const [match, params] = useRoute("/manga/:id");
  const id = parseInt(params?.id || "0");
  const { data: manga, isLoading } = useMangaDetails(id);
  const { data: libraryItems } = useLibrary();
  const { user } = useAuth();
  
  const addToLibrary = useAddToLibrary();
  const removeFromLibrary = useRemoveFromLibrary();
  const { toast } = useToast();

  const libraryItem = libraryItems?.find(item => item.mangaId === id);
  const isInLibrary = !!libraryItem;

  const handleLibraryToggle = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add manga to your library.",
        variant: "destructive"
      });
      return;
    }

    if (isInLibrary) {
      removeFromLibrary.mutate(libraryItem.id, {
        onSuccess: () => {
          toast({ title: "Removed from library" });
        }
      });
    } else {
      addToLibrary.mutate({ 
        mangaId: id, 
        userId: user.id as unknown as number, // Handle type mismatch if schema user.id is string vs int
        categoryId: null 
      }, {
        onSuccess: () => {
          toast({ title: "Added to library", className: "bg-primary text-primary-foreground" });
        }
      });
    }
  };

  if (isLoading || !manga) return (
    <div className="h-screen w-full bg-background animate-pulse" />
  );

  return (
    <div className="pb-24 min-h-screen relative">
      {/* Background Blur */}
      <div className="absolute top-0 left-0 right-0 h-96 overflow-hidden z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30 scale-110"
          style={{ backgroundImage: `url(${manga.coverUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/80 to-background" />
      </div>

      {/* Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 text-white">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 text-white">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-24">
        {/* Header Content */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-end">
          {/* Cover */}
          <div className="shrink-0 w-40 md:w-56 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10">
            <img 
              src={manga.coverUrl} 
              alt={manga.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Meta */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 flex-1">
            <h1 className="text-2xl md:text-4xl font-display font-bold leading-tight text-shadow-md">
              {manga.title}
            </h1>
            
            <div className="flex flex-col gap-1 text-sm md:text-base text-muted-foreground">
              <span className="font-medium text-foreground">{manga.author}</span>
              <span className="text-xs uppercase tracking-wider opacity-70">{manga.status} • {manga.source}</span>
            </div>

            {/* Actions */}
            <div className="flex w-full gap-3 pt-2 max-w-md">
              <Button 
                onClick={handleLibraryToggle}
                variant={isInLibrary ? "secondary" : "default"}
                className={cn(
                  "flex-1 gap-2 h-12 rounded-xl font-semibold text-base shadow-lg transition-all",
                  !isInLibrary && "bg-primary text-white hover:bg-primary/90 shadow-primary/25"
                )}
                disabled={addToLibrary.isPending || removeFromLibrary.isPending}
              >
                <Heart className={cn("h-5 w-5", isInLibrary && "fill-current text-primary")} />
                {isInLibrary ? "In Library" : "Add to Library"}
              </Button>
              {manga.chapters && manga.chapters.length > 0 && (
                <Link href={`/read/${manga.id}/${manga.chapters[0].id}`} className="flex-1">
                  <Button className="w-full gap-2 h-12 rounded-xl bg-white text-black hover:bg-white/90 font-bold text-base shadow-lg shadow-white/10">
                    <Play className="h-5 w-5 fill-current" />
                    Read
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Genres */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center md:justify-start">
          {manga.genres?.map((genre) => (
            <Badge key={genre} variant="outline" className="rounded-lg border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1">
              {genre}
            </Badge>
          ))}
        </div>

        {/* Description */}
        <div className="mt-8 space-y-2">
          <h3 className="text-lg font-bold font-display">Synopsis</h3>
          <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
            {manga.description}
          </p>
        </div>

        {/* Chapters */}
        <div className="mt-10 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-display">
              {manga.chapters?.length || 0} Chapters
            </h3>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              Sort: Newest
            </Button>
          </div>

          <div className="space-y-2">
            {manga.chapters?.map((chapter) => (
              <Link key={chapter.id} href={`/read/${manga.id}/${chapter.id}`}>
                <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:bg-accent/5 hover:border-primary/30 transition-all cursor-pointer group active:scale-[0.99]">
                  <div className="flex flex-col">
                    <span className="font-semibold group-hover:text-primary transition-colors">
                      Chapter {chapter.chapterNumber}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {chapter.title || `Chapter ${chapter.chapterNumber}`}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground/60 font-mono">
                    {chapter.publishDate && new Date(chapter.publishDate).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
