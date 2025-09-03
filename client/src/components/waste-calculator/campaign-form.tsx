import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Facebook, Tv } from "lucide-react";

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

interface CampaignFormProps {
  campaign: CampaignData;
  onChange: (campaign: CampaignData) => void;
  platform: 'meta' | 'ctv';
  title: string;
  subtitle: string;
}

export default function CampaignForm({ campaign, onChange, platform, title, subtitle }: CampaignFormProps) {
  const handleInputChange = (field: keyof CampaignData, value: string) => {
    const numericValue = parseFloat(value) || 0;
    onChange({
      ...campaign,
      [field]: numericValue,
    });
  };

  const getIcon = () => {
    if (platform === 'meta') {
      return <Facebook className="h-5 w-5 text-white" />;
    }
    return <Tv className="h-5 w-5 text-white" />;
  };

  const getIconBg = () => {
    if (platform === 'meta') {
      return "bg-gradient-to-r from-blue-500 to-purple-600";
    }
    return "bg-gradient-to-r from-primary to-accent";
  };

  return (
    <Card className="bg-card border-border shadow-sm" data-testid={`card-campaign-${platform}`}>
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <div className={`w-10 h-10 ${getIconBg()} rounded-lg flex items-center justify-center mr-4`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground" data-testid={`text-campaign-title-${platform}`}>{title}</h3>
            <p className="text-sm text-muted-foreground" data-testid={`text-campaign-subtitle-${platform}`}>{subtitle}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${platform}-spend`} className="block text-sm font-medium text-foreground mb-2">Monthly Spend</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id={`${platform}-spend`}
                  type="number"
                  placeholder="25,000"
                  className="pl-8"
                  value={campaign.monthlySpend || ''}
                  onChange={(e) => handleInputChange('monthlySpend', e.target.value)}
                  data-testid={`input-${platform}-spend`}
                />
              </div>
            </div>
            <div>
              <Label htmlFor={`${platform}-impressions`} className="block text-sm font-medium text-foreground mb-2">Impressions</Label>
              <Input
                id={`${platform}-impressions`}
                type="number"
                placeholder={platform === 'meta' ? '2,500,000' : '1,800,000'}
                value={campaign.impressions || ''}
                onChange={(e) => handleInputChange('impressions', e.target.value)}
                data-testid={`input-${platform}-impressions`}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {platform === 'meta' && (
              <div>
                <Label htmlFor={`${platform}-clicks`} className="block text-sm font-medium text-foreground mb-2">Clicks</Label>
                <Input
                  id={`${platform}-clicks`}
                  type="number"
                  placeholder="12,500"
                  value={campaign.clicks || ''}
                  onChange={(e) => handleInputChange('clicks', e.target.value)}
                  data-testid={`input-${platform}-clicks`}
                />
              </div>
            )}
            
            {platform === 'ctv' && (
              <div>
                <Label htmlFor={`${platform}-brand-searches`} className="block text-sm font-medium text-foreground mb-2">Brand Searches</Label>
                <Input
                  id={`${platform}-brand-searches`}
                  type="number"
                  placeholder="3,200"
                  value={campaign.brandSearches || ''}
                  onChange={(e) => handleInputChange('brandSearches', e.target.value)}
                  data-testid={`input-${platform}-brand-searches`}
                />
              </div>
            )}
            
            <div>
              <Label htmlFor={`${platform}-conversions`} className="block text-sm font-medium text-foreground mb-2">Conversions</Label>
              <Input
                id={`${platform}-conversions`}
                type="number"
                placeholder={platform === 'meta' ? '85' : '156'}
                value={campaign.conversions || ''}
                onChange={(e) => handleInputChange('conversions', e.target.value)}
                data-testid={`input-${platform}-conversions`}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${platform}-quality-cases`} className="block text-sm font-medium text-foreground mb-2">Quality Cases</Label>
              <Input
                id={`${platform}-quality-cases`}
                type="number"
                placeholder={platform === 'meta' ? '12' : '28'}
                value={campaign.qualityCases || ''}
                onChange={(e) => handleInputChange('qualityCases', e.target.value)}
                data-testid={`input-${platform}-quality-cases`}
              />
            </div>
            <div>
              <Label htmlFor={`${platform}-case-value`} className="block text-sm font-medium text-foreground mb-2">Avg Case Value</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id={`${platform}-case-value`}
                  type="number"
                  placeholder={platform === 'meta' ? '150,000' : '285,000'}
                  className="pl-8"
                  value={campaign.averageCaseValue || ''}
                  onChange={(e) => handleInputChange('averageCaseValue', e.target.value)}
                  data-testid={`input-${platform}-case-value`}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
