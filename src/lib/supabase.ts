import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      health_records: {
        Row: {
          id: string;
          user_id: string;
          heart_rate: number;
          blood_pressure_systolic: number;
          blood_pressure_diastolic: number;
          oxygen_level: number;
          temperature: number;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          heart_rate: number;
          blood_pressure_systolic: number;
          blood_pressure_diastolic: number;
          oxygen_level: number;
          temperature: number;
          recorded_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          heart_rate?: number;
          blood_pressure_systolic?: number;
          blood_pressure_diastolic?: number;
          oxygen_level?: number;
          temperature?: number;
          recorded_at?: string;
          created_at?: string;
        };
      };
      health_analytics: {
        Row: {
          id: string;
          user_id: string;
          avg_heart_rate: number;
          avg_blood_pressure: string;
          avg_oxygen_level: number;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          avg_heart_rate: number;
          avg_blood_pressure: string;
          avg_oxygen_level: number;
          date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          avg_heart_rate?: number;
          avg_blood_pressure?: string;
          avg_oxygen_level?: number;
          date?: string;
          created_at?: string;
        };
      };
      risk_assessments: {
        Row: {
          id: string;
          user_id: string;
          risk_level: 'low' | 'medium' | 'high';
          risk_factors: string[];
          recommendations: string[];
          assessed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          risk_level: 'low' | 'medium' | 'high';
          risk_factors: string[];
          recommendations: string[];
          assessed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          risk_level?: 'low' | 'medium' | 'high';
          risk_factors?: string[];
          recommendations?: string[];
          assessed_at?: string;
          created_at?: string;
        };
      };
    };
  };
};
