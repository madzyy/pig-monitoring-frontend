import { useState, useRef, useEffect } from 'react';

interface Detection {
  id: number;
  pigId: string;
  behavior: string;
  confidence: number;
  temp: number;
  status: string;
  bbox: [number, number, number, number]; // [x, y, width, height]
}

export default function LiveFeed() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState('camera1');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cameras = [
    { 
      id: 'camera1', 
      name: 'Barn A - Main Area', 
      location: 'Section 1',
      videoSrc: '/videos/barn-a.mp4' // Replace with actual video path
    },
    { 
      id: 'camera2', 
      name: 'Barn B - Feeding Area', 
      location: 'Section 2',
      videoSrc: '/videos/barn-b.mp4'
    },
    { 
      id: 'camera3', 
      name: 'Outdoor Pen', 
      location: 'Section 3',
      videoSrc: '/videos/outdoor.mp4'
    },
    { 
      id: 'camera4', 
      name: 'Isolation Area', 
      location: 'Section 4',
      videoSrc: '/videos/isolation.mp4'
    },
  ];

  // Camera-specific detections (in real app, this would come from WebSocket/API)
  const getCameraDetections = (cameraId: string): Detection[] => {
    const detections: Record<string, Detection[]> = {
      camera1: [
        { id: 1, pigId: 'PIG-001', behavior: 'Eating', confidence: 0.92, temp: 38.5, status: 'Healthy', bbox: [150, 100, 120, 150] },
        { id: 2, pigId: 'PIG-003', behavior: 'Walking', confidence: 0.88, temp: 38.3, status: 'Healthy', bbox: [550, 200, 100, 130] },
        { id: 4, pigId: 'PIG-012', behavior: 'Lying', confidence: 0.91, temp: 38.6, status: 'Healthy', bbox: [750, 150, 130, 140] },
      ],
      camera2: [
        { id: 5, pigId: 'PIG-005', behavior: 'Eating', confidence: 0.94, temp: 38.4, status: 'Healthy', bbox: [200, 150, 140, 160] },
        { id: 6, pigId: 'PIG-008', behavior: 'Investigating', confidence: 0.87, temp: 38.7, status: 'Healthy', bbox: [600, 250, 110, 140] },
      ],
      camera3: [
        { id: 7, pigId: 'PIG-010', behavior: 'Walking', confidence: 0.89, temp: 38.5, status: 'Healthy', bbox: [300, 200, 130, 150] },
        { id: 8, pigId: 'PIG-014', behavior: 'Lying', confidence: 0.93, temp: 38.3, status: 'Healthy', bbox: [700, 180, 120, 140] },
      ],
      camera4: [
        { id: 3, pigId: 'PIG-007', behavior: 'Sleeping', confidence: 0.95, temp: 39.2, status: 'Warning', bbox: [450, 350, 140, 110] },
        { id: 9, pigId: 'PIG-015', behavior: 'Lying', confidence: 0.88, temp: 39.5, status: 'Sick', bbox: [250, 300, 130, 120] },
      ],
    };
    return detections[cameraId] || [];
  };

  const [liveDetections, setLiveDetections] = useState<Detection[]>(getCameraDetections(selectedCamera));

  // Get current camera video source
  const currentCamera = cameras.find(cam => cam.id === selectedCamera);
  const videoSource = currentCamera?.videoSrc || '/videos/barn-a.mp4';

  // Update detections when camera changes
  useEffect(() => {
    setLiveDetections(getCameraDetections(selectedCamera));
  }, [selectedCamera]);

  useEffect(() => {
    if (isStreaming && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log('Video play error:', err);
        // If video file doesn't exist, we'll use a placeholder
      });
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isStreaming, selectedCamera]);

  useEffect(() => {
    const drawDetections = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      if (!canvas || !video || !isStreaming) return;

      // Set canvas size to match video
      canvas.width = video.videoWidth || video.clientWidth;
      canvas.height = video.videoHeight || video.clientHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw each detection
      liveDetections.forEach((detection) => {
        const [x, y, w, h] = detection.bbox;
        const color = getBehaviorColor(detection.behavior);
        
        // Scale bounding box if video dimensions differ
        const scaleX = canvas.width / 1920; // Assuming video is 1920px wide
        const scaleY = canvas.height / 1080; // Assuming video is 1080px tall
        
        const scaledX = x * scaleX;
        const scaledY = y * scaleY;
        const scaledW = w * scaleX;
        const scaledH = h * scaleY;

        // Draw bounding box
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(scaledX, scaledY, scaledW, scaledH);

        // Draw label background
        const label = `${detection.pigId} - ${detection.behavior}: ${(detection.confidence * 100).toFixed(0)}%`;
        ctx.font = 'bold 16px Arial';
        const textWidth = ctx.measureText(label).width;
        
        ctx.fillStyle = color;
        ctx.fillRect(scaledX, scaledY - 28, textWidth + 12, 28);

        // Draw label text
        ctx.fillStyle = 'white';
        ctx.fillText(label, scaledX + 6, scaledY - 8);

        // Draw temperature if available
        if (detection.temp) {
          const tempLabel = `Temp: ${detection.temp}°C`;
          ctx.font = '12px Arial';
          const tempWidth = ctx.measureText(tempLabel).width;
          ctx.fillStyle = color;
          ctx.fillRect(scaledX, scaledY + scaledH, tempWidth + 8, 20);
          ctx.fillStyle = 'white';
          ctx.fillText(tempLabel, scaledX + 4, scaledY + scaledH + 15);
        }
      });
    };

    if (isStreaming) {
      const interval = setInterval(drawDetections, 100); // Update 10 times per second
      return () => clearInterval(interval);
    }
  }, [isStreaming, liveDetections, selectedCamera]);

  const toggleStream = () => {
    setIsStreaming(!isStreaming);
  };

  const getBehaviorColor = (behavior: string) => {
    const colors: Record<string, string> = {
      Lying: '#10B981',
      Sleeping: '#3B82F6',
      Investigating: '#06B6D4',
      Eating: '#0EA5E9',
      Walking: '#6366F1',
      Mounted: '#8B5CF6',
    };
    return colors[behavior] || '#6B7280';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Healthy') return 'bg-green-100 text-green-800';
    if (status === 'Warning') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Live Camera Feed</h1>
          <p className="text-gray-600 mt-1">Real-time behavior detection and monitoring</p>
        </div>
        <button
          onClick={toggleStream}
          className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg ${
            isStreaming
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isStreaming ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <rect x="6" y="5" width="2" height="10" />
                <rect x="12" y="5" width="2" height="10" />
              </svg>
              Stop Stream
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Start Stream
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Feed */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Camera Selector */}
            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Camera:</label>
                <select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {cameras.map((cam) => (
                    <option key={cam.id} value={cam.id}>
                      {cam.name} ({cam.location})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative bg-gray-900 aspect-video">
              {isStreaming ? (
                <div className="relative w-full h-full">
                  {/* Video Element */}
                  <video
                    ref={videoRef}
                    src={videoSource}
                    className="w-full h-full object-contain"
                    loop
                    muted
                    playsInline
                    onError={(e) => {
                      console.log('Video load error - using placeholder');
                      // If video doesn't exist, show placeholder
                      const video = e.currentTarget;
                      video.style.display = 'none';
                    }}
                  />
                  
                  {/* Canvas Overlay for YOLO Detections */}
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 10 }}
                  />

                  {/* Live Indicator */}
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center space-x-2 z-20">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold">LIVE</span>
                  </div>

                  {/* Camera Name Overlay */}
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded z-20">
                    <span className="text-sm font-medium">
                      {cameras.find((c) => c.id === selectedCamera)?.name}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="w-24 h-24 text-gray-600 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-400 text-lg">Camera feed inactive</p>
                    <p className="text-gray-500 text-sm mt-2">Click "Start Stream" to begin</p>
                    <p className="text-gray-400 text-xs mt-4">
                      Note: Place video files in <code className="bg-gray-800 px-2 py-1 rounded">/public/videos/</code>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Stream Info */}
            <div className="bg-gray-50 border-t border-gray-200 p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Connected</span>
                  </div>
                  <span className="text-gray-600">FPS: 30</span>
                  <span className="text-gray-600">Resolution: 1920x1080</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Detections Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Detections</h3>
            <div className="space-y-3">
              {liveDetections.map((detection) => (
                <div
                  key={detection.id}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{detection.pigId}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(detection.status)}`}>
                      {detection.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Behavior:</span>
                      <span
                        className="font-medium"
                        style={{ color: getBehaviorColor(detection.behavior) }}
                      >
                        {detection.behavior}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confidence:</span>
                      <span className="font-medium text-gray-900">{(detection.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temperature:</span>
                      <span className={`font-medium ${detection.temp > 39 ? 'text-red-600' : 'text-green-600'}`}>
                        {detection.temp}°C
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Active Pigs:</span>
                <span className="text-2xl font-bold text-blue-600">{liveDetections.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Healthy:</span>
                <span className="text-2xl font-bold text-green-600">
                  {liveDetections.filter(d => d.status === 'Healthy').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Warnings:</span>
                <span className="text-2xl font-bold text-yellow-600">
                  {liveDetections.filter(d => d.status === 'Warning').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Sick:</span>
                <span className="text-2xl font-bold text-red-600">
                  {liveDetections.filter(d => d.status === 'Sick').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

