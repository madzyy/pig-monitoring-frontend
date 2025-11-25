import { useState, useEffect } from 'react';
import { livestockAPI, Detection } from '../api/livestock-api';

export default function DetectionsList() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map class IDs to behavior names
  const getBehaviorName = (classId: number): string => {
    const behaviors = ['Lying', 'Sleeping', 'Investigating', 'Eating', 'Walking', 'Mounted'];
    return behaviors[classId] || `Unknown (${classId})`;
  };

  // Get badge color for behavior
  const getBehaviorBadgeColor = (classId: number): string => {
    const colors = {
      0: 'bg-green-100 text-green-800', // lying - green (rest)
      1: 'bg-blue-100 text-blue-800',   // sleeping - blue (rest)
      2: 'bg-cyan-100 text-cyan-800',   // investigating - cyan (active)
      3: 'bg-sky-100 text-sky-800',     // eating - sky (active)
      4: 'bg-indigo-100 text-indigo-800', // walking - indigo (active)
      5: 'bg-violet-100 text-violet-800', // mounted - violet (active)
    };
    return colors[classId as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const loadDetections = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await livestockAPI.getAllDetections();
      setDetections(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load detections');
      console.error('Error loading detections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetections();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this detection?')) return;

    try {
      await livestockAPI.deleteDetection(id);
      setDetections(detections.filter(d => d.id !== id));
    } catch (err) {
      alert('Failed to delete detection');
      console.error('Delete error:', err);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  if (loading) {
    return (
      <div className="w-full animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-9 bg-gray-200 rounded w-64"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className="h-3 bg-gray-200 rounded w-28"></div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-gray-200 rounded mr-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-40"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-36"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-700">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium">Error loading detections</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Detection History</h1>
        <button
          onClick={loadDetections}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {detections.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No detections yet</h3>
          <p className="text-gray-500">Upload an image to create your first detection</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Filename
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Behavior
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bounding Box
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {detections.map((detection) => (
                  <tr key={detection.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-900">
                          {detection.filename}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getBehaviorBadgeColor(detection.class_id)}`}>
                        {getBehaviorName(detection.class_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          detection.confidence >= 0.8
                            ? 'bg-green-100 text-green-800'
                            : detection.confidence >= 0.6
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {(detection.confidence * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      [{detection.bbox.map(v => Math.round(v)).join(', ')}]
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTimestamp(detection.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(detection.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total detections: <span className="font-semibold">{detections.length}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

