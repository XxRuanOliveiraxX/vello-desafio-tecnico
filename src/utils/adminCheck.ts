
import { supabase } from '@/integrations/supabase/client';

export const checkUserIsAdmin = async (userId: string): Promise<boolean> => {
  try {
    // Fazer uma consulta direta usando SQL customizado
    const { data, error } = await supabase
      .from('orcamentos') // Usar uma tabela existente para fazer a consulta
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Database connection error:', error);
      return false;
    }

    // Se a consulta funcionou, fazer uma segunda consulta para verificar admin
    // Usar uma abordagem que funciona com RLS
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    // Por enquanto, vamos considerar que qualquer usuário autenticado com o email correto é admin
    const adminEmails = ['admin@vellogroup.com'];
    return adminEmails.includes(user.email || '');
    
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
