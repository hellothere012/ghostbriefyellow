/**
 * UI Configuration Constants
 * Centralized configuration for user interface elements, themes, and display settings
 */

// Theme Configuration
export const THEME = {
  COLORS: {
    PRIMARY: '#00ff88',
    SECONDARY: '#00cc66', 
    ACCENT: '#88ff00',
    BACKGROUND: '#0a0a0a',
    SURFACE: '#1a1a1a',
    TEXT_PRIMARY: '#ffffff',
    TEXT_SECONDARY: '#cccccc',
    TEXT_MUTED: '#888888',
    ERROR: '#ff4444',
    WARNING: '#ffaa00',
    SUCCESS: '#00ff88',
    INFO: '#4488ff'
  },
  GRADIENTS: {
    PRIMARY: 'linear-gradient(135deg, #00ff88, #00cc66)',
    SECONDARY: 'linear-gradient(135deg, #88ff00, #66cc00)',
    DARK: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)'
  },
  SHADOWS: {
    SMALL: '0 2px 4px rgba(0, 255, 136, 0.1)',
    MEDIUM: '0 4px 8px rgba(0, 255, 136, 0.15)',
    LARGE: '0 8px 16px rgba(0, 255, 136, 0.2)',
    GLOW: '0 0 20px rgba(0, 255, 136, 0.3)'
  }
};

// Layout Constants
export const LAYOUT = {
  HEADER_HEIGHT: '60px',
  SIDEBAR_WIDTH: '280px',
  CONTENT_MAX_WIDTH: '1200px',
  CONTENT_PADDING: '24px',
  CARD_SPACING: '16px',
  BORDER_RADIUS: '8px',
  BREAKPOINTS: {
    MOBILE: '768px',
    TABLET: '1024px',
    DESKTOP: '1200px'
  }
};

// Component Sizes
export const SIZES = {
  ICON: {
    SMALL: '16px',
    MEDIUM: '20px',
    LARGE: '24px',
    XLARGE: '32px'
  },
  BUTTON: {
    SMALL: '32px',
    MEDIUM: '40px',
    LARGE: '48px'
  },
  FONT: {
    SMALL: '12px',
    MEDIUM: '14px',
    LARGE: '16px',
    XLARGE: '20px',
    XXLARGE: '24px'
  }
};

// Animation Constants
export const ANIMATIONS = {
  DURATION: {
    FAST: '0.15s',
    NORMAL: '0.3s',
    SLOW: '0.5s'
  },
  EASING: {
    EASE: 'ease',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out'
  },
  TRANSITIONS: {
    DEFAULT: 'all 0.3s ease',
    COLOR: 'color 0.3s ease',
    BACKGROUND: 'background-color 0.3s ease',
    TRANSFORM: 'transform 0.3s ease'
  }
};

// Priority Level UI Configuration
export const PRIORITY_UI = {
  CRITICAL: {
    color: '#ff4444',
    background: 'rgba(255, 68, 68, 0.1)',
    border: '1px solid #ff4444',
    icon: '🔴',
    pulse: true
  },
  HIGH: {
    color: '#ffaa00',
    background: 'rgba(255, 170, 0, 0.1)',
    border: '1px solid #ffaa00',
    icon: '🟡',
    pulse: false
  },
  MEDIUM: {
    color: '#4488ff',
    background: 'rgba(68, 136, 255, 0.1)',
    border: '1px solid #4488ff',
    icon: '🔵',
    pulse: false
  },
  LOW: {
    color: '#888888',
    background: 'rgba(136, 136, 136, 0.1)',
    border: '1px solid #888888',
    icon: '⚪',
    pulse: false
  }
};

// Category UI Configuration
export const CATEGORY_UI = {
  MILITARY: {
    color: '#ff4444',
    icon: '🛡️',
    background: 'rgba(255, 68, 68, 0.1)'
  },
  TECHNOLOGY: {
    color: '#4444ff',
    icon: '💻',
    background: 'rgba(68, 68, 255, 0.1)'
  },
  CYBERSECURITY: {
    color: '#ff8800',
    icon: '🔒',
    background: 'rgba(255, 136, 0, 0.1)'
  },
  GEOPOLITICS: {
    color: '#00aa44',
    icon: '🌍',
    background: 'rgba(0, 170, 68, 0.1)'
  },
  FINANCE: {
    color: '#8844ff',
    icon: '💰',
    background: 'rgba(136, 68, 255, 0.1)'
  },
  SCIENCE: {
    color: '#00aaaa',
    icon: '🔬',
    background: 'rgba(0, 170, 170, 0.1)'
  }
};

// Loading States
export const LOADING_STATES = {
  SPINNER: {
    size: '20px',
    color: '#00ff88',
    duration: '1s'
  },
  SKELETON: {
    baseColor: '#1a1a1a',
    highlightColor: '#2a2a2a',
    duration: '1.5s'
  },
  PROGRESS: {
    height: '4px',
    color: '#00ff88',
    background: '#333333'
  }
};

// Message Types
export const MESSAGE_TYPES = {
  SUCCESS: {
    color: '#00ff88',
    background: 'rgba(0, 255, 136, 0.1)',
    icon: '✅'
  },
  ERROR: {
    color: '#ff4444',
    background: 'rgba(255, 68, 68, 0.1)',
    icon: '❌'
  },
  WARNING: {
    color: '#ffaa00',
    background: 'rgba(255, 170, 0, 0.1)',
    icon: '⚠️'
  },
  INFO: {
    color: '#4488ff',
    background: 'rgba(68, 136, 255, 0.1)',
    icon: 'ℹ️'
  }
};

// Table Configuration
export const TABLE = {
  ROW_HEIGHT: '48px',
  HEADER_HEIGHT: '56px',
  PAGINATION_SIZE: 25,
  MAX_COLUMN_WIDTH: '300px',
  MIN_COLUMN_WIDTH: '100px'
};

// Modal Configuration
export const MODAL = {
  BACKDROP_COLOR: 'rgba(0, 0, 0, 0.8)',
  MAX_WIDTH: '600px',
  PADDING: '24px',
  BORDER_RADIUS: '12px',
  ANIMATION_DURATION: '0.3s'
};

// Navigation Constants
export const NAVIGATION = {
  ITEMS: [
    { id: 'dashboard', label: 'Dashboard', path: '/', icon: '📊' },
    { id: 'signals', label: 'Live Signals', path: '/signals', icon: '📡' },
    { id: 'briefs', label: 'Intelligence Briefs', path: '/briefs', icon: '📋' },
    { id: 'rss', label: 'RSS Management', path: '/rss', icon: '⚙️' }
  ],
  ACTIVE_INDICATOR: {
    width: '3px',
    color: '#00ff88'
  }
};

// Form Constants
export const FORM = {
  INPUT_HEIGHT: '40px',
  LABEL_FONT_SIZE: '14px',
  ERROR_FONT_SIZE: '12px',
  SPACING: '16px',
  VALIDATION: {
    SUCCESS_COLOR: '#00ff88',
    ERROR_COLOR: '#ff4444',
    BORDER_WIDTH: '2px'
  }
};