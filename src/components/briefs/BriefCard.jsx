import React from 'react';

const BriefCard = ({ brief, onPromoteToBrief, isPermanent }) => {
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

  const handlePromoteToPermanent = () => {
    if (onPromoteToBrief && !isPermanent) {
      onPromoteToBrief(brief);
    }
  };

  // Get display data from brief or its intelligence metadata
  const priority = brief.priority || brief.intelligence?.priority || 'MEDIUM';
  const category = brief.category || brief.intelligence?.categories?.[0] || 'GENERAL';
  const tags = brief.tags || brief.intelligence?.tags || [];
  const published = brief.published || brief.createdAt || brief.publishedAt || brief.fetchedAt;
  const content = brief.summary || brief.content;
  
  // Check if this brief has intelligence scoring
  const hasIntelligence = brief.intelligence && brief.intelligence.relevanceScore;

  return (
    <div className="signal-card rounded-lg p-6 group">
      {/* Header */}
      <div className="signal-header mb-4 flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="flex-1 mr-4">
          <div className="flex items-start space-x-3 mb-2">
            <h3 className="signal-title text-lg font-bold">
              {brief.url ? (
                <a 
                  href={brief.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline"
                >
                  {brief.title}
                </a>
              ) : (
                brief.title
              )}
            </h3>
            
            {/* Brief Type Indicator */}
            <div className="flex items-center space-x-1">
              {isPermanent ? (
                <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500 rounded-full" title="Permanent Brief">
                  📌 SAVED
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500 rounded-full" title="Auto-promoted from RSS">
                  🤖 AUTO
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="signal-meta mt-2 flex items-center gap-4 md:mt-0 flex-shrink-0">
          <span className="signal-time text-xs">
            {formatTimeAgo(published)}
          </span>
          <span className={`priority-badge priority-${priority.toLowerCase()}`}>
            {priority}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="signal-content text-sm mb-4 leading-relaxed">
        {content}
      </div>

      {/* Intelligence Score (if available) */}
      {hasIntelligence && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-400">Intelligence Score</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-cyan-400">
                {Math.round(brief.intelligence.relevanceScore)}/100
              </span>
              {brief.intelligence.confidenceLevel && (
                <span className="text-xs text-gray-500">
                  ({Math.round(brief.intelligence.confidenceLevel)}% confidence)
                </span>
              )}
            </div>
          </div>
          <div className="w-full score-bar h-1.5 rounded-full overflow-hidden">
            <div 
              className={`score-fill-high h-1.5 rounded-full transition-all duration-500`} 
              style={{ width: `${brief.intelligence.relevanceScore}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Entity Information (if available) */}
      {brief.intelligence?.entities && (
        <div className="mb-4">
          {(brief.intelligence.entities.countries?.length > 0 || brief.intelligence.entities.technologies?.length > 0) && (
            <div className="flex flex-wrap gap-2 text-xs">
              {brief.intelligence.entities.countries?.slice(0, 3).map(country => (
                <span key={country} className="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500 rounded-full">
                  🌍 {country}
                </span>
              ))}
              {brief.intelligence.entities.technologies?.slice(0, 2).map(tech => (
                <span key={tech} className="px-2 py-1 bg-purple-500/20 text-purple-400 border border-purple-500 rounded-full">
                  🔬 {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tags and Actions */}
      <div className="flex justify-between items-end">
        <div className="flex flex-wrap gap-2">
          {/* Category */}
          <span className="tag category-tag">
            {category}
          </span>
          
          {/* Source Information */}
          {brief.source && (
            <span className="tag text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500">
              {brief.source === 'manual_creation' ? '✍️ Manual' :
               brief.source === 'auto_promoted' ? '🤖 Auto' :
               brief.source === 'promoted_article' ? '📰 Promoted' :
               `📡 ${brief.source}`}
            </span>
          )}
          
          {/* Feed Source (for auto-promoted articles) */}
          {brief.source?.feedName && (
            <span className="tag text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500">
              📡 {brief.source.feedName}
            </span>
          )}
          
          {/* Regular Tags */}
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
          {/* Promote to Permanent (for auto-promoted articles) */}
          {!isPermanent && (
            <button
              onClick={handlePromoteToPermanent}
              className="text-xs px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500 rounded-md hover:bg-green-500/30 transition-colors flex items-center space-x-1"
              title="Save as Permanent Brief"
            >
              <span>📌</span>
              <span>Save</span>
            </button>
          )}
          
          {/* Open Source (if URL available) */}
          {brief.url && (
            <a
              href={brief.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 bg-gray-500/20 text-gray-400 border border-gray-500 rounded-md hover:bg-gray-500/30 transition-colors flex items-center space-x-1"
              title="Open Source Article"
            >
              <span>🔗</span>
              <span>Source</span>
            </a>
          )}
        </div>
      </div>

      {/* Metadata Footer */}
      <div className="pt-3 border-t border-gray-700 mt-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            {/* Brief Type */}
            <div className="flex items-center space-x-1">
              {isPermanent ? (
                <>
                  <span>📌</span>
                  <span>Permanent Brief</span>
                </>
              ) : (
                <>
                  <span>🤖</span>
                  <span>Auto-Promoted</span>
                </>
              )}
            </div>
            
            {/* Original Source Domain */}
            {brief.source?.domain && (
              <span>
                from {brief.source.domain}
              </span>
            )}
            
            {/* Credibility Score */}
            {brief.source?.credibilityScore && (
              <span>
                Credibility: {brief.source.credibilityScore}%
              </span>
            )}
          </div>
          
          {/* Creation/Promotion Timestamp */}
          <span title={isPermanent ? "Brief created at" : "Article promoted at"}>
            {isPermanent ? 'Created' : 'Promoted'}: {formatTimeAgo(brief.createdAt || brief.fetchedAt)}
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

export default BriefCard;