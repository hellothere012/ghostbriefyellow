import React, { useState, useMemo } from 'react';
import { FaRadio, FaSearch, FaTrash } from 'react-icons/fa';
import SignalCard from './SignalCard.jsx';

const Signals = ({ signals, onPromoteToBrief, settings, onUpdateSettings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Derive filter options from signals data
  const filterOptions = useMemo(() => {
    const priorities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    const tags = [...new Set(signals.flatMap(s => s.intelligence?.tags || []))].sort();
    const categories = [...new Set(signals.flatMap(s => s.intelligence?.categories || []))].sort();
    
    return { priorities, tags, categories };
  }, [signals]);

  // Filter signals based on search and filters
  const filteredSignals = useMemo(() => {
    let filtered = signals;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(signal =>
        signal.title.toLowerCase().includes(searchLower) ||
        (signal.content || signal.summary || '').toLowerCase().includes(searchLower) ||
        (signal.intelligence?.tags || []).some(tag => 
          tag.toLowerCase().includes(searchLower)
        )
      );
    }

    // Priority filter
    if (selectedPriority) {
      filtered = filtered.filter(signal => 
        signal.intelligence?.priority === selectedPriority
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(signal =>
        signal.intelligence?.categories?.includes(selectedCategory)
      );
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(signal =>
        selectedTags.every(tag => 
          signal.intelligence?.tags?.includes(tag)
        )
      );
    }

    return filtered;
  }, [signals, searchTerm, selectedPriority, selectedCategory, selectedTags]);

  // Handle filter changes
  const handleTagClick = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedPriority('');
    setSelectedCategory('');
    setSelectedTags([]);
  };

  const hasActiveFilters = searchTerm || selectedPriority || selectedCategory || selectedTags.length > 0;

  return (
    <div id="signals-content" className="content-section">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100 flex items-center space-x-3">
          <FaRadio />
          <span>SIGNAL DROPS</span>
        </h1>
        <p className="text-gray-400 mt-2">
          Live intelligence feed from RSS sources with AI analysis and scoring
        </p>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search signals by title, content, or tags..."
        className="w-full p-3 mb-4 rounded-md search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filter Controls */}
      <div className="space-y-4 mb-6">
        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Priority Level
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedPriority('')}
              className={`filter-button px-3 py-1 rounded-full text-xs ${
                !selectedPriority ? 'filter-button-active' : ''
              }`}
            >
              ALL
            </button>
            {filterOptions.priorities.map(priority => (
              <button
                key={priority}
                onClick={() => setSelectedPriority(priority)}
                className={`filter-button px-3 py-1 rounded-full text-xs ${
                  selectedPriority === priority ? 'filter-button-active' : ''
                }`}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        {filterOptions.categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Intelligence Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`filter-button px-3 py-1 rounded-full text-xs ${
                  !selectedCategory ? 'filter-button-active' : ''
                }`}
              >
                ALL
              </button>
              {filterOptions.categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`filter-button px-3 py-1 rounded-full text-xs ${
                    selectedCategory === category ? 'filter-button-active' : ''
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tags Filter */}
        {filterOptions.tags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Tags (click to toggle)
            </label>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {filterOptions.tags.slice(0, 20).map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`filter-button px-3 py-1 rounded-full text-xs ${
                    selectedTags.includes(tag) ? 'filter-button-active' : ''
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="mb-6">
          <button
            onClick={clearAllFilters}
            className="filter-button px-4 py-2 rounded-full text-xs flex items-center space-x-2"
          >
            <FaTrash />
            <span>Clear All Filters</span>
          </button>
        </div>
      )}

      {/* Results Count and Settings */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-500">
          Showing {filteredSignals.length} of {signals.length} signals
          {settings?.relevanceThreshold && (
            <span className="ml-2">
              (relevance ≥ {settings.relevanceThreshold})
            </span>
          )}
        </div>

        {/* Quick Settings */}
        {onUpdateSettings && (
          <div className="flex items-center space-x-2 text-xs">
            <label className="text-gray-400">Min. Relevance:</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings?.relevanceThreshold || 40}
              onChange={(e) => onUpdateSettings({
                ...settings,
                relevanceThreshold: parseInt(e.target.value)
              })}
              className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-cyan-400 font-semibold min-w-8">
              {settings?.relevanceThreshold || 40}
            </span>
          </div>
        )}
      </div>

      {/* Signals List */}
      <div className="space-y-4">
        {filteredSignals.length > 0 ? (
          filteredSignals.map((signal, index) => (
            <SignalCard
              key={signal.id || index}
              signal={signal}
              onPromoteToBrief={onPromoteToBrief}
            />
          ))
        ) : (
          <div className="signal-card text-center p-8 rounded-lg">
            <div className="text-4xl mb-4">
              {hasActiveFilters ? <FaSearch /> : <FaRadio />}
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              {hasActiveFilters ? 'No Matching Signals' : 'No Signals Available'}
            </h3>
            <p className="text-gray-500">
              {hasActiveFilters 
                ? 'Try adjusting your filters or search terms.'
                : 'RSS feeds are being processed. Click refresh to fetch latest intelligence.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500 rounded-md hover:bg-cyan-500/30 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Load More (if needed) */}
      {filteredSignals.length > 50 && (
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Showing first 50 results. Use filters to narrow down your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default Signals;