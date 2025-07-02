
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Zap, Timer } from 'lucide-react';
import { UrgencyLevel, getUrgencyLabel, getUrgencyColor } from '@/utils/urgencyClassifier';

interface UrgencyIndicatorProps {
  level: UrgencyLevel;
  score?: number;
  reasons?: string[];
  showDetails?: boolean;
}

export const UrgencyIndicator = ({ 
  level, 
  score, 
  reasons = [], 
  showDetails = false 
}: UrgencyIndicatorProps) => {
  const getIcon = () => {
    switch (level) {
      case 'urgent':
        return <AlertTriangle className="w-3 h-3" />;
      case 'high':
        return <Zap className="w-3 h-3" />;
      case 'medium':
        return <Clock className="w-3 h-3" />;
      case 'low':
        return <Timer className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge className={`${getUrgencyColor(level)} flex items-center gap-1`}>
          {getIcon()}
          {getUrgencyLabel(level)}
          {score && <span className="text-xs">({score})</span>}
        </Badge>
        {level === 'urgent' && (
          <span className="text-xs text-red-600 font-medium">
            Atendimento prioritário necessário
          </span>
        )}
      </div>
      
      {showDetails && reasons.length > 0 && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border">
          <strong>Análise automática:</strong>
          <ul className="mt-1 space-y-1">
            {reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-gray-400">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
