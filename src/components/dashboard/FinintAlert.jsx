import React from 'react';

const FinintAlert = ({ time, content }) => {
  return (
    <div className="finint-card mb-8 flex items-start gap-4 rounded-lg p-6 border-l-4 border-cyan-400">
      {/* FININT Icon */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
          <span className="text-cyan-400 text-lg">💰</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="finint-time text-sm font-semibold font-mono">
              {time}
            </span>
            <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500">
              LIVE
            </span>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <span>📊</span>
            <span>Financial Intelligence</span>
          </div>
        </div>
        
        <div className="finint-content text-sm leading-relaxed">
          <strong className="text-cyan-400">FININT:</strong> {content}
        </div>
        
        {/* Alert Level Indicator */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">Alert Level:</span>
            <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded border border-orange-500">
              HIGH
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>Auto-detected</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Alert Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

export default FinintAlert;