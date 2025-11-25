import { useState, useRef } from 'react';
import { livestockAPI, PredictionResponse } from '../api/livestock-api';

export default function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPrediction(null);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePredict = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const result = await livestockAPI.predictImage(selectedFile);
      console.log('API Response:', result);
      console.log('Detections:', result.detections);
      result.detections.forEach((det, i) => {
        console.log(`Detection ${i}: class_id=${det.class_id}, confidence=${det.confidence}`);
      });
      setPrediction(result);
      
      // Draw bounding boxes after image loads
      setTimeout(() => drawBoundingBoxes(result), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Map class IDs to behavior names
  const getBehaviorName = (classId: number): string => {
    const behaviors = ['Lying', 'Sleeping', 'Investigating', 'Eating', 'Walking', 'Mounted'];
    return behaviors[classId] || `Unknown (${classId})`;
  };

  // Get color based on behavior - blue themed
  const getBehaviorColor = (classId: number): string => {
    const colors = {
      0: '#10B981', // lying - green (rest)
      1: '#3B82F6', // sleeping - blue (rest)
      2: '#06B6D4', // investigating - cyan (active)
      3: '#0EA5E9', // eating - sky blue (active)
      4: '#6366F1', // walking - indigo (active)
      5: '#8B5CF6', // mounted - violet (active)
    };
    return colors[classId as keyof typeof colors] || '#3B82F6';
  };

  const drawBoundingBoxes = (result: PredictionResponse) => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = image.width;
    canvas.height = image.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each detection
    result.detections.forEach((detection) => {
      const [x, y, w, h] = detection.bbox;
      const behaviorName = getBehaviorName(detection.class_id);
      const color = getBehaviorColor(detection.class_id);
      
      // Draw rectangle
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);

      // Draw label background
      const label = `Pig - ${behaviorName}: ${(detection.confidence * 100).toFixed(1)}%`;
      ctx.font = 'bold 16px Arial';
      const textWidth = ctx.measureText(label).width;
      
      ctx.fillStyle = color;
      ctx.fillRect(x, y - 28, textWidth + 12, 28);

      // Draw label text
      ctx.fillStyle = 'white';
      ctx.fillText(label, x + 6, y - 8);
    });
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Image Analysis
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Upload Section */}
        <div className="mb-6 flex justify-center">
          <div className="flex flex-wrap gap-4 justify-center">
            <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>

            {selectedFile && (
              <button
                onClick={handlePredict}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Analyze Image
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Image Display */}
        {selectedImage && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Uploaded Image
            </h3>
            <div className="flex justify-center">
              <div className="relative inline-block border-2 border-gray-200 rounded-lg overflow-hidden">
                <img
                  ref={imageRef}
                  src={selectedImage}
                  alt="Uploaded livestock"
                  className="max-w-full h-auto"
                  onLoad={() => prediction && drawBoundingBoxes(prediction)}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 pointer-events-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton for Results */}
        {loading && selectedImage && (
          <div className="mt-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="h-4 bg-gray-200 rounded w-36 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded w-20"></div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <div className="h-3 bg-gray-200 rounded w-28"></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3].map((i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Results Display */}
        {prediction && !loading && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Detection Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-sm text-blue-600 font-medium mb-1">Total Detections</p>
                <p className="text-4xl font-bold text-blue-600">{prediction.detections.length}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-sm text-cyan-600 font-medium mb-1">Average Confidence</p>
                <p className="text-4xl font-bold text-cyan-600">
                  {prediction.detections.length > 0
                    ? (
                        (prediction.detections.reduce((sum, d) => sum + d.confidence, 0) /
                          prediction.detections.length) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </div>

            {/* Detections Table */}
            {prediction.detections.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Detection #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Confidence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bounding Box
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {prediction.detections.map((detection, index) => (
                      <tr key={detection.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Pig {index + 1} - {getBehaviorName(detection.class_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {(detection.confidence * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          x:{Math.round(detection.bbox[0])}, y:{Math.round(detection.bbox[1])}, 
                          w:{Math.round(detection.bbox[2])}, h:{Math.round(detection.bbox[3])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

