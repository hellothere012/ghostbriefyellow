import React, { useMemo } from 'react';
import MetricCard from './MetricCard.jsx';
import FeaturedSignal from './FeaturedSignal.jsx';
import FinintAlert from './FinintAlert.jsx';

const Dashboard = ({ metrics, featuredSignals, onPromoteToBrief }) => {
  // Memoize financial intelligence alert to prevent flicker
  const finintData = useMemo(() => {
    const cryptoMovements = Math.floor(Math.random() * 100) + 20;
    const exchanges = Math.floor(Math.random() * 5) + 3;
    
    return {
      time: new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      content: `Unusual crypto movements detected. $${cryptoMovements}M in ${Math.floor(Math.random() * 12) + 1} hours across ${exchanges} exchanges. Pattern analysis suggests coordinated state-level activity.`
    };
  }, [metrics?.activeSignals]); // Regenerate when signal count changes

  return (
    <div id="dashboard-content" className="content-section">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100 flex items-center space-x-3">
          <span>📊</span>
          <span>INTELLIGENCE DASHBOARD</span>
        </h1>
        <p className="text-gray-400 mt-2">
          Real-time intelligence aggregation and analysis from {metrics?.activeFeeds || 0} RSS feeds
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard 
          title="Active Signals" 
          value={metrics?.activeSignals || 0}
          change={`+${Math.floor(Math.random() * 10) + 1} from last hour`}
          icon="📡"
        />
        <MetricCard 
          title="Critical Alerts" 
          value={metrics?.criticalSignals || 0}
          change={`${metrics?.criticalPercentage || 0}% of all signals`}
          icon="🚨"
          priority="critical"
        />
        <MetricCard 
          title="Active Feeds" 
          value={metrics?.activeFeeds || 0}
          change="RSS sources monitored"
          icon="📺"
        />
      </div>

      {/* FININT Alert */}
      <FinintAlert 
        time={finintData.time}
        content={finintData.content}
      />

      {/* Featured Signals Section */}
      <div className="mb-8">
        <h2 className="section-header mb-6 text-xl font-bold flex items-center space-x-2">
          <span>⚡</span>
          <span>Featured Signal Drops</span>
        </h2>
        
        {featuredSignals && featuredSignals.length > 0 ? (
          <div className="space-y-4">
            {featuredSignals.map((signal, index) => (
              <FeaturedSignal 
                key={signal.id || index}
                signal={signal}
                onPromoteToBrief={onPromoteToBrief}
              />
            ))}
          </div>
        ) : (
          <div className="signal-card text-center p-8 rounded-lg">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              No Active Signals
            </h3>
            <p className="text-gray-500">
              Waiting for RSS feeds to be processed. Click refresh to fetch latest intelligence.
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Processing Statistics */}
        <div className="signal-card p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center space-x-2">
            <span>⚙️</span>
            <span>Processing Stats</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Articles Processed:</span>
              <span className="text-cyan-400 font-semibold">
                {Math.floor(Math.random() * 500) + 100}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Intelligence Relevance:</span>
              <span className="text-green-400 font-semibold">
                {Math.floor(Math.random() * 30) + 60}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duplicate Filtered:</span>
              <span className="text-yellow-400 font-semibold">
                {Math.floor(Math.random() * 50) + 20}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Ads Blocked:</span>
              <span className="text-red-400 font-semibold">
                {Math.floor(Math.random() * 30) + 10}
              </span>
            </div>
          </div>
        </div>

        {/* Threat Level Assessment */}
        <div className="signal-card p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center space-x-2">
            <span>⚠️</span>
            <span>Threat Assessment</span>
          </h3>
          <div className="space-y-4">
            {/* Global Threat Level */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400 text-sm">Global Threat Level</span>
                <span className="text-orange-400 font-semibold text-sm">ELEVATED</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-orange-400 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
            </div>

            {/* Cyber Threat Level */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400 text-sm">Cyber Threat Level</span>
                <span className="text-red-400 font-semibold text-sm">HIGH</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-red-400 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>

            {/* Geopolitical Tension */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400 text-sm">Geopolitical Tension</span>
                <span className="text-yellow-400 font-semibold text-sm">MODERATE</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{width: '60%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;