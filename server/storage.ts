import { type Campaign, type InsertCampaign, type WasteAnalysis, type InsertWasteAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Campaign operations
  getCampaign(id: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  getAllCampaigns(): Promise<Campaign[]>;
  deleteCampaign(id: string): Promise<void>;
  
  // Waste analysis operations
  getWasteAnalysis(id: string): Promise<WasteAnalysis | undefined>;
  createWasteAnalysis(analysis: InsertWasteAnalysis): Promise<WasteAnalysis>;
  getAllWasteAnalyses(): Promise<WasteAnalysis[]>;
  deleteWasteAnalysis(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private campaigns: Map<string, Campaign>;
  private wasteAnalyses: Map<string, WasteAnalysis>;

  constructor() {
    this.campaigns = new Map();
    this.wasteAnalyses = new Map();
  }

  // Campaign operations
  async getCampaign(id: string): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = randomUUID();
    const campaign: Campaign = { 
      ...insertCampaign, 
      id,
      createdAt: new Date(),
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async deleteCampaign(id: string): Promise<void> {
    this.campaigns.delete(id);
  }

  // Waste analysis operations
  async getWasteAnalysis(id: string): Promise<WasteAnalysis | undefined> {
    return this.wasteAnalyses.get(id);
  }

  async createWasteAnalysis(insertAnalysis: InsertWasteAnalysis): Promise<WasteAnalysis> {
    const id = randomUUID();
    const analysis: WasteAnalysis = { 
      ...insertAnalysis, 
      id,
      createdAt: new Date(),
    };
    this.wasteAnalyses.set(id, analysis);
    return analysis;
  }

  async getAllWasteAnalyses(): Promise<WasteAnalysis[]> {
    return Array.from(this.wasteAnalyses.values());
  }

  async deleteWasteAnalysis(id: string): Promise<void> {
    this.wasteAnalyses.delete(id);
  }
}

export const storage = new MemStorage();
