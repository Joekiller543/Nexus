import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./replit_integrations/auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  setupAuth(app);

  // API Routes
  app.get(api.manga.list.path, async (req, res) => {
    const mangaList = await storage.getAllManga();
    res.json(mangaList);
  });

  app.get(api.manga.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const manga = await storage.getMangaWithChapters(id);
    if (!manga) return res.status(404).json({ message: "Manga not found" });
    res.json(manga);
  });

  app.get(api.library.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const items = await storage.getLibrary(req.user!.id);
    res.json(items);
  });

  app.post(api.library.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const input = api.library.update.input.parse(req.body);
    const item = await storage.addToLibrary({ ...input, userId: req.user!.id });
    res.json(item);
  });

  app.delete(api.library.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    await storage.removeFromLibrary(parseInt(req.params.id));
    res.status(204).send();
  });

  app.get(api.history.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const items = await storage.getHistory(req.user!.id);
    res.json(items);
  });

  app.post(api.history.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const input = api.history.update.input.parse(req.body);
    const item = await storage.updateHistory({ ...input, userId: req.user!.id });
    res.json(item);
  });
  
  // Helper to seed data if empty
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getAllManga();
  if (existing.length === 0) {
    console.log("Seeding database...");
    
    const m1 = await storage.createManga({
      title: "Solo Leveling",
      description: "Ten years ago, the Gate that connected the real world with the monster world opened...",
      coverUrl: "https://upload.wikimedia.org/wikipedia/en/9/9c/Solo_Leveling_Webtoon_cover.png",
      author: "Chu-Gong",
      artist: "Jang Sung-Rak",
      status: "Completed",
      genres: ["Action", "Adventure", "Fantasy"],
      source: "Local",
      rating: "9.8"
    });
    
    // Seed chapters for m1
    await storage.createChapter({ mangaId: m1.id, chapterNumber: "1", title: "Chapter 1", url: "dummy" });
    await storage.createChapter({ mangaId: m1.id, chapterNumber: "2", title: "Chapter 2", url: "dummy" });

    const m2 = await storage.createManga({
      title: "One Piece",
      description: "Gol D. Roger was known as the 'Pirate King', the strongest and most infamous being to have sailed the Grand Line...",
      coverUrl: "https://upload.wikimedia.org/wikipedia/en/9/90/One_Piece%2C_Volume_61_Cover_%28Japanese%29.jpg",
      author: "Eiichiro Oda",
      artist: "Eiichiro Oda",
      status: "Ongoing",
      genres: ["Action", "Adventure", "Comedy"],
      source: "Local",
      rating: "9.5"
    });

    await storage.createChapter({ mangaId: m2.id, chapterNumber: "1000", title: "Chapter 1000", url: "dummy" });

    const m3 = await storage.createManga({
      title: "Berserk",
      description: "Guts, known as the Black Swordsman, seeks sanctuary from the demonic forces...",
      coverUrl: "https://upload.wikimedia.org/wikipedia/en/4/45/Berserk_vol01.jpg",
      author: "Kentaro Miura",
      artist: "Kentaro Miura",
      status: "Hiatus",
      genres: ["Action", "Dark Fantasy", "Seinen"],
      source: "Local",
      rating: "9.9"
    });

     await storage.createChapter({ mangaId: m3.id, chapterNumber: "1", title: "The Black Swordsman", url: "dummy" });

     console.log("Database seeded!");
  }
}
