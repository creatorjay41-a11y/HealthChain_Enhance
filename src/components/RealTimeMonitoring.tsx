import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Zap,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  Smartphone,
  Watch,
  Brain,
  Bluetooth,
  BarChart3,
} from "lucide-react";

interface VitalSigns {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
  timestamp: string;
}

interface Device {
  id: string;
  name: string;
  type: "smartwatch" | "fitness_tracker" | "blood_pressure" | "thermometer" | "pulse_oximeter";
  status: "connected" | "disconnected" | "syncing";
  battery: number;
  lastSync: string;
  icon: React.ElementType;
}

interface Alert {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  severity: "high" | "medium" | "low";
}

export default function RealTimeMonitoring() {
  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    temperature: 98.6,
    oxygenSaturation: 98,
    respiratoryRate: 16,
    timestamp: new Date().toISOString(),
  });

  const [vitalsHistory, setVitalsHistory] = useState<any[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<Device[]>([
    {
      id: "apple_watch",
      name: "Apple Watch Series 9",
      type: "smartwatch",
      status: "connected",
      battery: 85,
      lastSync: "2 minutes ago",
      icon: Watch,
    },
    {
      id: "fitbit_charge",
      name: "Fitbit Charge 6",
      type: "fitness_tracker",
      status: "connected",
      battery: 62,
      lastSync: "5 minutes ago",
      icon: Activity,
    },
    {
      id: "omron_bp",
      name: "Omron Blood Pressure Monitor",
      type: "blood_pressure",
      status: "syncing",
      battery: 45,
      lastSync: "1 hour ago",
      icon: Heart,
    },
    {
      id: "pulse_ox",
      name: "Masimo Pulse Oximeter",
      type: "pulse_oximeter",
      status: "disconnected",
      battery: 20,
      lastSync: "3 hours ago",
      icon: Droplets,
    },
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: "warning",
      message: "Heart rate elevated above normal range (>100 BPM)",
      timestamp: "2 minutes ago",
      severity: "medium",
    },
    {
      id: 2,
      type: "info",
      message: "Fitbit sync completed successfully",
      timestamp: "5 minutes ago",
      severity: "low",
    },
  ]);

  const [activeTab, setActiveTab] = useState("overview");

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newVitals: VitalSigns = {
        heartRate: Math.floor(Math.random() * 20) + 65,
        bloodPressure: {
          systolic: Math.floor(Math.random() * 20) + 110,
          diastolic: Math.floor(Math.random() * 15) + 70,
        },
        temperature: Math.random() * 2 + 97.5,
        oxygenSaturation: Math.floor(Math.random() * 3) + 97,
        respiratoryRate: Math.floor(Math.random() * 6) + 14,
        timestamp: now.toISOString(),
      };

      setVitalSigns(newVitals);

      setVitalsHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            time: now.toLocaleTimeString(),
            heartRate: newVitals.heartRate,
            temperature: newVitals.temperature,
            oxygenSat: newVitals.oxygenSaturation,
            systolic: newVitals.bloodPressure.systolic,
          },
        ].slice(-20);
        return newHistory;
      });

      if (newVitals.heartRate > 100 && Math.random() > 0.8) {
        setAlerts((prev) => [
          {
            id: Date.now(),
            type: "warning",
            message: `Heart rate spike detected: ${newVitals.heartRate} BPM`,
            timestamp: "Just now",
            severity: "high",
          },
          ...prev.slice(0, 4),
        ]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getVitalStatus = (type: string, value: number) => {
    switch (type) {
      case "heartRate":
        if (value < 60) return { status: "low", color: "text-blue-600", bgColor: "bg-blue-50" };
        if (value > 100) return { status: "high", color: "text-red-600", bgColor: "bg-red-50" };
        return { status: "normal", color: "text-green-600", bgColor: "bg-green-50" };
      case "bloodPressure":
        if (value > 140) return { status: "high", color: "text-red-600", bgColor: "bg-red-50" };
        if (value < 90) return { status: "low", color: "text-blue-600", bgColor: "bg-blue-50" };
        return { status: "normal", color: "text-green-600", bgColor: "bg-green-50" };
      case "temperature":
        if (value > 100.4) return { status: "fever", color: "text-red-600", bgColor: "bg-red-50" };
        if (value < 97) return { status: "low", color: "text-blue-600", bgColor: "bg-blue-50" };
        return { status: "normal", color: "text-green-600", bgColor: "bg-green-50" };
      case "oxygenSat":
        if (value < 95) return { status: "low", color: "text-red-600", bgColor: "bg-red-50" };
        return { status: "normal", color: "text-green-600", bgColor: "bg-green-50" };
      default:
        return { status: "normal", color: "text-green-600", bgColor: "bg-green-50" };
    }
  };

  const heartRateStatus = getVitalStatus("heartRate", vitalSigns.heartRate);
  const bpStatus = getVitalStatus("bloodPressure", vitalSigns.bloodPressure.systolic);
  const tempStatus = getVitalStatus("temperature", vitalSigns.temperature);
  const oxygenStatus = getVitalStatus("oxygenSat", vitalSigns.oxygenSaturation);

  // Simple bar chart component for vitals history
  const SimpleChart = () => {
    if (vitalsHistory.length === 0) {
      return (
        <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Waiting for data...</p>
        </div>
      );
    }

    const maxValue = Math.max(...vitalsHistory.map(d => Math.max(d.heartRate, d.oxygenSat, d.systolic)));
    const minValue = Math.min(...vitalsHistory.map(d => Math.min(d.heartRate, d.oxygenSat, d.systolic)));
    const range = maxValue - minValue || 100;

    return (
      <div className="w-full h-80 bg-white rounded-lg p-4 flex flex-col">
        <div className="flex-1 flex items-end justify-between gap-1">
          {vitalsHistory.slice(-12).map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full flex gap-0.5 items-end justify-center h-48">
                <div
                  className="flex-1 bg-red-500 rounded-sm hover:bg-red-600 transition-all tooltip group-hover:opacity-100"
                  style={{
                    height: `${((item.heartRate - minValue) / range) * 100}%`,
                    minHeight: "2px",
                  }}
                  title={`HR: ${item.heartRate}`}
                />
                <div
                  className="flex-1 bg-blue-500 rounded-sm hover:bg-blue-600 transition-all"
                  style={{
                    height: `${((item.oxygenSat - minValue) / range) * 100}%`,
                    minHeight: "2px",
                  }}
                  title={`O2: ${item.oxygenSat}%`}
                />
                <div
                  className="flex-1 bg-green-500 rounded-sm hover:bg-green-600 transition-all"
                  style={{
                    height: `${((item.systolic - minValue) / range) * 100}%`,
                    minHeight: "2px",
                  }}
                  title={`BP: ${item.systolic}`}
                />
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">{item.time.split(":").slice(0, 2).join(":")}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.href = "/"}
                className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-gray-700 font-medium text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Real-time Health Monitoring</h1>
                  <p className="text-sm text-gray-600 font-medium">Live IoT Device Integration</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Live Monitoring
              </div>
              <div className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded-full text-xs text-gray-600">
                <Clock className="w-3 h-3" />
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="mb-8 space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={`border-l-4 p-4 rounded-lg flex gap-3 ${
                  alert.severity === "high"
                    ? "border-red-500 bg-red-50"
                    : alert.severity === "medium"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-blue-500 bg-blue-50"
                }`}
              >
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-600 mt-1">{alert.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Live Vital Signs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Heart Rate Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className={`w-5 h-5 ${heartRateStatus.color}`} />
                <h3 className="font-medium text-sm text-gray-900">Heart Rate</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${heartRateStatus.bgColor}`}>
                {heartRateStatus.status}
              </span>
            </div>
            <div className="mb-3">
              <div className="text-3xl font-bold text-gray-900">
                {vitalSigns.heartRate}
                <span className="text-lg text-gray-500 ml-1">BPM</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
              Normal range: 60-100 BPM
            </div>
          </div>

          {/* Blood Pressure Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className={`w-5 h-5 ${bpStatus.color}`} />
                <h3 className="font-medium text-sm text-gray-900">Blood Pressure</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bpStatus.bgColor}`}>
                {bpStatus.status}
              </span>
            </div>
            <div className="mb-3">
              <div className="text-3xl font-bold text-gray-900">
                {vitalSigns.bloodPressure.systolic}
                <span className="text-xl text-gray-500">/{vitalSigns.bloodPressure.diastolic}</span>
                <span className="text-lg text-gray-500 ml-1">mmHg</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
              Target: &lt;120/80 mmHg
            </div>
          </div>

          {/* Temperature Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Thermometer className={`w-5 h-5 ${tempStatus.color}`} />
                <h3 className="font-medium text-sm text-gray-900">Temperature</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tempStatus.bgColor}`}>
                {tempStatus.status}
              </span>
            </div>
            <div className="mb-3">
              <div className="text-3xl font-bold text-gray-900">
                {vitalSigns.temperature.toFixed(1)}
                <span className="text-lg text-gray-500 ml-1">°F</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
              Normal: 97-99°F
            </div>
          </div>

          {/* Oxygen Saturation Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Droplets className={`w-5 h-5 ${oxygenStatus.color}`} />
                <h3 className="font-medium text-sm text-gray-900">Oxygen Saturation</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${oxygenStatus.bgColor}`}>
                {oxygenStatus.status}
              </span>
            </div>
            <div className="mb-3">
              <div className="text-3xl font-bold text-gray-900">
                {vitalSigns.oxygenSaturation}
                <span className="text-lg text-gray-500 ml-1">%</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
              Normal: &gt;95%
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("devices")}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "devices"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Bluetooth className="h-4 w-4" />
              Devices
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "analytics"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Brain className="h-4 w-4" />
              Analytics
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Live Vital Signs Trends
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Real-time data from connected IoT devices</p>
                  </div>
                  <SimpleChart />
                  <div className="flex gap-6 mt-4 pt-4 border-t border-gray-200 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-red-500"></div>
                      <span>Heart Rate (BPM)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                      <span>Oxygen Saturation (%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                      <span>Systolic BP (mmHg)</span>
                    </div>
                  </div>
                </div>

                {/* Connected Devices */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <Smartphone className="w-5 h-5 text-green-600" />
                    Connected Devices
                  </h2>
                  <div className="space-y-3">
                    {connectedDevices.map((device) => {
                      const IconComponent = device.icon;
                      return (
                        <div
                          key={device.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div
                              className={`p-2 rounded-lg flex-shrink-0 ${
                                device.status === "connected"
                                  ? "bg-green-100 text-green-600"
                                  : device.status === "syncing"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-red-100 text-red-600"
                              }`}
                            >
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm text-gray-900 truncate">{device.name}</p>
                              <p className="text-xs text-gray-600">{device.lastSync}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <span className="text-xs text-gray-600">{device.battery}%</span>
                            <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  device.battery > 50 ? "bg-green-500" : device.battery > 20 ? "bg-yellow-500" : "bg-red-500"
                                }`}
                                style={{ width: `${device.battery}%` }}
                              />
                            </div>
                            {device.status === "connected" ? (
                              <Wifi className="w-4 h-4 text-green-600" />
                            ) : device.status === "syncing" ? (
                              <Zap className="w-4 h-4 text-yellow-600 animate-pulse" />
                            ) : (
                              <WifiOff className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Devices Tab */}
          {activeTab === "devices" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">IoT Health Devices</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connectedDevices.map((device) => {
                  const IconComponent = device.icon;
                  return (
                    <div
                      key={device.id}
                      className={`p-4 rounded-lg border-2 ${
                        device.status === "connected"
                          ? "border-green-200 bg-green-50"
                          : device.status === "syncing"
                            ? "border-yellow-200 bg-yellow-50"
                            : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-3 rounded-lg ${
                              device.status === "connected"
                                ? "bg-green-100 text-green-600"
                                : device.status === "syncing"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-red-100 text-red-600"
                            }`}
                          >
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{device.name}</p>
                            <p className="text-xs text-gray-600">{device.type.replace("_", " ")}</p>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            device.status === "connected"
                              ? "bg-green-200 text-green-800"
                              : device.status === "syncing"
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-red-200 text-red-800"
                          }`}
                        >
                          {device.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Battery</span>
                          <span className="font-medium">{device.battery}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              device.battery > 50 ? "bg-green-500" : device.battery > 20 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${device.battery}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Last sync</span>
                          <span>{device.lastSync}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI Health Insights */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                  <Brain className="w-5 h-5 text-purple-600" />
                  AI Health Insights
                </h2>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-lg">
                    <p className="font-medium text-sm text-gray-900">
                      <strong>Heart Rate Pattern:</strong> Your heart rate shows a healthy circadian rhythm with good variability during exercise.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-lg">
                    <p className="font-medium text-sm text-gray-900">
                      <strong>Recovery Score:</strong> Excellent recovery patterns detected. Your body is adapting well to current activity levels.
                    </p>
                  </div>
                  <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-lg">
                    <p className="font-medium text-sm text-gray-900">
                      <strong>Sleep Quality:</strong> Consider improving sleep consistency. Irregular sleep patterns detected in the last week.
                    </p>
                  </div>
                </div>
              </div>

              {/* Health Score Breakdown */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Health Score Breakdown</h2>
                <div className="space-y-4">
                  {[
                    { metric: "Cardiovascular", score: 87, color: "bg-red-500" },
                    { metric: "Sleep Quality", score: 73, color: "bg-blue-500" },
                    { metric: "Activity Level", score: 92, color: "bg-green-500" },
                    { metric: "Stress Management", score: 68, color: "bg-yellow-500" },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-900">{item.metric}</span>
                        <span className="font-semibold text-gray-900">{item.score}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color}`} style={{ width: `${item.score}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
