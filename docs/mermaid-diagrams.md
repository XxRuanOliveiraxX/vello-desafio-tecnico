
# Diagramas Mermaid.js - Vello Group

Este arquivo contém todos os diagramas em formato Mermaid.js para fácil cópia e uso em diferentes ferramentas.

## Como usar:

1. **GitHub/GitLab**: Cole o código diretamente em arquivos .md
2. **Mermaid Live Editor**: https://mermaid.live/
3. **Draw.io**: Importe usando a funcionalidade "Insert > Advanced > Mermaid"
4. **Notion**: Use blocos de código com tipo "mermaid"
5. **VS Code**: Use a extensão "Mermaid Preview"

## 1. Arquitetura Geral do Sistema

```mermaid
graph TB
    subgraph "Cliente/Browser"
        A[Interface Pública] 
        B[Painel Admin]
    end
    
    subgraph "Frontend React"
        C[React App]
        D[React Query]
        E[Tailwind CSS]
        F[Shadcn/UI]
    end
    
    subgraph "Backend Supabase"
        G[Authentication]
        H[PostgreSQL Database]
        I[Row Level Security]
        J[Edge Functions]
        K[Real-time Subscriptions]
    end
    
    subgraph "Segurança & Logs"
        L[Criptografia AES]
        M[Audit Logs]
        N[Error Tracking]
    end
    
    A --> C
    B --> C
    C --> D
    D --> G
    G --> H
    H --> I
    H --> L
    H --> M
    H --> N
```

## 2. Fluxo de Dados Detalhado

```mermaid
flowchart TD
    A[Usuário] --> B{Tipo de Acesso}
    B -->|Público| C[Formulário de Orçamento]
    B -->|Admin| D[Login/Autenticação]
    
    C --> E[Validação de Dados]
    E --> F[Classificação IA de Urgência]
    F --> G[Criptografia de Dados]
    G --> H[Salvar no Database]
    H --> I[Trigger de Log]
    I --> J[Notificação de Sucesso]
    
    D --> K{Credenciais Válidas?}
    K -->|Não| L[Erro de Login]
    K -->|Sim| M[Dashboard Admin]
    
    M --> N[Visualizar Orçamentos]
    M --> O[Métricas/Analytics]
    M --> P[Logs do Sistema]
    
    N --> Q[Filtros e Buscas]
    N --> R[Atualizar Status]
    N --> S[Exportar Dados]
```

## 3. Estrutura do Banco de Dados

```mermaid
erDiagram
    ORCAMENTOS {
        uuid id PK
        text nome_completo
        text email_criptografado
        text telefone_criptografado
        text[] servicos
        text descricao_projeto
        text urgencia
        status_orcamento status
        timestamp created_at
        timestamp updated_at
        text observacoes
        numeric valor_estimado
    }
    
    LOGS_EVENTOS {
        uuid id PK
        uuid orcamento_id FK
        tipo_evento tipo_evento
        nivel_log nivel
        text mensagem
        jsonb detalhes
        timestamp created_at
    }
    
    LOGS_ERROS {
        uuid id PK
        uuid orcamento_id FK
        text tipo_erro
        text mensagem
        text stack_trace
        nivel_log nivel
        boolean resolvido
        timestamp created_at
        timestamp resolved_at
    }
    
    VIEW_ORCAMENTOS_ADMIN {
        uuid id
        text nome_completo
        text email
        text telefone
        text[] servicos
        text descricao_projeto
        text urgencia
        status_orcamento status
        timestamp created_at
    }
    
    ORCAMENTOS ||--o{ LOGS_EVENTOS : "gera"
    ORCAMENTOS ||--o{ LOGS_ERROS : "pode_ter"
    ORCAMENTOS ||--|| VIEW_ORCAMENTOS_ADMIN : "visualizado_como"
```

## 4. Componentes React

```mermaid
graph TD
    subgraph "App Principal"
        A[App.tsx] --> B[Header]
        A --> C[Router]
        A --> D[Footer]
    end
    
    subgraph "Interface Pública"
        E[BudgetForm] --> F[ServiceSelector]
        E --> G[FormValidation]
        E --> H[SubmitHandler]
    end
    
    subgraph "Interface Admin"
        I[AdminPanel] --> J[DashboardMetrics]
        I --> K[BudgetList] 
        I --> L[SystemLogs]
        I --> M[FilterControls]
    end
    
    subgraph "Componentes Compartilhados"
        N[UrgencyIndicator]
        O[StatusBadge]
        P[LoadingSpinner]
        Q[ErrorBoundary]
    end
    
    C --> E
    C --> I
    J --> N
    K --> O
    K --> N
```

## 5. Fluxo de Segurança

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant A as Auth Supabase
    participant R as RLS
    participant D as Database
    participant E as Encryption
    
    Note over U,E: Fluxo de Criação de Orçamento
    U->>F: Envia formulário
    F->>F: Validação frontend
    F->>A: Verifica sessão anônima
    A->>R: Aplica políticas RLS
    R->>E: Criptografa dados sensíveis
    E->>D: Salva dados criptografados
    D->>D: Trigger de auditoria
    D->>F: Sucesso
    F->>U: Confirmação
    
    Note over U,E: Fluxo de Acesso Admin
    U->>F: Tenta login admin
    F->>A: Credenciais
    A->>A: Valida credenciais
    A->>R: Define contexto admin
    R->>E: Descriptografa dados
    E->>D: Busca dados completos
    D->>F: Dados formatados
    F->>U: Dashboard completo
```

## 6. Classificação de Urgência por IA

```mermaid
flowchart LR
    A[Descrição do Projeto] --> B[Análise de Texto]
    B --> C{Palavras-chave de Urgência}
    
    C -->|"urgente, emergência"| D[URGENTE]
    C -->|"prazo apertado, rápido"| E[ALTA]
    C -->|"breve, logo"| F[MÉDIA] 
    C -->|"futuramente, quando possível"| G[BAIXA]
    
    D --> H[Prioridade 1]
    E --> I[Prioridade 2]
    F --> J[Prioridade 3]
    G --> K[Prioridade 4]
    
    H --> L[Dashboard Admin]
    I --> L
    J --> L
    K --> L
```

## 7. Deploy e Infraestrutura

```mermaid
graph TB
    subgraph "Desenvolvimento"
        A[VS Code/Editor] --> B[Git Repository]
        B --> C[GitHub]
    end
    
    subgraph "Build & Deploy"
        C --> D[Lovable Platform]
        D --> E[Vite Build]
        E --> F[Static Assets]
    end
    
    subgraph "Produção"
        F --> G[CDN Global]
        G --> H[Custom Domain]
        H --> I[SSL Certificate]
    end
    
    subgraph "Backend Services"
        J[Supabase Cloud] --> K[PostgreSQL]
        J --> L[Authentication]
        J --> M[Real-time API]
        J --> N[Edge Functions]
    end
    
    G --> J
    
    subgraph "Monitoramento"
        O[Error Tracking]
        P[Performance Metrics]
        Q[User Analytics]
    end
    
    I --> O
    I --> P
    I --> Q
```
