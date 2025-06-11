import React from 'react';

const MetricCard = ({ title, value, change, icon, priority }) => {
  const getPriorityColor = () => {
    switch (priority) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      default: return 'text-cyan-400';
    }
  };

  const getPriorityGlow = () => {
    switch (priority) {
      case 'critical': return 'shadow-red-500/20';
      case 'high': return 'shadow-orange-500/20';
      case 'medium': return 'shadow-yellow-500/20';
      default: return 'shadow-cyan-500/20';
    }
  };

  return (
    <div className={`metric-card ${getPriorityGlow()}`}>
      {/* Icon */}
      {icon && (
        <div className="text-2xl mb-2">
          {icon}
        </div>
      )}
      
      {/* Title */}
      <p className="metric-label mt-2 text-sm font-semibold uppercase tracking-wider">
        {title}
      </p>
      
      {/* Value */}
      <p className={`metric-value text-5xl font-bold ${getPriorityColor()}`}>
        {value}
      </p>
      
      {/* Change/Description */}
      <p className="metric-change mt-1 text-xs">
        {change}
      </p>

      {/* Priority indicator for critical items */}
      {priority === 'critical' && (
        <div className="absolute top-2 right-2">
          <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default MetricCard;