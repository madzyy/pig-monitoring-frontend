import { useState, useEffect } from 'react';
import { livestockAPI, HealthResponse, Detection } from '../api/livestock-api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Dashboard() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [healthData, detectionsData] = await Promise.all([
        livestockAPI.checkHealth(),
        livestockAPI.getAllDetections()
      ]);
      setHealth(healthData);
      setDetections(detectionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = loadData;

  // Behavior mapping
  const getBehaviorName = (classId: number): string => {
    const behaviors = ['Lying', 'Sleeping', 'Investigating', 'Eating', 'Walking', 'Mounted'];
    return behaviors[classId] || 'Unknown';
  };

  // Calculate behavior distribution
  const behaviorData = detections.reduce((acc, det) => {
    const behavior = getBehaviorName(det.class_id);
    const existing = acc.find(item => item.name === behavior);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: behavior, value: 1 });
    }
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  // Calculate average confidence per behavior
  const confidenceByBehavior = detections.reduce((acc, det) => {
    const behavior = getBehaviorName(det.class_id);
    if (!acc[behavior]) {
      acc[behavior] = { total: 0, count: 0 };
    }
    acc[behavior].total += det.confidence;
    acc[behavior].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const avgConfidenceData = Object.entries(confidenceByBehavior).map(([name, data]) => ({
    name,
    confidence: ((data.total / data.count) * 100).toFixed(1),
  }));

  // Detections over time (group by day)
  const detectionsOverTime = detections.reduce((acc, det) => {
    const date = new Date(det.timestamp).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, [] as Array<{ date: string; count: number }>).slice(-7); // Last 7 days

  const COLORS = ['#10B981', '#3B82F6', '#06B6D4', '#0EA5E9', '#6366F1', '#8B5CF6'];

  if (loading) {
    return (
      <div className="w-full animate-pulse">
        <div className="h-9 bg-gray-200 rounded w-80 mb-6"></div>
        
        {/* Status Card Skeleton */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-7 bg-gray-200 rounded w-40"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-40 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>

        {/* Analytics Charts Skeleton */}
        <div className="mt-6">
          <div className="h-8 bg-gray-200 rounded w-56 mb-6"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-64 bg-gray-100 rounded"></div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-56 mb-4"></div>
              <div className="h-64 bg-gray-100 rounded"></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-64 bg-gray-100 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-lg shadow-sm">
                <div className="h-4 bg-blue-200 rounded w-32 mb-2"></div>
                <div className="h-10 bg-blue-300 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start Guide Skeleton */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 mt-6">
          <div className="h-6 bg-blue-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start">
                <div className="w-6 h-6 bg-blue-300 rounded-full mr-3"></div>
                <div className="h-4 bg-blue-200 rounded flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Mock health and security data
  const mockHealthData = {
    totalPigs: 5,
    healthy: 3,
    warning: 1,
    sick: 1,
    avgTemp: 38.6,
    alerts: 2,
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Pig Health & Security Monitoring Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Real-time monitoring of pig health, behavior, GPS tracking, and temperature via smart collars
        </p>
      </div>

      {/* Main Health & Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium mb-1">Total Monitored</p>
              <p className="text-4xl font-bold text-blue-600">{mockHealthData.totalPigs}</p>
              <p className="text-xs text-gray-600 mt-1">Pigs with collars</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium mb-1">Healthy</p>
              <p className="text-4xl font-bold text-green-600">{mockHealthData.healthy}</p>
              <p className="text-xs text-gray-600 mt-1">Normal vitals</p>
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
              <p className="text-sm text-yellow-600 font-medium mb-1">Warnings</p>
              <p className="text-4xl font-bold text-yellow-600">{mockHealthData.warning}</p>
              <p className="text-xs text-gray-600 mt-1">Needs attention</p>
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
              <p className="text-sm text-red-600 font-medium mb-1">Critical</p>
              <p className="text-4xl font-bold text-red-600">{mockHealthData.sick}</p>
              <p className="text-xs text-gray-600 mt-1">Immediate action</p>
            </div>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* System Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Live Camera Feed</h3>
              <p className="text-sm text-gray-600 mb-3">
                Real-time YOLO behavior detection with bounding boxes
              </p>
              <div className="flex items-center text-green-600 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="font-medium">4 cameras active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">GPS Tracking</h3>
              <p className="text-sm text-gray-600 mb-3">
                Real-time location monitoring via collar GPS sensors
              </p>
              <div className="flex items-center text-green-600 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="font-medium">{mockHealthData.totalPigs} collars connected</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Temperature Monitor</h3>
              <p className="text-sm text-gray-600 mb-3">
                Continuous body temperature monitoring for health
              </p>
              <div className="flex items-center text-blue-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                <span className="font-medium">Avg: {mockHealthData.avgTemp}°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">System Status</h2>
          <button
            onClick={checkHealth}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Backend Connection Failed</p>
                <p className="text-sm">{error}</p>
                <p className="text-sm mt-2">Make sure the FastAPI server is running on http://localhost:8000</p>
              </div>
            </div>
          </div>
        ) : health ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-lg font-semibold text-green-600 capitalize">
                    {health.status}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Model</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {health.model}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Model Input</p>
                <p className="text-xs text-gray-600">
                  <span className="font-mono bg-white px-2 py-1 rounded">
                    {health.input.name}
                  </span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Shape: <span className="font-mono">{JSON.stringify(health.input.shape)}</span>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Model Outputs</p>
                {health.outputs.map((output, index) => (
                  <div key={index} className="text-xs text-gray-600 mb-1">
                    <span className="font-mono bg-white px-2 py-1 rounded">
                      {output.name}
                    </span>
                    <span className="ml-2">
                      Shape: <span className="font-mono">{JSON.stringify(output.shape)}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Image Analysis</h3>
          <p className="text-gray-600 text-sm">
            Upload images of your pigs for AI-powered behavior detection and analysis
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Detection History</h3>
          <p className="text-gray-600 text-sm">
            View and manage all previous detections with detailed information
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Behavior Analysis</h3>
          <p className="text-gray-600 text-sm">
            Detect pig behaviors: lying, sleeping, investigating, eating, walking, mounted
          </p>
        </div>
      </div>

      {/* Analytics Charts */}
      {detections.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Behavior Analytics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Behavior Distribution Pie Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Behavior Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={behaviorData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {behaviorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Average Confidence by Behavior */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Confidence by Behavior</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={avgConfidenceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[0, 100]} label={{ value: 'Confidence %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="confidence" fill="#3B82F6" name="Confidence %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detections Over Time */}
          {detectionsOverTime.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Detections Over Time (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={detectionsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis label={{ value: 'Detections', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#06B6D4" strokeWidth={2} name="Detections" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-sm text-blue-600 font-medium mb-1">Total Detections</p>
              <p className="text-4xl font-bold text-blue-600">{detections.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-sm text-green-600 font-medium mb-1">Most Common</p>
              <p className="text-2xl font-bold text-green-600">
                {behaviorData.length > 0 ? behaviorData.sort((a, b) => b.value - a.value)[0].name : 'N/A'}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-sm text-purple-600 font-medium mb-1">Avg. Confidence</p>
              <p className="text-4xl font-bold text-purple-600">
                {((detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-sm text-orange-600 font-medium mb-1">Behaviors Tracked</p>
              <p className="text-4xl font-bold text-orange-600">{behaviorData.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Start Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Start Guide</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              1
            </div>
            <p className="text-gray-700">Go to the <strong>Image Analysis</strong> tab</p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              2
            </div>
            <p className="text-gray-700">Upload an image of your livestock</p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              3
            </div>
            <p className="text-gray-700">Click <strong>Analyze Image</strong> to detect animals</p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              4
            </div>
            <p className="text-gray-700">View results with bounding boxes and confidence scores</p>
          </div>
        </div>
      </div>
    </div>
  );
}

