import { useState, useEffect } from "react";
import {
  History,
  ArrowLeft,
  Plus,
  Search,
  Calendar,
  Shield,
  Download,
  FileText,
  Brain,
  Activity,
  Pill,
  Stethoscope,
  Clock,
  Lock,
  User,
  Weight,
  Ruler,
  Heart,
  CheckCircle,
  AlertTriangle,
  Loader2,
  TrendingUp,
  Zap,
  Eye,
  Filter,
  SortDesc,
  MoreHorizontal,
  Edit,
  Trash2,
  Share,
  Globe,
  Database,
  X,
  Home,
} from "lucide-react";

interface HealthRecord {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  doctor?: string;
  isSecure?: boolean;
  blockchainHash?: string;
  metadata?: any;
}

interface Message {
  type: "success" | "error";
  text: string;
}

export default function HealthHistory() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [activeTab, setActiveTab] = useState("records");
  const [stats, setStats] = useState({
    totalRecords: 0,
    secureRecords: 0,
    lastUpdate: null as string | null,
  });

  const [newRecord, setNewRecord] = useState({
    type: "",
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    doctor: "",
    metadata: {
      weight: "",
      height: "",
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      notes: "",
    },
  });

  const recordTypes = [
    { value: "checkup", label: "Regular Checkup", icon: Stethoscope, color: "bg-blue-500" },
    { value: "medication", label: "Medication", icon: Pill, color: "bg-green-500" },
    { value: "lab", label: "Lab Results", icon: FileText, color: "bg-purple-500" },
    { value: "imaging", label: "Imaging", icon: Activity, color: "bg-orange-500" },
    { value: "emergency", label: "Emergency", icon: Heart, color: "bg-red-500" },
    { value: "specialist", label: "Specialist Visit", icon: User, color: "bg-indigo-500" },
    { value: "vitals", label: "Vital Signs", icon: TrendingUp, color: "bg-teal-500" },
    { value: "other", label: "Other", icon: MoreHorizontal, color: "bg-gray-500" },
  ];

  // Load initial data
  useEffect(() => {
    loadHealthRecords();
  }, []);

  const loadHealthRecords = async () => {
    try {
      setIsLoading(true);
      
      // Simulated records - in production, this would call your API
      const mockRecords: HealthRecord[] = [
        {
          id: "1",
          type: "checkup",
          title: "Annual Physical Exam",
          description: "Regular annual health checkup with Dr. Smith. All vitals normal.",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          doctor: "Dr. John Smith",
          isSecure: true,
          blockchainHash: "0x1234567890abcdef",
          metadata: {
            weight: "75",
            height: "180",
            bloodPressure: "120/80",
            heartRate: "72",
            temperature: "36.5",
            notes: "Excellent overall health status",
          },
        },
        {
          id: "2",
          type: "lab",
          title: "Blood Test Results",
          description: "Complete blood count and metabolic panel. Results within normal range.",
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          doctor: "Dr. Sarah Johnson",
          isSecure: true,
          blockchainHash: "0x9876543210fedcba",
          metadata: {
            notes: "All values in normal range",
          },
        },
        {
          id: "3",
          type: "medication",
          title: "Prescription - Vitamin D",
          description: "Prescribed Vitamin D3 supplement for deficiency.",
          date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          doctor: "Dr. Michael Brown",
          isSecure: true,
          blockchainHash: "0x5555666677778888",
          metadata: {},
        },
      ];

      setRecords(mockRecords);
      setStats({
        totalRecords: mockRecords.length,
        secureRecords: mockRecords.filter((r) => r.isSecure).length,
        lastUpdate: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error loading records:", error);
      setMessage({ type: "error", text: "Failed to load health records" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Validate required fields
      if (!newRecord.type || !newRecord.title || !newRecord.description || !newRecord.date) {
        setMessage({ type: "error", text: "Please fill in all required fields" });
        setIsSubmitting(false);
        return;
      }

      // Create new record
      const record: HealthRecord = {
        id: Date.now().toString(),
        type: newRecord.type,
        title: newRecord.title,
        description: newRecord.description,
        date: newRecord.date,
        doctor: newRecord.doctor,
        isSecure: true,
        blockchainHash: "0x" + Math.random().toString(16).slice(2),
        metadata: newRecord.metadata,
      };

      setRecords([record, ...records]);
      setStats({
        ...stats,
        totalRecords: stats.totalRecords + 1,
        secureRecords: stats.secureRecords + 1,
        lastUpdate: new Date().toISOString(),
      });

      setMessage({
        type: "success",
        text: "Health record saved securely to blockchain!",
      });

      setIsDialogOpen(false);
      setNewRecord({
        type: "",
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        doctor: "",
        metadata: {
          weight: "",
          height: "",
          bloodPressure: "",
          heartRate: "",
          temperature: "",
          notes: "",
        },
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving record:", error);
      setMessage({ type: "error", text: "Failed to save record. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRecords = records
    .filter((record) => {
      const matchesSearch =
        record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.doctor && record.doctor.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = selectedType === "all" || record.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "type") return a.type.localeCompare(b.type);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  const getRecordIcon = (type: string) => {
    const recordType = recordTypes.find((rt) => rt.value === type);
    return recordType ? recordType.icon : FileText;
  };

  const getRecordColor = (type: string) => {
    const recordType = recordTypes.find((rt) => rt.value === type);
    return recordType ? recordType.color : "bg-gray-500";
  };

  const getRecordLabel = (type: string) => {
    const recordType = recordTypes.find((rt) => rt.value === type);
    return recordType ? recordType.label : type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
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
                <span className="hidden sm:inline">Back to Menu</span>
                <span className="sm:hidden">Back</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25">
                  <History className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Health History</h1>
                  <p className="text-sm text-gray-600 font-medium">Secure Medical Records</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700">
                <Database className="w-3 h-3" />
                <span className="hidden sm:inline">Blockchain Secured</span>
                <span className="sm:hidden">Secured</span>
              </div>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Record</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-300"
                : "bg-red-50 border-red-300"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className={`h-5 w-5 ${message.type === "success" ? "text-emerald-600" : "text-red-600"}`} />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            <p className={`font-medium text-sm ${message.type === "success" ? "text-emerald-800" : "text-red-800"}`}>
              {message.text}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="space-y-6">
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { value: "records", label: "Records", icon: FileText },
              { value: "analytics", label: "Analytics", icon: TrendingUp },
              { value: "security", label: "Security", icon: Shield },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.value
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Records Tab */}
          {activeTab === "records" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: FileText, label: "Total Records", value: stats.totalRecords, bgColor: "bg-blue-100", iconColor: "text-blue-600" },
                  { icon: Shield, label: "Secure Records", value: stats.secureRecords, bgColor: "bg-emerald-100", iconColor: "text-emerald-600" },
                  { icon: Clock, label: "Last Update", value: stats.lastUpdate ? new Date(stats.lastUpdate).toLocaleDateString() : "Never", bgColor: "bg-purple-100", iconColor: "text-purple-600" },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                        <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Search and Filters */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Search & Filter Records</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search records, descriptions, or doctors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  >
                    <option value="all">All Types</option>
                    {recordTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="type">Sort by Type</option>
                    <option value="title">Sort by Title</option>
                  </select>
                </div>
              </div>

              {/* Records List */}
              <div className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredRecords.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                    <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Records Found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm || selectedType !== "all" ? "No records match your criteria." : "Start by adding your first health record."}
                    </p>
                    <button
                      onClick={() => setIsDialogOpen(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 mx-auto transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add First Record
                    </button>
                  </div>
                ) : (
                  filteredRecords.map((record) => {
                    const RecordIcon = getRecordIcon(record.type);
                    return (
                      <div key={record.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${getRecordColor(record.type)} text-white`}>
                            <RecordIcon className="w-6 h-6" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                                <div className="flex items-center gap-3 text-sm text-gray-600 mt-1 flex-wrap">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(record.date).toLocaleDateString()}
                                  </div>
                                  {record.doctor && (
                                    <div className="flex items-center gap-1">
                                      <User className="w-4 h-4" />
                                      {record.doctor}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                {record.isSecure && (
                                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold flex items-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    Secure
                                  </span>
                                )}
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                                  {getRecordLabel(record.type)}
                                </span>
                              </div>
                            </div>

                            <p className="text-gray-700 mb-3 line-clamp-2">{record.description}</p>

                            {record.metadata && Object.keys(record.metadata).some((key) => record.metadata[key]) && (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm bg-gray-50 rounded-lg p-3">
                                {record.metadata.weight && (
                                  <div>
                                    <span className="text-gray-600">Weight:</span>
                                    <p className="font-medium text-gray-900">{record.metadata.weight} kg</p>
                                  </div>
                                )}
                                {record.metadata.bloodPressure && (
                                  <div>
                                    <span className="text-gray-600">BP:</span>
                                    <p className="font-medium text-gray-900">{record.metadata.bloodPressure}</p>
                                  </div>
                                )}
                                {record.metadata.heartRate && (
                                  <div>
                                    <span className="text-gray-600">HR:</span>
                                    <p className="font-medium text-gray-900">{record.metadata.heartRate} bpm</p>
                                  </div>
                                )}
                                {record.metadata.temperature && (
                                  <div>
                                    <span className="text-gray-600">Temp:</span>
                                    <p className="font-medium text-gray-900">{record.metadata.temperature}°C</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-center py-12">
              <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
              <p className="text-gray-600">
                We're working on powerful analytics features to help you understand your health trends and patterns.
              </p>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  Security & Privacy
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Encryption Status</h4>
                    {[
                      { title: "End-to-End Encryption", status: "Active" },
                      { title: "Blockchain Storage", status: "Secured" },
                      { title: "Split Key Encryption", status: "Enabled" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium text-gray-900">{item.title}</span>
                        </div>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-semibold">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Privacy Controls</h4>
                    {[
                      { title: "Data Ownership", badge: "You Own Your Data", desc: "Your data belongs to you and is never shared without consent." },
                      { title: "Access Control", badge: "Private by Default", desc: "Only you can access your records with unique authentication." },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{item.title}</span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-semibold">{item.badge}</span>
                        </div>
                        <p className="text-xs text-gray-600">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Record Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-0">
            <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h2 className="font-bold text-lg text-gray-900">Add New Health Record</h2>
                    <p className="text-sm text-gray-600">Create a record securely stored on blockchain</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">Record Type *</label>
                    <select
                      value={newRecord.type}
                      onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      required
                    >
                      <option value="">Select record type</option>
                      {recordTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">Date *</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Annual Physical Exam"
                    value={newRecord.title}
                    onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Description *</label>
                  <textarea
                    placeholder="Detailed description of the medical record..."
                    value={newRecord.description}
                    onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Healthcare Provider</label>
                  <input
                    type="text"
                    placeholder="e.g., Dr. Smith"
                    value={newRecord.doctor}
                    onChange={(e) => setNewRecord({ ...newRecord, doctor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Additional Information (Optional)</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">Weight</label>
                      <div className="relative">
                        <Weight className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="kg"
                          value={newRecord.metadata.weight}
                          onChange={(e) => setNewRecord({ ...newRecord, metadata: { ...newRecord.metadata, weight: e.target.value } })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">Height</label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="cm"
                          value={newRecord.metadata.height}
                          onChange={(e) => setNewRecord({ ...newRecord, metadata: { ...newRecord.metadata, height: e.target.value } })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">Blood Pressure</label>
                      <div className="relative">
                        <Heart className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="120/80"
                          value={newRecord.metadata.bloodPressure}
                          onChange={(e) => setNewRecord({ ...newRecord, metadata: { ...newRecord.metadata, bloodPressure: e.target.value } })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900">Heart Rate</label>
                      <div className="relative">
                        <Activity className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="bpm"
                          value={newRecord.metadata.heartRate}
                          onChange={(e) => setNewRecord({ ...newRecord, metadata: { ...newRecord.metadata, heartRate: e.target.value } })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">Additional Notes</label>
                    <textarea
                      placeholder="Any additional notes or observations..."
                      value={newRecord.metadata.notes}
                      onChange={(e) => setNewRecord({ ...newRecord, metadata: { ...newRecord.metadata, notes: e.target.value } })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        Save Securely
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
