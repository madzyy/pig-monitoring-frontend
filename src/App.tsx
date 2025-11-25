import { useState } from 'react';
import Dashboard from './components/Dashboard';
import ImageUpload from './components/ImageUpload';
import DetectionsList from './components/DetectionsList';
import LiveFeed from './components/LiveFeed';
import GPSTracking from './components/GPSTracking';
import HealthMonitor from './components/HealthMonitor';
import './App.css';

type TabType = 'dashboard' | 'live' | 'gps' | 'health' | 'upload' | 'detections';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    { id: 'dashboard' as TabType, name: 'Dashboard' },
    { id: 'live' as TabType, name: 'Live Feed' },
    { id: 'gps' as TabType, name: 'GPS Tracking' },
    { id: 'health' as TabType, name: 'Health Monitor' },
    { id: 'upload' as TabType, name: 'Image Analysis' },
    { id: 'detections' as TabType, name: 'History' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex flex-col">
      {/* Navigation Bar - Larger, Blue Theme */}
      <nav className="border-b border-blue-100 bg-white/90 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="mx-auto px-8 sm:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Pig Health & Security Monitor
              </span>
            </div>

            {/* Right Side - Tab Navigation + GitHub */}
            <div className="flex items-center space-x-2">
              {/* Tab Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-base font-medium rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-blue-600 bg-blue-50 shadow-sm'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
              {/* GitHub Icon */}
              <a 
                href="https://github.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 ml-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 py-6 px-8 sm:px-12">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'live' && <LiveFeed />}
        {activeTab === 'gps' && <GPSTracking />}
        {activeTab === 'health' && <HealthMonitor />}
        {activeTab === 'upload' && <ImageUpload />}
        {activeTab === 'detections' && <DetectionsList />}
      </main>

      {/* Footer - Sticky at bottom */}
      <footer className="border-t border-blue-100 mt-auto bg-white/50 sticky top-[100vh]">
        <div className="mx-auto px-8 sm:px-12 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>
              © 2024 Pig Behavior AI
            </p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-600 transition-colors">
                Docs
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                API
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
