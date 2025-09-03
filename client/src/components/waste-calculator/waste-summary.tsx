interface WasteAnalysisResult {
  monthlyWaste: number;
  annualWaste: number;
  potentialSavings: number;
  metaMetrics: any;
  ctvMetrics: any;
  recommendations: any[];
}

interface WasteSummaryProps {
  analysisResult: WasteAnalysisResult;
}

export default function WasteSummary({ analysisResult }: WasteSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6" data-testid="waste-summary">
      <div className="gradient-border">
        <div className="gradient-border-inner p-6 text-center">
          <div className="text-2xl font-bold text-destructive mb-2" data-testid="text-monthly-waste">
            {formatCurrency(analysisResult.monthlyWaste)}
          </div>
          <div className="text-sm font-medium text-foreground mb-1">Monthly Waste</div>
          <div className="text-xs text-muted-foreground">Meta vs CTV efficiency</div>
        </div>
      </div>
      
      <div className="gradient-border">
        <div className="gradient-border-inner p-6 text-center">
          <div className="text-2xl font-bold text-destructive mb-2" data-testid="text-annual-waste">
            {formatCurrency(analysisResult.annualWaste)}
          </div>
          <div className="text-sm font-medium text-foreground mb-1">Annual Waste</div>
          <div className="text-xs text-muted-foreground">Projected yearly loss</div>
        </div>
      </div>
      
      <div className="gradient-border">
        <div className="gradient-border-inner p-6 text-center">
          <div className="text-2xl font-bold text-success mb-2" data-testid="text-potential-savings">
            {formatCurrency(analysisResult.potentialSavings)}
          </div>
          <div className="text-sm font-medium text-foreground mb-1">Potential Savings</div>
          <div className="text-xs text-muted-foreground">With CTV optimization</div>
        </div>
      </div>
    </div>
  );
}
