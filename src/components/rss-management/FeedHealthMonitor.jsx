import React, { useState } from 'react';

const FeedHealthMonitor = ({ feeds, onTestFeed }) => {
  const [testingFeeds, setTestingFeeds] = useState(new Set());

  const handleTestFeed = async (feed) => {
    setTestingFeeds(prev => new Set([...prev, feed.id]));
    try {
      await onTestFeed(feed);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setTestingFeeds(prev => {
        const newSet = new Set(prev);
        newSet.delete(feed.id);
        return newSet;
      });
    }
  };

  const getHealthStatus = (feed) => {
    if (feed.errorCount > 5) return { status: 'critical', label: 'Critical', color: 'text-red-400' };
    if (feed.errorCount > 2) return { status: 'warning', label: 'Warning', color: 'text-yellow-400' };
    if (!feed.isActive) return { status: 'inactive', label: 'Inactive', color: 'text-gray-400' };
    return { status: 'healthy', label: 'Healthy', color: 'text-green-400' };
  };

  const getHealthIcon = (status) => {
    switch (status) {
      case 'critical': return '🔴';
      case 'warning': return '🟡';
      case 'inactive': return '⚫';
      default: return '🟢';
    }
  };

  const formatUptime = (addedAt, errorCount) => {
    if (!addedAt) return 'Unknown';
    
    const uptime = errorCount === 0 ? 100 : Math.max(0, 100 - (errorCount * 5));
    return `${uptime}%`;
  };

  const healthStats = {
    total: feeds.length,
    healthy: feeds.filter(f => f.errorCount === 0 && f.isActive).length,
    warning: feeds.filter(f => f.errorCount > 2 && f.errorCount <= 5).length,
    critical: feeds.filter(f => f.errorCount > 5).length,
    inactive: feeds.filter(f => !f.isActive).length
  };

  return (
    <div className="space-y-6">
      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="signal-card p-4 rounded-lg">
          <div className="text-gray-300 text-2xl font-bold">
            {healthStats.total}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">
            Total Feeds
          </div>
        </div>
        
        <div className="signal-card p-4 rounded-lg">
          <div className="text-green-400 text-2xl font-bold">
            {healthStats.healthy}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">
            Healthy
          </div>
        </div>
        
        <div className="signal-card p-4 rounded-lg">
          <div className="text-yellow-400 text-2xl font-bold">
            {healthStats.warning}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">
            Warning
          </div>
        </div>
        
        <div className="signal-card p-4 rounded-lg">
          <div className="text-red-400 text-2xl font-bold">
            {healthStats.critical}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">
            Critical
          </div>
        </div>
        
        <div className="signal-card p-4 rounded-lg">
          <div className="text-gray-400 text-2xl font-bold">
            {healthStats.inactive}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">
            Inactive
          </div>
        </div>
      </div>

      {/* Health Details */}
      <div className="signal-card p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center space-x-2">
          <span>💊</span>
          <span>Feed Health Status</span>
        </h3>
        
        {feeds.length === 0 ? (
          <div className="text-center p-8">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-500">No feeds to monitor</p>
          </div>
        ) : (
          <div className="space-y-3">
            {feeds.map(feed => {
              const health = getHealthStatus(feed);
              const isTesting = testingFeeds.has(feed.id);
              
              return (
                <div key={feed.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {/* Status Icon */}
                      <span className="text-lg">
                        {getHealthIcon(health.status)}
                      </span>
                      
                      {/* Feed Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-300 truncate">
                            {feed.name}
                          </h4>
                          <span className={`text-xs font-medium ${health.color}`}>
                            {health.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>
                            Uptime: <span className="text-cyan-400">
                              {formatUptime(feed.addedAt, feed.errorCount)}
                            </span>
                          </span>
                          <span>
                            Errors: <span className={feed.errorCount > 0 ? 'text-red-400' : 'text-green-400'}>
                              {feed.errorCount}
                            </span>
                          </span>
                          <span>
                            Category: <span className="text-cyan-400">{feed.category}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Test Button */}
                    <button
                      onClick={() => handleTestFeed(feed)}
                      disabled={isTesting}
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500 rounded-md hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs flex items-center space-x-1"
                    >
                      {isTesting ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          <span>Testing...</span>
                        </>
                      ) : (
                        <>
                          <span>🔍</span>
                          <span>Test</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Health Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all ${
                          health.status === 'critical' ? 'bg-red-400' :
                          health.status === 'warning' ? 'bg-yellow-400' :
                          health.status === 'inactive' ? 'bg-gray-400' :
                          'bg-green-400'
                        }`}
                        style={{ 
                          width: `${Math.max(10, 100 - (feed.errorCount * 10))}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Error Details */}
                  {feed.errorCount > 0 && (
                    <div className="mt-2 text-xs text-red-400">
                      {feed.errorCount} consecutive errors detected
                      {feed.errorCount > 5 && ' - Feed may be permanently down'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="signal-card p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center space-x-2">
          <span>💡</span>
          <span>Recommendations</span>
        </h3>
        
        <div className="space-y-3">
          {healthStats.critical > 0 && (
            <div className="flex items-start space-x-3 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              <span className="text-red-400 text-lg">⚠️</span>
              <div>
                <p className="text-sm text-red-400 font-medium">
                  {healthStats.critical} feed(s) in critical state
                </p>
                <p className="text-xs text-gray-500">
                  Consider removing or replacing feeds with high error counts
                </p>
              </div>
            </div>
          )}
          
          {healthStats.warning > 0 && (
            <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
              <span className="text-yellow-400 text-lg">⚠️</span>
              <div>
                <p className="text-sm text-yellow-400 font-medium">
                  {healthStats.warning} feed(s) showing warnings
                </p>
                <p className="text-xs text-gray-500">
                  Monitor these feeds closely for potential issues
                </p>
              </div>
            </div>
          )}
          
          {healthStats.total > 0 && healthStats.healthy / healthStats.total > 0.8 && (
            <div className="flex items-start space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
              <span className="text-green-400 text-lg">✅</span>
              <div>
                <p className="text-sm text-green-400 font-medium">
                  System health is good
                </p>
                <p className="text-xs text-gray-500">
                  {Math.round((healthStats.healthy / healthStats.total) * 100)}% of feeds are operating normally
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedHealthMonitor;