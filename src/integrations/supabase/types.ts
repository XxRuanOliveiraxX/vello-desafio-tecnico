export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      logs_erros: {
        Row: {
          created_at: string
          detalhes: Json | null
          id: string
          ip_origem: unknown | null
          mensagem: string
          nivel: Database["public"]["Enums"]["nivel_log"]
          orcamento_id: string | null
          resolved_at: string | null
          resolvido: boolean | null
          stack_trace: string | null
          tipo_erro: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          detalhes?: Json | null
          id?: string
          ip_origem?: unknown | null
          mensagem: string
          nivel?: Database["public"]["Enums"]["nivel_log"]
          orcamento_id?: string | null
          resolved_at?: string | null
          resolvido?: boolean | null
          stack_trace?: string | null
          tipo_erro: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          detalhes?: Json | null
          id?: string
          ip_origem?: unknown | null
          mensagem?: string
          nivel?: Database["public"]["Enums"]["nivel_log"]
          orcamento_id?: string | null
          resolved_at?: string | null
          resolvido?: boolean | null
          stack_trace?: string | null
          tipo_erro?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_erros_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logs_erros_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "view_orcamentos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logs_erros_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "view_orcamentos_pendentes"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_eventos: {
        Row: {
          created_at: string
          detalhes: Json | null
          id: string
          ip_origem: unknown | null
          mensagem: string
          nivel: Database["public"]["Enums"]["nivel_log"]
          orcamento_id: string | null
          tipo_evento: Database["public"]["Enums"]["tipo_evento"]
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          detalhes?: Json | null
          id?: string
          ip_origem?: unknown | null
          mensagem: string
          nivel?: Database["public"]["Enums"]["nivel_log"]
          orcamento_id?: string | null
          tipo_evento: Database["public"]["Enums"]["tipo_evento"]
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          detalhes?: Json | null
          id?: string
          ip_origem?: unknown | null
          mensagem?: string
          nivel?: Database["public"]["Enums"]["nivel_log"]
          orcamento_id?: string | null
          tipo_evento?: Database["public"]["Enums"]["tipo_evento"]
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_eventos_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logs_eventos_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "view_orcamentos_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logs_eventos_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "view_orcamentos_pendentes"
            referencedColumns: ["id"]
          },
        ]
      }
      orcamentos: {
        Row: {
          created_at: string
          descricao_projeto: string
          email_criptografado: string
          id: string
          ip_origem: unknown | null
          nome_completo: string
          observacoes: string | null
          origem: string | null
          servicos: string[]
          status: Database["public"]["Enums"]["status_orcamento"]
          telefone_criptografado: string
          updated_at: string
          urgencia: string | null
          user_agent: string | null
          valor_estimado: number | null
        }
        Insert: {
          created_at?: string
          descricao_projeto: string
          email_criptografado: string
          id?: string
          ip_origem?: unknown | null
          nome_completo: string
          observacoes?: string | null
          origem?: string | null
          servicos?: string[]
          status?: Database["public"]["Enums"]["status_orcamento"]
          telefone_criptografado: string
          updated_at?: string
          urgencia?: string | null
          user_agent?: string | null
          valor_estimado?: number | null
        }
        Update: {
          created_at?: string
          descricao_projeto?: string
          email_criptografado?: string
          id?: string
          ip_origem?: unknown | null
          nome_completo?: string
          observacoes?: string | null
          origem?: string | null
          servicos?: string[]
          status?: Database["public"]["Enums"]["status_orcamento"]
          telefone_criptografado?: string
          updated_at?: string
          urgencia?: string | null
          user_agent?: string | null
          valor_estimado?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      view_orcamentos_admin: {
        Row: {
          created_at: string | null
          descricao_projeto: string | null
          email: string | null
          id: string | null
          nome_completo: string | null
          observacoes: string | null
          servicos: string[] | null
          status: Database["public"]["Enums"]["status_orcamento"] | null
          telefone: string | null
          updated_at: string | null
          urgencia: string | null
          valor_estimado: number | null
        }
        Insert: {
          created_at?: string | null
          descricao_projeto?: string | null
          email?: never
          id?: string | null
          nome_completo?: string | null
          observacoes?: string | null
          servicos?: string[] | null
          status?: Database["public"]["Enums"]["status_orcamento"] | null
          telefone?: never
          updated_at?: string | null
          urgencia?: string | null
          valor_estimado?: number | null
        }
        Update: {
          created_at?: string | null
          descricao_projeto?: string | null
          email?: never
          id?: string | null
          nome_completo?: string | null
          observacoes?: string | null
          servicos?: string[] | null
          status?: Database["public"]["Enums"]["status_orcamento"] | null
          telefone?: never
          updated_at?: string | null
          urgencia?: string | null
          valor_estimado?: number | null
        }
        Relationships: []
      }
      view_orcamentos_pendentes: {
        Row: {
          created_at: string | null
          id: string | null
          nome_completo: string | null
          prioridade_ordem: number | null
          servicos: string[] | null
          urgencia: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          nome_completo?: string | null
          prioridade_ordem?: never
          servicos?: string[] | null
          urgencia?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          nome_completo?: string | null
          prioridade_ordem?: never
          servicos?: string[] | null
          urgencia?: string | null
        }
        Relationships: []
      }
      view_orcamentos_por_servico: {
        Row: {
          aprovados: number | null
          pendentes: number | null
          rejeitados: number | null
          servico: string | null
          total_orcamentos: number | null
          valor_medio: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      criptografar_email: {
        Args: { email_texto: string }
        Returns: string
      }
      criptografar_telefone: {
        Args: { telefone_texto: string }
        Returns: string
      }
      descriptografar_email: {
        Args: { email_criptografado: string }
        Returns: string
      }
      descriptografar_telefone: {
        Args: { telefone_criptografado: string }
        Returns: string
      }
    }
    Enums: {
      nivel_log: "info" | "warning" | "error" | "success"
      status_orcamento:
        | "pendente"
        | "em_analise"
        | "aprovado"
        | "rejeitado"
        | "finalizado"
      tipo_evento:
        | "orcamento_recebido"
        | "email_enviado"
        | "webhook_disparado"
        | "status_alterado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      nivel_log: ["info", "warning", "error", "success"],
      status_orcamento: [
        "pendente",
        "em_analise",
        "aprovado",
        "rejeitado",
        "finalizado",
      ],
      tipo_evento: [
        "orcamento_recebido",
        "email_enviado",
        "webhook_disparado",
        "status_alterado",
      ],
    },
  },
} as const
