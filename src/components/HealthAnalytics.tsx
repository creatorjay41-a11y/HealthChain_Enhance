import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Activity,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Brain,
  Heart,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  Shield,
  RefreshCw,
  Loader2,
  Info,
} from "lucide-react";

interface HealthMetric {
  id: string;
  type: string;
  value: number;
  timestamp: string;
  unit?: string;
}

interface HealthInsight {
  id: string;
  title: string;
  description: string;
  type: "positive" | "warning" | "critical" | "neutral";
  category: string;
  importance: "low" | "medium" | "high";
  confidence: number;
  action: string;
}

interface HealthTrend {
  metric: string;
  direction: "up" | "down" | "stable";
  change: string;
  percentage: number;
}

interface AnalyticsData {
  metrics: HealthMetric[];
  insights: HealthInsight[];
  trends: HealthTrend[];
  healthScore: number;
}

export default function HealthAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("insights");
  const [chartData, setChartData] = useState<any[]>([]);

  // Fetch analytics data from Netlify function
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/.netlify/functions/health-analytics", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load analytics";
      setError(errorMessage);
      console.error("Error fetching analytics:", err);
      
      // Fallback to local data if fetch fails
      setAnalyticsData({
        metrics: [],
        insights: [],
        trends: [],
        healthScore: 85,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate chart data
  useEffect(() => {
    const generateChartData = () => {
      const data = [];
      const days =
        selectedTimeframe === "week" ? 7 : selectedTimeframe === "month" ? 30 : 365;

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        data.push({
          date: date.toLocaleDateString(),
          heartRate: Math.floor(Math.random() * 20) + 65,
          steps: Math.floor(Math.random() * 3000) + 7000,
          sleep: Math.random() * 2 + 6.5,
          stress: Math.floor(Math.random() * 30) + 20,
        });
      }

      setChartData(data);
    };

    generateChartData();
  }, [selectedTimeframe]);

  // Load data on mount
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const healthMetrics = useMemo(() => {
    if (!analyticsData) return [];

    return [
      {
        title: "Overall Health Score",
        value: analyticsData.healthScore,
        target: 90,
        trend: "up",
        change: "+3.2%",
        description: "Based on your recent health data and AI analysis",
      },
      {
        title: "Cardiovascular Health",
        value: 82,
        target: 85,
        trend:
          analyticsData.trends.find((t) => t.metric.includes("Heart"))?.direction === "up"
            ? "up"
            : "down",
        change: analyticsData.trends.find((t) => t.metric.includes("Heart"))?.change || "+2.1%",
        description: "Heart rate, blood pressure, and activity trends",
      },
      {
        title: "Mental Wellness",
        value: 78,
        target: 80,
        trend: "down",
        change: "-1.5%",
        description: "Stress levels, sleep quality, and mood tracking",
      },
      {
        title: "Preventive Care",
        value: 95,
        target: 100,
        trend: "up",
        change: "+5.0%",
        description: "Checkups, screenings, and vaccination status",
      },
    ];
  }, [analyticsData]);

  const riskFactors = [
    {
      factor: "Hypertension Risk",
      level: "low",
      probability: 12,
      description: "Based on family history and current lifestyle",
    },
    {
      factor: "Diabetes Risk",
      level: "moderate",
      probability: 25,
      description: "Consider dietary modifications and regular monitoring",
    },
    {
      factor: "Heart Disease Risk",
      level: "low",
      probability: 8,
      description: "Excellent cardiovascular health indicators",
    },
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "positive":
        return "border-l-green-500 bg-green-50";
      case "warning":
        return "border-l-yellow-500 bg-yellow-50";
      case "critical":
        return "border-l-red-500 bg-red-50";
      default:
        return "border-l-blue-500 bg-blue-50";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between gap-4 flex-wrap">
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
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Health Analytics</h1>
                  <p className="text-sm text-gray-600">AI-Powered Insights</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={fetchAnalyticsData}
                disabled={isLoading}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 flex items-center gap-1 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </button>
              <div className="flex items-center gap-1 px-3 py-1 bg-purple-50 border border-purple-200 rounded-full text-xs font-semibold text-purple-700">
                <Brain className="h-3 w-3" />
                AI Powered
              </div>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg border border-gray-200">
                {["week", "month", "year"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedTimeframe(period)}
                    className={`px-3 py-2 text-xs font-medium transition-colors rounded ${
                      selectedTimeframe === period
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900 text-sm">{error}</p>
              <p className="text-red-800 text-xs mt-1">Please try refreshing the page.</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading health analytics...</p>
          </div>
        ) : (
          <>
            {/* Health Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {healthMetrics.map((metric, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900">{metric.title}</h3>
                    <div
                      className={`flex items-center text-xs font-semibold gap-1 ${
                        metric.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {metric.change}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                      <span className="text-sm text-gray-600">/{metric.target}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${(metric.value / metric.target) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600">{metric.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="space-y-6">
              <div className="flex gap-2 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("insights")}
                  className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === "insights"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Zap className="h-4 w-4" />
                  Insights
                </button>
                <button
                  onClick={() => setActiveTab("trends")}
                  className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === "trends"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <LineChart className="h-4 w-4" />
                  Trends
                </button>
                <button
                  onClick={() => setActiveTab("predictions")}
                  className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === "predictions"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  Risk Analysis
                </button>
              </div>

              {/* AI Insights Tab */}
              {activeTab === "insights" && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      AI-Generated Health Insights
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Personalized recommendations based on your health data analysis
                    </p>
                  </div>
                  <div className="space-y-4">
                    {analyticsData?.insights.map((insight, index) => (
                      <div
                        key={index}
                        className={`border-l-4 rounded-lg p-4 ${getInsightColor(insight.type)}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">{getInsightIcon(insight.type)}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                            <p className="text-sm text-gray-700 mt-1">{insight.description}</p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span className="px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700">
                                {insight.category}
                              </span>
                              <span className="text-xs text-gray-600">
                                Confidence: {insight.confidence}%
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  insight.importance === "high"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {insight.importance}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-blue-600 mt-2">
                              Recommended Action: {insight.action}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Health Trends Tab */}
              {activeTab === "trends" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Activity Summary */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        Activity Summary
                      </h2>
                      <div className="space-y-4">
                        {[
                          { activity: "Steps", value: 8500, target: 10000, unit: "steps" },
                          { activity: "Sleep", value: 7.2, target: 8, unit: "hours" },
                          { activity: "Water", value: 6, target: 8, unit: "glasses" },
                          { activity: "Exercise", value: 4, target: 5, unit: "days/week" },
                        ].map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-gray-900">{item.activity}</span>
                              <span className="text-gray-700">
                                {typeof item.value === "number" ? item.value.toFixed(1) : item.value} / {item.target} {item.unit}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600"
                                style={{ width: `${Math.min((item.value / item.target) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Health Categories */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                        <PieChart className="h-5 w-5 text-blue-600" />
                        Health Categories
                      </h2>
                      <div className="space-y-4">
                        {[
                          { category: "Physical Health", score: 85, color: "bg-red-500" },
                          { category: "Mental Health", score: 78, color: "bg-purple-500" },
                          { category: "Nutrition", score: 82, color: "bg-green-500" },
                          { category: "Prevention", score: 95, color: "bg-blue-500" },
                        ].map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-gray-900">{item.category}</span>
                              <span className="text-gray-700 font-semibold">{item.score}%</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${item.color}`}
                                  style={{ width: `${item.score}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chart Data */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                        <LineChart className="h-5 w-5 text-blue-600" />
                        Metrics Overview
                      </h2>
                      <div className="space-y-3 text-sm">
                        {chartData.slice(-5).map((data, idx) => (
                          <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-gray-600">{data.date}</span>
                            <div className="flex gap-2 text-xs font-semibold">
                              <span className="text-red-600">HR: {data.heartRate}</span>
                              <span className="text-blue-600">Steps: {Math.round(data.steps / 1000)}k</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Risk Analysis Tab */}
              {activeTab === "predictions" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Predictive Risk Analysis
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      AI-powered risk assessment based on your health data and lifestyle factors
                    </p>
                    <div className="space-y-4">
                      {riskFactors.map((risk, index) => (
                        <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">{risk.factor}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(risk.level)}`}>
                              {risk.level} risk
                            </span>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">Risk Probability</span>
                              <span className="font-semibold text-gray-900">{risk.probability}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  risk.level === "low"
                                    ? "bg-green-500"
                                    : risk.level === "moderate"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${risk.probability}%` }}
                              />
                            </div>
                            <p className="text-sm text-gray-600">{risk.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prevention Plan */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-200 p-6 shadow-sm flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex-shrink-0">
                      <Brain className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Personalized Prevention Plan</h3>
                      <p className="text-sm text-gray-700">
                        Based on your risk analysis, we've created a customized prevention plan to help you maintain optimal health and reduce future health risks.
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm flex-shrink-0 transition-colors">
                      View Plan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
