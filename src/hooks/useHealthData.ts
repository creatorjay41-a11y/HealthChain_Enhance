import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface HealthRecord {
  id: string;
  user_id: string;
  heart_rate: number;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  oxygen_level: number;
  temperature: number;
  recorded_at: string;
  created_at: string;
}

export interface HealthAnalytics {
  id: string;
  user_id: string;
  avg_heart_rate: number;
  avg_blood_pressure: string;
  avg_oxygen_level: number;
  date: string;
  created_at: string;
}

export interface RiskAssessment {
  id: string;
  user_id: string;
  risk_level: 'low' | 'medium' | 'high';
  risk_factors: string[];
  recommendations: string[];
  assessed_at: string;
  created_at: string;
}

export const useHealthData = () => {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [analytics, setAnalytics] = useState<HealthAnalytics[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthRecords = useCallback(async () => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();

      if (!session?.session?.user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error: queryError } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('recorded_at', { ascending: false });

      if (queryError) throw queryError;
      setHealthRecords(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health records');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const { data: session } = await supabase.auth.getSession();

      if (!session?.session?.user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error: queryError } = await supabase
        .from('health_analytics')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('date', { ascending: false });

      if (queryError) throw queryError;
      setAnalytics(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    }
  }, []);

  const fetchRiskAssessment = useCallback(async () => {
    try {
      const { data: session } = await supabase.auth.getSession();

      if (!session?.session?.user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error: queryError } = await supabase
        .from('risk_assessments')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('assessed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (queryError) throw queryError;
      setRiskAssessment(data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch risk assessment');
    }
  }, []);

  const addHealthRecord = useCallback(async (record: Omit<HealthRecord, 'id' | 'created_at' | 'user_id'>) => {
    try {
      const { data: session } = await supabase.auth.getSession();

      if (!session?.session?.user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error: insertError } = await supabase
        .from('health_records')
        .insert({
          user_id: session.session.user.id,
          ...record,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setHealthRecords(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add health record');
    }
  }, []);

  const updateRiskAssessment = useCallback(async (assessment: Omit<RiskAssessment, 'id' | 'created_at' | 'user_id'>) => {
    try {
      const { data: session } = await supabase.auth.getSession();

      if (!session?.session?.user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error: upsertError } = await supabase
        .from('risk_assessments')
        .upsert({
          user_id: session.session.user.id,
          ...assessment,
        })
        .select()
        .single();

      if (upsertError) throw upsertError;
      setRiskAssessment(data);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update risk assessment');
    }
  }, []);

  useEffect(() => {
    fetchHealthRecords();
    fetchAnalytics();
    fetchRiskAssessment();
  }, [fetchHealthRecords, fetchAnalytics, fetchRiskAssessment]);

  return {
    healthRecords,
    analytics,
    riskAssessment,
    loading,
    error,
    addHealthRecord,
    updateRiskAssessment,
    refetchHealthRecords: fetchHealthRecords,
  };
};
