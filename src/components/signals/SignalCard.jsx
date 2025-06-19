import React from 'react';
import { FaGlobe, FaMicroscope, FaBroadcastTower, FaClipboard, FaExternalLinkAlt, FaRobot } from 'react-icons/fa';

const SignalCard = ({ signal, onPromoteToBrief }) => {
  const getScoreClass = (score) => {
    if (score < 40) return 'score-fill-low';
    if (score < 75) return 'score-fill-medium';
    return 'score-fill-high';
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  const handlePromoteToBrief = () => {
    if (onPromoteToBrief) {
      onPromoteToBrief(signal);
    }
  };

  const intelligence = signal.intelligence || {};
  const relevanceScore = Math.round(intelligence.relevanceScore || 0);
  const priority = intelligence.priority || 'LOW';
  const categories = intelligence.categories || [];
  const tags = intelligence.tags || [];
  const entities = intelligence.entities || {};

  return (
    <div className="signal-card rounded-lg p-6 group">
      {/* Header */}
      <div className="signal-header mb-4 flex flex-col md:flex-row md:items-start md:justify-between">
        <h3 className="signal-title text-lg font-bold flex-1 mr-4">
          <a 
            href={signal.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:underline"
          >
            {signal.title}
          </a>
        </h3>
        <div className="signal-meta mt-2 flex items-center gap-4 md:mt-0 flex-shrink-0">
          <span className="signal-time text-xs">
            {formatTimeAgo(signal.publishedAt || signal.fetchedAt)}
          </span>
          <span className={`priority-badge priority-${priority.toLowerCase()}`}>
            {priority}
          </span>
        </div>
      </div>

      {/* Content */}
      <p className="signal-content text-sm mb-4 leading-relaxed">
        {signal.content || signal.summary}
      </p>

      {/* Intelligence Analysis */}
      <div className="mb-4 space-y-3">
        {/* Intelligence Score */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-400">Intelligence Score</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-cyan-400">
                {relevanceScore}/100
              </span>
              {intelligence.confidenceLevel && (
                <span className="text-xs text-gray-500">
                  ({Math.round(intelligence.confidenceLevel)}% confidence)
                </span>
              )}
            </div>
          </div>
          <div className="w-full score-bar h-2 rounded-full overflow-hidden">
            <div 
              className={`${getScoreClass(relevanceScore)} h-2 rounded-full transition-all duration-500`} 
              style={{ width: `${relevanceScore}%` }}
            ></div>
          </div>
        </div>

        {/* Entity Information */}
        {(entities.countries?.length > 0 || entities.technologies?.length > 0) && (
          <div className="flex flex-wrap gap-2 text-xs">
            {entities.countries?.slice(0, 3).map(country => (
              <span key={country} className="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500 rounded-full flex items-center gap-1">
                <FaGlobe /> {country}
              </span>
            ))}
            {entities.technologies?.slice(0, 2).map(tech => (
              <span key={tech} className="px-2 py-1 bg-purple-500/20 text-purple-400 border border-purple-500 rounded-full flex items-center gap-1">
                <FaMicroscope /> {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tags and Categories */}
      <div className="flex justify-between items-end mb-4">
        <div className="flex flex-wrap gap-2">
          {/* Source Information */}
          {signal.source && (
            <span className="tag text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500 flex items-center gap-1">
              <FaBroadcastTower /> {signal.source.feedName}
            </span>
          )}
          
          {/* Categories */}
          {categories.slice(0, 2).map(category => (
            <span key={category} className="tag category-tag">
              {category}
            </span>
          ))}
          
          {/* Tags */}
          {tags.slice(0, 4).map(tag => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
          
          {/* Show more indicator */}
          {tags.length > 4 && (
            <span className="text-xs text-gray-500">
              +{tags.length - 4} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handlePromoteToBrief}
            className="text-xs px-3 py-1.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500 rounded-md hover:bg-cyan-500/30 transition-colors flex items-center space-x-1"
            title="Promote to Permanent Brief"
          >
            <FaClipboard />
            <span>Brief</span>
          </button>
          
          <a
            href={signal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 bg-gray-500/20 text-gray-400 border border-gray-500 rounded-md hover:bg-gray-500/30 transition-colors flex items-center space-x-1"
            title="Open Source Article"
          >
            <FaExternalLinkAlt />
            <span>Source</span>
          </a>
        </div>
      </div>

      {/* Intelligence Metadata Footer */}
      <div className="pt-3 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            {/* Processing Info */}
            <div className="flex items-center space-x-1">
              <FaRobot />
              <span>Claude Analyzed</span>
            </div>
            
            {/* Source Domain */}
            {signal.source?.domain && (
              <span>
                from {signal.source.domain}
              </span>
            )}
            
            {/* Credibility Score */}
            {signal.source?.credibilityScore && (
              <span>
                Credibility: {signal.source.credibilityScore}%
              </span>
            )}
          </div>
          
          {/* Processing Timestamp */}
          <span title="Article fetched at">
            Fetched: {formatTimeAgo(signal.fetchedAt)}
          </span>
        </div>
      </div>

      {/* Critical Alert Indicator */}
      {priority === 'CRITICAL' && (
        <div className="absolute top-2 right-2">
          <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
        </div>
      )}
    </div>
  );
};

export default SignalCard;