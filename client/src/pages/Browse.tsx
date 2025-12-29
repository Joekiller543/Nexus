import { useMangaList } from "@/hooks/use-manga";
import { MangaCard } from "@/components/MangaCard";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce"; // We'll need this utility

export default function Browse() {
  const [search, setSearch] = useState("");
  // const debouncedSearch = useDebounce(search, 500); // Ideally implement this hook
  
  const { data: mangaList, isLoading } = useMangaList({ search });

  return (
    <div className="pb-24 pt-4 px-4 max-w-7xl mx-auto space-y-6">
      <header className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Browse</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search titles, authors..." 
            className="pl-9 rounded-xl bg-secondary/50 border-white/5 focus:bg-secondary transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />
              <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 animate-in fade-in duration-500">
          {mangaList?.map((manga) => (
            <MangaCard key={manga.id} manga={manga} />
          ))}
          {mangaList?.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No results found for "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
