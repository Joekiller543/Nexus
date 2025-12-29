import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { type Manga } from "@shared/schema";

interface MangaCardProps {
  manga: Manga;
  unreadCount?: number;
  compact?: boolean;
}

export function MangaCard({ manga, unreadCount, compact = false }: MangaCardProps) {
  return (
    <Link href={`/manga/${manga.id}`}>
      <div className="group relative flex flex-col gap-2 cursor-pointer transition-transform duration-200 hover:-translate-y-1">
        <div className={cn(
          "relative overflow-hidden rounded-xl bg-secondary shadow-lg shadow-black/20",
          compact ? "aspect-[2/3]" : "aspect-[2/3]"
        )}>
          {/* Unsplash Image fallback if coverUrl is missing */}
          {/* scenic mountain landscape fallback */}
          <img
            src={manga.coverUrl || "https://images.unsplash.com/photo-1578374173705-969cdd6c2d13?w=400&h=600&fit=crop"}
            alt={manga.title}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
            loading="lazy"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          
          {unreadCount && unreadCount > 0 && (
            <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
              {unreadCount}
            </span>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-3 pt-8 bg-gradient-to-t from-black/90 to-transparent">
            {compact ? null : (
              <p className="text-xs text-white/70 line-clamp-1 mb-0.5 font-medium">
                {manga.source}
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-0.5">
          <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {manga.title}
          </h3>
          {!compact && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {manga.author}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
