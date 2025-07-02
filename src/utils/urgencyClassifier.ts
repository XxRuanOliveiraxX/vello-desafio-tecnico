
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'urgent';

interface KeywordPattern {
  keywords: string[];
  weight: number;
  level: UrgencyLevel;
}

const urgencyPatterns: KeywordPattern[] = [
  // Urgente - Palavras que indicam necessidade imediata
  {
    keywords: ['urgente', 'emergência', 'crítico', 'parado', 'hoje', 'agora', 'imediato', 'emergencial', 'preciso hoje', 'não funciona', 'quebrou', 'caiu'],
    weight: 10,
    level: 'urgent'
  },
  
  // Alta prioridade - Indicam prazo curto ou importância alta
  {
    keywords: ['rápido', 'prazo curto', 'esta semana', 'importante', 'prioridade', 'logo', 'breve', 'até sexta', 'final da semana', 'cliente esperando'],
    weight: 7,
    level: 'high'
  },
  
  // Média prioridade - Prazos moderados
  {
    keywords: ['próxima semana', 'próximo mês', 'médio prazo', '15 dias', 'quinze dias', 'mês que vem', 'moderado'],
    weight: 5,
    level: 'medium'
  },
  
  // Baixa prioridade - Sem pressa ou prazos longos
  {
    keywords: ['quando possível', 'sem pressa', 'longo prazo', 'futuro', 'eventualmente', 'não urgente', 'flexível', 'posso esperar'],
    weight: 2,
    level: 'low'
  }
];

const contextPatterns = [
  // Contextos que aumentam urgência
  {
    keywords: ['lançamento', 'entrega', 'cliente', 'apresentação', 'reunião', 'deadline', 'prazo'],
    multiplier: 1.5
  },
  
  // Problemas técnicos que indicam urgência
  {
    keywords: ['erro', 'bug', 'problema', 'falha', 'não abre', 'travando', 'lento'],
    multiplier: 2.0
  },
  
  // Indicadores de planejamento (reduz urgência)
  {
    keywords: ['planejando', 'pensando', 'considerando', 'avaliando', 'pesquisando'],
    multiplier: 0.5
  }
];

export const classifyUrgency = (description: string): {
  level: UrgencyLevel;
  score: number;
  reasons: string[];
} => {
  if (!description || description.trim().length < 10) {
    return {
      level: 'medium',
      score: 5,
      reasons: ['Descrição muito curta para análise precisa']
    };
  }

  const lowerDescription = description.toLowerCase();
  let totalScore = 0;
  let maxLevel: UrgencyLevel = 'low';
  const foundReasons: string[] = [];

  // Analisar padrões de urgência
  urgencyPatterns.forEach(pattern => {
    const foundKeywords = pattern.keywords.filter(keyword => 
      lowerDescription.includes(keyword)
    );

    if (foundKeywords.length > 0) {
      let patternScore = pattern.weight * foundKeywords.length;
      
      // Aplicar multiplicadores de contexto
      contextPatterns.forEach(context => {
        const contextKeywords = context.keywords.filter(keyword =>
          lowerDescription.includes(keyword)
        );
        
        if (contextKeywords.length > 0) {
          patternScore *= context.multiplier;
        }
      });

      totalScore += patternScore;
      
      if (getUrgencyValue(pattern.level) > getUrgencyValue(maxLevel)) {
        maxLevel = pattern.level;
      }

      foundReasons.push(
        `Encontradas palavras de ${pattern.level}: ${foundKeywords.join(', ')}`
      );
    }
  });

  // Análise adicional baseada em comprimento e detalhamento
  if (description.length > 500) {
    totalScore += 2; // Descrições longas e detalhadas podem indicar complexidade
    foundReasons.push('Descrição detalhada indica projeto complexo');
  }

  // Análise de pontuação e tom
  const exclamationCount = (description.match(/!/g) || []).length;
  if (exclamationCount > 2) {
    totalScore += 3;
    foundReasons.push('Tom urgente detectado (múltiplas exclamações)');
  }

  // Determinar nível final baseado na pontuação
  let finalLevel: UrgencyLevel;
  if (totalScore >= 15) {
    finalLevel = 'urgent';
  } else if (totalScore >= 10) {
    finalLevel = 'high';
  } else if (totalScore >= 5) {
    finalLevel = 'medium';
  } else {
    finalLevel = 'low';
  }

  // Se não encontrou nenhum padrão específico, usar nível médio
  if (foundReasons.length === 0) {
    foundReasons.push('Nenhum indicador específico de urgência encontrado');
    finalLevel = 'medium';
    totalScore = 5;
  }

  return {
    level: finalLevel,
    score: Math.round(totalScore),
    reasons: foundReasons
  };
};

const getUrgencyValue = (level: UrgencyLevel): number => {
  switch (level) {
    case 'low': return 1;
    case 'medium': return 2;
    case 'high': return 3;
    case 'urgent': return 4;
    default: return 2;
  }
};

export const getUrgencyLabel = (level: UrgencyLevel): string => {
  switch (level) {
    case 'low': return 'Baixa';
    case 'medium': return 'Média';
    case 'high': return 'Alta';
    case 'urgent': return 'Urgente';
    default: return 'Média';
  }
};

export const getUrgencyColor = (level: UrgencyLevel): string => {
  switch (level) {
    case 'low': return 'text-gray-600 bg-gray-100';
    case 'medium': return 'text-yellow-700 bg-yellow-100';
    case 'high': return 'text-orange-700 bg-orange-100';
    case 'urgent': return 'text-red-700 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};
