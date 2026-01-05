import { Handler } from '@netlify/functions';

interface HealthInsight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'critical' | 'neutral';
  category: string;
  importance: 'low' | 'medium' | 'high';
  confidence: number;
  action: string;
}

const handler: Handler = async (): Promise<Response> => {
  try {
    // Cached health insights - returns quickly
    const insights: HealthInsight[] = [
      {
        id: '1',
        title: 'Heart Rate Pattern',
        description: 'Your heart rate shows healthy variability during physical activities',
        type: 'positive',
        category: 'Cardiovascular',
        importance: 'high',
        confidence: 94,
        action: 'Continue current exercise routine',
      },
      {
        id: '2',
        title: 'Sleep Quality Alert',
        description: 'Your sleep consistency has improved by 23% this month',
        type: 'positive',
        category: 'Sleep',
        importance: 'medium',
        confidence: 88,
        action: 'Maintain consistent bedtime routine',
      },
      {
        id: '3',
        title: 'Stress Level Warning',
        description: 'Elevated stress levels detected in HRV analysis',
        type: 'warning',
        category: 'Mental Health',
        importance: 'high',
        confidence: 81,
        action: 'Try meditation or relaxation techniques',
      },
      {
        id: '4',
        title: 'Activity Goal Status',
        description: 'You are on track with your weekly activity goals',
        type: 'positive',
        category: 'Activity',
        importance: 'medium',
        confidence: 95,
        action: 'Maintain current pace for optimal health',
      },
    ];

    return new Response(JSON.stringify({ insights }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600', // Cache for 10 minutes
        'X-Served-By': 'netlify-function',
      },
    });
  } catch (error) {
    console.error('Error fetching health insights:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch health insights',
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
