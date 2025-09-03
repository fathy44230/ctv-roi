export interface CampaignMetrics {
  costPerImpression: number;
  costPerClick?: number;
  costPerBrandSearch?: number;
  costPerConversion: number;
  qualityRate: number;
  costPerQualityCase: number;
  roi: number;
}

export interface CampaignData {
  monthlySpend: number;
  impressions: number;
  clicks?: number;
  brandSearches?: number;
  conversions: number;
  qualityCases: number;
  averageCaseValue: number;
}

export function calculateMetrics(campaign: CampaignData, platform: 'meta' | 'ctv'): CampaignMetrics {
  const { monthlySpend, impressions, clicks, brandSearches, conversions, qualityCases, averageCaseValue } = campaign;
  
  const costPerImpression = monthlySpend / impressions;
  const qualityRate = (qualityCases / conversions) * 100;
  const costPerQualityCase = monthlySpend / qualityCases;
  const revenue = qualityCases * averageCaseValue;
  const roi = ((revenue - monthlySpend) / monthlySpend) * 100;
  const costPerConversion = monthlySpend / conversions;
  
  if (platform === 'meta') {
    const costPerClick = clicks ? monthlySpend / clicks : 0;
    return {
      costPerImpression,
      costPerClick,
      costPerConversion,
      qualityRate,
      costPerQualityCase,
      roi
    };
  } else {
    const costPerBrandSearch = brandSearches ? monthlySpend / brandSearches : 0;
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

export function calculateWaste(metaCampaign: CampaignData, ctvCampaign: CampaignData) {
  const metaMetrics = calculateMetrics(metaCampaign, 'meta');
  const ctvMetrics = calculateMetrics(ctvCampaign, 'ctv');
  
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
    metaMetrics,
    ctvMetrics
  };
}
