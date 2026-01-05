import { Handler } from '@netlify/functions';

interface HealthAnalyticsResponse {
  metrics: Array<{
    id: string;
    type: string;
    value: number;
    timestamp: string;
    unit?: string;
  }>;
  insights: Array<{
    id: string;
    title: string;
    description: string;
    type: 'positive' | 'warning' | 'critical' | 'neutral';
    category: string;
    importance: 'low' | 'medium' | 'high';
    confidence: number;
    action: string;
  }>;
  trends: Array<{
    metric: string;
    direction: 'up' | 'down' | 'stable';
    change: string;
    percentage: number;
  }>;
  healthScore: number;
}

const handler: Handler = async (): Promise<Response> => {
  try {
    // Simulated health data generation (can be replaced with real API calls)
    const metrics = [
      {
        id: '1',
        type: 'heart_rate',
        value: Math.floor(Math.random() * 40) + 60,
        timestamp: new Date().toISOString(),
        unit: 'BPM',
      },
      {
        id: '2',
        type: 'blood_pressure_systolic',
        value: Math.floor(Math.random() * 30) + 110,
        timestamp: new Date().toISOString(),
        unit: 'mmHg',
      },
      {
        id: '3',
        type: 'blood_pressure_diastolic',
        value: Math.floor(Math.random() * 20) + 70,
        timestamp: new Date().toISOString(),
        unit: 'mmHg',
      },
      {
        id: '4',
        type: 'temperature',
        value: parseFloat((Math.random() * 2 + 97.5).toFixed(1)),
        timestamp: new Date().toISOString(),
        unit: '°F',
      },
      {
        id: '5',
        type: 'oxygen_saturation',
        value: Math.floor(Math.random() * 4) + 96,
        timestamp: new Date().toISOString(),
        unit: '%',
      },
    ];

    const insights = [
      {
        id: '1',
        title: 'Heart Rate Pattern',
        description: 'Your heart rate shows healthy variability during physical activities',
        type: 'positive' as const,
        category: 'Cardiovascular',
        importance: 'high' as const,
        confidence: 94,
        action: 'Continue current exercise routine',
      },
      {
        id: '2',
        title: 'Sleep Quality Alert',
        description: 'Your sleep consistency has improved by 23% this month',
        type: 'positive' as const,
        category: 'Sleep',
        importance: 'medium' as const,
        confidence: 88,
        action: 'Maintain consistent bedtime routine',
      },
      {
        id: '3',
        title: 'Stress Level Warning',
        description: 'Elevated stress levels detected in HRV analysis',
        type: 'warning' as const,
        category: 'Mental Health',
        importance: 'high' as const,
        confidence: 81,
        action: 'Try meditation or relaxation techniques',
      },
      {
        id: '4',
        title: 'Activity Goal Status',
        description: 'You are on track with your weekly activity goals',
        type: 'positive' as const,
        category: 'Activity',
        importance: 'medium' as const,
        confidence: 95,
        action: 'Maintain current pace for optimal health',
      },
    ];

    const trends = [
      {
        metric: 'Heart Rate Variability',
        direction: 'up' as const,
        change: '+12.5%',
        percentage: 12.5,
      },
      {
        metric: 'Sleep Duration',
        direction: 'up' as const,
        change: '+45 min',
        percentage: 8.3,
      },
      {
        metric: 'Exercise Minutes',
        direction: 'stable' as const,
        change: 'Consistent',
        percentage: 0,
      },
      {
        metric: 'Stress Index',
        direction: 'down' as const,
        change: '-18%',
        percentage: -18,
      },
    ];

    const healthScore = 85;

    const response: HealthAnalyticsResponse = {
      metrics,
      insights,
      trends,
      healthScore,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('Error fetching health analytics:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch health analytics data',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export { handler };
