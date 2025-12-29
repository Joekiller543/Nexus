import { z } from 'zod';
import { 
  insertUserSchema, 
  insertMangaSchema, 
  insertChapterSchema,
  insertLibraryItemSchema,
  insertHistorySchema,
  users,
  manga,
  chapters,
  libraryItems,
  history,
  categories
} from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  // Auth is handled by Replit Auth / passport, but we might expose user info
  user: {
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.notFound,
      },
    },
  },
  manga: {
    list: {
      method: 'GET' as const,
      path: '/api/manga',
      input: z.object({
        search: z.string().optional(),
        genre: z.string().optional(),
        source: z.string().optional(),
        page: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof manga.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/manga/:id',
      responses: {
        200: z.custom<typeof manga.$inferSelect & { chapters: typeof chapters.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
  },
  library: {
    list: {
      method: 'GET' as const,
      path: '/api/library',
      responses: {
        200: z.array(z.custom<typeof libraryItems.$inferSelect & { manga: typeof manga.$inferSelect }>()),
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/library',
      input: insertLibraryItemSchema,
      responses: {
        200: z.custom<typeof libraryItems.$inferSelect>(),
        201: z.custom<typeof libraryItems.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/library/:id',
      responses: {
        204: z.void(),
      },
    }
  },
  history: {
    list: {
      method: 'GET' as const,
      path: '/api/history',
      responses: {
        200: z.array(z.custom<typeof history.$inferSelect & { manga: typeof manga.$inferSelect, chapter: typeof chapters.$inferSelect }>()),
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/history',
      input: insertHistorySchema,
      responses: {
        200: z.custom<typeof history.$inferSelect>(),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
