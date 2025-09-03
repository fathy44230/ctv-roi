import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Lightbulb } from "lucide-react";

interface Recommendation {
  type: 'waste' | 'opportunity';
  title: string;
  description: string;
}

interface OptimizationRecommendationsProps {
  recommendations: Recommendation[];
}

export default function OptimizationRecommendations({ recommendations }: OptimizationRecommendationsProps) {
  const wasteAreas = recommendations.filter(rec => rec.type === 'waste');
  const opportunities = recommendations.filter(rec => rec.type === 'opportunity');

  return (
    <Card className="bg-card border-border shadow-sm" data-testid="card-recommendations">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6" data-testid="text-recommendations-title">Budget Optimization Recommendations</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground flex items-center" data-testid="text-waste-areas-title">
              <AlertTriangle className="text-destructive mr-2 h-5 w-5" />
              Current Waste Areas
            </h4>
            <div className="space-y-3">
              {wasteAreas.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-destructive/10 rounded-lg" data-testid={`waste-area-${index}`}>
                  <div className="w-2 h-2 bg-destructive rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-foreground" data-testid={`waste-title-${index}`}>{rec.title}</div>
                    <div className="text-sm text-muted-foreground" data-testid={`waste-description-${index}`}>{rec.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground flex items-center" data-testid="text-opportunities-title">
              <Lightbulb className="text-success mr-2 h-5 w-5" />
              Optimization Opportunities
            </h4>
            <div className="space-y-3">
              {opportunities.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-success/10 rounded-lg" data-testid={`opportunity-${index}`}>
                  <div className="w-2 h-2 bg-success rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-foreground" data-testid={`opportunity-title-${index}`}>{rec.title}</div>
                    <div className="text-sm text-muted-foreground" data-testid={`opportunity-description-${index}`}>{rec.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
