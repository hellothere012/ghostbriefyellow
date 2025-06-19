import React from 'react';

const Header = ({ metrics, onRefresh, isRefreshing, processingStatus }) => {
  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-cyan-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 1.5c-5.523 0-10 3.134-10 7 0 2.22.9 4.22 2.36 5.64l-1.61 3.22a1 1 0 001.52 1.25l3.22-1.61A9.926 9.926 0 0012 18.5c5.523 0 10-3.134 10-7s-4.477-7-10-7z" 
              />
              <path d="M12 11.5a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            <h1 className="font-orbitron text-2xl text-cyan-400 tracking-wider">
              GHOST BRIEF
            </h1>
            <span className="text-xs text-gray-400 hidden md:block">
              Intelligence Dashboard v2.0
            </span>
          </div>

          {/* Status and Controls */}
          <div className="flex items-center space-x-6">
            {/* Quick Metrics */}
            <div className="hidden lg:flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <span className="text-gray-400">Signals:</span>
                <span className="text-cyan-400 font-semibold">
                  {metrics?.activeSignals || 0}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-400">Critical:</span>
                <span className="text-red-400 font-semibold">
                  {metrics?.criticalSignals || 0}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-400">Feeds:</span>
                <span className="text-green-400 font-semibold">
                  {metrics?.activeFeeds || 0}
                </span>
              </div>
            </div>

            {/* Processing Status */}
            {processingStatus && (
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${
                  processingStatus.stage === 'error' ? 'bg-red-500' :
                  processingStatus.stage === 'warning' ? 'bg-yellow-500' :
                  processingStatus.stage === 'success' ? 'bg-green-500' :
                  'bg-blue-500'
                } ${processingStatus.stage === 'processing' || processingStatus.stage === 'fetching' ? 'animate-pulse' : ''}`} />
                <span className="text-xs text-gray-300 max-w-xs truncate">
                  {processingStatus.message}
                </span>
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isRefreshing 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-cyan-400'
              }`}
              title="Refresh RSS feeds"
            >
              <svg 
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
              <span className="hidden sm:block">
                {isRefreshing ? 'Updating...' : 'Refresh'}
              </span>
            </button>

            {/* Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400 status-dot" />
              <div className="flex flex-col items-end">
                <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Operational
                </span>
                <span className="text-xs text-gray-500">
                  {formatLastUpdate(metrics?.lastUpdate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;