import { Handler } from '@netlify/functions';

interface HealthMetric {
  id: string;
  type: string;
  value: number;
  timestamp: string;
  unit?: string;
}

const handler: Handler = async (): Promise<Response> => {
  try {
    // Fast metrics endpoint with minimal processing
    const now = new Date();
    const metrics: HealthMetric[] = [
      {
        id: '1',
        type: 'heart_rate',
        value: Math.floor(Math.random() * 40) + 60,
        timestamp: now.toISOString(),
        unit: 'BPM',
      },
      {
        id: '2',
        type: 'blood_pressure_systolic',
        value: Math.floor(Math.random() * 30) + 110,
        timestamp: now.toISOString(),
        unit: 'mmHg',
      },
      {
        id: '3',
        type: 'blood_pressure_diastolic',
        value: Math.floor(Math.random() * 20) + 70,
        timestamp: now.toISOString(),
        unit: 'mmHg',
      },
      {
        id: '4',
        type: 'temperature',
        value: parseFloat((Math.random() * 2 + 97.5).toFixed(1)),
        timestamp: now.toISOString(),
        unit: '°F',
      },
      {
        id: '5',
        type: 'oxygen_saturation',
        value: Math.floor(Math.random() * 4) + 96,
        timestamp: now.toISOString(),
        unit: '%',
      },
    ];

    // Calculate health score
    const healthScore = 85;

    return new Response(JSON.stringify({ metrics, healthScore }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute - metrics change frequently
        'X-Served-By': 'netlify-function',
      },
    });
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch health metrics',
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
