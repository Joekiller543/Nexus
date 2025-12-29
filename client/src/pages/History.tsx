import { useHistory } from "@/hooks/use-library";
import { Link } from "wouter";
import { Loader2, Calendar, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function HistoryPage() {
  const { data: history, isLoading } = useHistory();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Group history by date (Today, Yesterday, etc.) - Simplified for now
  
  return (
    <div className="pb-24 pt-4 px-4 max-w-3xl mx-auto space-y-6">
      <header className="py-2">
        <h1 className="text-2xl font-bold tracking-tight">History</h1>
      </header>

      <div className="space-y-4">
        {history?.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No reading history yet.
          </div>
        ) : (
          history?.map((entry) => (
            <div key={entry.id} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
              <Link href={`/manga/${entry.mangaId}`} className="shrink-0">
                <div className="h-24 w-16 rounded-md overflow-hidden bg-secondary shadow-sm">
                  <img 
                    src={entry.manga?.coverUrl} 
                    alt={entry.manga?.title}
                    className="h-full w-full object-cover" 
                  />
                </div>
              </Link>
              
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <Link href={`/manga/${entry.mangaId}`}>
                  <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                    {entry.manga?.title}
                  </h3>
                </Link>
                
                <Link href={`/read/${entry.mangaId}/${entry.chapterId}`}>
                  <div className="flex items-center gap-2 mt-1 text-sm text-primary/90 font-medium hover:underline">
                    <BookOpen className="h-3.5 w-3.5" />
                    Chapter {entry.chapter?.chapterNumber}
                  </div>
                </Link>

                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {entry.readAt && formatDistanceToNow(new Date(entry.readAt), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
