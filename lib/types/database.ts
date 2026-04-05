export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          badge_number: string | null;
          role: "admin" | "officer" | "viewer";
          is_active: boolean;
          station_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          badge_number?: string | null;
          role?: "admin" | "officer" | "viewer";
          is_active?: boolean;
          station_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_profiles"]["Insert"]>;
        Relationships: [];
      };
      firs: {
        Row: {
          id: string;
          fir_number: string;
          title: string;
          description: string;
          incident_date: string;
          location: string;
          complainant_name: string;
          status: "draft" | "pending" | "under_investigation" | "closed";
          assigned_officer_id: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          fir_number: string;
          title: string;
          description: string;
          incident_date: string;
          location: string;
          complainant_name: string;
          status?: "draft" | "pending" | "under_investigation" | "closed";
          assigned_officer_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["firs"]["Insert"]>;
        Relationships: [];
      };
      criminal_records: {
        Row: {
          id: string;
          suspect_name: string;
          national_id: string;
          offense_summary: string;
          status: "pending" | "approved" | "rejected";
          version: number;
          last_reviewed_by: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          suspect_name: string;
          national_id: string;
          offense_summary: string;
          status?: "pending" | "approved" | "rejected";
          version?: number;
          last_reviewed_by?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["criminal_records"]["Insert"]>;
        Relationships: [];
      };
      criminal_record_versions: {
        Row: {
          id: string;
          criminal_record_id: string;
          version: number;
          snapshot: Json;
          decision: string | null;
          note: string | null;
          changed_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          criminal_record_id: string;
          version: number;
          snapshot: Json;
          decision?: string | null;
          note?: string | null;
          changed_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["criminal_record_versions"]["Insert"]>;
        Relationships: [];
      };
      cases: {
        Row: {
          id: string;
          case_number: string;
          fir_id: string | null;
          title: string;
          summary: string;
          priority: "low" | "medium" | "high";
          status: "open" | "in_progress" | "pending_review" | "closed";
          lead_officer_id: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          case_number: string;
          fir_id?: string | null;
          title: string;
          summary: string;
          priority?: "low" | "medium" | "high";
          status?: "open" | "in_progress" | "pending_review" | "closed";
          lead_officer_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cases"]["Insert"]>;
        Relationships: [];
      };
      case_notes: {
        Row: {
          id: string;
          case_id: string;
          note: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          case_id: string;
          note: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["case_notes"]["Insert"]>;
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: number;
          actor_id: string | null;
          entity_type: string;
          entity_id: string | null;
          action: string;
          details: Json | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          actor_id?: string | null;
          entity_type: string;
          entity_id?: string | null;
          action: string;
          details?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
