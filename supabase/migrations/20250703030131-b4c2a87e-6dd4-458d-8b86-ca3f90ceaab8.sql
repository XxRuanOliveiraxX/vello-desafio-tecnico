
-- Criar tabela de perfis de usuários administrativos
CREATE TABLE public.admin_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela admin_profiles
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Política para permitir que admins vejam todos os perfis
CREATE POLICY "Admins can view all admin profiles" 
ON public.admin_profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles ap 
    WHERE ap.user_id = auth.uid() AND ap.active = true
  )
);

-- Política para permitir que admins atualizem perfis
CREATE POLICY "Admins can update admin profiles" 
ON public.admin_profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles ap 
    WHERE ap.user_id = auth.uid() AND ap.active = true
  )
);

-- Função para verificar se um usuário é admin ativo
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE user_id = $1 AND active = true
  );
$$;

-- Atualizar políticas das tabelas existentes para usar autenticação
DROP POLICY IF EXISTS "Permitir acesso total aos orçamentos" ON public.orcamentos;
CREATE POLICY "Admins can access all orcamentos" 
ON public.orcamentos 
FOR ALL 
USING (public.is_admin());

DROP POLICY IF EXISTS "Permitir acesso total aos logs de eventos" ON public.logs_eventos;
CREATE POLICY "Admins can access all logs_eventos" 
ON public.logs_eventos 
FOR ALL 
USING (public.is_admin());

DROP POLICY IF EXISTS "Permitir acesso total aos logs de erros" ON public.logs_erros;
CREATE POLICY "Admins can access all logs_erros" 
ON public.logs_erros 
FOR ALL 
USING (public.is_admin());

-- Trigger para atualizar updated_at
CREATE OR REPLACE TRIGGER update_admin_profiles_updated_at
    BEFORE UPDATE ON public.admin_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir um usuário admin inicial (você pode alterar o email)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@vellogroup.com',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (email) DO NOTHING;

-- Inserir perfil admin correspondente
INSERT INTO public.admin_profiles (user_id, email, role, active)
SELECT id, email, 'admin', true 
FROM auth.users 
WHERE email = 'admin@vellogroup.com'
ON CONFLICT (user_id) DO NOTHING;
