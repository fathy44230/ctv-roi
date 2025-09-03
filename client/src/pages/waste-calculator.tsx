import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, HelpCircle, Calculator } from "lucide-react";
import CampaignForm from "@/components/waste-calculator/campaign-form";
import ResultsDashboard from "@/components/waste-calculator/results-dashboard";
import { useToast } from "@/hooks/use-toast";

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

interface WasteAnalysisResult {
  monthlyWaste: number;
  annualWaste: number;
  potentialSavings: number;
  metaMetrics: any;
  ctvMetrics: any;
  recommendations: any[];
}

export default function WasteCalculator() {
  const [metaCampaign, setMetaCampaign] = useState<CampaignData>({
    name: "Meta Campaign",
    platform: 'meta',
    monthlySpend: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    qualityCases: 0,
    averageCaseValue: 0,
  });

  const [ctvCampaign, setCtvCampaign] = useState<CampaignData>({
    name: "CTV Campaign",
    platform: 'ctv',
    monthlySpend: 0,
    impressions: 0,
    brandSearches: 0,
    conversions: 0,
    qualityCases: 0,
    averageCaseValue: 0,
  });

  const [analysisResult, setAnalysisResult] = useState<WasteAnalysisResult | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const calculateWasteMutation = useMutation({
    mutationFn: async (data: { metaCampaign: CampaignData; ctvCampaign: CampaignData }) => {
      const response = await apiRequest('POST', '/api/waste-analysis/calculate', data);
      return response.json();
    },
    onSuccess: (result) => {
      setAnalysisResult(result);
      setCurrentStep(2);
      toast({
        title: "Analysis Complete",
        description: "Your waste analysis has been calculated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Calculation Failed",
        description: "There was an error calculating your waste analysis. Please check your input data and try again.",
        variant: "destructive",
      });
    },
  });

  const handleCalculateWaste = () => {
    if (!metaCampaign.monthlySpend || !ctvCampaign.monthlySpend) {
      toast({
        title: "Missing Data",
        description: "Please fill in all required campaign data before calculating.",
        variant: "destructive",
      });
      return;
    }
    
    calculateWasteMutation.mutate({ metaCampaign, ctvCampaign });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-primary" data-testid="logo">TAQTICS</div>
              <div className="h-6 w-px bg-border"></div>
              <h1 className="text-lg font-semibold text-foreground" data-testid="page-title">Advertising Waste Calculator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" data-testid="button-help">
                <HelpCircle className="h-4 w-4" />
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-strategy-session">
                <Phone className="h-4 w-4 mr-2" />
                Get Strategy Session
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-heading">Compare Your Advertising Efficiency</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto" data-testid="text-description">
              Discover exactly how much budget you're wasting on inefficient Meta campaigns compared to precision CTV targeting. 
              Get concrete data to optimize your legal advertising strategy.
            </p>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${currentStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} flex items-center justify-center text-sm font-semibold`} data-testid="step-indicator-1">1</div>
                <span className={`ml-2 text-sm font-medium ${currentStep === 1 ? 'text-foreground' : 'text-muted-foreground'}`} data-testid="step-label-1">Enter Data</span>
              </div>
              <div className="w-8 h-px bg-border"></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${currentStep === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} flex items-center justify-center text-sm font-semibold`} data-testid="step-indicator-2">2</div>
                <span className={`ml-2 text-sm font-medium ${currentStep === 2 ? 'text-foreground' : 'text-muted-foreground'}`} data-testid="step-label-2">Calculate Waste</span>
              </div>
              <div className="w-8 h-px bg-border"></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${currentStep === 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} flex items-center justify-center text-sm font-semibold`} data-testid="step-indicator-3">3</div>
                <span className={`ml-2 text-sm font-medium ${currentStep === 3 ? 'text-foreground' : 'text-muted-foreground'}`} data-testid="step-label-3">Export Report</span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Forms */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <CampaignForm
                campaign={metaCampaign}
                onChange={setMetaCampaign}
                platform="meta"
                title="Meta Campaign Data"
                subtitle="Facebook & Instagram advertising metrics"
              />
              <CampaignForm
                campaign={ctvCampaign}
                onChange={setCtvCampaign}
                platform="ctv"
                title="CTV Campaign Data"
                subtitle="Connected TV advertising metrics"
              />
            </div>

            {/* Calculate Button */}
            <div className="text-center mb-8">
              <Button 
                className="bg-primary text-primary-foreground px-8 py-3 text-lg hover:bg-primary/90" 
                onClick={handleCalculateWaste}
                disabled={calculateWasteMutation.isPending}
                data-testid="button-calculate"
              >
                <Calculator className="h-5 w-5 mr-2" />
                {calculateWasteMutation.isPending ? "Calculating..." : "Calculate Advertising Waste"}
              </Button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {currentStep === 2 && analysisResult && (
          <ResultsDashboard
            analysisResult={analysisResult}
            metaCampaign={metaCampaign}
            ctvCampaign={ctvCampaign}
            onExportComplete={() => setCurrentStep(3)}
          />
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-8 mt-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4" data-testid="text-cta-title">Ready to Eliminate Advertising Waste?</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto" data-testid="text-cta-description">
            Get a custom CTV strategy designed specifically for your practice. Our precision targeting eliminates waste and delivers high-value cases consistently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary px-8 py-3 font-semibold hover:bg-white/90" data-testid="button-schedule-session">
              <Phone className="h-5 w-5 mr-2" />
              Schedule Strategy Session
            </Button>
            <Button variant="outline" className="border-white text-white px-8 py-3 font-semibold hover:bg-white/10" data-testid="button-market-analysis">
              <Calculator className="h-5 w-5 mr-2" />
              Get Market Analysis
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-xl font-bold text-primary mb-2" data-testid="text-footer-logo">TAQTICS</div>
              <p className="text-sm text-muted-foreground" data-testid="text-footer-tagline">Precision CTV advertising for legal professionals</p>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-linkedin">
                LinkedIn
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-twitter">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-privacy">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
