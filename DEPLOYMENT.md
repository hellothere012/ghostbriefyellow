# Ghost Brief - Claude API Deployment Guide

## 🚀 Quick Setup Guide

### 1. Environment Setup
```bash
# Add your Claude API key to .env
echo "ANTHROPIC_API_KEY=your_actual_claude_api_key_here" >> .env

# Start development environment
npm run dev
```

### 2. Development Commands
```bash
# Start both frontend and backend
npm run dev

# Start only backend API server
npm run server

# Start only frontend (React)
npm start

# Run linter
npm run lint

# Build for production
npm run build
```

### 3. Testing the Migration
```bash
# Test backend health
curl http://localhost:3001/api/health

# Test article analysis (with valid Claude API key)
curl -X POST http://localhost:3001/api/analyze-article \
  -H "Content-Type: application/json" \
  -d '{"article": {"title": "Test Article", "content": "Test content", "url": "https://example.com"}}'
```

## 🏗️ Architecture Overview

### Before Migration (Client-Side)
```
Browser → RSS Feed → Parse → intelligenceAnalyzer.js → Display
```

### After Migration (Claude API)
```
Browser → RSS Feed → Parse → Express API → Claude Analysis → Display
```

## 📊 What Changed

### Files Modified
- ✅ `package.json` - Added backend dependencies & scripts
- ✅ `src/services/rssService.js` - Now calls Claude API instead of client-side analysis
- ✅ `src/components/signals/SignalCard.jsx` - Fixed Unicode icons with react-icons
- ✅ `src/components/signals/Signals.jsx` - Fixed Unicode icons with react-icons

### Files Added
- ✅ `.env` - Environment variables (add your Claude API key here)
- ✅ `server.js` - Express API server
- ✅ `claudeService.js` - Claude API integration service
- ✅ `Dockerfile` - Google Cloud Run deployment
- ✅ `cloudbuild.yaml` - Automated Cloud Build configuration
- ✅ `.dockerignore` - Docker build optimization

### Files Removed
- ✅ `src/utils/intelligenceAnalyzer.js` - Replaced by Claude API

## 🔧 Claude API Integration

### Key Features
- **Superior Analysis**: Claude's natural language understanding vs. keyword matching
- **Fallback System**: Maintains functionality when API is unavailable
- **Batch Processing**: Efficient handling of multiple articles
- **Rate Limiting**: Built-in protection against API limits
- **Error Handling**: Graceful degradation with fallback analysis

### API Endpoints
- `GET /api/health` - Service health check
- `POST /api/analyze-article` - Single article analysis
- `POST /api/analyze-articles-batch` - Batch article processing
- `GET /api/docs` - API documentation

## ☁️ Google Cloud Deployment

### Prerequisites
```bash
# Install Google Cloud CLI
# Enable Cloud Run, Cloud Build, and Secret Manager APIs
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Secret Management
```bash
# Store Claude API key securely
echo "your_claude_api_key" | gcloud secrets create ghost-brief-claude-key --data-file=-
```

### Deployment
```bash
# Deploy to Cloud Run
gcloud builds submit --config cloudbuild.yaml

# Or manual deployment
docker build -t gcr.io/YOUR_PROJECT_ID/ghost-brief-api .
docker push gcr.io/YOUR_PROJECT_ID/ghost-brief-api
gcloud run deploy ghost-brief-api --image gcr.io/YOUR_PROJECT_ID/ghost-brief-api --region us-central1
```

### Production Configuration
- **Scaling**: 0-10 instances (auto-scaling)
- **Memory**: 512Mi per instance
- **CPU**: 1 vCPU per instance
- **Concurrency**: 100 requests per instance
- **Timeout**: 300 seconds

## 🛡️ Security Features

- API keys stored in Google Secret Manager
- Non-root Docker user
- CORS protection for development
- Input validation and sanitization
- Rate limiting protection
- Health check monitoring

## 📈 Performance Optimizations

- Batch processing for multiple articles
- Connection pooling for API requests
- Efficient error handling with fallbacks
- Optimized Docker image with Alpine Linux
- Automatic scaling based on load

## 🔍 Monitoring & Debugging

### Development Logs
```bash
# Backend logs
npm run server

# Frontend logs
npm start

# Combined logs
npm run dev
```

### Production Logs
```bash
# Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=ghost-brief-api" --limit 50
```

### Health Monitoring
The service includes built-in health checks:
- Docker health check every 30 seconds
- API health endpoint at `/api/health`
- Cloud Run health monitoring

## 🚨 Troubleshooting

### Common Issues

**Claude API Authentication Error**
```
Solution: Add valid ANTHROPIC_API_KEY to .env file
```

**CORS Errors in Development**
```
Solution: Ensure proxy setting in package.json points to http://localhost:3001
```

**Port Conflicts**
```
Solution: Change PORT in .env or kill existing processes on port 3001/3000
```

**Rate Limiting**
```
Solution: Built-in batch processing and delays handle this automatically
```

## 📝 Data Structure Compatibility

The migration maintains complete compatibility with existing data structures:

```javascript
// Intelligence Analysis Structure (unchanged)
{
  relevanceScore: number (0-100),
  confidenceLevel: number (0-100),
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
  categories: string[],
  entities: {
    countries: string[],
    organizations: string[],
    technologies: string[],
    weapons: string[]
  },
  tags: string[],
  isAdvertisement: boolean,
  isDuplicate: boolean,
  duplicateOf: string | null,
  isSignificantUpdate: boolean
}
```

All existing dashboard components, signals, and briefs continue to work without changes.

## 🎯 Next Steps

1. **Add Claude API Key**: Replace placeholder in `.env` with your actual API key
2. **Test Locally**: Run `npm run dev` and verify everything works
3. **Deploy to Cloud**: Follow Google Cloud deployment steps
4. **Monitor Performance**: Check logs and health endpoints
5. **Optimize**: Adjust batch sizes and timeouts based on usage patterns

The migration is complete and your Ghost Brief application now runs on a professional, scalable architecture powered by Claude AI!