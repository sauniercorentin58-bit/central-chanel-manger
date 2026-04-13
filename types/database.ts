export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      checklist_items: {
        Row: {
          completed: boolean;
          created_at: string;
          id: string;
          intervention_id: string;
          label: string;
          order_index: number;
        };
        Insert: {
          completed?: boolean;
          created_at?: string;
          id?: string;
          intervention_id: string;
          label: string;
          order_index?: number;
        };
        Update: {
          completed?: boolean;
          created_at?: string;
          id?: string;
          intervention_id?: string;
          label?: string;
          order_index?: number;
        };
      };
      interventions: {
        Row: {
          cleaner_name: string;
          created_at: string;
          id: string;
          notes: string | null;
          property_id: string;
          scheduled_for: string;
          status: "todo" | "in_progress" | "done";
          user_id: string;
        };
        Insert: {
          cleaner_name: string;
          created_at?: string;
          id?: string;
          notes?: string | null;
          property_id: string;
          scheduled_for: string;
          status?: "todo" | "in_progress" | "done";
          user_id: string;
        };
        Update: {
          cleaner_name?: string;
          created_at?: string;
          id?: string;
          notes?: string | null;
          property_id?: string;
          scheduled_for?: string;
          status?: "todo" | "in_progress" | "done";
          user_id?: string;
        };
      };
      properties: {
        Row: {
          address: string;
          created_at: string;
          id: string;
          name: string;
          user_id: string;
        };
        Insert: {
          address: string;
          created_at?: string;
          id?: string;
          name: string;
          user_id: string;
        };
        Update: {
          address?: string;
          created_at?: string;
          id?: string;
          name?: string;
          user_id?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
