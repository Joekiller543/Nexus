import { db } from "./db";
import {
  users, manga, chapters, libraryItems, history, categories,
  type User, type Manga, type Chapter, type LibraryItem, type HistoryEntry
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User (Handled by Auth module mostly, but exposed here if needed)
  getUser(id: string): Promise<User | undefined>;

  // Manga
  getAllManga(): Promise<Manga[]>;
  getManga(id: number): Promise<Manga | undefined>;
  getMangaWithChapters(id: number): Promise<Manga & { chapters: Chapter[] } | undefined>;
  createManga(manga: typeof manga.$inferInsert): Promise<Manga>;
  
  // Chapters
  createChapter(chapter: typeof chapters.$inferInsert): Promise<Chapter>;

  // Library
  getLibrary(userId: string): Promise<(LibraryItem & { manga: Manga })[]>;
  addToLibrary(item: typeof libraryItems.$inferInsert): Promise<LibraryItem>;
  removeFromLibrary(id: number): Promise<void>;

  // History
  getHistory(userId: string): Promise<(HistoryEntry & { manga: Manga, chapter: Chapter })[]>;
  updateHistory(entry: typeof history.$inferInsert): Promise<HistoryEntry>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getAllManga(): Promise<Manga[]> {
    return await db.select().from(manga).orderBy(desc(manga.id));
  }

  async getManga(id: number): Promise<Manga | undefined> {
    const [item] = await db.select().from(manga).where(eq(manga.id, id));
    return item;
  }

  async getMangaWithChapters(id: number): Promise<Manga & { chapters: Chapter[] } | undefined> {
    const [item] = await db.select().from(manga).where(eq(manga.id, id));
    if (!item) return undefined;
    
    const items = await db.select().from(chapters).where(eq(chapters.mangaId, id)).orderBy(desc(chapters.chapterNumber));
    return { ...item, chapters: items };
  }

  async createManga(item: typeof manga.$inferInsert): Promise<Manga> {
    const [newItem] = await db.insert(manga).values(item).returning();
    return newItem;
  }

  async createChapter(item: typeof chapters.$inferInsert): Promise<Chapter> {
    const [newItem] = await db.insert(chapters).values(item).returning();
    return newItem;
  }

  async getLibrary(userId: string): Promise<(LibraryItem & { manga: Manga })[]> {
    const items = await db.select().from(libraryItems)
      .where(eq(libraryItems.userId, userId))
      .leftJoin(manga, eq(libraryItems.mangaId, manga.id));
    
    return items.map(item => ({
      ...item.library_items,
      manga: item.manga!
    }));
  }

  async addToLibrary(item: typeof libraryItems.$inferInsert): Promise<LibraryItem> {
    // Check if exists first
    const [existing] = await db.select().from(libraryItems)
      .where(and(eq(libraryItems.userId, item.userId), eq(libraryItems.mangaId, item.mangaId)));
    
    if (existing) return existing;

    const [newItem] = await db.insert(libraryItems).values(item).returning();
    return newItem;
  }

  async removeFromLibrary(id: number): Promise<void> {
    await db.delete(libraryItems).where(eq(libraryItems.id, id));
  }

  async getHistory(userId: string): Promise<(HistoryEntry & { manga: Manga, chapter: Chapter })[]> {
    const items = await db.select().from(history)
      .where(eq(history.userId, userId))
      .orderBy(desc(history.readAt))
      .leftJoin(manga, eq(history.mangaId, manga.id))
      .leftJoin(chapters, eq(history.chapterId, chapters.id));

    return items.map(item => ({
      ...item.history,
      manga: item.manga!,
      chapter: item.chapters!
    }));
  }

  async updateHistory(entry: typeof history.$inferInsert): Promise<HistoryEntry> {
     // Check if exists first
    const [existing] = await db.select().from(history)
      .where(and(eq(history.userId, entry.userId), eq(history.mangaId, entry.mangaId), eq(history.chapterId, entry.chapterId)));
    
    if (existing) {
       const [updated] = await db.update(history)
         .set({ lastPage: entry.lastPage, readAt: new Date() })
         .where(eq(history.id, existing.id))
         .returning();
       return updated;
    }

    const [newItem] = await db.insert(history).values(entry).returning();
    return newItem;
  }
}

export const storage = new DatabaseStorage();
