import React from 'react';

const FeaturedSignal = ({ signal, onPromoteToBrief }) => {
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

  return (
    <div className="signal-card rounded-lg p-6 group">
      <div className="signal-header mb-4 flex flex-col md:flex-row md:items-start md:justify-between">
        <h3 className="signal-title text-lg font-bold">
          <a 
            href={signal.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:underline"
          >
            {signal.title}
          </a>
        </h3>
        <div className="signal-meta mt-2 flex items-center gap-4 md:mt-0">
          <span className="signal-time text-xs">
            {formatTimeAgo(signal.publishedAt || signal.fetchedAt)}
          </span>
          <span className={`priority-badge priority-${signal.intelligence?.priority?.toLowerCase() || 'low'}`}>
            {signal.intelligence?.priority || 'LOW'}
          </span>
        </div>
      </div>

      <p className="signal-content text-sm mb-4">
        {signal.content || signal.summary}
      </p>

      {/* Intelligence Score */}
      {signal.intelligence && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold">Intelligence Score</span>
            <span className="text-xs font-bold">
              {Math.round(signal.intelligence.relevanceScore || 0)}/100
            </span>
          </div>
          <div className="w-full score-bar h-1.5 rounded-full overflow-hidden">
            <div 
              className={`${getScoreClass(signal.intelligence.relevanceScore || 0)} h-1.5 rounded-full`} 
              style={{ width: `${signal.intelligence.relevanceScore || 0}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {/* Source tag */}
          {signal.source && (
            <span className="tag text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500">
              {signal.source.feedName}
            </span>
          )}
          
          {/* Intelligence categories */}
          {signal.intelligence?.categories?.map(category => (
            <span key={category} className="tag category-tag">
              {category}
            </span>
          ))}
          
          {/* Regular tags */}
          {signal.intelligence?.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handlePromoteToBrief}
            className="text-xs px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500 rounded-md hover:bg-cyan-500/30 transition-colors"
            title="Promote to Brief"
          >
            📋 Brief
          </button>
          
          <a
            href={signal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1 bg-gray-500/20 text-gray-400 border border-gray-500 rounded-md hover:bg-gray-500/30 transition-colors"
            title="Open Source"
          >
            🔗 Source
          </a>
        </div>
      </div>

      {/* Additional Intelligence Metadata */}
      {signal.intelligence && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              {signal.intelligence.confidenceLevel && (
                <span>
                  Confidence: {Math.round(signal.intelligence.confidenceLevel)}%
                </span>
              )}
              
              {signal.intelligence.entities?.countries?.length > 0 && (
                <span>
                  Countries: {signal.intelligence.entities.countries.slice(0, 2).join(', ')}
                  {signal.intelligence.entities.countries.length > 2 && '...'}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              <span>🤖</span>
              <span>AI Analyzed</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedSignal;