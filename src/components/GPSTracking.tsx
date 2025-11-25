import { useState } from 'react';

interface PigLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'safe' | 'warning' | 'danger';
  battery: number;
  lastUpdate: string;
  temp: number;
}

export default function GPSTracking() {
  const [selectedPig, setSelectedPig] = useState<string | null>(null);

  // Mock pig locations
  const pigs: PigLocation[] = [
    {
      id: 'PIG-001',
      name: 'Pig 001',
      lat: 40.7128,
      lng: -74.006,
      status: 'safe',
      battery: 85,
      lastUpdate: '2 min ago',
      temp: 38.5,
    },
    {
      id: 'PIG-003',
      name: 'Pig 003',
      lat: 40.7138,
      lng: -74.0065,
      status: 'safe',
      battery: 92,
      lastUpdate: '1 min ago',
      temp: 38.3,
    },
    {
      id: 'PIG-007',
      name: 'Pig 007',
      lat: 40.7145,
      lng: -74.007,
      status: 'warning',
      battery: 45,
      lastUpdate: '5 min ago',
      temp: 39.2,
    },
    {
      id: 'PIG-012',
      name: 'Pig 012',
      lat: 40.7125,
      lng: -74.0055,
      status: 'safe',
      battery: 78,
      lastUpdate: '3 min ago',
      temp: 38.6,
    },
    {
      id: 'PIG-015',
      name: 'Pig 015',
      lat: 40.7155,
      lng: -74.008,
      status: 'danger',
      battery: 15,
      lastUpdate: '15 min ago',
      temp: 39.8,
    },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'safe') return 'text-green-600 bg-green-100';
    if (status === 'warning') return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusDot = (status: string) => {
    if (status === 'safe') return 'bg-green-500';
    if (status === 'warning') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const safePigs = pigs.filter((p) => p.status === 'safe').length;
  const warningPigs = pigs.filter((p) => p.status === 'warning').length;
  const dangerPigs = pigs.filter((p) => p.status === 'danger').length;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">GPS Tracking & Security</h1>
          <p className="text-gray-600 mt-1">Real-time location monitoring via collar GPS</p>
        </div>
        <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Locations
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 mb-1">Total Pigs</p>
              <p className="text-3xl font-bold text-blue-600">{pigs.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 mb-1">Safe Zone</p>
              <p className="text-3xl font-bold text-green-600">{safePigs}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 mb-1">Warnings</p>
              <p className="text-3xl font-bold text-yellow-600">{warningPigs}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 mb-1">Alerts</p>
              <p className="text-3xl font-bold text-red-600">{dangerPigs}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-800">Location Map</h3>
            </div>
            <div className="relative bg-gradient-to-br from-green-100 to-blue-100 aspect-video">
              {/* Mock Map with Pins */}
              <div className="absolute inset-0 p-8">
                {/* Farm Boundary */}
                <div className="absolute inset-12 border-4 border-dashed border-green-600 rounded-lg bg-green-50 bg-opacity-30">
                  <div className="absolute -top-6 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Safe Zone
                  </div>
                </div>

                {/* Pig Markers */}
                {pigs.map((pig, index) => (
                  <div
                    key={pig.id}
                    className="absolute cursor-pointer transform hover:scale-125 transition-transform"
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + (index % 3) * 20}%`,
                    }}
                    onClick={() => setSelectedPig(pig.id)}
                  >
                    <div className="relative">
                      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          className={pig.status === 'safe' ? 'text-green-500' : pig.status === 'warning' ? 'text-yellow-500' : 'text-red-500'}
                          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                        />
                      </svg>
                      {selectedPig === pig.id && (
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-3 whitespace-nowrap z-10 border-2 border-blue-500">
                          <p className="font-bold text-gray-900">{pig.id}</p>
                          <p className="text-sm text-gray-600">Temp: {pig.temp}°C</p>
                          <p className="text-sm text-gray-600">Battery: {pig.battery}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Legend */}
                <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Status:</p>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">Safe</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">Warning</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">Alert</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pig List */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tracked Pigs</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {pigs.map((pig) => (
                <div
                  key={pig.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPig === pig.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPig(pig.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${getStatusDot(pig.status)}`}></div>
                      <span className="font-bold text-gray-900">{pig.id}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pig.status)}`}>
                      {pig.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="text-gray-900 font-mono text-xs">
                        {pig.lat.toFixed(4)}, {pig.lng.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temperature:</span>
                      <span className={`font-medium ${pig.temp > 39 ? 'text-red-600' : 'text-green-600'}`}>
                        {pig.temp}°C
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Battery:</span>
                      <span className={`font-medium ${pig.battery < 20 ? 'text-red-600' : 'text-gray-900'}`}>
                        {pig.battery}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Update:</span>
                      <span className="text-gray-900">{pig.lastUpdate}</span>
                    </div>
                  </div>

                  {pig.battery < 20 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center text-red-600 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Low battery - Replace collar soon
                      </div>
                    </div>
                  )}

                  {pig.temp > 39 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center text-red-600 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        High temperature detected
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

