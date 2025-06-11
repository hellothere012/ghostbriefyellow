import React, { useState } from 'react';

const FeedList = ({ feeds, onUpdateFeed, onDeleteFeed, onTestFeed }) => {
  const [testingFeed, setTestingFeed] = useState(null);

  const handleToggleFeed = (feedId, isActive) => {
    onUpdateFeed(feedId, { isActive: !isActive });
  };

  const handleTestFeed = async (feed) => {
    setTestingFeed(feed.id);
    try {
      await onTestFeed(feed);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setTestingFeed(null);
    }
  };

  const getStatusColor = (status, errorCount) => {
    if (errorCount > 5) return 'text-red-400';
    if (errorCount > 2) return 'text-yellow-400';
    if (status === 'active') return 'text-green-400';
    return 'text-gray-400';
  };

  const getStatusIcon = (status, errorCount) => {
    if (errorCount > 5) return '❌';
    if (errorCount > 2) return '⚠️';
    if (status === 'active') return '✅';
    return '⏸️';
  };

  const formatLastFetched = (timestamp) => {
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

  if (feeds.length === 0) {
    return (
      <div className="signal-card text-center p-8 rounded-lg">
        <div className="text-4xl mb-4">📡</div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">
          No RSS Feeds Configured
        </h3>
        <p className="text-gray-500">
          Add your first RSS feed to start aggregating intelligence data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feeds.map(feed => (
        <div key={feed.id} className="signal-card p-6 rounded-lg">
          <div className="flex items-start justify-between">
            {/* Feed Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-300 truncate">
                  {feed.name}
                </h3>
                
                {/* Status Indicator */}
                <div className={`flex items-center space-x-1 ${getStatusColor(feed.status, feed.errorCount)}`}>
                  <span className="text-sm">{getStatusIcon(feed.status, feed.errorCount)}</span>
                  <span className="text-xs font-medium uppercase">
                    {feed.errorCount > 5 ? 'Failed' : 
                     feed.errorCount > 2 ? 'Warning' : 
                     feed.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Category Badge */}
                <span className="tag category-tag text-xs">
                  {feed.category}
                </span>
              </div>

              {/* URL */}
              <p className="text-sm text-gray-400 mb-2 font-mono break-all">
                {feed.url}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {feed.tags.map(tag => (
                  <span key={tag} className="tag text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Metadata */}
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>
                  Credibility: <span className="text-cyan-400">{feed.credibilityScore}%</span>
                </span>
                <span>
                  Last Fetched: <span className="text-cyan-400">{formatLastFetched(feed.lastFetched)}</span>
                </span>
                {feed.errorCount > 0 && (
                  <span>
                    Errors: <span className="text-red-400">{feed.errorCount}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col space-y-2 ml-4">
              {/* Toggle Active */}
              <button
                onClick={() => handleToggleFeed(feed.id, feed.isActive)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  feed.isActive
                    ? 'bg-green-500/20 text-green-400 border border-green-500 hover:bg-green-500/30'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500 hover:bg-gray-500/30'
                }`}
              >
                {feed.isActive ? '⏸️ Pause' : '▶️ Activate'}
              </button>

              {/* Test Feed */}
              <button
                onClick={() => handleTestFeed(feed)}
                disabled={testingFeed === feed.id}
                className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500 rounded-md hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              >
                {testingFeed === feed.id ? '⏳ Testing...' : '🔍 Test'}
              </button>

              {/* Delete Feed */}
              <button
                onClick={() => {
                  if (window.confirm(`Delete RSS feed "${feed.name}"?`)) {
                    onDeleteFeed(feed.id);
                  }
                }}
                className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500 rounded-md hover:bg-red-500/30 transition-colors text-xs"
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          {/* Error Messages */}
          {feed.errorCount > 0 && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-sm text-red-400">
                <strong>Recent Issues:</strong> Feed has failed {feed.errorCount} time(s). 
                {feed.errorCount > 5 && ' Feed has been marked as failed and may need attention.'}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FeedList;