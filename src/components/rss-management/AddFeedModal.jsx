import React, { useState } from 'react';

const AddFeedModal = ({ onClose, onAddFeed }) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: 'TECHNOLOGY',
    tags: '',
    credibilityScore: 70,
    isActive: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'MILITARY', 'TECHNOLOGY', 'CYBERSECURITY', 'GEOPOLITICS', 
    'FINANCE', 'SCIENCE', 'HEALTH', 'ENERGY'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(''); // Clear error on input change
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Feed name is required');
      return false;
    }
    
    if (!formData.url.trim()) {
      setError('RSS URL is required');
      return false;
    }

    // Basic URL validation
    try {
      new URL(formData.url);
    } catch {
      setError('Please enter a valid URL');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const feedConfig = {
        name: formData.name.trim(),
        url: formData.url.trim(),
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim().toUpperCase()).filter(tag => tag),
        credibilityScore: parseInt(formData.credibilityScore),
        isActive: formData.isActive
      };

      const success = await onAddFeed(feedConfig);
      if (success) {
        onClose();
      } else {
        setError('Failed to add RSS feed. Please check the URL and try again.');
      }
    } catch (err) {
      setError('Failed to add RSS feed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestUrl = async () => {
    if (!formData.url.trim()) {
      setError('Please enter a URL to test');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Simple fetch test
      const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(formData.url)}`);
      if (response.ok) {
        const content = await response.text();
        if (content.includes('<rss') || content.includes('<feed') || content.includes('<?xml')) {
          setError('✅ RSS feed validation successful!');
        } else {
          setError('⚠️ URL responded but may not be a valid RSS feed');
        }
      } else {
        setError('❌ URL is not accessible or does not exist');
      }
    } catch (err) {
      setError('❌ Failed to test URL: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-cyan-400 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-cyan-400">Add RSS Feed</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Feed Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Feed Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Defense News"
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-gray-300 focus:border-cyan-400 focus:outline-none"
              required
            />
          </div>

          {/* RSS URL */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              RSS URL *
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://example.com/rss"
                className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-md text-gray-300 focus:border-cyan-400 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={handleTestUrl}
                disabled={isSubmitting}
                className="px-3 py-2 bg-blue-500/20 text-blue-400 border border-blue-500 rounded-md hover:bg-blue-500/30 transition-colors disabled:opacity-50"
              >
                Test
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-gray-300 focus:border-cyan-400 focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., DEFENSE, MILITARY, WEAPONS"
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-gray-300 focus:border-cyan-400 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used for intelligent tagging and filtering
            </p>
          </div>

          {/* Credibility Score */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Credibility Score: {formData.credibilityScore}%
            </label>
            <input
              type="range"
              name="credibilityScore"
              min="1"
              max="100"
              value={formData.credibilityScore}
              onChange={handleInputChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low Trust</span>
              <span>High Trust</span>
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-4 h-4 text-cyan-400 bg-gray-800 border-gray-600 rounded focus:ring-cyan-400"
            />
            <label className="text-sm text-gray-400">
              Activate feed immediately
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`p-3 rounded-md text-sm ${
              error.includes('✅') ? 'bg-green-500/10 border border-green-500/20 text-green-400' :
              error.includes('⚠️') ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400' :
              'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {error}
            </div>
          )}

          {/* Submit Buttons */}
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
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500 rounded-md hover:bg-cyan-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Feed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFeedModal;