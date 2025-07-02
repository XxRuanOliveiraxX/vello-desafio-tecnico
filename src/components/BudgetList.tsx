import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Filter, Download, Eye, Mail, MessageSquare, RefreshCw } from 'lucide-react';
import { getOrcamentos, updateOrcamentoStatus, updateOrcamentoUrgencia } from '@/utils/supabaseHelpers';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type StatusOrcamento = Database['public']['Enums']['status_orcamento'];

type Orcamento = {
  id: string;
  nome_completo: string;
  email: string;
  telefone: string;
  servicos: string[];
  descricao_projeto: string;
  urgencia: string;
  status: string;
  valor_estimado?: number;
  created_at: string;
  updated_at: string;
};

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'low': return 'bg-gray-100 text-gray-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'urgent': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pendente': return 'bg-gray-100 text-gray-800';
    case 'em_analise': return 'bg-blue-100 text-blue-800';
    case 'aprovado': return 'bg-green-100 text-green-800';
    case 'rejeitado': return 'bg-red-100 text-red-800';
    case 'finalizado': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    pendente: 'Pendente',
    em_analise: 'Em Análise',
    aprovado: 'Aprovado',
    rejeitado: 'Rejeitado',
    finalizado: 'Finalizado'
  };
  return statusMap[status] || status;
};

const formatUrgency = (urgency: string) => {
  const urgencyMap: Record<string, string> = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    urgent: 'Urgente'
  };
  return urgencyMap[urgency] || urgency;
};

export const BudgetList = () => {
  const [budgets, setBudgets] = useState<Orcamento[]>([]);
  const [filteredBudgets, setFilteredBudgets] = useState<Orcamento[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadOrcamentos = async () => {
    try {
      setIsLoading(true);
      const data = await getOrcamentos();
      setBudgets(data || []);
      setFilteredBudgets(data || []);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      toast({
        title: "Erro ao carregar orçamentos",
        description: "Não foi possível carregar a lista de orçamentos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrcamentos();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterBudgets(value, statusFilter, urgencyFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    filterBudgets(searchTerm, value, urgencyFilter);
  };

  const handleUrgencyFilter = (value: string) => {
    setUrgencyFilter(value);
    filterBudgets(searchTerm, statusFilter, value);
  };

  const filterBudgets = (search: string, status: string, urgency: string) => {
    let filtered = budgets;

    if (search) {
      filtered = filtered.filter(budget =>
        budget.nome_completo.toLowerCase().includes(search.toLowerCase()) ||
        budget.email.toLowerCase().includes(search.toLowerCase()) ||
        budget.servicos.some(service => 
          service.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter(budget => budget.status === status);
    }

    if (urgency !== 'all') {
      filtered = filtered.filter(budget => budget.urgencia === urgency);
    }

    setFilteredBudgets(filtered);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateOrcamentoStatus(id, newStatus as StatusOrcamento);
      toast({
        title: "Status atualizado",
        description: `Status do orçamento atualizado para ${formatStatus(newStatus)}.`,
      });
      // Recarregar lista
      loadOrcamentos();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do orçamento.",
        variant: "destructive",
      });
    }
  };

  const handleUrgencyUpdate = async (id: string, newUrgency: string) => {
    try {
      await updateOrcamentoUrgencia(id, newUrgency);
      toast({
        title: "Urgência atualizada",
        description: `Urgência do orçamento atualizada para ${formatUrgency(newUrgency)}.`,
      });
      // Recarregar lista
      loadOrcamentos();
    } catch (error) {
      console.error('Erro ao atualizar urgência:', error);
      toast({
        title: "Erro ao atualizar urgência",
        description: "Não foi possível atualizar a urgência do orçamento.",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Nome', 'Email', 'Telefone', 'Serviços', 'Status', 'Urgência', 'Data'],
      ...filteredBudgets.map(budget => [
        budget.id,
        budget.nome_completo,
        budget.email,
        budget.telefone,
        budget.servicos.join('; '),
        formatStatus(budget.status),
        formatUrgency(budget.urgencia),
        new Date(budget.created_at).toLocaleDateString('pt-BR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orcamentos.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          Carregando orçamentos...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lista de Orçamentos</CardTitle>
            <CardDescription>
              Gerencie todos os orçamentos recebidos ({filteredBudgets.length} de {budgets.length})
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadOrcamentos} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome, email ou serviço..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em_analise">Em Análise</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="rejeitado">Rejeitado</SelectItem>
              <SelectItem value="finalizado">Finalizado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={urgencyFilter} onValueChange={handleUrgencyFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Urgência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Urgências</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabela */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Serviços</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Urgência</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBudgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{budget.nome_completo}</div>
                      <div className="text-sm text-gray-500">{budget.email}</div>
                      <div className="text-xs text-gray-400">{budget.telefone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {budget.servicos.map((service, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={budget.status} 
                      onValueChange={(value) => handleStatusUpdate(budget.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={getStatusColor(budget.status)}>
                          {formatStatus(budget.status)}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="em_analise">Em Análise</SelectItem>
                        <SelectItem value="aprovado">Aprovado</SelectItem>
                        <SelectItem value="rejeitado">Rejeitado</SelectItem>
                        <SelectItem value="finalizado">Finalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={budget.urgencia} 
                      onValueChange={(value) => handleUrgencyUpdate(budget.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={getUrgencyColor(budget.urgencia)}>
                          {formatUrgency(budget.urgencia)}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(budget.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Orçamento</DialogTitle>
                            <DialogDescription>
                              Informações completas do cliente e projeto
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <strong>Nome:</strong> {budget.nome_completo}
                              </div>
                              <div>
                                <strong>Email:</strong> {budget.email}
                              </div>
                              <div>
                                <strong>Telefone:</strong> {budget.telefone}
                              </div>
                              <div>
                                <strong>Status:</strong>{' '}
                                <Badge className={getStatusColor(budget.status)}>
                                  {formatStatus(budget.status)}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <strong>Serviços:</strong>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {budget.servicos.map((service, index) => (
                                  <Badge key={index} variant="outline">
                                    {service}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <strong>Descrição do Projeto:</strong>
                              <p className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                                {budget.descricao_projeto}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Enviar Email"
                        onClick={() => window.open(`mailto:${budget.email}`, '_blank')}
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="WhatsApp"
                        onClick={() => window.open(`https://wa.me/${budget.telefone.replace(/\D/g, '')}`, '_blank')}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredBudgets.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            Nenhum orçamento encontrado com os filtros aplicados.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
