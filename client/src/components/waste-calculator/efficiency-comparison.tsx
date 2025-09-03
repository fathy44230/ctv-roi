import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Tv } from "lucide-react";

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

interface EfficiencyComparisonProps {
  analysisResult: WasteAnalysisResult;
  metaCampaign: CampaignData;
  ctvCampaign: CampaignData;
}

export default function EfficiencyComparison({ 
  analysisResult, 
  metaCampaign, 
  ctvCampaign 
}: EfficiencyComparisonProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const { metaMetrics, ctvMetrics } = analysisResult;

  return (
    <div className="space-y-6">
      {/* Detailed Comparison */}
      <Card className="bg-card border-border shadow-sm" data-testid="card-efficiency-comparison">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6" data-testid="text-efficiency-title">Efficiency Comparison</h3>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Meta Metrics */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Facebook className="text-white text-sm" />
                </div>
                <h4 className="text-lg font-semibold text-foreground" data-testid="text-meta-performance">Meta Performance</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Cost Per Impression</span>
                  <span className="font-semibold text-foreground" data-testid="text-meta-cpi">
                    {formatCurrency(metaMetrics.costPerImpression)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Cost Per Click</span>
                  <span className="font-semibold text-foreground" data-testid="text-meta-cpc">
                    {formatCurrency(metaMetrics.costPerClick || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Cost Per Conversion</span>
                  <span className="font-semibold text-foreground" data-testid="text-meta-cpconv">
                    {formatCurrency(metaMetrics.costPerConversion)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Quality Case Rate</span>
                  <span className="font-semibold text-destructive" data-testid="text-meta-quality-rate">
                    {formatPercentage(metaMetrics.qualityRate)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">ROI</span>
                  <span className="font-semibold text-foreground" data-testid="text-meta-roi">
                    {formatPercentage(metaMetrics.roi)}
                  </span>
                </div>
              </div>
            </div>

            {/* CTV Metrics */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mr-3">
                  <Tv className="text-white text-sm" />
                </div>
                <h4 className="text-lg font-semibold text-foreground" data-testid="text-ctv-performance">CTV Performance</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Cost Per Impression</span>
                  <span className="font-semibold text-foreground" data-testid="text-ctv-cpi">
                    {formatCurrency(ctvMetrics.costPerImpression)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Cost Per Brand Search</span>
                  <span className="font-semibold text-foreground" data-testid="text-ctv-cpbs">
                    {formatCurrency(ctvMetrics.costPerBrandSearch || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Cost Per Conversion</span>
                  <span className="font-semibold text-success" data-testid="text-ctv-cpconv">
                    {formatCurrency(ctvMetrics.costPerConversion)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Quality Case Rate</span>
                  <span className="font-semibold text-success" data-testid="text-ctv-quality-rate">
                    {formatPercentage(ctvMetrics.qualityRate)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">ROI</span>
                  <span className="font-semibold text-success" data-testid="text-ctv-roi">
                    {formatPercentage(ctvMetrics.roi)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Efficiency Chart */}
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-foreground mb-4" data-testid="text-efficiency-chart-title">Cost Efficiency Comparison</h4>
            <div className="chart-container rounded-lg p-6 h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4">
                  <div className="text-3xl font-bold text-destructive mb-2" data-testid="text-cost-difference">
                    {((metaMetrics.costPerQualityCase - ctvMetrics.costPerQualityCase) / ctvMetrics.costPerQualityCase * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Higher cost per quality case</div>
                  <div className="text-xs text-muted-foreground">Meta vs CTV</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ROI Comparison */}
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-foreground mb-4" data-testid="text-roi-chart-title">ROI Performance</h4>
            <div className="chart-container rounded-lg p-6 h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4">
                  <div className="text-3xl font-bold text-success mb-2" data-testid="text-roi-multiple">
                    {(ctvMetrics.roi / metaMetrics.roi).toFixed(1)}x
                  </div>
                  <div className="text-sm text-muted-foreground">Higher ROI with CTV</div>
                  <div className="text-xs text-muted-foreground">
                    {formatPercentage(ctvMetrics.roi)} vs {formatPercentage(metaMetrics.roi)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
