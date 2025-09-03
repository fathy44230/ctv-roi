import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCampaignSchema, calculateWasteSchema } from "@shared/schema";
import { z } from "zod";

// Waste calculation utilities
function calculateEfficiencyMetrics(campaign: any, platform: 'meta' | 'ctv') {
  const { monthlySpend, impressions, clicks, brandSearches, conversions, qualityCases, averageCaseValue } = campaign;
  
  const costPerImpression = monthlySpend / impressions;
  const qualityRate = (qualityCases / conversions) * 100;
  const costPerQualityCase = monthlySpend / qualityCases;
  const revenue = qualityCases * averageCaseValue;
  const roi = ((revenue - monthlySpend) / monthlySpend) * 100;
  
  if (platform === 'meta') {
    const costPerClick = monthlySpend / (clicks || 1);
    const costPerConversion = monthlySpend / conversions;
    return {
      costPerImpression,
      costPerClick,
      costPerConversion,
      qualityRate,
      costPerQualityCase,
      roi
    };
  } else {
    const costPerBrandSearch = monthlySpend / (brandSearches || 1);
    const costPerConversion = monthlySpend / conversions;
    return {
      costPerImpression,
      costPerBrandSearch,
      costPerConversion,
      qualityRate,
      costPerQualityCase,
      roi
    };
  }
}

function calculateWaste(metaCampaign: any, ctvCampaign: any) {
  const metaMetrics = calculateEfficiencyMetrics(metaCampaign, 'meta');
  const ctvMetrics = calculateEfficiencyMetrics(ctvCampaign, 'ctv');
  
  // Calculate waste based on efficiency difference
  const costPerQualityCaseDiff = metaMetrics.costPerQualityCase - ctvMetrics.costPerQualityCase;
  const monthlyWaste = Math.max(0, costPerQualityCaseDiff * metaCampaign.qualityCases);
  const annualWaste = monthlyWaste * 12;
  
  // Potential savings if Meta budget was reallocated to CTV efficiency
  const potentialSavings = (metaCampaign.monthlySpend * 0.6 * (ctvMetrics.roi - metaMetrics.roi)) / 100 * 12;
  
  return {
    monthlyWaste,
    annualWaste,
    potentialSavings: Math.max(0, potentialSavings),
    metaEfficiencyMetrics: metaMetrics,
    ctvEfficiencyMetrics: ctvMetrics
  };
}

function generateRecommendations(metaMetrics: any, ctvMetrics: any, wasteData: any) {
  const recommendations = [];
  
  if (metaMetrics.qualityRate < ctvMetrics.qualityRate) {
    recommendations.push({
      type: 'waste',
      title: 'Low-Quality Lead Volume',
      description: `${(100 - metaMetrics.qualityRate).toFixed(1)}% of Meta conversions are low-value cases`
    });
  }
  
  if (metaMetrics.costPerQualityCase > ctvMetrics.costPerQualityCase) {
    recommendations.push({
      type: 'waste',
      title: 'High Cost Per Quality Case',
      description: `$${metaMetrics.costPerQualityCase.toFixed(0)} vs $${ctvMetrics.costPerQualityCase.toFixed(0)} for CTV campaigns`
    });
  }
  
  recommendations.push({
    type: 'waste',
    title: 'Poor Audience Precision',
    description: 'Broad targeting lacks behavioral intent signals'
  });
  
  recommendations.push({
    type: 'opportunity',
    title: 'Reallocate 60% to CTV',
    description: `Potential $${Math.round(wasteData.potentialSavings / 12000)}K annual savings with better targeting`
  });
  
  recommendations.push({
    type: 'opportunity',
    title: 'Implement Cross-Channel Attribution',
    description: 'Track CTV influence on search conversions'
  });
  
  recommendations.push({
    type: 'opportunity',
    title: 'Behavioral Audience Targeting',
    description: 'Reach high-value prospects before they search'
  });
  
  return recommendations;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Calculate waste analysis
  app.post("/api/waste-analysis/calculate", async (req, res) => {
    try {
      const data = calculateWasteSchema.parse(req.body);
      
      const wasteData = calculateWaste(data.metaCampaign, data.ctvCampaign);
      const recommendations = generateRecommendations(
        wasteData.metaEfficiencyMetrics,
        wasteData.ctvEfficiencyMetrics,
        wasteData
      );
      
      const response = {
        monthlyWaste: wasteData.monthlyWaste,
        annualWaste: wasteData.annualWaste,
        potentialSavings: wasteData.potentialSavings,
        metaMetrics: wasteData.metaEfficiencyMetrics,
        ctvMetrics: wasteData.ctvEfficiencyMetrics,
        recommendations
      };
      
      res.json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to calculate waste analysis" });
      }
    }
  });
  
  // Create campaign
  app.post("/api/campaigns", async (req, res) => {
    try {
      const campaignData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(campaignData);
      res.json(campaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid campaign data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create campaign" });
      }
    }
  });
  
  // Get all campaigns
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getAllCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });
  
  // Get campaign by ID
  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        res.status(404).json({ message: "Campaign not found" });
        return;
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });
  
  // Export data endpoint
  app.post("/api/export/:format", async (req, res) => {
    try {
      const { format } = req.params;
      const { analysisData } = req.body;
      
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="waste-analysis.csv"');
        
        const csvData = [
          ['Metric', 'Meta', 'CTV', 'Difference'],
          ['Monthly Spend', analysisData.metaCampaign.monthlySpend, analysisData.ctvCampaign.monthlySpend, ''],
          ['Cost Per Impression', analysisData.metaMetrics.costPerImpression.toFixed(4), analysisData.ctvMetrics.costPerImpression.toFixed(4), ''],
          ['Quality Case Rate', `${analysisData.metaMetrics.qualityRate.toFixed(1)}%`, `${analysisData.ctvMetrics.qualityRate.toFixed(1)}%`, ''],
          ['ROI', `${analysisData.metaMetrics.roi.toFixed(1)}%`, `${analysisData.ctvMetrics.roi.toFixed(1)}%`, ''],
          ['', '', '', ''],
          ['Monthly Waste', `$${analysisData.monthlyWaste.toFixed(2)}`, '', ''],
          ['Annual Waste', `$${analysisData.annualWaste.toFixed(2)}`, '', ''],
          ['Potential Savings', `$${analysisData.potentialSavings.toFixed(2)}`, '', '']
        ].map(row => row.join(',')).join('\n');
        
        res.send(csvData);
      } else {
        res.status(400).json({ message: "Unsupported export format" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
