import { Calendar, Download, Filter } from 'lucide-react';
import BackButton from '../components/BackButton';
import { useHealthData } from '../hooks/useHealthData';

export default function HealthHistory() {
  const { healthRecords, loading } = useHealthData();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportData = () => {
    const csv = [
      ['Date', 'Heart Rate (bpm)', 'Blood Pressure', 'Oxygen Level (%)', 'Temperature (°C)'],
      ...healthRecords.map(record => [
        formatDate(record.recorded_at),
        record.heart_rate,
        `${record.blood_pressure_systolic}/${record.blood_pressure_diastolic}`,
        record.oxygen_level,
        record.temperature,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackButton />

        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Health History</h1>
              <p className="text-slate-600 mt-2">View and manage your health records</p>
            </div>
            <button
              onClick={exportData}
              disabled={healthRecords.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <Filter size={20} className="text-slate-600" />
              <p className="text-slate-700 font-semibold">
                {loading ? 'Loading records...' : `${healthRecords.length} records found`}
              </p>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <p className="text-slate-600">Loading health records...</p>
              </div>
            ) : healthRecords.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar size={48} className="mx-auto mb-4 text-slate-400" />
                <p className="text-slate-600">No health records found</p>
                <p className="text-slate-500 text-sm">Start monitoring to create your first record</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date & Time</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Heart Rate</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Blood Pressure</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Oxygen Level</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Temperature</th>
                    </tr>
                  </thead>
                  <tbody>
                    {healthRecords.map((record, idx) => (
                      <tr key={record.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-6 py-4 text-sm text-slate-900">{formatDate(record.recorded_at)}</td>
                        <td className="px-6 py-4 text-sm text-slate-900 font-semibold">{record.heart_rate} bpm</td>
                        <td className="px-6 py-4 text-sm text-slate-900">
                          {record.blood_pressure_systolic}/{record.blood_pressure_diastolic} mmHg
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">{record.oxygen_level}%</td>
                        <td className="px-6 py-4 text-sm text-slate-900">{record.temperature}°C</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
