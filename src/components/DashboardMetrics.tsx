
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, Calendar, Clock, Target, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type MetricsData = {
  totalOrcamentos: number;
  orcamentosEsteMes: number;
  taxaConversao: number;
  tempoMedioResposta: number;
  orcamentosPorStatus: Record<string, number>;
  orcamentosPorServico: Array<{ name: string; count: number }>;
  tendenciaMensal: Array<{ month: string; budgets: number; conversions: number }>;
  distribuicaoUrgencia: Array<{ name: string; value: number; color: string }>;
};

export const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      
      // Buscar dados dos orçamentos
      const { data: orcamentos, error: orcamentosError } = await supabase
        .from('orcamentos')
        .select('*');

      if (orcamentosError) throw orcamentosError;

      // Processar métricas
      const totalOrcamentos = orcamentos?.length || 0;
      
      // Orçamentos deste mês
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);
      
      const orcamentosEsteMes = orcamentos?.filter(o => 
        new Date(o.created_at) >= inicioMes
      ).length || 0;

      // Taxa de conversão (aprovados + finalizados)
      const orcamentosConvertidos = orcamentos?.filter(o => 
        o.status === 'aprovado' || o.status === 'finalizado'
      ).length || 0;
      const taxaConversao = totalOrcamentos > 0 ? (orcamentosConvertidos / totalOrcamentos) * 100 : 0;

      // Orçamentos por status
      const orcamentosPorStatus = orcamentos?.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Orçamentos por serviço
      const servicosCount = {} as Record<string, number>;
      orcamentos?.forEach(o => {
        o.servicos.forEach((servico: string) => {
          servicosCount[servico] = (servicosCount[servico] || 0) + 1;
        });
      });
      
      const orcamentosPorServico = Object.entries(servicosCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Distribuição de urgência
      const urgenciaCount = orcamentos?.reduce((acc, o) => {
        acc[o.urgencia || 'low'] = (acc[o.urgencia || 'low'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const distribuicaoUrgencia = [
        { name: 'Baixa', value: urgenciaCount.low || 0, color: '#10B981' },
        { name: 'Média', value: urgenciaCount.medium || 0, color: '#F59E0B' },
        { name: 'Alta', value: urgenciaCount.high || 0, color: '#EF4444' },
        { name: 'Urgente', value: urgenciaCount.urgent || 0, color: '#DC2626' }
      ];

      // Tendência mensal (últimos 6 meses)
      const tendenciaMensal = [];
      for (let i = 5; i >= 0; i--) {
        const mes = new Date();
        mes.setMonth(mes.getMonth() - i);
        const inicioMes = new Date(mes.getFullYear(), mes.getMonth(), 1);
        const fimMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0);
        
        const orcamentosDoMes = orcamentos?.filter(o => {
          const dataOrcamento = new Date(o.created_at);
          return dataOrcamento >= inicioMes && dataOrcamento <= fimMes;
        }) || [];
        
        const conversoesDoMes = orcamentosDoMes.filter(o => 
          o.status === 'aprovado' || o.status === 'finalizado'
        ).length;

        tendenciaMensal.push({
          month: mes.toLocaleDateString('pt-BR', { month: 'short' }),
          budgets: orcamentosDoMes.length,
          conversions: conversoesDoMes
        });
      }

      setMetrics({
        totalOrcamentos,
        orcamentosEsteMes,
        taxaConversao: Number(taxaConversao.toFixed(1)),
        tempoMedioResposta: 2.3, // Valor fixo por enquanto
        orcamentosPorStatus,
        orcamentosPorServico,
        tendenciaMensal,
        distribuicaoUrgencia
      });

    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
      toast({
        title: "Erro ao carregar métricas",
        description: "Não foi possível carregar as métricas do dashboard.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            Carregando métricas...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Orçamentos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOrcamentos}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
              Dados em tempo real
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.orcamentosEsteMes}</div>
            <p className="text-xs text-muted-foreground">
              Meta: 80 orçamentos
            </p>
            <Progress value={(metrics.orcamentosEsteMes / 80) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.taxaConversao}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
              Aprovados + Finalizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Resposta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.tempoMedioResposta}h</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline w-3 h-3 mr-1 text-green-500" />
              Meta: &lt; 24h
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência Mensal</CardTitle>
            <CardDescription>
              Orçamentos recebidos e conversões por mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.tendenciaMensal}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="budgets" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Orçamentos"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="conversions" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Conversões"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orçamentos por Serviço */}
        <Card>
          <CardHeader>
            <CardTitle>Orçamentos por Serviço</CardTitle>
            <CardDescription>
              Distribuição dos serviços mais solicitados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.orcamentosPorServico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Urgência e Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição de Urgência - Agora com gráfico de colunas */}
        <Card>
          <CardHeader>
            <CardTitle>Classificação de Urgência</CardTitle>
            <CardDescription>
              Distribuição por nível de urgência
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.distribuicaoUrgencia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]}
                  >
                    {metrics.distribuicaoUrgencia.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status dos Orçamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Status dos Orçamentos</CardTitle>
            <CardDescription>
              Acompanhamento do pipeline de vendas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(metrics.orcamentosPorStatus).map(([status, count]) => {
              const percentage = (count / metrics.totalOrcamentos) * 100;
              const statusLabels: Record<string, string> = {
                pendente: 'Pendentes',
                em_analise: 'Em Análise',
                aprovado: 'Aprovados',
                rejeitado: 'Rejeitados',
                finalizado: 'Finalizados'
              };
              
              return (
                <div key={status}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{statusLabels[status] || status}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{count}</Badge>
                      <span className="text-sm text-gray-500">{percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
