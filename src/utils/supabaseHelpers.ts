import { supabase } from '@/integrations/supabase/client';
import { classifyUrgency } from './urgencyClassifier';
import type { Database } from '@/integrations/supabase/types';

type StatusOrcamento = Database['public']['Enums']['status_orcamento'];

export const saveOrcamento = async (formData: {
  fullName: string;
  email: string;
  phone: string;
  services: string[];
  projectDescription: string;
}) => {
  try {
    console.log('Salvando orçamento no Supabase:', formData);

    // Classificar urgência automaticamente usando IA
    const urgencyAnalysis = classifyUrgency(formData.projectDescription);
    console.log('Análise de urgência:', urgencyAnalysis);

    // Usar as funções de criptografia do Supabase
    const { data: emailCriptografado } = await supabase.rpc('criptografar_email', {
      email_texto: formData.email
    });

    const { data: telefoneCriptografado } = await supabase.rpc('criptografar_telefone', {
      telefone_texto: formData.phone
    });

    if (!emailCriptografado || !telefoneCriptografado) {
      throw new Error('Erro ao criptografar dados sensíveis');
    }

    // Salvar no banco de dados com urgência classificada automaticamente
    const { data, error } = await supabase
      .from('orcamentos')
      .insert({
        nome_completo: formData.fullName,
        email_criptografado: emailCriptografado,
        telefone_criptografado: telefoneCriptografado,
        servicos: formData.services,
        descricao_projeto: formData.projectDescription,
        urgencia: urgencyAnalysis.level, // IA classificou automaticamente
        status: 'pendente',
        origem: 'web',
        ip_origem: null,
        user_agent: navigator.userAgent
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar orçamento:', error);
      throw error;
    }

    console.log('Orçamento salvo com sucesso com urgência:', urgencyAnalysis.level, data);
    return { data, urgencyAnalysis };
  } catch (error) {
    console.error('Erro no saveOrcamento:', error);
    throw error;
  }
};

export const getOrcamentos = async () => {
  try {
    const { data, error } = await supabase
      .from('view_orcamentos_admin')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar orçamentos:', error);
    throw error;
  }
};

export const getLogsEventos = async () => {
  try {
    const { data, error } = await supabase
      .from('logs_eventos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar logs de eventos:', error);
    throw error;
  }
};

export const getLogsErros = async () => {
  try {
    const { data, error } = await supabase
      .from('logs_erros')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar logs de erros:', error);
    throw error;
  }
};

export const updateOrcamentoStatus = async (id: string, status: StatusOrcamento) => {
  try {
    const { data, error } = await supabase
      .from('orcamentos')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao atualizar status do orçamento:', error);
    throw error;
  }
};

export const updateOrcamentoUrgencia = async (id: string, urgencia: string) => {
  try {
    // Buscar dados atuais do orçamento para logging
    const { data: orcamentoAtual, error: fetchError } = await supabase
      .from('orcamentos')
      .select('urgencia, nome_completo')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Atualizar urgência
    const { data, error } = await supabase
      .from('orcamentos')
      .update({ urgencia })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Registrar evento de alteração de urgência nos logs
    const { error: logError } = await supabase
      .from('logs_eventos')
      .insert({
        orcamento_id: id,
        tipo_evento: 'status_alterado',
        nivel: 'info',
        mensagem: `Urgência alterada de ${orcamentoAtual.urgencia} para ${urgencia} para ${orcamentoAtual.nome_completo}`,
        detalhes: {
          urgencia_anterior: orcamentoAtual.urgencia,
          urgencia_nova: urgencia,
          alterado_manualmente: true
        }
      });

    if (logError) {
      console.error('Erro ao registrar log de alteração de urgência:', logError);
    }

    return data;
  } catch (error) {
    console.error('Erro ao atualizar urgência do orçamento:', error);
    throw error;
  }
};
