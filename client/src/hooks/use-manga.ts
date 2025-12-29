import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useMangaList(filters?: { search?: string; genre?: string; source?: string }) {
  const queryString = new URLSearchParams(filters as Record<string, string>).toString();
  const queryKey = [api.manga.list.path, filters];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      const url = `${api.manga.list.path}?${queryString}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch manga list");
      return api.manga.list.responses[200].parse(await res.json());
    },
  });
}

export function useMangaDetails(id: number) {
  return useQuery({
    queryKey: [api.manga.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.manga.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch manga details");
      return api.manga.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
