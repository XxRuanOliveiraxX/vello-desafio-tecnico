
-- Criar enum para status dos orçamentos
CREATE TYPE public.status_orcamento AS ENUM ('pendente', 'em_analise', 'aprovado', 'rejeitado', 'finalizado');

-- Criar enum para tipos de eventos
CREATE TYPE public.tipo_evento AS ENUM ('orcamento_recebido', 'email_enviado', 'webhook_disparado', 'status_alterado');

-- Criar enum para níveis de log
CREATE TYPE public.nivel_log AS ENUM ('info', 'warning', 'error', 'success');

-- Tabela de orçamentos com criptografia para dados sensíveis
CREATE TABLE public.orcamentos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome_completo TEXT NOT NULL,
    email_criptografado TEXT NOT NULL, -- dados criptografados
    telefone_criptografado TEXT NOT NULL, -- dados criptografados
    servicos TEXT[] NOT NULL DEFAULT '{}',
    descricao_projeto TEXT NOT NULL,
    urgencia TEXT DEFAULT 'low' CHECK (urgencia IN ('low', 'medium', 'high', 'urgent')),
    status status_orcamento NOT NULL DEFAULT 'pendente',
    valor_estimado DECIMAL(10,2),
    observacoes TEXT,
    ip_origem INET,
    user_agent TEXT,
    origem TEXT DEFAULT 'web',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de logs de eventos
CREATE TABLE public.logs_eventos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    orcamento_id UUID REFERENCES public.orcamentos(id) ON DELETE SET NULL,
    tipo_evento tipo_evento NOT NULL,
    nivel nivel_log NOT NULL DEFAULT 'info',
    mensagem TEXT NOT NULL,
    detalhes JSONB,
    ip_origem INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de logs de erros
CREATE TABLE public.logs_erros (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    orcamento_id UUID REFERENCES public.orcamentos(id) ON DELETE SET NULL,
    tipo_erro TEXT NOT NULL,
    nivel nivel_log NOT NULL DEFAULT 'error',
    mensagem TEXT NOT NULL,
    stack_trace TEXT,
    detalhes JSONB,
    ip_origem INET,
    user_agent TEXT,
    resolvido BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs_eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs_erros ENABLE ROW LEVEL SECURITY;

-- Políticas RLS permissivas para acesso administrativo
-- Em produção, estas devem ser mais restritivas com base em roles de usuário
CREATE POLICY "Permitir acesso total aos orçamentos" ON public.orcamentos
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso total aos logs de eventos" ON public.logs_eventos
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso total aos logs de erros" ON public.logs_erros
    FOR ALL USING (true) WITH CHECK (true);

-- Índices para performance
CREATE INDEX idx_orcamentos_status ON public.orcamentos(status);
CREATE INDEX idx_orcamentos_created_at ON public.orcamentos(created_at);
CREATE INDEX idx_orcamentos_urgencia ON public.orcamentos(urgencia);
CREATE INDEX idx_logs_eventos_tipo ON public.logs_eventos(tipo_evento);
CREATE INDEX idx_logs_eventos_created_at ON public.logs_eventos(created_at);
CREATE INDEX idx_logs_erros_resolvido ON public.logs_erros(resolvido);
CREATE INDEX idx_logs_erros_created_at ON public.logs_erros(created_at);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at nos orçamentos
CREATE TRIGGER update_orcamentos_updated_at 
    BEFORE UPDATE ON public.orcamentos 
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Função para registrar eventos automaticamente
CREATE OR REPLACE FUNCTION public.registrar_evento_orcamento()
RETURNS TRIGGER AS $$
BEGIN
    -- Registrar evento de criação
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.logs_eventos (
            orcamento_id, 
            tipo_evento, 
            nivel, 
            mensagem, 
            detalhes,
            ip_origem
        ) VALUES (
            NEW.id,
            'orcamento_recebido',
            'info',
            'Novo orçamento recebido: ' || NEW.nome_completo,
            jsonb_build_object(
                'servicos', NEW.servicos,
                'urgencia', NEW.urgencia,
                'origem', NEW.origem
            ),
            NEW.ip_origem
        );
        RETURN NEW;
    END IF;
    
    -- Registrar evento de alteração de status
    IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        INSERT INTO public.logs_eventos (
            orcamento_id, 
            tipo_evento, 
            nivel, 
            mensagem, 
            detalhes
        ) VALUES (
            NEW.id,
            'status_alterado',
            'info',
            'Status alterado de ' || OLD.status || ' para ' || NEW.status,
            jsonb_build_object(
                'status_anterior', OLD.status,
                'status_novo', NEW.status
            )
        );
        RETURN NEW;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para registrar eventos automaticamente
CREATE TRIGGER trigger_registrar_evento_orcamento
    AFTER INSERT OR UPDATE ON public.orcamentos
    FOR EACH ROW EXECUTE PROCEDURE public.registrar_evento_orcamento();

-- View para orçamentos pendentes
CREATE VIEW public.view_orcamentos_pendentes AS
SELECT 
    id,
    nome_completo,
    servicos,
    urgencia,
    created_at,
    CASE 
        WHEN urgencia = 'urgent' THEN 1
        WHEN urgencia = 'high' THEN 2
        WHEN urgencia = 'medium' THEN 3
        ELSE 4
    END as prioridade_ordem
FROM public.orcamentos 
WHERE status = 'pendente'
ORDER BY prioridade_ordem, created_at;

-- View para orçamentos por serviço
CREATE VIEW public.view_orcamentos_por_servico AS
SELECT 
    unnest(servicos) as servico,
    COUNT(*) as total_orcamentos,
    COUNT(CASE WHEN status = 'pendente' THEN 1 END) as pendentes,
    COUNT(CASE WHEN status = 'aprovado' THEN 1 END) as aprovados,
    COUNT(CASE WHEN status = 'rejeitado' THEN 1 END) as rejeitados,
    AVG(CASE WHEN valor_estimado IS NOT NULL THEN valor_estimado END) as valor_medio
FROM public.orcamentos 
GROUP BY unnest(servicos)
ORDER BY total_orcamentos DESC;

-- Função para criptografar dados sensíveis (usar com pgcrypto)
-- Primeiro habilitar a extensão pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Função para criptografar email
CREATE OR REPLACE FUNCTION public.criptografar_email(email_texto TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(encrypt(email_texto::bytea, 'chave_secreta_email', 'aes'), 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para descriptografar email
CREATE OR REPLACE FUNCTION public.descriptografar_email(email_criptografado TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN convert_from(decrypt(decode(email_criptografado, 'base64'), 'chave_secreta_email', 'aes'), 'UTF8');
EXCEPTION
    WHEN OTHERS THEN
        RETURN '[ERRO_DESCRIPTOGRAFIA]';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para criptografar telefone
CREATE OR REPLACE FUNCTION public.criptografar_telefone(telefone_texto TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(encrypt(telefone_texto::bytea, 'chave_secreta_telefone', 'aes'), 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para descriptografar telefone
CREATE OR REPLACE FUNCTION public.descriptografar_telefone(telefone_criptografado TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN convert_from(decrypt(decode(telefone_criptografado, 'base64'), 'chave_secreta_telefone', 'aes'), 'UTF8');
EXCEPTION
    WHEN OTHERS THEN
        RETURN '[ERRO_DESCRIPTOGRAFIA]';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View administrativa para visualizar dados descriptografados (apenas para admins)
CREATE VIEW public.view_orcamentos_admin AS
SELECT 
    id,
    nome_completo,
    public.descriptografar_email(email_criptografado) as email,
    public.descriptografar_telefone(telefone_criptografado) as telefone,
    servicos,
    descricao_projeto,
    urgencia,
    status,
    valor_estimado,
    observacoes,
    created_at,
    updated_at
FROM public.orcamentos;
