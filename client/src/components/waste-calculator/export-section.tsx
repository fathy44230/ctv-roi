import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Download, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface ExportSectionProps {
  analysisResult: WasteAnalysisResult;
  metaCampaign: CampaignData;
  ctvCampaign: CampaignData;
  onExportComplete: () => void;
}

export default function ExportSection({ 
  analysisResult, 
  metaCampaign, 
  ctvCampaign, 
  onExportComplete 
}: ExportSectionProps) {
  const { toast } = useToast();

  const exportCSVMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/export/csv', {
        analysisData: {
          ...analysisResult,
          metaCampaign,
          ctvCampaign,
        },
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'waste-analysis.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "Export Successful",
        description: "Your CSV report has been downloaded.",
      });
      onExportComplete();
    },
    onError: () => {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePDFExport = () => {
    // For now, show a toast indicating the feature
    toast({
      title: "PDF Export",
      description: "PDF export functionality would be implemented here using a PDF generation library.",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Advertising Waste Analysis Results',
        text: `My advertising waste analysis shows potential savings of $${analysisResult.potentialSavings.toFixed(0)} annually.`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "The results page URL has been copied to your clipboard.",
      });
    }
  };

  return (
    <Card className="bg-card border-border shadow-sm" data-testid="card-export">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="text-export-title">Export Your Waste Analysis</h3>
            <p className="text-muted-foreground" data-testid="text-export-description">Download comprehensive reports for budget optimization decisions</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handlePDFExport}
              data-testid="button-export-pdf"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export PDF Report
            </Button>
            <Button 
              className="bg-success text-success-foreground hover:bg-success/90"
              onClick={() => exportCSVMutation.mutate()}
              disabled={exportCSVMutation.isPending}
              data-testid="button-export-csv"
            >
              <Download className="h-4 w-4 mr-2" />
              {exportCSVMutation.isPending ? 'Exporting...' : 'Export CSV Data'}
            </Button>
            <Button 
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={handleShare}
              data-testid="button-share"
            >
              <Share className="h-4 w-4 mr-2" />
              Share Results
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
