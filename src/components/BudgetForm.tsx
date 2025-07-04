import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { ServiceSelector } from './ServiceSelector';
import { UrgencyIndicator } from './UrgencyIndicator';
import { validateForm, formatPhoneNumber, FormData, classifyUrgency } from '@/utils/formUtils';
import { saveOrcamento } from '@/utils/supabaseHelpers';

export const BudgetForm = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    services: [],
    projectDescription: '',
    acceptTerms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [urgencyAnalysis, setUrgencyAnalysis] = useState<ReturnType<typeof classifyUrgency> | null>(null);
  const { toast } = useToast();

  console.log('BudgetForm rendered, formData:', formData);

  const handleInputChange = (field: keyof FormData, value: any) => {
    console.log('Input change:', field, value);
    
    let processedValue = value;
    
    if (field === 'phone') {
      processedValue = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));
    
    // Analisar urgência em tempo real quando a descrição muda
    if (field === 'projectDescription' && value.length > 20) {
      const analysis = classifyUrgency(value);
      setUrgencyAnalysis(analysis);
      console.log('Análise de urgência atualizada:', analysis);
    } else if (field === 'projectDescription' && value.length <= 20) {
      setUrgencyAnalysis(null);
    }
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started:', formData);
    
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos destacados.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Salvar no Supabase (com classificação automática de urgência)
      const result = await saveOrcamento({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        services: formData.services,
        projectDescription: formData.projectDescription,
      });

      // Enviar para o webhook n8n com dados organizados incluindo urgência
      try {
        const webhookUrl = 'https://xxruanxx.app.n8n.cloud/webhook-test/vello-form';
        
        const webhookData = {
          cliente: {
            nome_completo: formData.fullName,
            email: formData.email,
            telefone: formData.phone
          },
          projeto: {
            servicos_solicitados: formData.services,
            descricao_detalhada: formData.projectDescription,
            urgencia_detectada: result.urgencyAnalysis.level,
            pontuacao_urgencia: result.urgencyAnalysis.score,
            motivos_urgencia: result.urgencyAnalysis.reasons
          },
          metadados: {
            timestamp: new Date().toISOString(),
            origem: 'vello-form',
            user_agent: navigator.userAgent,
            url_origem: window.location.href,
            id_orcamento: result.data.id
          }
        };

        console.log('Enviando dados para n8n com análise de urgência:', webhookData);

        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
        });

        console.log('Webhook n8n enviado com sucesso');
      } catch (webhookError) {
        console.warn('Erro ao enviar webhook n8n (não crítico):', webhookError);
      }

      setSubmitSuccess(true);
      toast({
        title: "Orçamento enviado com sucesso! ✅",
        description: `Classificado como ${result.urgencyAnalysis.level.toUpperCase()}. Nossa equipe entrará em contato em breve.`,
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          services: [],
          projectDescription: '',
          acceptTerms: false
        });
        setSubmitSuccess(false);
        setUrgencyAnalysis(null);
      }, 3000);

    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Erro ao enviar orçamento",
        description: "Tente novamente ou entre em contato conosco diretamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Card className="max-w-2xl mx-auto animate-pulse-success">
        <CardContent className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-700 mb-2">Orçamento Enviado!</h3>
          <p className="text-gray-600 mb-4">
            Obrigado pelo seu interesse. Seus dados foram salvos com segurança em nosso banco de dados.
          </p>
          <p className="text-sm text-gray-500">
            Nossa equipe entrará em contato em até 24 horas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
          Solicite seu Orçamento
        </CardTitle>
        <CardDescription className="text-lg text-gray-600">
          Conte-nos sobre seu projeto e receba uma proposta personalizada
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome Completo */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
              Nome Completo *
            </Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
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
              onChange={(e) => handleInputChange('email', e.target.value)}
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
              onChange={(e) => handleInputChange('phone', e.target.value)}
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
            onServicesChange={(services) => handleInputChange('services', services)}
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
              onChange={(e) => handleInputChange('projectDescription', e.target.value)}
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
              onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
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

          {/* Botão de Envio */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 text-lg font-semibold bg-vello-orange hover:bg-vello-orange/90 transition-all duration-300 transform hover:scale-[1.02]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Salvando orçamento...
              </>
            ) : (
              'Solicitar Orçamento Gratuito'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
