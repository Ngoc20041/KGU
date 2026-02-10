export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      batch: {
        Row: {
          batch_code: string
          created_at: string | null
          expiry_date: string
          id: string
          manufacture_date: string
          product_id: string | null
          quality_status: string | null
        }
        Insert: {
          batch_code: string
          created_at?: string | null
          expiry_date: string
          id?: string
          manufacture_date: string
          product_id?: string | null
          quality_status?: string | null
        }
        Update: {
          batch_code?: string
          created_at?: string | null
          expiry_date?: string
          id?: string
          manufacture_date?: string
          product_id?: string | null
          quality_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "batch_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      factory: {
        Row: {
          address: string | null
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          address?: string | null
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          address?: string | null
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      factory_user: {
        Row: {
          factory_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          factory_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          factory_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "factory_user_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factory"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_transaction: {
        Row: {
          batch_id: string | null
          created_at: string | null
          factory_id: string | null
          id: string
          location_id: string | null
          product_id: string | null
          quantity: number
          reference_id: string | null
          reference_type: string | null
          transaction_type: string | null
          warehouse_id: string | null
        }
        Insert: {
          batch_id?: string | null
          created_at?: string | null
          factory_id?: string | null
          id?: string
          location_id?: string | null
          product_id?: string | null
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string | null
          warehouse_id?: string | null
        }
        Update: {
          batch_id?: string | null
          created_at?: string | null
          factory_id?: string | null
          id?: string
          location_id?: string | null
          product_id?: string | null
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string | null
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transaction_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transaction_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transaction_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transaction_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transaction_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse"
            referencedColumns: ["id"]
          },
        ]
      }
      location: {
        Row: {
          capacity: number | null
          code: string
          id: string
          is_active: boolean | null
          warehouse_id: string | null
        }
        Insert: {
          capacity?: number | null
          code: string
          id?: string
          is_active?: boolean | null
          warehouse_id?: string | null
        }
        Update: {
          capacity?: number | null
          code?: string
          id?: string
          is_active?: boolean | null
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse"
            referencedColumns: ["id"]
          },
        ]
      }
      product: {
        Row: {
          category_id: string | null
          code: string
          created_at: string | null
          id: string
          is_batch_controlled: boolean | null
          name: string
          product_type: string | null
          shelf_life_days: number | null
          unit: string
        }
        Insert: {
          category_id?: string | null
          code: string
          created_at?: string | null
          id?: string
          is_batch_controlled?: boolean | null
          name: string
          product_type?: string | null
          shelf_life_days?: number | null
          unit: string
        }
        Update: {
          category_id?: string | null
          code?: string
          created_at?: string | null
          id?: string
          is_batch_controlled?: boolean | null
          name?: string
          product_type?: string | null
          shelf_life_days?: number | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_category"
            referencedColumns: ["id"]
          },
        ]
      }
      product_bom: {
        Row: {
          id: string
          loss_rate: number | null
          material_id: string | null
          product_id: string | null
          quantity_required: number
        }
        Insert: {
          id?: string
          loss_rate?: number | null
          material_id?: string | null
          product_id?: string | null
          quantity_required: number
        }
        Update: {
          id?: string
          loss_rate?: number | null
          material_id?: string | null
          product_id?: string | null
          quantity_required?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_bom_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_bom_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      product_category: {
        Row: {
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_category_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_category"
            referencedColumns: ["id"]
          },
        ]
      }
      production_consumption: {
        Row: {
          batch_id: string | null
          id: string
          material_id: string | null
          production_order_id: string | null
          quantity_used: number
        }
        Insert: {
          batch_id?: string | null
          id?: string
          material_id?: string | null
          production_order_id?: string | null
          quantity_used: number
        }
        Update: {
          batch_id?: string | null
          id?: string
          material_id?: string | null
          production_order_id?: string | null
          quantity_used?: number
        }
        Relationships: [
          {
            foreignKeyName: "production_consumption_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_consumption_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_consumption_production_order_id_fkey"
            columns: ["production_order_id"]
            isOneToOne: false
            referencedRelation: "production_order"
            referencedColumns: ["id"]
          },
        ]
      }
      production_order: {
        Row: {
          actual_quantity: number | null
          end_date: string | null
          factory_id: string | null
          id: string
          planned_quantity: number | null
          product_id: string | null
          start_date: string | null
          status: string | null
        }
        Insert: {
          actual_quantity?: number | null
          end_date?: string | null
          factory_id?: string | null
          id?: string
          planned_quantity?: number | null
          product_id?: string | null
          start_date?: string | null
          status?: string | null
        }
        Update: {
          actual_quantity?: number | null
          end_date?: string | null
          factory_id?: string | null
          id?: string
          planned_quantity?: number | null
          product_id?: string | null
          start_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_order_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_order_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      production_output: {
        Row: {
          batch_id: string | null
          id: string
          product_id: string | null
          production_order_id: string | null
          quantity: number
        }
        Insert: {
          batch_id?: string | null
          id?: string
          product_id?: string | null
          production_order_id?: string | null
          quantity: number
        }
        Update: {
          batch_id?: string | null
          id?: string
          product_id?: string | null
          production_order_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "production_output_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_output_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_output_production_order_id_fkey"
            columns: ["production_order_id"]
            isOneToOne: false
            referencedRelation: "production_order"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouse: {
        Row: {
          code: string
          created_at: string | null
          factory_id: string | null
          id: string
          name: string
          type: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          factory_id?: string | null
          id?: string
          name: string
          type?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          factory_id?: string | null
          id?: string
          name?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factory"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_transaction: {
        Row: {
          id: string
          amount: number
          category: string
          note: string | null
          date: string
          type: string
          user_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          amount: number
          category: string
          note?: string | null
          date: string
          type: string
          user_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          amount?: number
          category?: string
          note?: string | null
          date?: string
          type?: string
          user_id?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      inventory_balance: {
        Row: {
          batch_id: string | null
          factory_id: string | null
          product_id: string | null
          quantity: number | null
          warehouse_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transaction_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transaction_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transaction_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transaction_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
