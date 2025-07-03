
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardMetrics } from './DashboardMetrics';
import { BudgetList } from './BudgetList';
import { SystemLogs } from './SystemLogs';
import { BarChart3, Users, TrendingUp, Settings, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthLogin } from './AuthLogin';

export const AdminPanel = () => {
  const { user, loading, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Verificando autenticação...</span>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AuthLogin />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo, {user.email} - Gerencie orçamentos e monitore métricas do sistema
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="budgets" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Orçamentos
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Análises
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardMetrics />
        </TabsContent>

        <TabsContent value="budgets">
          <BudgetList />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Análises Avançadas</CardTitle>
              <CardDescription>
                Relatórios detalhados e insights de performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                Módulo de análises em desenvolvimento...
                <br />
                <small>Integrações com Google Analytics e ferramentas de BI</small>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <SystemLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
};
