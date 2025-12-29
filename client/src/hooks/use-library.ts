import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertLibraryItem, type InsertHistory } from "@shared/schema";

export function useLibrary() {
  return useQuery({
    queryKey: [api.library.list.path],
    queryFn: async () => {
      const res = await fetch(api.library.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch library");
      return api.library.list.responses[200].parse(await res.json());
    },
  });
}

export function useAddToLibrary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertLibraryItem) => {
      const res = await fetch(api.library.update.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to add to library");
      return api.library.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.library.list.path] });
    },
  });
}

export function useRemoveFromLibrary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.library.delete.path, { id });
      const res = await fetch(url, { 
        method: "DELETE",
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to remove from library");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.library.list.path] });
    },
  });
}

export function useHistory() {
  return useQuery({
    queryKey: [api.history.list.path],
    queryFn: async () => {
      const res = await fetch(api.history.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.history.list.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertHistory) => {
      const res = await fetch(api.history.update.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update history");
      return api.history.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.history.list.path] });
    },
  });
}
