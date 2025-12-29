import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

// === TABLE DEFINITIONS ===

// Users are defined in ./models/auth.ts

export const manga = pgTable("manga", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  coverUrl: text("cover_url").notNull(),
  author: text("author"),
  artist: text("artist"),
  status: text("status").default("Ongoing"), // Ongoing, Completed, etc.
  genres: text("genres").array(),
  source: text("source").notNull(), // e.g., "Mangadex", "Local"
  rating: text("rating"), // e.g., "8.5"
  createdAt: timestamp("created_at").defaultNow(),
});

export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  mangaId: integer("manga_id").notNull().references(() => manga.id),
  title: text("title"),
  chapterNumber:  text("chapter_number").notNull(), // Use text to support "10.5"
  volume: text("volume"),
  publishDate: timestamp("publish_date"),
  url: text("url"), // External URL or internal identifier
  pageCount: integer("page_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(), // "Reading", "Plan to Read", "Completed"
  order: integer("order").default(0),
});

export const libraryItems = pgTable("library_items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  mangaId: integer("manga_id").notNull().references(() => manga.id),
  categoryId: integer("category_id").references(() => categories.id),
  unreadCount: integer("unread_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const history = pgTable("history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  mangaId: integer("manga_id").notNull().references(() => manga.id),
  chapterId: integer("chapter_id").notNull().references(() => chapters.id),
  lastPage: integer("last_page").default(1),
  readAt: timestamp("read_at").defaultNow(),
});

// === RELATIONS ===

export const mangaRelations = relations(manga, ({ many }) => ({
  chapters: many(chapters),
}));

export const chaptersRelations = relations(chapters, ({ one }) => ({
  manga: one(manga, {
    fields: [chapters.mangaId],
    references: [manga.id],
  }),
}));

export const libraryItemsRelations = relations(libraryItems, ({ one }) => ({
  manga: one(manga, {
    fields: [libraryItems.mangaId],
    references: [manga.id],
  }),
  category: one(categories, {
    fields: [libraryItems.categoryId],
    references: [categories.id],
  }),
}));

export const historyRelations = relations(history, ({ one }) => ({
  manga: one(manga, {
    fields: [history.mangaId],
    references: [manga.id],
  }),
  chapter: one(chapters, {
    fields: [history.chapterId],
    references: [chapters.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertMangaSchema = createInsertSchema(manga).omit({ id: true, createdAt: true });
export const insertChapterSchema = createInsertSchema(chapters).omit({ id: true, createdAt: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertLibraryItemSchema = createInsertSchema(libraryItems).omit({ id: true, createdAt: true });
export const insertHistorySchema = createInsertSchema(history).omit({ id: true, readAt: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Manga = typeof manga.$inferSelect;
export type Chapter = typeof chapters.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type LibraryItem = typeof libraryItems.$inferSelect & { manga?: Manga, category?: Category };
export type HistoryEntry = typeof history.$inferSelect & { manga?: Manga, chapter?: Chapter };

// Request types
export type CreateMangaRequest = z.infer<typeof insertMangaSchema>;
export type CreateChapterRequest = z.infer<typeof insertChapterSchema>;
export type UpdateLibraryItemRequest = Partial<z.infer<typeof insertLibraryItemSchema>>;
export type UpdateHistoryRequest = Partial<z.infer<typeof insertHistorySchema>>;

// Response types
export type MangaResponse = Manga & { chapters?: Chapter[] };
export type LibraryResponse = LibraryItem[];
