import React from 'react';

const LoadingOverlay = ({ status }) => {
  const getStatusColor = () => {
    if (!status) return 'text-cyan-400';
    
    switch (status.stage) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      default: return 'text-cyan-400';
    }
  };

  const getStatusIcon = () => {
    if (!status) return '⚡';
    
    switch (status.stage) {
      case 'fetching': return '🌐';
      case 'processing': return '🧠';
      case 'testing': return '🔍';
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '⚡';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-cyan-400 rounded-lg p-8 max-w-md mx-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Animated Icon */}
          <div className="text-4xl animate-pulse">
            {getStatusIcon()}
          </div>
          
          {/* Loading Spinner */}
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-600 border-t-cyan-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-cyan-400 rounded-full animate-spin animation-delay-75"></div>
          </div>
          
          {/* Status Message */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">
              Processing Intelligence
            </h3>
            <p className={`text-sm ${getStatusColor()}`}>
              {status?.message || 'Analyzing data streams...'}
            </p>
          </div>
          
          {/* Progress Indicator */}
          <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
            <div className="bg-cyan-400 h-1 rounded-full animate-pulse" style={{
              width: status?.stage === 'success' ? '100%' : '60%',
              transition: 'width 0.5s ease-in-out'
            }}></div>
          </div>
          
          {/* Stage Indicator */}
          {status && (
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>Stage:</span>
              <span className={`font-medium ${getStatusColor()}`}>
                {status.stage.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;