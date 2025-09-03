import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  platform: text("platform").notNull(), // 'meta' or 'ctv'
  monthlySpend: real("monthly_spend").notNull(),
  impressions: integer("impressions").notNull(),
  clicks: integer("clicks"),
  brandSearches: integer("brand_searches"),
  conversions: integer("conversions").notNull(),
  qualityCases: integer("quality_cases").notNull(),
  averageCaseValue: real("average_case_value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wasteAnalyses = pgTable("waste_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metaCampaignId: varchar("meta_campaign_id").references(() => campaigns.id),
  ctvCampaignId: varchar("ctv_campaign_id").references(() => campaigns.id),
  monthlyWaste: real("monthly_waste").notNull(),
  annualWaste: real("annual_waste").notNull(),
  potentialSavings: real("potential_savings").notNull(),
  metaEfficiencyMetrics: text("meta_efficiency_metrics").notNull(), // JSON string
  ctvEfficiencyMetrics: text("ctv_efficiency_metrics").notNull(), // JSON string
  recommendations: text("recommendations").notNull(), // JSON string
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
});

export const insertWasteAnalysisSchema = createInsertSchema(wasteAnalyses).omit({
  id: true,
  createdAt: true,
});

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertWasteAnalysis = z.infer<typeof insertWasteAnalysisSchema>;
export type WasteAnalysis = typeof wasteAnalyses.$inferSelect;

// Validation schemas for API endpoints
export const calculateWasteSchema = z.object({
  metaCampaign: insertCampaignSchema.extend({
    platform: z.literal('meta'),
    clicks: z.number().min(0),
  }),
  ctvCampaign: insertCampaignSchema.extend({
    platform: z.literal('ctv'),
    brandSearches: z.number().min(0),
  }),
});

export type CalculateWasteRequest = z.infer<typeof calculateWasteSchema>;
