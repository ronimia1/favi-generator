import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// FaviconSet represents a processed set of favicon images
export const faviconSets = pgTable("favicon_sets", {
  id: serial("id").primaryKey(),
  originalName: text("original_name").notNull(),
  originalFormat: text("original_format").notNull(),
  sizes: jsonb("sizes").notNull(), // Contains paths to different sizes: { 16: "path/to/16x16.ico", 32: "path/to/32x32.ico", 48: "path/to/48x48.ico" }
  createdAt: text("created_at").notNull()
});

export const insertFaviconSetSchema = createInsertSchema(faviconSets).pick({
  originalName: true,
  originalFormat: true,
  sizes: true,
  createdAt: true
});

export type InsertFaviconSet = z.infer<typeof insertFaviconSetSchema>;
export type FaviconSet = typeof faviconSets.$inferSelect;

// ProcessingJob represents an in-progress favicon generation job
export const processingJobs = pgTable("processing_jobs", {
  id: serial("id").primaryKey(),
  totalImages: integer("total_images").notNull(),
  completedImages: integer("completed_images").notNull(),
  status: text("status").notNull(), // 'pending', 'processing', 'completed', 'failed'
  error: text("error"),
  createdAt: text("created_at").notNull()
});

export const insertProcessingJobSchema = createInsertSchema(processingJobs).pick({
  totalImages: true,
  completedImages: true,
  status: true,
  createdAt: true
}).extend({
  error: z.string().optional()
});

export type InsertProcessingJob = z.infer<typeof insertProcessingJobSchema>;
export type ProcessingJob = typeof processingJobs.$inferSelect;
