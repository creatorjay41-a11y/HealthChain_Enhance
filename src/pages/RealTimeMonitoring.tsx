import { useState, useEffect } from 'react';
import { Heart, Droplet, Thermometer, Wind, Activity } from 'lucide-react';
import BackButton from '../components/BackButton';
import { useHealthData } from '../hooks/useHealthData';

export default function RealTimeMonitoring() {
  const { addHealthRecord, loading } = useHealthData();
  const [vitals, setVitals] = useState({
    heart_rate: 72,
    blood_pressure_systolic: 120,
    blood_pressure_diastolic: 80,
    oxygen_level: 98,
    temperature: 37.0,
  });

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [recordedAt, setRecordedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setVitals(prev => ({
        heart_rate: Math.max(60, Math.min(100, prev.heart_rate + (Math.random() - 0.5) * 2)),
        blood_pressure_systolic: Math.max(110, Math.min(130, prev.blood_pressure_systolic + (Math.random() - 0.5))),
        blood_pressure_diastolic: Math.max(70, Math.min(90, prev.blood_pressure_diastolic + (Math.random() - 0.5))),
        oxygen_level: Math.max(95, Math.min(100, prev.oxygen_level + (Math.random() - 0.5) * 0.5)),
        temperature: Math.max(36.5, Math.min(37.5, prev.temperature + (Math.random() - 0.5) * 0.1)),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const handleStartMonitoring = () => {
    setIsMonitoring(true);
    setRecordedAt(new Date().toISOString());
  };

  const handleStopAndRecord = async () => {
    setIsMonitoring(false);
    try {
      await addHealthRecord({
        heart_rate: Math.round(vitals.heart_rate),
        blood_pressure_systolic: Math.round(vitals.blood_pressure_systolic),
        blood_pressure_diastolic: Math.round(vitals.blood_pressure_diastolic),
        oxygen_level: Math.round(vitals.oxygen_level),
        temperature: Math.round(vitals.temperature * 10) / 10,
        recorded_at: recordedAt || new Date().toISOString(),
      });
      setRecordedAt(null);
    } catch (err) {
      console.error('Failed to record vitals:', err);
    }
  };

  const getHeartRateColor = (rate: number) => {
    if (rate < 60 || rate > 100) return 'text-red-600';
    if (rate < 70 || rate > 95) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getOxygenColor = (oxygen: number) => {
    if (oxygen < 95) return 'text-red-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackButton />

        <div className="mt-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Real-Time Monitoring</h1>
          <p className="text-slate-600 mb-8">Monitor your vital signs in real-time</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 ${getHeartRateColor(vitals.heart_rate)} bg-red-100`}>
                      <Heart size={32} />
                    </div>
                    <p className="text-slate-600 text-sm mb-2">Heart Rate</p>
                    <p className={`text-3xl font-bold ${getHeartRateColor(vitals.heart_rate)}`}>
                      {Math.round(vitals.heart_rate)}
                    </p>
                    <p className="text-slate-500 text-xs">bpm</p>
                  </div>

                  <div className="text-center">
                    <div className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 ${getOxygenColor(vitals.oxygen_level)} bg-blue-100`}>
                      <Droplet size={32} />
                    </div>
                    <p className="text-slate-600 text-sm mb-2">Oxygen</p>
                    <p className={`text-3xl font-bold ${getOxygenColor(vitals.oxygen_level)}`}>
                      {Math.round(vitals.oxygen_level)}
                    </p>
                    <p className="text-slate-500 text-xs">%</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 text-orange-600 bg-orange-100">
                      <Thermometer size={32} />
                    </div>
                    <p className="text-slate-600 text-sm mb-2">Temperature</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {vitals.temperature.toFixed(1)}
                    </p>
                    <p className="text-slate-500 text-xs">°C</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 text-purple-600 bg-purple-100">
                      <Wind size={32} />
                    </div>
                    <p className="text-slate-600 text-sm mb-2">Blood Pressure</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(vitals.blood_pressure_systolic)}/{Math.round(vitals.blood_pressure_diastolic)}
                    </p>
                    <p className="text-slate-500 text-xs">mmHg</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {!isMonitoring ? (
                  <button
                    onClick={handleStartMonitoring}
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Activity size={20} />
                    Start Monitoring
                  </button>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-2 py-3 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      Monitoring Active
                    </div>
                    <button
                      onClick={handleStopAndRecord}
                      disabled={loading}
                      className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-400"
                    >
                      {loading ? 'Recording...' : 'Stop & Record'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Monitoring Guidelines</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="font-semibold text-slate-900">Normal Range</p>
                  <p className="text-slate-600 text-sm">Heart Rate: 60-100 bpm</p>
                  <p className="text-slate-600 text-sm">Blood Pressure: 90-120 / 60-80 mmHg</p>
                  <p className="text-slate-600 text-sm">Oxygen Level: 95-100%</p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <p className="font-semibold text-slate-900">Caution</p>
                  <p className="text-slate-600 text-sm">Heart Rate: 50-59 or 101-120 bpm</p>
                  <p className="text-slate-600 text-sm">Blood Pressure: Slightly elevated</p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-slate-900">High Priority</p>
                  <p className="text-slate-600 text-sm">Heart Rate: Below 50 or above 120 bpm</p>
                  <p className="text-slate-600 text-sm">Oxygen Level: Below 95%</p>
                  <p className="text-slate-600 text-sm">Seek medical attention</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
