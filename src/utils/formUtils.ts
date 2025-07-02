
import { classifyUrgency, UrgencyLevel } from './urgencyClassifier';

export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  services: string[];
  projectDescription: string;
  acceptTerms: boolean;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateForm = (data: FormData): FormValidation => {
  const errors: Record<string, string> = {};

  // Nome completo
  if (!data.fullName.trim()) {
    errors.fullName = 'Nome completo é obrigatório';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Nome deve ter pelo menos 2 caracteres';
  } else if (data.fullName.trim().split(' ').length < 2) {
    errors.fullName = 'Por favor, digite nome e sobrenome';
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim()) {
    errors.email = 'Email é obrigatório';
  } else if (!emailRegex.test(data.email)) {
    errors.email = 'Email inválido';
  }

  // Telefone
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  if (!data.phone.trim()) {
    errors.phone = 'Telefone é obrigatório';
  } else if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
    errors.phone = 'Telefone inválido. Use formato: +55 (11) 99999-9999';
  }

  // Serviços
  if (data.services.length === 0) {
    errors.services = 'Selecione pelo menos um serviço';
  }

  // Descrição do projeto
  if (!data.projectDescription.trim()) {
    errors.projectDescription = 'Descrição do projeto é obrigatória';
  } else if (data.projectDescription.trim().length < 20) {
    errors.projectDescription = 'Descrição deve ter pelo menos 20 caracteres';
  } else if (data.projectDescription.trim().length > 2000) {
    errors.projectDescription = 'Descrição muito longa (máximo 2000 caracteres)';
  }

  // Aceite dos termos
  if (!data.acceptTerms) {
    errors.acceptTerms = 'É necessário aceitar os termos de uso';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove tudo exceto números e o sinal de +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Se começar com + mantenha, senão adicione +55
  let formatted = cleaned;
  
  if (!formatted.startsWith('+')) {
    // Se tem 11 dígitos, assumir que é BR sem código do país
    if (formatted.length === 11) {
      formatted = '+55' + formatted;
    }
    // Se tem 10 dígitos, assumir BR sem código do país e sem 9
    else if (formatted.length === 10) {
      formatted = '+55' + formatted;
    }
    // Se não começar com +, adicionar +55
    else if (formatted.length > 0) {
      formatted = '+55' + formatted;
    }
  }
  
  // Formato: +55 (11) 99999-9999
  if (formatted.length >= 13) {
    const countryCode = formatted.slice(0, 3);
    const areaCode = formatted.slice(3, 5);
    const firstPart = formatted.slice(5, 10);
    const secondPart = formatted.slice(10, 14);
    
    return `${countryCode} (${areaCode}) ${firstPart}-${secondPart}`;
  }
  
  return formatted;
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

// Usar o novo classificador de urgência
export { classifyUrgency, getUrgencyLabel, getUrgencyColor } from './urgencyClassifier';
