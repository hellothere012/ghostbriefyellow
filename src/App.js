import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './styles/index.css';

// Services
import { rssService } from './services/rssService';
import { storageService } from './services/storageService';

// Drill data for testing
import { initializeDrillData } from './data/drillData';

// Components
import Header from './components/common/Header';
import Dashboard from './components/dashboard/Dashboard';
import Briefs from './components/briefs/Briefs';
import Signals from './components/signals/Signals';
import RSSManagement from './components/rss-management/RSSManagement';
import LoadingOverlay from './components/common/LoadingOverlay';

const App = () => {
  // Core state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  // Data state
  const [rssFeeds, setRssFeeds] = useState([]);
  const [feedsLoaded, setFeedsLoaded] = useState(false);
  const [articles, setArticles] = useState([]);
  const [briefs, setBriefs] = useState([]);
  const [processingStatus, setProcessingStatus] = useState(null);
  
  // Processing locks
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Settings state - initialize with safe defaults
  const [settings, setSettings] = useState({
    autoRefreshInterval: 30,
    relevanceThreshold: 50,
    maxArticlesPerFeed: 50,
    enableNotifications: false
  });

  /**
   * Refresh RSS feeds and process articles through AI
   */
  const refreshRSSFeeds = useCallback(async () => {
    // Prevent overlapping processing runs
    if (isProcessing) {
      console.log('🔒 RSS processing already in progress, skipping...');
      return;
    }
    
    if (!feedsLoaded) {
      console.log('⏳ Feeds not loaded yet, skipping refresh...');
      return;
    }
    
    try {
      setIsProcessing(true);
      setIsLoading(true);
      setProcessingStatus({ stage: 'fetching', message: 'Fetching RSS feeds...' });
      console.log('🔄 Starting RSS feed refresh...');
      
      const activeFeeds = rssFeeds.filter(feed => feed.isActive);
      console.log(`📡 Found ${activeFeeds.length} active feeds out of ${rssFeeds.length} total feeds`);
      
      if (activeFeeds.length === 0) {
        console.warn('⚠️ No active RSS feeds configured');
        setProcessingStatus({ stage: 'warning', message: 'No active RSS feeds configured. Please activate feeds in Feed Management.' });
        return;
      }
      
      setProcessingStatus({ 
        stage: 'processing', 
        message: `Processing ${activeFeeds.length} RSS feeds...` 
      });
      
      // Process RSS feeds with AI analysis
      console.log('🤖 Starting AI analysis of RSS feeds...');
      const result = await rssService.processMultipleFeeds(activeFeeds, articles);
      console.log('📊 RSS processing result:', result);
      
      if (result.intelligenceArticles > 0) {
        console.log(`✅ Found ${result.intelligenceArticles} intelligence articles from ${result.totalArticlesProcessed} total articles`);
        
        // Update articles state
        const updatedArticles = [...articles, ...result.articles];
        console.log(`📰 Updating articles state: ${articles.length} → ${updatedArticles.length}`);
        setArticles(updatedArticles);
        
        // Save to storage
        storageService.addArticles(result.articles);
        console.log('💾 Articles saved to storage');
        
        // Update feed statuses
        result.feedResults.forEach(feedResult => {
          console.log(`📡 Feed ${feedResult.feedId}: ${feedResult.success ? 'SUCCESS' : 'FAILED'}`);
          storageService.updateFeedStatus(
            feedResult.feedId, 
            feedResult.success ? 'active' : 'error',
            feedResult.success ? 0 : 1
          );
        });
        
        // Refresh feeds state to show updated statuses
        setRssFeeds(storageService.getRSSFeeds());
        setLastUpdate(new Date().toISOString());
        
        setProcessingStatus({ 
          stage: 'success', 
          message: `Processed ${result.totalArticlesProcessed} articles, found ${result.intelligenceArticles} intelligence items` 
        });
        
      } else {
        console.warn('⚠️ No intelligence articles found in RSS processing');
        console.log('📊 Processing details:', {
          totalFeeds: result.totalFeeds,
          successfulFeeds: result.successfulFeeds,
          totalArticlesProcessed: result.totalArticlesProcessed,
          feedResults: result.feedResults
        });
        
        setProcessingStatus({ 
          stage: 'warning', 
          message: `Processed ${result.totalArticlesProcessed || 0} articles but found no intelligence content. Check feed URLs and content.` 
        });
      }
      
    } catch (error) {
      console.error('❌ RSS refresh failed:', error);
      console.error('Error details:', error.stack);
      setProcessingStatus({ 
        stage: 'error', 
        message: `RSS refresh failed: ${error.message}` 
      });
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
      setTimeout(() => setProcessingStatus(null), 8000); // Extended timeout for debugging
    }
  }, [rssFeeds, articles, isProcessing, feedsLoaded]);

  // Auto-refresh RSS feeds
  useEffect(() => {
    if (settings.autoRefreshInterval > 0) {
      const interval = setInterval(() => {
        refreshRSSFeeds();
      }, settings.autoRefreshInterval * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [settings.autoRefreshInterval, refreshRSSFeeds]);

  /**
   * Check if we should auto-refresh based on last update time
   */
  const shouldAutoRefresh = () => {
    const lastUpdate = storageService.getLastUpdate();
    if (!lastUpdate) return true;
    
    const timeSinceUpdate = Date.now() - new Date(lastUpdate).getTime();
    const refreshThreshold = settings.autoRefreshInterval * 60 * 1000;
    
    return timeSinceUpdate > refreshThreshold;
  };

  /**
   * Initialize application with stored data and fetch fresh RSS content
   */
  const initializeApplication = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Initializing Ghost Brief application...');
      
      // Load stored data with fallbacks for production safety
      let storedFeeds = [];
      let storedArticles = [];
      let storedBriefs = [];
      let storedSettings = settings; // Use current state as fallback
      
      try {
        storedFeeds = await storageService.getRSSFeeds();
        storedArticles = await storageService.getArticles();
        storedBriefs = await storageService.getBriefs();
        storedSettings = await storageService.getSettings();
        console.log('✅ Storage data loaded successfully');
      } catch (storageError) {
        console.warn('⚠️ Storage loading failed, using defaults:', storageError.message);
        // Continue with empty defaults - app will still work
      }
      
      // Initialize drill data for testing if no articles exist
      if (storedArticles.length === 0) {
        try {
          console.log('🎯 No articles found, initializing drill data...');
          await initializeDrillData(storageService);
          
          // Reload articles after drill data initialization
          const updatedArticles = await storageService.getArticles();
          const updatedBriefs = await storageService.getBriefs();
          setArticles(updatedArticles);
          setBriefs(updatedBriefs);
          console.log(`🎯 Drill data loaded: ${updatedArticles.length} articles, ${updatedBriefs.length} briefs`);
        } catch (drillError) {
          console.warn('⚠️ Drill data initialization failed:', drillError.message);
          setArticles([]);
          setBriefs([]);
        }
      } else {
        setArticles(storedArticles);
        setBriefs(storedBriefs);
      }
      
      console.log(`📡 Loaded ${storedFeeds.length} RSS feeds from storage`);
      console.log(`📰 Total articles available: ${await storageService.getArticles().then(a => a.length)}`);
      console.log(`🧠 Total briefs available: ${await storageService.getBriefs().then(b => b.length)}`);
      
      setRssFeeds(storedFeeds);
      setFeedsLoaded(true); // Mark feeds as loaded
      // Articles and briefs already set above based on drill data initialization
      if (storedArticles.length > 0) {
        setArticles(storedArticles);
        setBriefs(storedBriefs);
      }
      setSettings(storedSettings);
      
      try {
        setLastUpdate(await storageService.getLastUpdate());
        // Clean up old data
        await storageService.cleanupOldData();
      } catch (cleanupError) {
        console.warn('⚠️ Storage cleanup failed:', cleanupError.message);
      }
      
      console.log('✅ Application initialization complete. RSS processing will be handled by useEffect.');
      
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      console.error('Error details:', error.stack);
      
      // Set safe defaults so app still renders
      setRssFeeds([]);
      setArticles([]);
      setBriefs([]);
      setProcessingStatus({ 
        stage: 'error', 
        message: `Initialization failed: ${error.message}. App will work with limited functionality.` 
      });
    } finally {
      setIsLoading(false);
    }
  }, [refreshRSSFeeds, settings]);

  // Initialize data on component mount
  useEffect(() => {
    initializeApplication();
  }, [initializeApplication]);

  // Auto-refresh RSS feeds
  useEffect(() => {
    if (settings.autoRefreshInterval > 0) {
      const interval = setInterval(() => {
        refreshRSSFeeds();
      }, settings.autoRefreshInterval * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [settings.autoRefreshInterval, refreshRSSFeeds]);

  // Trigger RSS refresh when feeds are loaded and available
  useEffect(() => {
    if (feedsLoaded && rssFeeds.length > 0 && !isProcessing) {
      const activeFeeds = rssFeeds.filter(feed => feed.isActive);
      if (activeFeeds.length > 0) {
        console.log('🚀 Feeds loaded, triggering initial RSS refresh...');
        // Use setTimeout to avoid immediate processing during initialization
        setTimeout(() => {
          refreshRSSFeeds();
        }, 1000);
      }
    }
  }, [feedsLoaded, rssFeeds, isProcessing, refreshRSSFeeds]);

  /**
   * RSS Feed Management Functions
   */
  const handleAddFeed = async (feedConfig) => {
    try {
      const success = await storageService.addRSSFeed(feedConfig);
      if (success) {
        setRssFeeds(await storageService.getRSSFeeds());
        
        // Immediately test the new feed
        setProcessingStatus({ stage: 'testing', message: `Testing new feed: ${feedConfig.name}...` });
        const testResult = await rssService.processFeed(feedConfig, articles);
        
        if (testResult.success) {
          setProcessingStatus({ 
            stage: 'success', 
            message: `Feed added successfully: ${testResult.intelligenceArticles} articles processed` 
          });
          
          if (testResult.articles.length > 0) {
            const updatedArticles = [...articles, ...testResult.articles];
            setArticles(updatedArticles);
            storageService.addArticles(testResult.articles);
          }
        } else {
          setProcessingStatus({ 
            stage: 'warning', 
            message: `Feed added but test failed: ${testResult.error}` 
          });
        }
        
        setTimeout(() => setProcessingStatus(null), 5000);
        return true;
      }
      return false;
    } catch (error) {
      setProcessingStatus({ stage: 'error', message: `Failed to add feed: ${error.message}` });
      setTimeout(() => setProcessingStatus(null), 5000);
      return false;
    }
  };

  const handleUpdateFeed = (feedId, updates) => {
    const success = storageService.updateRSSFeed(feedId, updates);
    if (success) {
      setRssFeeds(storageService.getRSSFeeds());
    }
    return success;
  };

  const handleDeleteFeed = (feedId) => {
    const success = storageService.deleteRSSFeed(feedId);
    if (success) {
      setRssFeeds(storageService.getRSSFeeds());
      
      // Remove articles from deleted feed
      const remainingArticles = articles.filter(article => 
        article.source.feedId !== feedId
      );
      setArticles(remainingArticles);
      storageService.saveArticles(remainingArticles);
    }
    return success;
  };

  /**
   * Brief Management Functions
   */
  const handleCreateBrief = (briefData) => {
    const success = storageService.addBrief(briefData);
    if (success) {
      setBriefs(storageService.getBriefs());
    }
    return success;
  };

  const handlePromoteArticleToBrief = (article) => {
    const briefData = {
      title: article.title,
      summary: article.content || article.summary,
      url: article.url,
      source: 'promoted_article',
      originalArticle: article,
      intelligence: article.intelligence,
      tags: article.intelligence?.tags || [],
      priority: article.intelligence?.priority || 'MEDIUM',
      category: article.intelligence?.categories?.[0] || 'GENERAL'
    };
    
    return handleCreateBrief(briefData);
  };

  /**
   * Settings Management
   */
  const handleUpdateSettings = (newSettings) => {
    const success = storageService.saveSettings(newSettings);
    if (success) {
      setSettings(newSettings);
    }
    return success;
  };

  /**
   * Data Processing and Filtering
   */
  
  // Filter articles for signals (live RSS data, < 30 days)
  const signalsData = useMemo(() => {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    return articles
      .filter(article => {
        const articleDate = new Date(article.publishedAt || article.fetchedAt).getTime();
        return articleDate > thirtyDaysAgo && 
               article.intelligence && 
               article.intelligence.relevanceScore >= settings.relevanceThreshold;
      })
      .sort((a, b) => {
        // Sort by priority and relevance score
        const priorityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        const aPriority = priorityOrder[a.intelligence?.priority] || 1;
        const bPriority = priorityOrder[b.intelligence?.priority] || 1;
        
        if (aPriority !== bPriority) return bPriority - aPriority;
        return (b.intelligence?.relevanceScore || 0) - (a.intelligence?.relevanceScore || 0);
      })
      .slice(0, 100); // Limit for performance
  }, [articles, settings.relevanceThreshold]);

  // Combine briefs with high-value articles
  const briefsData = useMemo(() => {
    const highValueArticles = articles
      .filter(article => 
        article.intelligence && 
        article.intelligence.relevanceScore >= 80 && 
        article.intelligence.priority === 'CRITICAL'
      )
      .map(article => ({
        ...article,
        isPermanent: false,
        source: 'auto_promoted'
      }));
    
    return [...briefs, ...highValueArticles]
      .sort((a, b) => {
        const aDate = new Date(a.createdAt || a.publishedAt || a.fetchedAt).getTime();
        const bDate = new Date(b.createdAt || b.publishedAt || b.fetchedAt).getTime();
        return bDate - aDate;
      });
  }, [briefs, articles]);

  // Dashboard metrics
  const dashboardMetrics = useMemo(() => {
    const criticalSignals = signalsData.filter(s => s.intelligence?.priority === 'CRITICAL').length;
    const totalSignals = signalsData.length;
    const activeFeedsCount = rssFeeds.filter(f => f.isActive).length;
    
    return {
      activeSignals: totalSignals,
      criticalSignals,
      activeFeeds: activeFeedsCount,
      lastUpdate,
      criticalPercentage: totalSignals > 0 ? Math.round((criticalSignals / totalSignals) * 100) : 0
    };
  }, [signalsData, rssFeeds, lastUpdate]);

  /**
   * Navigation handler
   */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Auto-refresh data when switching to certain tabs
    if ((tab === 'dashboard' || tab === 'signals') && shouldAutoRefresh()) {
      refreshRSSFeeds();
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--bg-primary)'}}>
      {/* Loading overlay */}
      {isLoading && <LoadingOverlay status={processingStatus} />}
      
      {/* Header */}
      <Header 
        metrics={dashboardMetrics}
        onRefresh={refreshRSSFeeds}
        isRefreshing={isLoading}
        processingStatus={processingStatus}
      />

      {/* Navigation */}
      <nav className="border-b sticky top-16 z-40" style={{borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)'}}>
        <div className="mx-auto flex max-w-7xl px-6">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'briefs', label: 'Briefs', icon: '🧠' },
            { id: 'signals', label: 'Signals', icon: '📡' },
            { id: 'feeds', label: 'Feed Management', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`nav-item rounded-t-md px-4 py-3 text-sm font-medium flex items-center space-x-2 ${
                activeTab === tab.id ? 'active' : ''
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-6 lg:px-8">
        {activeTab === 'dashboard' && (
          <Dashboard 
            metrics={dashboardMetrics}
            featuredSignals={signalsData.slice(0, 5)}
            onPromoteToBrief={handlePromoteArticleToBrief}
          />
        )}
        
        {activeTab === 'briefs' && (
          <Briefs 
            briefs={briefsData}
            onCreateBrief={handleCreateBrief}
            onPromoteToBrief={handlePromoteArticleToBrief}
          />
        )}
        
        {activeTab === 'signals' && (
          <Signals 
            signals={signalsData}
            onPromoteToBrief={handlePromoteArticleToBrief}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
        
        {activeTab === 'feeds' && (
          <RSSManagement 
            feeds={rssFeeds}
            onAddFeed={handleAddFeed}
            onUpdateFeed={handleUpdateFeed}
            onDeleteFeed={handleDeleteFeed}
            onTestFeed={(feed) => rssService.processFeed(feed, articles)}
            statistics={storageService.getStorageStats()}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </main>
    </div>
  );
};

export default App;