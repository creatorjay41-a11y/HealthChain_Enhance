import { AlertTriangle, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import BackButton from '../components/BackButton';
import { useHealthData } from '../hooks/useHealthData';
import { useState } from 'react';

export default function HealthRiskPrediction() {
  const { healthRecords, riskAssessment, updateRiskAssessment, loading } = useHealthData();
  const [refreshing, setRefreshing] = useState(false);

  const calculateRiskLevel = () => {
    if (healthRecords.length === 0) return null;

    const avgHeartRate = healthRecords.reduce((sum, r) => sum + r.heart_rate, 0) / healthRecords.length;
    const avgOxygen = healthRecords.reduce((sum, r) => sum + r.oxygen_level, 0) / healthRecords.length;
    const avgSystolic = healthRecords.reduce((sum, r) => sum + r.blood_pressure_systolic, 0) / healthRecords.length;

    const riskFactors: string[] = [];
    let riskScore = 0;

    if (avgHeartRate < 60 || avgHeartRate > 100) {
      riskFactors.push('Abnormal Heart Rate');
      riskScore += 2;
    }

    if (avgOxygen < 95) {
      riskFactors.push('Low Oxygen Saturation');
      riskScore += 3;
    }

    if (avgSystolic > 130) {
      riskFactors.push('High Blood Pressure');
      riskScore += 2;
    }

    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (riskScore >= 5) riskLevel = 'high';
    else if (riskScore >= 2) riskLevel = 'medium';

    const recommendations: string[] = [];
    if (riskFactors.includes('Abnormal Heart Rate')) {
      recommendations.push('Monitor your heart rate regularly and consult with a cardiologist if symptoms persist');
    }
    if (riskFactors.includes('Low Oxygen Saturation')) {
      recommendations.push('Ensure proper ventilation and consider consulting a respiratory specialist');
    }
    if (riskFactors.includes('High Blood Pressure')) {
      recommendations.push('Reduce sodium intake, manage stress, and increase physical activity');
    }
    if (recommendations.length === 0) {
      recommendations.push('Maintain your current healthy lifestyle and continue regular monitoring');
    }

    return {
      riskLevel,
      riskFactors,
      recommendations,
    };
  };

  const assessment = calculateRiskLevel();

  const handleRefreshAssessment = async () => {
    if (!assessment) return;
    setRefreshing(true);
    try {
      await updateRiskAssessment({
        risk_level: assessment.riskLevel,
        risk_factors: assessment.riskFactors,
        recommendations: assessment.recommendations,
        assessed_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to update risk assessment:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', badge: 'bg-green-100 text-green-800' };
      case 'medium':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900', badge: 'bg-yellow-100 text-yellow-800' };
      case 'high':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', badge: 'bg-red-100 text-red-800' };
      default:
        return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-900', badge: 'bg-slate-100 text-slate-800' };
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle size={32} className="text-green-600" />;
      case 'medium':
        return <AlertCircle size={32} className="text-yellow-600" />;
      case 'high':
        return <AlertTriangle size={32} className="text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton />

        <div className="mt-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Health Risk Prediction</h1>
          <p className="text-slate-600 mb-8">Personalized health risk assessment based on your data</p>

          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-slate-600">Loading risk assessment...</p>
            </div>
          ) : !assessment ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <AlertTriangle size={48} className="mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600">No health data available</p>
              <p className="text-slate-500 text-sm">Start monitoring to receive a personalized risk assessment</p>
            </div>
          ) : (
            <>
              <div className={`${getRiskColor(assessment.riskLevel).bg} ${getRiskColor(assessment.riskLevel).border} rounded-xl shadow-lg p-8 border mb-8`}>
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-6">
                    {getRiskIcon(assessment.riskLevel)}
                    <div>
                      <h2 className={`text-2xl font-bold ${getRiskColor(assessment.riskLevel).text} mb-2`}>
                        {assessment.riskLevel.charAt(0).toUpperCase() + assessment.riskLevel.slice(1)} Risk
                      </h2>
                      <p className={`${getRiskColor(assessment.riskLevel).text} mb-4`}>
                        Based on your recent health metrics and trends
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {assessment.riskFactors.map((factor, idx) => (
                          <span key={idx} className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(assessment.riskLevel).badge}`}>
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleRefreshAssessment}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400 whitespace-nowrap"
                  >
                    <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                    {refreshing ? 'Updating' : 'Update'}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Recommendations</h2>
                <div className="space-y-4">
                  {assessment.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <CheckCircle size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                      <p className="text-slate-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Disclaimer:</span> This risk assessment is based on your health metrics and should not replace professional medical advice. Always consult with a healthcare provider for personalized guidance.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
