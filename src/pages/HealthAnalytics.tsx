import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import BackButton from '../components/BackButton';
import { useHealthData } from '../hooks/useHealthData';

export default function HealthAnalytics() {
  const { healthRecords, analytics, loading } = useHealthData();

  const calculateStats = () => {
    if (healthRecords.length === 0) {
      return {
        avgHeartRate: 0,
        avgOxygen: 0,
        avgSystolic: 0,
        avgDiastolic: 0,
        avgTemp: 0,
      };
    }

    const avgHeartRate = Math.round(
      healthRecords.reduce((sum, r) => sum + r.heart_rate, 0) / healthRecords.length
    );
    const avgOxygen = Math.round(
      healthRecords.reduce((sum, r) => sum + r.oxygen_level, 0) / healthRecords.length
    );
    const avgSystolic = Math.round(
      healthRecords.reduce((sum, r) => sum + r.blood_pressure_systolic, 0) / healthRecords.length
    );
    const avgDiastolic = Math.round(
      healthRecords.reduce((sum, r) => sum + r.blood_pressure_diastolic, 0) / healthRecords.length
    );
    const avgTemp = Math.round(
      (healthRecords.reduce((sum, r) => sum + r.temperature, 0) / healthRecords.length) * 10
    ) / 10;

    return { avgHeartRate, avgOxygen, avgSystolic, avgDiastolic, avgTemp };
  };

  const stats = calculateStats();

  const StatCard = ({ icon: Icon, label, value, unit, color }: any) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-t-4" style={{ borderTopColor: color }}>
      <div className="flex items-center justify-between mb-4">
        <Icon size={28} style={{ color }} />
        <TrendingUp size={20} className="text-green-600" />
      </div>
      <p className="text-slate-600 text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-slate-500 text-xs mt-1">{unit}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackButton />

        <div className="mt-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Health Analytics</h1>
          <p className="text-slate-600 mb-8">Track trends and insights from your health data</p>

          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-slate-600">Loading analytics...</p>
            </div>
          ) : healthRecords.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <BarChart3 size={48} className="mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600">No data available</p>
              <p className="text-slate-500 text-sm">Start monitoring to see your health analytics</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <StatCard
                  icon={() => <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">❤️</div>}
                  label="Avg Heart Rate"
                  value={stats.avgHeartRate}
                  unit="bpm"
                  color="#ef4444"
                />
                <StatCard
                  icon={() => <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">💧</div>}
                  label="Avg Oxygen"
                  value={stats.avgOxygen}
                  unit="%"
                  color="#3b82f6"
                />
                <StatCard
                  icon={() => <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">📊</div>}
                  label="Avg Systolic"
                  value={stats.avgSystolic}
                  unit="mmHg"
                  color="#a855f7"
                />
                <StatCard
                  icon={() => <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">📉</div>}
                  label="Avg Diastolic"
                  value={stats.avgDiastolic}
                  unit="mmHg"
                  color="#6366f1"
                />
                <StatCard
                  icon={() => <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">🌡️</div>}
                  label="Avg Temperature"
                  value={stats.avgTemp}
                  unit="°C"
                  color="#f97316"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Health Insights</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="font-semibold text-blue-900 mb-1">Heart Health</p>
                      <p className="text-blue-800 text-sm">
                        {stats.avgHeartRate < 60 ? 'Your heart rate is on the lower side. Monitor for any symptoms.' :
                         stats.avgHeartRate > 100 ? 'Your heart rate is elevated. Consider stress management techniques.' :
                         'Your heart rate is within normal range. Keep up the healthy lifestyle!'}
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="font-semibold text-green-900 mb-1">Oxygen Saturation</p>
                      <p className="text-green-800 text-sm">
                        {stats.avgOxygen < 95 ? 'Your oxygen levels are low. Consult with a healthcare provider.' :
                         'Your oxygen saturation is healthy. Continue monitoring regularly.'}
                      </p>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="font-semibold text-orange-900 mb-1">Blood Pressure</p>
                      <p className="text-orange-800 text-sm">
                        {stats.avgSystolic > 130 || stats.avgDiastolic > 80 ? 'Your blood pressure is elevated. Consider lifestyle modifications.' :
                         'Your blood pressure readings are good. Maintain this healthy trend.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                    <Calendar size={24} />
                    Timeline
                  </h2>
                  <div className="space-y-3">
                    {healthRecords.slice(0, 5).map((record) => (
                      <div key={record.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-sm font-semibold text-slate-900">
                          {new Date(record.recorded_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-xs text-slate-600">
                          HR: {record.heart_rate} bpm | BP: {record.blood_pressure_systolic}/{record.blood_pressure_diastolic} | O₂: {record.oxygen_level}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
