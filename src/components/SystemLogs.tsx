
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, RefreshCw, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { getLogsEventos, getLogsErros } from '@/utils/supabaseHelpers';
import { useToast } from '@/hooks/use-toast';

type LogEvento = {
  id: string;
  orcamento_id?: string;
  tipo_evento: string;
  nivel: string;
  mensagem: string;
  detalhes?: any;
  created_at: string;
};

type LogErro = {
  id: string;
  orcamento_id?: string;
  tipo_erro: string;
  nivel: string;
  mensagem: string;
  stack_trace?: string;
  detalhes?: any;
  resolvido: boolean;
  created_at: string;
  resolved_at?: string;
};

const getLogIcon = (nivel: string) => {
  switch (nivel) {
    case 'info':
      return <Info className="w-4 h-4 text-blue-500" />;
    case 'success':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'error':
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Info className="w-4 h-4 text-gray-500" />;
  }
};

const getLogColor = (nivel: string) => {
  switch (nivel) {
    case 'info':
      return 'bg-blue-100 text-blue-800';
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    case 'error':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const SystemLogs = () => {
  const [eventLogs, setEventLogs] = useState<LogEvento[]>([]);
  const [errorLogs, setErrorLogs] = useState<LogErro[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const [eventos, erros] = await Promise.all([
        getLogsEventos(),
        getLogsErros()
      ]);
      
      setEventLogs(eventos || []);
      setErrorLogs(erros || []);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      toast({
        title: "Erro ao carregar logs",
        description: "Não foi possível carregar os logs do sistema.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const filteredEventLogs = eventLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.mensagem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.tipo_evento.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || log.nivel === levelFilter;
    
    return matchesSearch && matchesLevel;
  });

  const filteredErrorLogs = errorLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.mensagem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.tipo_erro.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || log.nivel === levelFilter;
    
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Logs do Sistema</CardTitle>
              <CardDescription>
                Monitore eventos e erros em tempo real
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={loadLogs}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar em logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Sucesso</SelectItem>
                <SelectItem value="warning">Aviso</SelectItem>
                <SelectItem value="error">Erro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="events" className="space-y-4">
            <TabsList>
              <TabsTrigger value="events">
                Eventos ({eventLogs.length})
              </TabsTrigger>
              <TabsTrigger value="errors">
                Erros ({errorLogs.filter(log => !log.resolvido).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="events">
              <div className="space-y-3">
                {isLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Carregando eventos...
                  </div>
                ) : (
                  <>
                    {filteredEventLogs.map((log) => (
                      <div key={log.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getLogIcon(log.nivel)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={getLogColor(log.nivel)}>
                                  {log.nivel.toUpperCase()}
                                </Badge>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {log.tipo_evento}
                                </code>
                              </div>
                              <p className="text-sm text-gray-900 mb-2">{log.mensagem}</p>
                              {log.detalhes && (
                                <div className="text-xs bg-gray-50 p-2 rounded font-mono">
                                  {JSON.stringify(log.detalhes, null, 2)}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 ml-4">
                            {formatTimestamp(log.created_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredEventLogs.length === 0 && !isLoading && (
                      <div className="text-center py-8 text-gray-500">
                        Nenhum evento encontrado.
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="errors">
              <div className="space-y-3">
                {isLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Carregando erros...
                  </div>
                ) : (
                  <>
                    {filteredErrorLogs.map((log) => (
                      <div key={log.id} className={`border rounded-lg p-4 ${log.resolvido ? 'bg-gray-50' : 'bg-white'}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getLogIcon(log.nivel)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={getLogColor(log.nivel)}>
                                  {log.nivel.toUpperCase()}
                                </Badge>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {log.tipo_erro}
                                </code>
                                {log.resolvido && (
                                  <Badge variant="outline" className="bg-green-100 text-green-800">
                                    Resolvido
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-900 mb-2">{log.mensagem}</p>
                              {log.detalhes && (
                                <div className="text-xs bg-gray-50 p-2 rounded font-mono mb-2">
                                  {JSON.stringify(log.detalhes, null, 2)}
                                </div>
                              )}
                              {log.stack_trace && (
                                <div className="text-xs bg-red-50 p-2 rounded font-mono">
                                  <strong>Stack Trace:</strong><br />
                                  {log.stack_trace}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 ml-4">
                            {formatTimestamp(log.created_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredErrorLogs.length === 0 && !isLoading && (
                      <div className="text-center py-8 text-gray-500">
                        Nenhum erro encontrado.
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
