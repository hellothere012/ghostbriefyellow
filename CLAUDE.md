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
- Fetches and parses RSS feeds using CORS proxy
- Processes articles through AI analysis pipeline
- Handles duplicate detection and advertisement filtering
- Implements intelligent content scoring and priority assignment
- Supports concurrent feed processing with error handling

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

## Development Commands

```bash
# Start development server (uses localhost:3001 backend)
npm start

# Start with production backend
npm run start:prod

# Start backend server only
npm run server

# Run both frontend and backend in development
npm run dev

# Run frontend with production API
npm run dev:prod

# Build for production
npm run build

# Build with production API configuration
npm run build:prod

# Run tests (Jest with React Testing Library)
npm test

# Run a single test file
npm test -- path/to/test.js

# Run tests in watch mode
npm test -- --watch

# Lint code (ESLint for .js/.jsx files)
npm run lint

# Auto-fix linting issues
npm run lint -- --fix

# Format code (Prettier)
npm run format
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

## Common Development Tasks

### Adding New RSS Feeds
1. Use the RSS Management interface to add feeds
2. Test feed connectivity and parsing
3. Monitor feed health and adjust credibility scores
4. Review AI analysis results and adjust keywords if needed

### Modifying Intelligence Analysis
1. Edit keyword databases in `src/utils/intelligenceAnalyzer.js`
2. Adjust scoring weights and thresholds
3. Update entity recognition patterns
4. Test with sample RSS content

### Customizing UI/UX
1. Modify CSS variables in `src/styles/index.css` for theming
2. Adjust component layouts in respective component files
3. Update filtering and search logic in component state management
4. Test responsive design across different screen sizes

### Performance Optimization
1. Monitor IndexedDB usage and implement cleanup
2. Optimize RSS processing batch sizes
3. Implement virtual scrolling for large datasets
4. Add caching layers for frequently accessed data
5. Leverage IndexedDB indexes for fast queries
6. Use transaction-based operations for data integrity

## Security Considerations

- RSS feeds are processed through CORS proxy (consider backend implementation for production)
- No sensitive data stored in localStorage
- All external links open in new tabs with security attributes
- Content sanitization for RSS feed data
- Error handling prevents application crashes from malformed feeds

## Troubleshooting

### Common Issues
1. **CORS Errors**: RSS feeds blocked by browser security policies
2. **Feed Parsing Failures**: Malformed XML or unexpected RSS format
3. **Storage Limits**: IndexedDB quota management (automatic cleanup implemented)
4. **Performance Issues**: Too many concurrent RSS requests (batching implemented)

## Project Initialization & Quick Start

### First Time Setup
1. **Install Dependencies**: `npm install`
2. **Environment Configuration**: Create `.env` file with required variables
3. **Start Development**: 
   - Frontend only: `npm start`
   - Frontend + Backend: `npm run dev` (requires concurrently)
4. **Verify Functionality**: Check dashboard loads with drill data

### Key Verification Points
- Application starts without errors
- IndexedDB initialization succeeds
- Drill data appears in dashboard
- RSS processing functions correctly
- Daily briefing generation works
- Briefing scheduler initializes at startup (check console for "📅 Initializing briefing scheduler...")
- Quality filtering pipeline operates

### Data Structure
- **IndexedDB Stores**: articles, briefs, feeds, settings, metadata
- **Professional Drill Data**: Available in `src/data/drillData.js`
- **Automatic Migration**: From localStorage to IndexedDB on first run

## Important Notes

- RSS processing uses CORS proxy at `https://api.allorigins.win/raw?url=` for feed fetching
- Intelligence analysis pipeline uses Claude API via configured backend endpoint
- All data persists in IndexedDB with automatic 30-day cleanup for articles and permanent brief storage
- Feed health monitoring tracks error counts and last fetch timestamps
- Advertisement detection uses URL patterns and promotional language analysis
- API configuration automatically switches between development and production environments
- Backend deployment available at: https://ghost-brief-api-199177265279.us-central1.run.app
- Professional drill data initializes automatically when no content exists

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