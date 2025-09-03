import WasteSummary from "./waste-summary";
import EfficiencyComparison from "./efficiency-comparison";
import OptimizationRecommendations from "./optimization-recommendations";
import ExportSection from "./export-section";

interface WasteAnalysisResult {
  monthlyWaste: number;
  annualWaste: number;
  potentialSavings: number;
  metaMetrics: any;
  ctvMetrics: any;
  recommendations: any[];
}

interface CampaignData {
  name: string;
  platform: 'meta' | 'ctv';
  monthlySpend: number;
  impressions: number;
  clicks?: number;
  brandSearches?: number;
  conversions: number;
  qualityCases: number;
  averageCaseValue: number;
}

interface ResultsDashboardProps {
  analysisResult: WasteAnalysisResult;
  metaCampaign: CampaignData;
  ctvCampaign: CampaignData;
  onExportComplete: () => void;
}

export default function ResultsDashboard({ 
  analysisResult, 
  metaCampaign, 
  ctvCampaign, 
  onExportComplete 
}: ResultsDashboardProps) {
  return (
    <div className="space-y-8" data-testid="results-dashboard">
      <WasteSummary analysisResult={analysisResult} />
      <EfficiencyComparison 
        analysisResult={analysisResult}
        metaCampaign={metaCampaign}
        ctvCampaign={ctvCampaign}
      />
      <OptimizationRecommendations recommendations={analysisResult.recommendations} />
      <ExportSection 
        analysisResult={analysisResult}
        metaCampaign={metaCampaign}
        ctvCampaign={ctvCampaign}
        onExportComplete={onExportComplete}
      />
    </div>
  );
}
