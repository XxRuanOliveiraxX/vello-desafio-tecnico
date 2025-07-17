
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { validateForm, formatPhoneNumber, FormData, classifyUrgency } from '@/utils/formUtils';
import { saveOrcamento } from '@/utils/supabaseHelpers';

export const useBudgetForm = () => {
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

  console.log('BudgetForm hook, formData:', formData);

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
        const webhookUrl = 'https://ruan-test.app.n8n.cloud/webhook-test/vello-form';
        
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

  return {
    formData,
    isSubmitting,
    submitSuccess,
    errors,
    urgencyAnalysis,
    handleInputChange,
    handleSubmit
  };
};
