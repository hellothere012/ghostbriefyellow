import React, { useState, useMemo } from 'react';
import BriefCard from './BriefCard.jsx';

const Briefs = ({ briefs, onCreateBrief, onPromoteToBrief }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Derive filter options from briefs data
  const filterOptions = useMemo(() => {
    const tags = [...new Set(briefs.flatMap(b => 
      b.tags || b.intelligence?.tags || []
    ))].sort();
    
    const categories = [...new Set(briefs.flatMap(b => 
      b.category ? [b.category] : (b.intelligence?.categories || [])
    ))].sort();
    
    return { tags, categories };
  }, [briefs]);

  // Filter briefs based on search and filters
  const filteredBriefs = useMemo(() => {
    let filtered = briefs;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(brief =>
        brief.title.toLowerCase().includes(searchLower) ||
        (brief.summary || brief.content || '').toLowerCase().includes(searchLower) ||
        (brief.tags || brief.intelligence?.tags || []).some(tag => 
          tag.toLowerCase().includes(searchLower)
        )
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(brief =>
        brief.category === selectedCategory ||
        brief.intelligence?.categories?.includes(selectedCategory)
      );
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(brief =>
        selectedTags.every(tag => 
          (brief.tags || brief.intelligence?.tags || []).includes(tag)
        )
      );
    }

    return filtered;
  }, [briefs, searchTerm, selectedCategory, selectedTags]);

  // Handle filter changes
  const handleTagClick = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTags([]);
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedTags.length > 0;

  // Separate permanent briefs from auto-promoted articles
  const permanentBriefs = filteredBriefs.filter(b => b.isPermanent !== false);
  const autoBriefs = filteredBriefs.filter(b => b.isPermanent === false);

  return (
    <div id="briefs-content" className="content-section">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100 flex items-center space-x-3">
          <span>🧠</span>
          <span>GHOST BRIEFS</span>
        </h1>
        <p className="text-gray-400 mt-2">
          Intelligence reports and analysis - permanent archive of critical information
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search briefs by title, summary, or tags..."
          className="flex-1 p-3 rounded-md search-bar md:mr-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Create Brief Button */}
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500 rounded-md hover:bg-cyan-500/30 transition-colors"
        >
          <span>➕</span>
          <span>Create Brief</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="space-y-4 mb-6">
        {/* Category Filter */}
        {filterOptions.categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Category
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
            <span>🗑️</span>
            <span>Clear All Filters</span>
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-500">
        Showing {filteredBriefs.length} of {briefs.length} briefs
        {permanentBriefs.length > 0 && autoBriefs.length > 0 && (
          <span className="ml-2">
            ({permanentBriefs.length} permanent, {autoBriefs.length} auto-promoted)
          </span>
        )}
      </div>

      {/* Briefs List */}
      <div className="space-y-6">
        {/* Permanent Briefs Section */}
        {permanentBriefs.length > 0 && (
          <div>
            {autoBriefs.length > 0 && (
              <h2 className="section-header mb-4 text-lg font-bold flex items-center space-x-2">
                <span>📌</span>
                <span>Permanent Briefs</span>
              </h2>
            )}
            <div className="space-y-4">
              {permanentBriefs.map((brief, index) => (
                <BriefCard
                  key={brief.id || index}
                  brief={brief}
                  onPromoteToBrief={onPromoteToBrief}
                  isPermanent={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Auto-Promoted Briefs Section */}
        {autoBriefs.length > 0 && (
          <div>
            {permanentBriefs.length > 0 && (
              <h2 className="section-header mb-4 text-lg font-bold flex items-center space-x-2">
                <span>🤖</span>
                <span>Auto-Promoted Intelligence</span>
              </h2>
            )}
            <div className="space-y-4">
              {autoBriefs.map((brief, index) => (
                <BriefCard
                  key={brief.id || index}
                  brief={brief}
                  onPromoteToBrief={onPromoteToBrief}
                  isPermanent={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredBriefs.length === 0 && (
          <div className="signal-card text-center p-8 rounded-lg">
            <div className="text-4xl mb-4">
              {hasActiveFilters ? '🔍' : '🧠'}
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              {hasActiveFilters ? 'No Matching Briefs' : 'No Briefs Available'}
            </h3>
            <p className="text-gray-500 mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your filters or search terms.'
                : 'Create your first intelligence brief or wait for high-value articles to be auto-promoted.'}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500 rounded-md hover:bg-cyan-500/30 transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500 rounded-md hover:bg-cyan-500/30 transition-colors"
              >
                Create First Brief
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Brief Modal */}
      {showCreateForm && (
        <CreateBriefModal
          onClose={() => setShowCreateForm(false)}
          onCreateBrief={onCreateBrief}
        />
      )}
    </div>
  );
};

// Simple Create Brief Modal Component
const CreateBriefModal = ({ onClose, onCreateBrief }) => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    category: 'INTELLIGENCE',
    tags: '',
    priority: 'MEDIUM'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.summary.trim()) {
      alert('Title and summary are required');
      return;
    }

    const briefData = {
      title: formData.title.trim(),
      summary: formData.summary.trim(),
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim().toUpperCase()).filter(tag => tag),
      priority: formData.priority,
      source: 'manual_creation'
    };

    const success = onCreateBrief(briefData);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-cyan-400 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-cyan-400">Create Intelligence Brief</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-gray-300 focus:border-cyan-400 focus:outline-none"
              placeholder="Brief title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Summary *</label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              rows={6}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-gray-300 focus:border-cyan-400 focus:outline-none"
              placeholder="Intelligence summary and analysis..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-gray-300 focus:border-cyan-400 focus:outline-none"
              >
                <option value="INTELLIGENCE">Intelligence</option>
                <option value="MILITARY">Military</option>
                <option value="CYBERSECURITY">Cybersecurity</option>
                <option value="GEOPOLITICS">Geopolitics</option>
                <option value="TECHNOLOGY">Technology</option>
                <option value="FINANCE">Finance</option>
                <option value="HEALTH">Health</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-gray-300 focus:border-cyan-400 focus:outline-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-gray-300 focus:border-cyan-400 focus:outline-none"
              placeholder="e.g., CLASSIFIED, URGENT, REGIONAL"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500 rounded-md hover:bg-cyan-500/30 transition-colors"
            >
              Create Brief
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Briefs;