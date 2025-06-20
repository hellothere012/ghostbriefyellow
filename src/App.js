import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './styles/index.css';

// New Database Services
import { databaseService } from './services/databaseService';
import { databaseMigrationService } from './services/databaseMigration';

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
  
  // Database state
  const [signals, setSignals] = useState([]);
  const [briefs, setBriefs] = useState([]);
  const [rssFeeds, setRssFeeds] = useState([]);
  const [stats, setStats] = useState(null);
  const [processingStatus, setProcessingStatus] = useState(null);
  
  // Processing locks
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Migration state
  const [migrationStatus, setMigrationStatus] = useState(null);

  /**
   * Process RSS feeds through new database system
   */
  const processRSSFeeds = useCallback(async () => {
    // Prevent overlapping processing runs
    if (isProcessing) {
      console.log('🔒 RSS processing already in progress, skipping...');
      return;
    }
    
    try {
      setIsProcessing(true);
      setIsLoading(true);
      setProcessingStatus({ stage: 'processing', message: 'Processing RSS feeds with AI analysis...' });
      console.log('🔄 Starting RSS feed processing...');
      
      // Trigger server-side RSS processing
      const result = await databaseService.processRSSFeeds();
      
      if (result.success) {
        console.log('✅ RSS processing completed:', result);
        setProcessingStatus({ 
          stage: 'success', 
          message: result.message || 'RSS processing completed successfully'
        });
        
        // Refresh data from database
        await Promise.all([
          loadSignals(),
          loadStats()
        ]);
        
        setLastUpdate(new Date().toISOString());
        
      } else {
        console.error('❌ RSS processing failed:', result);
        setProcessingStatus({ 
          stage: 'error', 
          message: result.error || 'RSS processing failed'
        });
      }
      
    } catch (error) {
      console.error('❌ RSS processing failed:', error);
      setProcessingStatus({ 
        stage: 'error', 
        message: `RSS processing failed: ${error.message}` 
      });
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
      setTimeout(() => setProcessingStatus(null), 8000);
    }
  }, [isProcessing]);

  /**
   * Load signals from database
   */
  const loadSignals = useCallback(async (filters = {}) => {
    try {
      const response = await databaseService.getSignals({
        limit: 50,
        offset: 0,
        ...filters
      });
      
      if (response.success) {
        setSignals(response.signals);
        console.log(`📊 Loaded ${response.signals.length} signals from database`);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Error loading signals:', error);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Load briefs from database
   */
  const loadBriefs = useCallback(async () => {
    try {
      const response = await databaseService.getBriefs({
        limit: 20,
        offset: 0
      });
      
      if (response.success) {
        setBriefs(response.briefs);
        console.log(`🧠 Loaded ${response.briefs.length} briefs from database`);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Error loading briefs:', error);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Load RSS feeds from database
   */
  const loadFeeds = useCallback(async () => {
    try {
      const response = await databaseService.getFeeds();
      
      if (response.success) {
        setRssFeeds(response.feeds);
        console.log(`📡 Loaded ${response.feeds.length} RSS feeds from database`);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Error loading feeds:', error);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Load statistics from database
   */
  const loadStats = useCallback(async () => {
    try {
      const response = await databaseService.getStats();
      
      if (response.success) {
        setStats(response.stats);
        console.log('📈 Loaded statistics from database');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Error loading stats:', error);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Initialize application with database
   */
  const initializeApplication = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Initializing Ghost Brief with database...');
      
      // Check if migration is needed from old IndexedDB system
      try {
        const migrationCheck = await databaseMigrationService.checkMigrationNeeded();
        if (migrationCheck.needed) {
          console.log('🔄 Migration needed from IndexedDB to database');
          setMigrationStatus({ stage: 'running', message: 'Migrating data to new database...' });
          
          const migrationResult = await databaseMigrationService.migrateToDatabase();
          if (migrationResult.success) {
            setMigrationStatus({ stage: 'success', message: 'Data migration completed successfully' });
            console.log('✅ Migration completed:', migrationResult.summary);
          } else {
            setMigrationStatus({ stage: 'error', message: 'Migration had errors but continued' });
          }
          
          setTimeout(() => setMigrationStatus(null), 10000);
        }
      } catch (migrationError) {
        console.warn('⚠️ Migration check failed:', migrationError.message);
      }
      
      // Initialize default feeds if none exist
      try {
        const feedsResponse = await loadFeeds();
        if (!feedsResponse.success || feedsResponse.feeds?.length === 0) {
          console.log('📡 No feeds found, initializing default feeds...');
          await databaseService.initializeDefaultFeeds();
          await loadFeeds(); // Reload after initialization
        }
      } catch (error) {
        console.warn('⚠️ Feed initialization failed:', error.message);
      }
      
      // Load all data from database
      await Promise.all([
        loadSignals(),
        loadBriefs(),
        loadStats()
      ]);
      
      setIsInitialized(true);
      console.log('✅ Application initialization complete');
      
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      setProcessingStatus({ 
        stage: 'error', 
        message: `Initialization failed: ${error.message}. Some features may not work.` 
      });
    } finally {
      setIsLoading(false);
    }
  }, [loadSignals, loadBriefs, loadFeeds, loadStats]);

  // Initialize data on component mount
  useEffect(() => {
    initializeApplication();
  }, [initializeApplication]);

  // Auto-refresh RSS processing
  useEffect(() => {
    if (isInitialized) {
      const interval = setInterval(() => {
        processRSSFeeds();
      }, 30 * 60 * 1000); // Every 30 minutes

      return () => clearInterval(interval);
    }
  }, [isInitialized, processRSSFeeds]);

  /**
   * RSS Feed Management Functions
   */
  const handleAddFeed = async (feedConfig) => {
    try {
      setProcessingStatus({ stage: 'adding', message: `Adding feed: ${feedConfig.name}...` });
      
      const response = await databaseService.createFeed(feedConfig);
      if (response.success) {
        // Reload feeds from database
        await loadFeeds();
        
        setProcessingStatus({ 
          stage: 'success', 
          message: `Feed added successfully: ${feedConfig.name}` 
        });
        
        setTimeout(() => setProcessingStatus(null), 5000);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding feed:', error);
      setProcessingStatus({ stage: 'error', message: `Failed to add feed: ${error.message}` });
      setTimeout(() => setProcessingStatus(null), 5000);
      return false;
    }
  };

  const handleUpdateFeed = async (feedId, updates) => {
    try {
      const response = await databaseService.updateFeed({ id: feedId, ...updates });
      if (response.success) {
        await loadFeeds();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating feed:', error);
      return false;
    }
  };

  const handleDeleteFeed = async (feedId) => {
    try {
      const response = await databaseService.deleteFeed(feedId);
      if (response.success) {
        await loadFeeds();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting feed:', error);
      return false;
    }
  };

  /**
   * Brief Management Functions
   */
  const handleCreateBrief = async (briefData) => {
    try {
      const response = await databaseService.createBrief(briefData);
      if (response.success) {
        await loadBriefs();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating brief:', error);
      return false;
    }
  };

  const handlePromoteSignalToBrief = async (signal) => {
    const briefData = {
      title: signal.title,
      summary: signal.summary,
      status: 'PUBLISHED',
      classification: 'UNCLASSIFIED',
      keywords: signal.category || [],
      version: 1,
      datePublished: new Date(),
      relatedSignalIds: [signal.id]
    };
    
    return await handleCreateBrief(briefData);
  };

  /**
   * Dashboard metrics from database stats
   */
  const dashboardMetrics = useMemo(() => {
    if (!stats) {
      return {
        activeSignals: 0,
        criticalSignals: 0,
        activeFeeds: 0,
        lastUpdate: null,
        criticalPercentage: 0
      };
    }
    
    return {
      activeSignals: stats.overview?.totalSignals || 0,
      criticalSignals: stats.escalation?.CRITICAL || 0,
      activeFeeds: stats.overview?.activeFeeds || 0,
      lastUpdate,
      criticalPercentage: stats.overview?.totalSignals > 0 ? 
        Math.round(((stats.escalation?.CRITICAL || 0) / stats.overview.totalSignals) * 100) : 0
    };
  }, [stats, lastUpdate]);

  /**
   * Navigation handler
   */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Refresh data when switching to certain tabs
    if (tab === 'dashboard' || tab === 'signals') {
      loadSignals();
      loadStats();
    } else if (tab === 'briefs') {
      loadBriefs();
    } else if (tab === 'feeds') {
      loadFeeds();
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--bg-primary)'}}>
      {/* Loading overlay */}
      {isLoading && <LoadingOverlay status={processingStatus} />}
      
      {/* Header */}
      <Header 
        metrics={dashboardMetrics}
        onRefresh={processRSSFeeds}
        isRefreshing={isLoading}
        processingStatus={processingStatus}
        migrationStatus={migrationStatus}
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
            featuredSignals={signals.slice(0, 5)}
            onPromoteToBrief={handlePromoteSignalToBrief}
            stats={stats}
          />
        )}
        
        {activeTab === 'briefs' && (
          <Briefs 
            briefs={briefs}
            onCreateBrief={handleCreateBrief}
            onPromoteToBrief={handlePromoteSignalToBrief}
            signals={signals}
          />
        )}
        
        {activeTab === 'signals' && (
          <Signals 
            signals={signals}
            onPromoteToBrief={handlePromoteSignalToBrief}
            onLoadMore={() => loadSignals({ offset: signals.length })}
            stats={stats}
          />
        )}
        
        {activeTab === 'feeds' && (
          <RSSManagement 
            feeds={rssFeeds}
            onAddFeed={handleAddFeed}
            onUpdateFeed={handleUpdateFeed}
            onDeleteFeed={handleDeleteFeed}
            onProcessFeeds={processRSSFeeds}
            stats={stats}
          />
        )}
      </main>
    </div>
  );
};

export default App;