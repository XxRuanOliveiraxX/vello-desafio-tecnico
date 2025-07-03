# Vello Group - Sistema de Orçamentos

![Vello Group](https://img.shields.io/badge/Vello-Group-blue)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-Styling-38B2AC)

## 📋 Visão Geral

O **Vello Group** é uma aplicação web moderna para gerenciamento de orçamentos e soluções tecnológicas. O sistema permite que clientes solicitem orçamentos através de um formulário intuitivo e fornece aos administradores um painel completo para gerenciar essas solicitações.

### 🌟 Principais Funcionalidades

- **Interface Pública**: Formulário de solicitação de orçamentos com seleção de serviços
- **Painel Administrativo**: Gerenciamento completo de orçamentos e métricas
- **Classificação Automática de Urgência**: IA integrada para análise de prioridade
- **Sistema de Logs**: Monitoramento completo de eventos e erros
- **Segurança Avançada**: Criptografia de dados sensíveis e RLS (Row Level Security)
- **Dashboard com Métricas**: Visualização de KPIs e relatórios em tempo real

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18.3.1** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e desenvolvimento
- **Tailwind CSS** - Framework de estilos
- **Shadcn/UI** - Componentes de interface
- **React Hook Form** - Gerenciamento de formulários
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones

### Backend & Database
- **Supabase** - Backend as a Service
- **PostgreSQL** - Banco de dados principal
- **Row Level Security (RLS)** - Segurança a nível de linha
- **Funções PostgreSQL** - Criptografia e lógica de negócio
- **Views** - Consultas otimizadas

### Ferramentas de Desenvolvimento
- **ESLint** - Linting de código
- **PostCSS** - Processamento de CSS
- **Zod** - Validação de schemas
- **React Query** - Gerenciamento de estado e cache

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ e npm
- Conta no Supabase
- Git

### 1. Clone o Repositório
```bash
git clone https://github.com/XxRuanOliveiraxX/vello-desafio-tecnico.git
cd vello-desafio-tecnico
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configuração do Supabase

#### 3.1. Crie um projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a URL e a chave anônima do projeto

#### 3.2. Configure as variáveis de ambiente
```bash
# src/integrations/supabase/client.ts
# Substitua pelas suas credenciais do Supabase
const SUPABASE_URL = "sua-url-do-supabase"
const SUPABASE_PUBLISHABLE_KEY = "sua-chave-publica"
```

#### 3.3. Execute as migrações do banco
Execute o SQL presente em `supabase/migrations/` no SQL Editor do Supabase:

```sql
-- Executar todos os comandos SQL do arquivo de migração
-- Isso criará as tabelas, views, funções e políticas de segurança
```

### 4. Inicie o Desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🎯 Como Usar

### Interface Pública - Solicitação de Orçamentos

1. **Acesse a página inicial**
2. **Preencha o formulário** com:
   - Nome completo
   - Email de contato
   - Telefone
   - Serviços desejados (múltipla seleção)
   - Descrição detalhada do projeto
3. **Envie a solicitação** - O sistema classificará automaticamente a urgência

### Painel Administrativo

1. **Acesse o painel admin** clicando em "Painel Admin"
2. **Faça login** com as credenciais:
   - Email: `admin@vellogroup.com`
   - Senha: `admin123`
3. **Navegue pelas abas**:
   - **Dashboard**: Métricas e KPIs principais
   - **Orçamentos**: Lista completa com filtros e ações
   - **Análises**: Relatórios avançados (em desenvolvimento)
   - **Logs**: Monitoramento de eventos e erros

### Funcionalidades do Painel Admin

#### Gerenciamento de Orçamentos
- **Visualizar** todos os orçamentos com informações completas
- **Filtrar** por status, urgência, nome ou serviço
- **Alterar status**: Pendente → Em Análise → Aprovado/Rejeitado → Finalizado
- **Ajustar urgência**: Baixa, Média, Alta, Urgente
- **Exportar** dados em CSV
- **Contatar clientes** via email ou WhatsApp

#### Dashboard e Métricas
- **Total de orçamentos** recebidos
- **Taxa de conversão** por status
- **Distribuição por urgência**
- **Gráficos temporais** de recebimento
- **Métricas por serviço**

## 🏗️ Arquitetura do Sistema

### Estrutura do Banco de Dados

#### Tabelas Principais
- `orcamentos` - Armazena as solicitações de orçamento
- `logs_eventos` - Registra eventos do sistema
- `logs_erros` - Registra erros e exceções

#### Views Otimizadas
- `view_orcamentos_admin` - Dados descriptografados para administração
- `view_orcamentos_pendentes` - Orçamentos aguardando análise
- `view_orcamentos_por_servico` - Estatísticas por categoria

#### Funções de Segurança
- `criptografar_email()` / `descriptografar_email()`
- `criptografar_telefone()` / `descriptografar_telefone()`

### Estrutura de Pastas
```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── AdminPanel.tsx  # Painel administrativo
│   ├── BudgetForm.tsx  # Formulário de orçamentos
│   ├── BudgetList.tsx  # Lista de orçamentos
│   └── ...
├── hooks/              # Hooks customizados
├── integrations/       # Integrações externas
│   └── supabase/       # Configuração Supabase
├── lib/                # Utilitários e configurações
├── pages/              # Páginas da aplicação
├── utils/              # Funções utilitárias
└── main.tsx           # Ponto de entrada
```

## 🔒 Segurança

### Criptografia de Dados
- **Emails e telefones** são criptografados no banco usando AES
- **Funções PostgreSQL** para criptografia/descriptografia segura
- **Chaves secretas** armazenadas de forma segura

### Row Level Security (RLS)
- **Políticas de acesso** granulares por tabela
- **Isolamento de dados** por contexto de usuário
- **Auditoria completa** de acessos e modificações

### Logs e Monitoramento
- **Eventos do sistema** registrados automaticamente
- **Rastreamento de erros** com stack traces
- **Métricas de acesso** e comportamento do usuário

## 📊 Classificação Automática de Urgência

O sistema utiliza IA para classificar automaticamente a urgência dos orçamentos baseado na descrição do projeto:

### Níveis de Urgência
- **Baixa**: Projetos sem prazo específico
- **Média**: Projetos com cronograma normal
- **Alta**: Projetos com prazos apertados
- **Urgente**: Projetos críticos ou emergenciais

### Fatores Analisados
- Palavras-chave indicativas de urgência
- Contexto temporal mencionado
- Tipo de serviço solicitado
- Complexidade aparente do projeto

## 🚀 Deploy e Produção

### Opções de Deploy
1. **Lovable Platform** (Recomendado)
   - Deploy automático via interface
   - SSL incluído
   - CDN global

2. **Vercel/Netlify**
   ```bash
   npm run build
   # Upload da pasta dist/
   ```

3. **Servidor Próprio**
   ```bash
   npm run build
   # Servir pasta dist/ com nginx/apache
   ```

### Variáveis de Ambiente (Produção)
```env
VITE_SUPABASE_URL=sua-url-producao
VITE_SUPABASE_ANON_KEY=sua-chave-producao
```

## 🧪 Testes e Qualidade

### Scripts Disponíveis
```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Verificação de código
```

### Boas Práticas Implementadas
- **TypeScript** rigoroso para tipagem
- **ESLint** para qualidade de código
- **Componentes modulares** e reutilizáveis
- **Hooks customizados** para lógica compartilhada
- **Error boundaries** para tratamento de erros

## 📝 Roadmap e Melhorias Futuras

### Em Desenvolvimento
- [ ] Módulo de análises avançadas
- [ ] Integração com Google Analytics
- [ ] API REST para integrações externas
- [ ] Aplicativo mobile (React Native)

### Próximas Funcionalidades
- [ ] Chat em tempo real com clientes
- [ ] Sistema de templates de orçamento
- [ ] Integração com CRM externo
- [ ] Dashboard de performance da equipe

## 🤝 Contribuição

### Como Contribuir
1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrões de Código
- Use TypeScript para tipagem
- Siga as convenções do ESLint
- Componentes em PascalCase
- Hooks customizados com prefixo `use`
- Commits em português, descritivos

### Documentação Adicional
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/UI](https://ui.shadcn.com)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ por Ruan Oliveira**

Entre em contato comigo através do linkedin, visite www.linkedin.com/in/ruan07
