import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").unique(),
  name: text("name"),
  authProvider: text("auth_provider").notNull().default("guest"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  category: text("category").notNull(),
  messages: jsonb("messages").default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const categories = [
  "fashion",
  "health", 
  "travel",
  "books",
  "movies",
  "music"
] as const;

export type Category = typeof categories[number];

export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  sender: z.enum(["user", "ai"]),
  timestamp: z.date(),
  category: z.enum(categories).optional(),
});

export const chatRequestSchema = z.object({
  message: z.string().min(1),
  category: z.enum(categories),
  sessionId: z.string().optional(),
  userId: z.string().optional(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
  authProvider: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).pick({
  userId: true,
  category: true,
  messages: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type Message = z.infer<typeof messageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
