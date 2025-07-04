
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';
import { ServiceSelector } from '../ServiceSelector';
import { UrgencyIndicator } from '../UrgencyIndicator';
import { FormData, classifyUrgency } from '@/utils/formUtils';

interface FormFieldsProps {
  formData: FormData;
  errors: Record<string, string>;
  urgencyAnalysis: ReturnType<typeof classifyUrgency> | null;
  onInputChange: (field: keyof FormData, value: any) => void;
}

export const FormFields = ({ formData, errors, urgencyAnalysis, onInputChange }: FormFieldsProps) => {
  return (
    <>
      {/* Nome Completo */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
          Nome Completo *
        </Label>
        <Input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => onInputChange('fullName', e.target.value)}
          className={`transition-all duration-200 ${errors.fullName ? 'border-red-500 focus:border-red-500' : 'focus:border-vello-blue'}`}
          placeholder="Digite seu nome completo"
        />
        {errors.fullName && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          className={`transition-all duration-200 ${errors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-vello-blue'}`}
          placeholder="seu@email.com"
        />
        {errors.email && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Telefone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
          Telefone/WhatsApp *
        </Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => onInputChange('phone', e.target.value)}
          className={`transition-all duration-200 ${errors.phone ? 'border-red-500 focus:border-red-500' : 'focus:border-vello-blue'}`}
          placeholder="+55 (11) 99999-9999"
        />
        {errors.phone && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.phone}
          </p>
        )}
      </div>

      {/* Seletor de Serviços */}
      <ServiceSelector
        selectedServices={formData.services}
        onServicesChange={(services) => onInputChange('services', services)}
        error={errors.services}
      />

      {/* Descrição do Projeto */}
      <div className="space-y-2">
        <Label htmlFor="projectDescription" className="text-sm font-semibold text-gray-700">
          Descrição do Projeto *
        </Label>
        <Textarea
          id="projectDescription"
          value={formData.projectDescription}
          onChange={(e) => onInputChange('projectDescription', e.target.value)}
          className={`min-h-32 transition-all duration-200 ${errors.projectDescription ? 'border-red-500 focus:border-red-500' : 'focus:border-vello-blue'}`}
          placeholder="Descreva detalhadamente seu projeto, objetivos, prazo desejado e qualquer informação relevante..."
        />
        {errors.projectDescription && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.projectDescription}
          </p>
        )}
        
        {/* Indicador de Urgência em Tempo Real */}
        {urgencyAnalysis && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              🤖 Análise Automática de Prioridade:
            </h4>
            <UrgencyIndicator 
              level={urgencyAnalysis.level}
              score={urgencyAnalysis.score}
              reasons={urgencyAnalysis.reasons}
              showDetails={true}
            />
          </div>
        )}
      </div>

      {/* Aceite dos Termos */}
      <div className="flex items-start space-x-3">
        <Checkbox
          id="acceptTerms"
          checked={formData.acceptTerms}
          onCheckedChange={(checked) => onInputChange('acceptTerms', checked)}
          className={errors.acceptTerms ? 'border-red-500' : ''}
        />
        <Label htmlFor="acceptTerms" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
          Aceito os{' '}
          <a href="#" className="text-vello-blue hover:underline font-medium">
            termos de uso
          </a>{' '}
          e{' '}
          <a href="#" className="text-vello-blue hover:underline font-medium">
            política de privacidade
          </a>
          . Autorizo o contato da Vello Group para esclarecimentos sobre minha solicitação. *
        </Label>
      </div>
      {errors.acceptTerms && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors.acceptTerms}
        </p>
      )}
    </>
  );
};
