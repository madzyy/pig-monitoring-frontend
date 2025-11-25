import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PigHealth {
  id: string;
  name: string;
  temp: number;
  avgTemp: number;
  heartRate: number;
  lastBehavior: string;
  behaviorDuration: number; // hours
  status: 'healthy' | 'warning' | 'sick';
  diagnosis: string;
  collar: {
    battery: number;
    signal: 'strong' | 'weak';
  };
}

export default function HealthMonitor() {
  const [selectedPig, setSelectedPig] = useState('PIG-001');

  // Mock health data
  const pigs: PigHealth[] = [
    {
      id: 'PIG-001',
      name: 'Pig 001',
      temp: 38.5,
      avgTemp: 38.4,
      heartRate: 75,
      lastBehavior: 'Eating',
      behaviorDuration: 0.5,
      status: 'healthy',
      diagnosis: 'Normal vitals. Active and eating regularly.',
      collar: { battery: 85, signal: 'strong' },
    },
    {
      id: 'PIG-003',
      name: 'Pig 003',
      temp: 38.3,
      avgTemp: 38.5,
      heartRate: 72,
      lastBehavior: 'Walking',
      behaviorDuration: 1.2,
      status: 'healthy',
      diagnosis: 'All parameters within normal range.',
      collar: { battery: 92, signal: 'strong' },
    },
    {
      id: 'PIG-007',
      name: 'Pig 007',
      temp: 39.2,
      avgTemp: 38.6,
      heartRate: 88,
      lastBehavior: 'Sleeping',
      behaviorDuration: 6.5,
      status: 'warning',
      diagnosis: 'Elevated temperature and prolonged sleep. Monitor for illness.',
      collar: { battery: 45, signal: 'strong' },
    },
    {
      id: 'PIG-012',
      name: 'Pig 012',
      temp: 38.6,
      avgTemp: 38.5,
      heartRate: 78,
      lastBehavior: 'Lying',
      behaviorDuration: 2.0,
      status: 'healthy',
      diagnosis: 'Healthy. Normal rest period.',
      collar: { battery: 78, signal: 'strong' },
    },
    {
      id: 'PIG-015',
      name: 'Pig 015',
      temp: 39.8,
      avgTemp: 38.4,
      heartRate: 95,
      lastBehavior: 'Lying',
      behaviorDuration: 8.0,
      status: 'sick',
      diagnosis: 'High fever and lethargy. Possible infection. Veterinary attention required.',
      collar: { battery: 15, signal: 'weak' },
    },
  ];

  const selectedPigData = pigs.find((p) => p.id === selectedPig) || pigs[0];

  // Temperature history (mock data)
  const tempHistory = [
    { time: '00:00', temp: 38.4 },
    { time: '04:00', temp: 38.3 },
    { time: '08:00', temp: 38.5 },
    { time: '12:00', temp: 38.6 },
    { time: '16:00', temp: 39.0 },
    { time: '20:00', temp: selectedPigData.temp },
  ];

  // Behavior pattern (hours spent in last 24h)
  const behaviorPattern = [
    { behavior: 'Sleeping', hours: selectedPigData.status === 'sick' ? 12 : 8 },
    { behavior: 'Eating', hours: selectedPigData.status === 'sick' ? 2 : 4 },
    { behavior: 'Walking', hours: selectedPigData.status === 'sick' ? 2 : 6 },
    { behavior: 'Lying', hours: selectedPigData.status === 'sick' ? 5 : 4 },
    { behavior: 'Investigating', hours: selectedPigData.status === 'sick' ? 1 : 2 },
  ];

  // Health distribution
  const healthDistribution = [
    { name: 'Healthy', value: pigs.filter((p) => p.status === 'healthy').length },
    { name: 'Warning', value: pigs.filter((p) => p.status === 'warning').length },
    { name: 'Sick', value: pigs.filter((p) => p.status === 'sick').length },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  const getStatusBadge = (status: string) => {
    if (status === 'healthy') return 'bg-green-100 text-green-800';
    if (status === 'warning') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'healthy') {
      return (
        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    if (status === 'warning') {
      return (
        <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Health Monitoring System</h1>
          <p className="text-gray-600 mt-1">Temperature tracking and health analysis</p>
        </div>
      </div>

      {/* Health Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 mb-1">Healthy Pigs</p>
              <p className="text-4xl font-bold text-green-600">
                {pigs.filter((p) => p.status === 'healthy').length}
              </p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 mb-1">Warnings</p>
              <p className="text-4xl font-bold text-yellow-600">
                {pigs.filter((p) => p.status === 'warning').length}
              </p>
            </div>
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 mb-1">Sick / Critical</p>
              <p className="text-4xl font-bold text-red-600">
                {pigs.filter((p) => p.status === 'sick').length}
              </p>
            </div>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Pig Health Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pig Selector & Details */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Pig</h3>
            <select
              value={selectedPig}
              onChange={(e) => setSelectedPig(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
            >
              {pigs.map((pig) => (
                <option key={pig.id} value={pig.id}>
                  {pig.id} - {pig.status.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Health Status Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Health Status</h3>
              {getStatusIcon(selectedPigData.status)}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusBadge(selectedPigData.status)}`}>
                  {selectedPigData.status.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Temperature:</span>
                <span className={`text-xl font-bold ${
                  selectedPigData.temp > 39 ? 'text-red-600' :
                  selectedPigData.temp > 38.8 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {selectedPigData.temp}°C
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Heart Rate:</span>
                <span className="text-lg font-bold text-gray-900">{selectedPigData.heartRate} BPM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Collar Battery:</span>
                <span className={`text-lg font-bold ${
                  selectedPigData.collar.battery < 20 ? 'text-red-600' :
                  selectedPigData.collar.battery < 50 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {selectedPigData.collar.battery}%
                </span>
              </div>
            </div>
          </div>

          {/* Diagnosis Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              AI Diagnosis
            </h3>
            <p className="text-gray-700">{selectedPigData.diagnosis}</p>
            
            {selectedPigData.status !== 'healthy' && (
              <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-sm font-medium text-blue-900">Recommended Action:</p>
                <p className="text-sm text-blue-800 mt-1">
                  {selectedPigData.status === 'sick' 
                    ? 'Isolate and contact veterinarian immediately.'
                    : 'Continue monitoring. Check again in 2 hours.'}
                </p>
              </div>
            )}
          </div>

          {/* Current Behavior */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Behavior</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Activity:</span>
                <span className="font-bold text-gray-900">{selectedPigData.lastBehavior}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className={`font-bold ${
                  selectedPigData.behaviorDuration > 6 && selectedPigData.lastBehavior === 'Sleeping' 
                    ? 'text-red-600' 
                    : 'text-gray-900'
                }`}>
                  {selectedPigData.behaviorDuration.toFixed(1)} hours
                </span>
              </div>
              {selectedPigData.behaviorDuration > 6 && selectedPigData.lastBehavior === 'Sleeping' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-start text-red-600 text-sm">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Prolonged sleeping detected. Possible lethargy or illness.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Temperature History */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Temperature Trend (24 Hours)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={tempHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[37, 40]} label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                {/* Normal range area */}
                <Line type="monotone" dataKey="temp" stroke="#3B82F6" strokeWidth={3} name="Temperature" dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-200 border-2 border-green-500 mr-2"></div>
                <span className="text-gray-600">Normal Range: 38.0-38.9°C</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-200 border-2 border-red-500 mr-2"></div>
                <span className="text-gray-600">Fever: {'>'}39.0°C</span>
              </div>
            </div>
          </div>

          {/* Behavior Pattern */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Behavior Pattern (Last 24 Hours)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={behaviorPattern}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="behavior" />
                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="hours" fill="#06B6D4" name="Time (hours)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Overall Health Distribution */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Herd Health Overview</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={healthDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {healthDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

