# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ghost Brief is a professional-grade AI-powered intelligence briefing dashboard that aggregates and analyzes RSS feeds from premium intelligence sources. The application features:

- **Real-time RSS Processing**: Live feeds from 15+ premium intelligence sources
- **AI-Powered Analysis**: Automatic relevance scoring, entity extraction, and priority classification
- **Intelligence Dashboard**: Live metrics, threat assessments, and featured signals
- **Permanent Briefs**: User-created and auto-promoted intelligence reports
- **Live Signals**: Real-time feed processing with 30-day retention
- **RSS Management**: Complete feed configuration, health monitoring, and testing
- **Advanced Filtering**: Multi-dimensional search and categorization

## Architecture

### Technology Stack
- **Frontend**: React 18 with functional components and hooks
- **Styling**: Custom CSS with CSS variables, green/black intelligence theme
- **State Management**: React hooks (useState, useEffect, useMemo, useCallback)
- **Data Persistence**: IndexedDB with automatic cleanup and retention policies
- **RSS Processing**: Custom RSS service with CORS proxy integration
- **AI Analysis**: Client-side intelligence analysis engine with entity recognition

### Core Services

#### RSS Service (`src/services/rssService.js`)
- Fetches and parses RSS feeds using CORS proxy and Webshare proxy integration
- Processes articles through AI analysis pipeline
- Handles duplicate detection and advertisement filtering
- Implements intelligent content scoring and priority assignment
- Supports concurrent feed processing with error handling

#### Webshare Proxy Service (`webshareProxy.js`)
- Professional RSS proxy integration using rotating residential proxies
- HTTP and SOCKS5 proxy support with authentication
- Enhanced reliability for RSS feed fetching
- Built-in connection testing and error handling
- User-Agent and header management for stealth operations

#### Storage Service (`src/services/storageService.js`)
- Manages IndexedDB data persistence for feeds, articles, and briefs
- Implements 30-day automatic retention policy for articles
- Provides feed health monitoring and statistics
- Handles data import/export and backup functionality
- Automatic migration from localStorage to IndexedDB

#### IndexedDB Service (`src/services/indexedDBService.js`)
- High-capacity storage infrastructure (GB capacity vs ~10MB localStorage)
- Structured database with optimized indexes for performance
- Transaction-based operations prevent data corruption
- Schema versioning and upgrade management

#### Migration Service (`src/services/migrationService.js`)
- Automatic migration from localStorage to IndexedDB
- Data integrity validation during migration
- Preserves all existing user data during upgrade
- Fallback mechanisms for migration failures

#### Intelligence Analyzer (`src/utils/intelligenceAnalyzer.js`)
- AI-powered content analysis and relevance scoring
- Automatic entity extraction (countries, technologies, weapons, organizations)
- Category classification and priority assignment
- Duplicate detection with similarity analysis
- Advertisement filtering and content validation

### Component Architecture

```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx - Main navigation and status
│   │   └── LoadingOverlay.jsx - Processing status display
│   ├── dashboard/
│   │   ├── Dashboard.jsx - Main intelligence dashboard
│   │   ├── MetricCard.jsx - Metric display components
│   │   ├── FeaturedSignal.jsx - Featured signal cards
│   │   └── FinintAlert.jsx - Financial intelligence alerts
│   ├── briefs/
│   │   ├── Briefs.jsx - Intelligence briefs management
│   │   └── BriefCard.jsx - Individual brief display
│   ├── signals/
│   │   ├── Signals.jsx - Live signals feed
│   │   └── SignalCard.jsx - Signal display with scoring
│   └── rss-management/
│       ├── RSSManagement.jsx - Feed configuration hub
│       ├── FeedList.jsx - Active feed management
│       ├── AddFeedModal.jsx - New feed addition
│       └── FeedHealthMonitor.jsx - Feed status monitoring
├── services/ - Core business logic and data processing
│   ├── briefing/ - Daily briefing generation modules
│   ├── quality/ - Signal quality filtering modules
│   ├── scoring/ - Multi-factor scoring modules
│   └── storage/ - IndexedDB storage management modules
├── utils/ - Intelligence analysis and processing utilities
├── styles/ - CSS theming and styling
├── constants/ - Centralized configuration constants
├── config/ - API and environment configuration
└── data/ - Default RSS feeds and configuration
```

### Modular Service Architecture

The application uses a highly modular architecture for maintainability and extensibility:

#### Briefing Services (`src/services/briefing/`)
- `briefingGenerator.js` - Main briefing generation orchestrator
- `patternAnalyzer.js` - Pattern and trend analysis
- `sectionGenerators.js` - Individual section generators
- `qualityAssessor.js` - Briefing quality validation
- `templateManager.js` - Briefing template management

#### Quality Services (`src/services/quality/`)
- `contentAnalyzer.js` - Content quality and relevance analysis
- `sourceVerifier.js` - Source credibility verification
- `duplicateDetector.js` - Advanced duplicate detection

#### Scoring Services (`src/services/scoring/`)
- `keywordScorer.js` - Keyword-based relevance scoring
- `entityScorer.js` - Entity significance scoring
- `temporalScorer.js` - Time-based relevance scoring
- `sourceAssessor.js` - Source credibility assessment
- `threatAssessor.js` - Threat level assessment
- `scoreCombiner.js` - Multi-factor score combination

#### Storage Services (`src/services/storage/`)
- `articleManager.js` - Article CRUD operations
- `briefManager.js` - Brief management
- `feedManager.js` - RSS feed configuration
- `settingsManager.js` - Application settings
- `retentionManager.js` - Data retention and cleanup

### Data Models

#### RSS Feed Configuration
```javascript
{
  id: string,
  name: string,
  url: string,
  category: 'MILITARY' | 'TECHNOLOGY' | 'CYBERSECURITY' | 'GEOPOLITICS' | 'FINANCE' | 'SCIENCE',
  tags: string[],
  isActive: boolean,
  credibilityScore: number (1-100),
  lastFetched: Date,
  status: 'active' | 'warning' | 'error',
  errorCount: number
}
```

#### Enhanced Article/Signal
```javascript
{
  id: string,
  title: string,
  content: string,
  url: string,
  publishedAt: Date,
  fetchedAt: Date,
  source: {
    feedId: string,
    feedName: string,
    domain: string,
    credibilityScore: number
  },
  intelligence: {
    relevanceScore: number (0-100),
    confidenceLevel: number (0-100),
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
    categories: string[],
    tags: string[],
    entities: {
      countries: string[],
      organizations: string[],
      technologies: string[],
      weapons: string[]
    },
    isAdvertisement: boolean,
    isDuplicate: boolean
  }
}
```

## Premium RSS Feeds

The application includes 15 pre-configured premium intelligence sources:

### Military & Defense (5 feeds)
- Defense News, Military.com, Breaking Defense, War on the Rocks, Defense One

### Technology & Cybersecurity (3 feeds)  
- Ars Technica, The Hacker News, MIT Technology Review

### Geopolitics & International (4 feeds)
- Reuters World, Foreign Policy, BBC World, Associated Press

### Finance & Economics (2 feeds)
- Bloomberg Politics, Wall Street Journal

### Health & Science (1 feed)
- Science News

## AI Intelligence Processing

### Content Analysis Pipeline
1. **Advertisement Detection**: URL pattern matching and promotional language analysis
2. **Duplicate Detection**: Content similarity analysis with 24-hour time windows
3. **Relevance Scoring**: Multi-factor analysis based on intelligence keywords
4. **Entity Extraction**: Named entity recognition for countries, organizations, technologies
5. **Category Classification**: Automatic categorization into intelligence domains
6. **Priority Assignment**: CRITICAL/HIGH/MEDIUM/LOW based on intelligence value

### Enhanced Intelligence Analysis Services

#### Claude Analysis Service (`src/services/claudeAnalysisService.js`)
- Professional intelligence analysis prompts
- Enhanced validation and error handling
- Context-aware analysis with geopolitical focus
- Multi-domain specialized prompts (threat, technology, economic)
- Comprehensive fallback systems

#### Multi-Factor Scoring Service (`src/services/multiFactorScoringService.js`)
- Sophisticated 6-factor scoring algorithm
- Enhanced keyword tier system with context weighting
- Entity significance analysis with geopolitical relationships
- Temporal relevance and source credibility assessment
- Cross-validation and consistency checking

#### Advanced Entity Extraction (`src/services/advancedEntityExtraction.js`)
- Comprehensive entity databases with aliases (500+ entities)
- Technical designation extraction (weapon systems, coordinates)
- Relationship pattern detection (adversarial, allied)
- Strategic location recognition and assessment
- Quantitative data extraction (casualties, monetary, distances)

#### Signal Quality Filter (`src/services/signalQualityFilter.js`)
- 7-stage comprehensive quality pipeline
- Content quality assessment with linguistic indicators
- Source verification and credibility analysis
- Advanced duplicate detection with similarity analysis
- Quality metrics and reporting with pass/fail tracking

#### Daily Briefing Service (`src/services/dailyBriefingService.js`)
- Automated daily intelligence briefing generation
- Professional intelligence community format
- 7-section comprehensive briefings (Executive Summary, Priority Developments, Threat Assessment, etc.)
- Quality assessment and briefing history management

#### Briefing Scheduler (`src/services/briefingScheduler.js`)
- Automatic scheduling with manual trigger capability
- Daily briefing generation at 6 AM
- Integration with application lifecycle
- Error handling and retry mechanisms

### Intelligence Keywords Database
- **CRITICAL**: nuclear, weapon, attack, cyber, breach, classified, military, bioweapon
- **HIGH**: sanctions, deployment, missile, surveillance, intelligence, espionage
- **MEDIUM**: diplomatic, trade war, alliance, defense, technology transfer
- **GEOPOLITICAL**: china, russia, iran, north korea, taiwan, ukraine, syria
- **TECHNOLOGY**: ai, quantum, hypersonic, satellite, blockchain, neural
- **HEALTH**: outbreak, pandemic, bioweapon, vaccine, virus, epidemic

## Data Flow

### Enhanced RSS Processing Flow
1. **Feed Fetching**: Automated polling every 15-30 minutes
2. **Content Parsing**: XML parsing and article extraction
3. **Enhanced AI Analysis**: Claude API integration with professional prompts
4. **Multi-Factor Scoring**: 6-factor intelligence scoring algorithm
5. **Advanced Entity Extraction**: Professional entity recognition (500+ entities)
6. **Quality Filtering**: 7-stage filtering pipeline
7. **Storage**: IndexedDB persistence with 30-day retention
8. **Display**: Real-time updates to dashboard and signals

### Daily Briefing Generation Flow
1. **Signal Collection**: Gather signals from past 24 hours
2. **Pattern Analysis**: Identify trends and strategic developments
3. **Section Generation**: Create 7-section professional briefing
4. **Quality Validation**: Ensure intelligence community standards
5. **Storage**: Permanent briefing storage with metadata
6. **Scheduling**: Automated daily generation at 6 AM

### Data Retention Policy
- **Articles**: 30-day automatic cleanup for dashboard/signals
- **Briefs**: Permanent storage for user-created and promoted content
- **Feed Configuration**: Persistent across sessions
- **Error Logs**: Feed health monitoring and troubleshooting

## Critical React Architecture Patterns

### Function Definition Order (CRITICAL)
This application has specific function definition requirements that prevent runtime crashes:

```javascript
const App = () => {
  // 1. State definitions FIRST
  const [state, setState] = useState();
  
  // 2. ALL useCallback functions BEFORE any useEffect
  const functionA = useCallback(() => {}, [deps]);
  const functionB = useCallback(() => {
    functionA(); // Safe - functionA defined above
  }, [functionA]);
  
  // 3. useEffect hooks AFTER function definitions
  useEffect(() => {
    functionB(); // Safe - functionB defined above
  }, [functionB]);
};
```

**Critical Rule**: Never call a function in useEffect before it's defined with useCallback. This causes "use before defined" errors that result in blank pages in production.

### React Hook Dependencies
- Always include function dependencies in useEffect arrays
- Use useCallback for functions that are dependencies of other hooks
- Avoid circular dependencies between useCallback functions
- Use eslint-disable-next-line react-hooks/exhaustive-deps only when intentionally running once

## Production Deployment

### Vercel Configuration
The app uses specific Vercel settings in `vercel.json`:
- **Build Command**: `npm run build:prod` (sets production environment)
- **Environment Variables**: Automatically injected for production API
- **SPA Rewrites**: All routes redirect to index.html for client-side routing

### Build Process
```bash
# Production build (required for deployment)
npm run build:prod

# Test production build locally
npx serve -s build

# Development build (local testing only)
npm run build
```

### Environment Detection Hierarchy
1. `REACT_APP_ENV` environment variable (explicit override)
2. `NODE_ENV` environment variable  
3. Hostname detection (localhost = development)
4. Default to production for deployed environments

## Error Handling & Debugging

### Production Error Handling
The app includes multiple error handling layers:
- **ErrorBoundary**: Catches React component errors in production
- **Storage Fallbacks**: Continues operating if IndexedDB fails
- **API Retry Logic**: Exponential backoff for failed requests
- **RSS Processing Fallbacks**: Client-side analysis when API fails

### Debugging Blank Page Issues
1. Check browser console for "use before defined" errors
2. Verify function definition order in App.js
3. Check React Hook dependency arrays
4. Test production build locally with `npx serve -s build`
5. Verify environment variables are set correctly

## RSS Processing Architecture

### Sequential Processing Pattern
The RSS service processes feeds sequentially to prevent API overload:
- **One feed at a time** with 2-3 second delays between feeds
- **Article batches of 2** with 2-3 second delays between batches
- **60-second timeout** per feed to prevent hanging
- **Retry logic** with exponential backoff for failed requests

### Rate Limiting & Resource Management
- Maximum 2 concurrent API requests
- Request queue management prevents system overload
- Circuit breaker pattern for cascading failure prevention
- Memory usage monitoring and cleanup

## Development Commands

```bash
# Development
npm start                    # Frontend only (localhost:3000)
npm run dev                  # Frontend + Backend (requires concurrently)
npm run server              # Backend only (localhost:3001)

# Production Testing
npm run build:prod          # Build with production environment
npx serve -s build          # Test production build locally

# Testing & Quality
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm test -- path/to/test.js # Single test file
npm run lint                # ESLint check
npm run lint -- --fix       # Auto-fix linting
```

## Environment Configuration

The application supports both development and production environments:

### Development Environment
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001 (local Express server)
- **Configuration**: Automatically detected when running on localhost

### Production Environment
- **Frontend**: Deployed React application
- **Backend**: https://ghost-brief-api-199177265279.us-central1.run.app
- **Configuration**: Set via environment variables

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Anthropic Claude API Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Server Configuration (for local development)
PORT=3001
NODE_ENV=development

# API Configuration
# For development, leave blank to use localhost:3001
# For production, set to your deployed backend URL
REACT_APP_API_URL=https://ghost-brief-api-199177265279.us-central1.run.app

# Environment override (development|production)
# Leave blank to auto-detect based on hostname
REACT_APP_ENV=production

# Webshare Proxy Configuration (Optional)
WEBSHARE_PROXY_HOST=p.webshare.io
WEBSHARE_PROXY_PORT=80
WEBSHARE_USERNAME=your_webshare_username
WEBSHARE_PASSWORD=your_webshare_password
WEBSHARE_PROXY_TYPE=http
```

### Switching Between Environments

#### Development Mode (Local Backend)
```bash
# Method 1: Use .env file
REACT_APP_API_URL=
REACT_APP_ENV=

# Method 2: Use development scripts
npm start
npm run dev
```

#### Production Mode (Deployed Backend)
```bash
# Method 1: Use .env file
REACT_APP_API_URL=https://ghost-brief-api-199177265279.us-central1.run.app
REACT_APP_ENV=production

# Method 2: Use production scripts
npm run start:prod
npm run build:prod
```

## Critical Debugging Guide

### Blank Page Issues (Production)
**Root Cause**: Function definition order or React Hook dependency errors

**Debugging Steps**:
1. Check browser console for JavaScript errors
2. Look for "use before defined" or "Cannot read property" errors
3. Verify function definition order in App.js:
   - All useCallback functions before useEffect hooks
   - Functions defined before they're referenced
4. Test production build locally: `npm run build:prod && npx serve -s build`
5. Check React Hook dependency arrays for missing dependencies

### RSS Processing Issues
**Symptoms**: Feeds not loading, API timeouts, blank signals

**Debugging Steps**:
1. Check console for RSS processing errors
2. Verify API endpoint health: check network tab for failed requests
3. Test individual feeds in RSS Management interface
4. Monitor rate limiting: look for "too many requests" errors
5. Check IndexedDB storage quotas and cleanup

### Storage & Migration Issues
**Symptoms**: Data loss, initialization failures, performance issues

**Solutions**:
- Clear IndexedDB if migration fails: DevTools > Application > Storage
- Check console for storage initialization errors
- Verify drill data initialization if no articles exist
- Monitor storage usage and cleanup operations

## Performance Optimization

### RSS Processing Optimization
- **Sequential Processing**: Prevents API overload and system freezing
- **Batch Size**: Keep article batches small (2 articles max)
- **Delays**: Use 2-3 second delays between operations
- **Timeouts**: 60-second timeout per feed prevents hanging

### Storage Performance
- **IndexedDB Batching**: Batch write operations for efficiency
- **Cleanup Automation**: 30-day retention for articles, permanent for briefs
- **Index Optimization**: Use structured indexes for fast queries
- **Transaction Management**: Use transactions for data integrity

## Project Initialization

### First Time Setup
```bash
# Install dependencies
npm install

# Start development (choose one)
npm start                # Frontend only
npm run dev             # Frontend + Backend

# Verify functionality
# - Dashboard loads with drill data
# - RSS feeds can be added/tested
# - No console errors
```

### Environment Variables
Create `.env` file for local development:
```bash
# Backend API (leave blank for localhost:3001)
REACT_APP_API_URL=

# Environment override (leave blank for auto-detection)
REACT_APP_ENV=

# Server configuration
PORT=3001
NODE_ENV=development
```

## Important Architecture Notes

### RSS Processing
- **CORS Proxy**: `https://api.allorigins.win/raw?url=` for feed fetching
- **Webshare Proxy**: Professional rotating residential proxies for enhanced reliability
- **Sequential Processing**: One feed at a time to prevent overload
- **Rate Limiting**: Max 2 concurrent requests with retry logic
- **Fallback Analysis**: Client-side intelligence when API fails

### Data Persistence
- **Primary Storage**: IndexedDB with GB capacity
- **Retention Policy**: 30 days for articles, permanent for briefs
- **Migration**: Automatic upgrade from localStorage to IndexedDB
- **Drill Data**: Professional test data auto-initializes when empty

### API Integration
- **Backend**: https://ghost-brief-api-199177265279.us-central1.run.app
- **Environment Detection**: Automatic localhost vs production switching
- **Health Monitoring**: Feed status tracking with error counts
- **Intelligence Analysis**: Claude API with professional prompts

## API Integration

### Backend Services
- **Health Check**: `GET /api/health` - Service status and configuration
- **Article Analysis**: `POST /api/analyze-article` - Single article intelligence analysis
- **Batch Analysis**: `POST /api/analyze-articles-batch` - Multiple article processing
- **API Documentation**: `GET /api/docs` - Complete API reference

### Configuration Service
The application includes a centralized API configuration service (`src/config/api.js`) that:
- Automatically detects environment (development/production)
- Manages API endpoints and CORS proxy URLs
- Provides retry logic and timeout handling
- Includes health check functionality
- Supports environment-specific logging levels

### Environment Detection
Environment is determined by:
1. `REACT_APP_ENV` environment variable (explicit override)
2. `NODE_ENV` environment variable
3. Hostname detection (localhost = development)
4. Default to production for deployed environments

## Security & Best Practices

### Error Handling
- **ErrorBoundary**: Wraps entire app to catch React errors
- **Storage Fallbacks**: App continues if IndexedDB fails
- **API Resilience**: Retry logic with exponential backoff
- **Graceful Degradation**: Client-side fallbacks for all services

### Performance
- **Function Definition Order**: Critical for preventing runtime errors
- **Sequential RSS Processing**: Prevents system overload
- **Memory Management**: Automatic cleanup and retention policies
- **Rate Limiting**: Prevents API throttling and service degradation

## Code Quality & Standards

### ESLint Configuration
- **Strict ESLint rules** with warnings treated as non-blocking
- **Required default cases** in switch statements for completeness
- **Loop function safety** to prevent variable capture issues
- **React hooks exhaustive dependencies** to ensure proper re-rendering

### Recent Code Quality Improvements
- **Switch Statement Defaults**: Added default cases to all switch statements in:
  - `src/services/quality/sourceVerifier.js` - Source tier assessment and verification summary
  - `src/services/scoring/threatAssessor.js` - Threat level recommendation generation
- **Loop Function Safety**: Fixed unsafe variable references in retry mechanism (`src/utils/errorHelpers.js`)
- **Production Build Verification**: All code compiles cleanly with only non-blocking warnings