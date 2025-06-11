import React, { useState } from 'react';
import FeedList from './FeedList.jsx';
import AddFeedModal from './AddFeedModal.jsx';
import FeedHealthMonitor from './FeedHealthMonitor.jsx';

const RSSManagement = ({ 
  feeds, 
  onAddFeed, 
  onUpdateFeed, 
  onDeleteFeed, 
  onTestFeed,
  statistics,
  settings,
  onUpdateSettings 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeView, setActiveView] = useState('feeds');

  const handleAddFeed = async (feedConfig) => {
    const success = await onAddFeed(feedConfig);
    if (success) {
      setShowAddModal(false);
    }
    return success;
  };

  const feedCategories = ['ALL', 'MILITARY', 'TECHNOLOGY', 'CYBERSECURITY', 'GEOPOLITICS', 'FINANCE', 'SCIENCE'];
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredFeeds = selectedCategory === 'ALL' 
    ? feeds 
    : feeds.filter(feed => feed.category === selectedCategory);

  return (
    <div className="rss-management">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100 flex items-center space-x-3">
          <span>⚙️</span>
          <span>RSS FEED MANAGEMENT</span>
        </h1>
        <p className="text-gray-400 mt-2">
          Configure and monitor intelligence RSS feeds for real-time data aggregation
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6">
        {[
          { id: 'feeds', label: 'Feed Configuration', icon: '📡' },
          { id: 'health', label: 'Health Monitor', icon: '💊' },
          { id: 'settings', label: 'Settings', icon: '⚙️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors ${
              activeView === tab.id 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Feed Configuration View */}
      {activeView === 'feeds' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="signal-card p-4 rounded-lg">
              <div className="text-cyan-400 text-2xl font-bold">
                {statistics?.totalFeeds || 0}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                Total Feeds
              </div>
            </div>
            
            <div className="signal-card p-4 rounded-lg">
              <div className="text-green-400 text-2xl font-bold">
                {statistics?.activeFeeds || 0}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                Active Feeds
              </div>
            </div>
            
            <div className="signal-card p-4 rounded-lg">
              <div className="text-yellow-400 text-2xl font-bold">
                {statistics?.totalArticles || 0}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                Articles Cached
              </div>
            </div>
            
            <div className="signal-card p-4 rounded-lg">
              <div className="text-blue-400 text-2xl font-bold">
                {statistics?.storageUsed?.mb || 0}MB
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                Storage Used
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {feedCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Add Feed Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500 rounded-md hover:bg-cyan-500/30 transition-colors"
            >
              <span>➕</span>
              <span>Add RSS Feed</span>
            </button>
          </div>

          {/* Feed List */}
          <FeedList
            feeds={filteredFeeds}
            onUpdateFeed={onUpdateFeed}
            onDeleteFeed={onDeleteFeed}
            onTestFeed={onTestFeed}
          />
        </div>
      )}

      {/* Health Monitor View */}
      {activeView === 'health' && (
        <FeedHealthMonitor 
          feeds={feeds}
          onTestFeed={onTestFeed}
        />
      )}

      {/* Settings View */}
      {activeView === 'settings' && (
        <div className="space-y-6">
          <div className="signal-card p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">
              Processing Settings
            </h3>
            
            <div className="space-y-4">
              {/* Relevance Threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Intelligence Relevance Threshold
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings?.relevanceThreshold || 40}
                    onChange={(e) => onUpdateSettings({
                      ...settings,
                      relevanceThreshold: parseInt(e.target.value)
                    })}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-cyan-400 font-semibold min-w-12">
                    {settings?.relevanceThreshold || 40}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Articles below this score will be filtered out
                </p>
              </div>

              {/* Auto Refresh Interval */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Auto Refresh Interval (minutes)
                </label>
                <select
                  value={settings?.autoRefreshInterval || 15}
                  onChange={(e) => onUpdateSettings({
                    ...settings,
                    autoRefreshInterval: parseInt(e.target.value)
                  })}
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-gray-300"
                >
                  <option value="5">5 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="0">Manual only</option>
                </select>
              </div>

              {/* Max Articles Per Feed */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Max Articles Per Feed
                </label>
                <select
                  value={settings?.maxArticlesPerFeed || 50}
                  onChange={(e) => onUpdateSettings({
                    ...settings,
                    maxArticlesPerFeed: parseInt(e.target.value)
                  })}
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-gray-300"
                >
                  <option value="25">25 articles</option>
                  <option value="50">50 articles</option>
                  <option value="100">100 articles</option>
                  <option value="200">200 articles</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="signal-card p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">
              Data Management
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Clear Cache</p>
                  <p className="text-xs text-gray-500">Remove all cached articles</p>
                </div>
                <button className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500 rounded-md hover:bg-red-500/30 transition-colors">
                  Clear
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Export Configuration</p>
                  <p className="text-xs text-gray-500">Download feed settings</p>
                </div>
                <button className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500 rounded-md hover:bg-blue-500/30 transition-colors">
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Feed Modal */}
      {showAddModal && (
        <AddFeedModal
          onClose={() => setShowAddModal(false)}
          onAddFeed={handleAddFeed}
        />
      )}
    </div>
  );
};

export default RSSManagement;