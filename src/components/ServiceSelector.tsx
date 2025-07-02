
import { Label } from '@/components/ui/label';
import { AlertCircle, Check } from 'lucide-react';

const SERVICES = [
  {
    id: 'web-development',
    name: 'Desenvolvimento Web',
    description: 'Sites, aplicações web e e-commerce',
    icon: '🌐'
  },
  {
    id: 'mobile-development',
    name: 'Desenvolvimento Mobile',
    description: 'Apps iOS e Android nativos ou híbridos',
    icon: '📱'
  },
  {
    id: 'digital-marketing',
    name: 'Marketing Digital',
    description: 'SEO, Google Ads, redes sociais e automação',
    icon: '📈'
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design',
    description: 'Design de interfaces e experiência do usuário',
    icon: '🎨'
  },
  {
    id: 'data-analytics',
    name: 'Análise de Dados',
    description: 'BI, dashboards e relatórios inteligentes',
    icon: '📊'
  },
  {
    id: 'automation',
    name: 'Automação de Processos',
    description: 'Integração de sistemas e fluxos automatizados',
    icon: '⚡'
  },
  {
    id: 'consulting',
    name: 'Consultoria Tecnológica',
    description: 'Estratégia digital e transformação tecnológica',
    icon: '💡'
  },
  {
    id: 'other',
    name: 'Outros',
    description: 'Descreva sua necessidade específica',
    icon: '🔧'
  }
];

interface ServiceSelectorProps {
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
  error?: string;
}

export const ServiceSelector = ({ selectedServices, onServicesChange, error }: ServiceSelectorProps) => {
  const handleServiceToggle = (serviceId: string) => {
    console.log('Service toggle:', serviceId, 'currently selected:', selectedServices);
    
    const isSelected = selectedServices.includes(serviceId);
    let newServices;
    
    if (isSelected) {
      newServices = selectedServices.filter(id => id !== serviceId);
    } else {
      // Verificar se já tem 2 serviços selecionados
      if (selectedServices.length >= 2) {
        console.log('Máximo de 2 serviços já selecionados');
        return; // Não permite selecionar mais de 2
      }
      newServices = [...selectedServices, serviceId];
    }
    
    console.log('New services:', newServices);
    onServicesChange(newServices);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold text-gray-700">
        Serviços Desejados * <span className="text-xs text-gray-500">(selecione até 2 opções)</span>
      </Label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SERVICES.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          const isDisabled = !isSelected && selectedServices.length >= 2;
          
          return (
            <div
              key={service.id}
              className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                isDisabled 
                  ? 'opacity-50 cursor-not-allowed border-gray-200' 
                  : 'hover:shadow-md'
              } ${
                isSelected 
                  ? 'border-vello-blue bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              } ${error ? 'border-red-300' : ''}`}
              onClick={() => !isDisabled && handleServiceToggle(service.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`mt-1 w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-colors ${
                  isSelected 
                    ? 'bg-vello-blue border-vello-blue' 
                    : isDisabled
                    ? 'border-gray-300'
                    : 'border-gray-300'
                }`}>
                  {isSelected && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{service.icon}</span>
                    <h4 className={`font-medium ${
                      isSelected 
                        ? 'text-vello-blue' 
                        : isDisabled 
                        ? 'text-gray-400'
                        : 'text-gray-900'
                    }`}>
                      {service.name}
                    </h4>
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${
                    isDisabled ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {service.description}
                  </p>
                </div>
              </div>
              
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-vello-blue rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
      
      {selectedServices.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Serviços selecionados ({selectedServices.length}/2):</strong>{' '}
            {selectedServices.map(id => 
              SERVICES.find(s => s.id === id)?.name
            ).join(', ')}
          </p>
          {selectedServices.length === 2 && (
            <p className="text-xs text-blue-600 mt-1">
              Máximo de serviços atingido. Desmarque um serviço para selecionar outro.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
