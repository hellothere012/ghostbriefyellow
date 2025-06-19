// Drill Data for Ghost Brief Intelligence Dashboard
// Professional intelligence-grade sample content for testing and demonstration

/**
 * Drill Signal - Professional Intelligence Format
 * Tests core signal display and processing functionality
 */
export const drillSignal = {
  id: 'drill_signal_001',
  title: 'Russia Deploys Advanced S-500 Prometheus Air Defense Systems Near Ukraine Border',
  content: 'Russian Armed Forces have positioned at least six S-500 Prometheus air defense missile systems along the Belarus-Ukraine border region, approximately 80 kilometers northeast of Kyiv. Satellite imagery from commercial providers confirms the deployment of these advanced anti-aircraft and anti-missile systems, which represent Russia\'s most sophisticated air defense technology. The S-500 systems feature extended range capabilities up to 600 kilometers and advanced radar systems capable of tracking multiple aerial targets simultaneously, including stealth aircraft and hypersonic missiles. Military analysts note this deployment significantly alters the tactical aerospace environment in the region and poses enhanced threats to NATO reconnaissance flights and potential air operations. The timing coincides with increased military exercises in the region and comes amid ongoing tensions over regional security arrangements.',
  summary: 'Russia has deployed advanced S-500 air defense systems near the Ukraine border, significantly enhancing regional anti-aircraft capabilities and altering the tactical aerospace environment.',
  url: 'https://drill.ghostbrief.com/signals/russia-s500-deployment',
  publishedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
  fetchedAt: new Date().toISOString(),
  source: {
    feedId: 'drill_military_intel',
    feedName: 'Drill Military Intelligence',
    domain: 'drill.ghostbrief.com',
    credibilityScore: 95,
    category: 'MILITARY'
  },
  categories: ['MILITARY', 'TECHNOLOGY'],
  rawTags: ['RUSSIA', 'UKRAINE', 'AIR DEFENSE', 'S-500', 'MILITARY DEPLOYMENT'],
  intelligence: {
    relevanceScore: 87,
    confidenceLevel: 92,
    priority: 'HIGH',
    categories: ['MILITARY', 'TECHNOLOGY', 'GEOPOLITICS'],
    tags: ['RUSSIA', 'UKRAINE', 'AIR DEFENSE', 'S-500', 'PROMETHEUS', 'MILITARY DEPLOYMENT', 'BORDER SECURITY', 'NATO', 'TACTICAL AEROSPACE'],
    entities: {
      countries: ['RUSSIA', 'UKRAINE', 'BELARUS'],
      organizations: ['RUSSIAN ARMED FORCES', 'NATO'],
      technologies: ['S-500 PROMETHEUS', 'AIR DEFENSE SYSTEM', 'RADAR SYSTEMS', 'ANTI-AIRCRAFT MISSILES'],
      weapons: ['S-500 MISSILE SYSTEM', 'ANTI-AIRCRAFT MISSILES', 'ANTI-MISSILE SYSTEMS']
    },
    isAdvertisement: false,
    isDuplicate: false,
    duplicateOf: null,
    isSignificantUpdate: false,
    threatAssessment: 'HIGH',
    strategicImplications: 'Significant shift in regional air defense capabilities, potential impact on NATO air operations',
    temporalRelevance: 95,
    geopoliticalContext: 'Russia-Ukraine border tensions, NATO expansion concerns, regional military balance'
  },
  processingMetadata: {
    processedAt: new Date().toISOString(),
    processingVersion: '2.0-drill',
    aiModel: 'claude-3-sonnet-drill',
    analysisType: 'full_intelligence_assessment'
  }
};

/**
 * Drill Brief - Executive Intelligence Briefing Format
 * Demonstrates professional briefing capabilities and format
 */
export const drillBrief = {
  id: 'drill_brief_001',
  title: 'STRATEGIC ASSESSMENT: Russian S-500 Deployment Threatens NATO Air Superiority in Eastern Europe',
  summary: 'Russia\'s deployment of advanced S-500 Prometheus air defense systems near the Ukraine border represents a significant escalation in regional military capabilities, with far-reaching implications for NATO air operations, regional deterrence strategies, and the broader European security architecture.',
  content: `EXECUTIVE SUMMARY

Russia has deployed at least six S-500 Prometheus air defense systems along the Belarus-Ukraine border, positioning these advanced weapons approximately 80 kilometers northeast of Kyiv. This deployment represents the most significant enhancement to Russian air defense capabilities in the region since 2014 and fundamentally alters the tactical aerospace environment across Eastern Europe.

INTELLIGENCE ASSESSMENT

The S-500 Prometheus system represents Russia's most advanced air defense technology, capable of engaging targets at ranges up to 600 kilometers with simultaneous tracking of multiple aerial threats. Unlike previous-generation systems, the S-500 possesses enhanced capabilities against stealth aircraft, hypersonic missiles, and low-observable reconnaissance platforms currently employed by NATO forces.

Satellite imagery analysis confirms the deployment occurred within the past 72 hours, suggesting coordinated planning with ongoing military exercises in the region. The positioning provides overlapping coverage with existing S-300 and S-400 systems, creating a multi-layered air defense network extending deep into Ukrainian airspace and affecting flight corridors used by NATO reconnaissance missions.

WHY THIS MATTERS NOW

This deployment occurs at a critical juncture in regional security dynamics, coinciding with increased NATO military exercises and ongoing discussions about alliance expansion. The timing suggests deliberate strategic messaging, demonstrating Russia's capability to project advanced defensive systems rapidly and alter the regional military balance.

The S-500's advanced radar systems pose particular challenges to existing NATO air operations, including intelligence-gathering flights and potential humanitarian or defensive missions. The system's ability to engage targets at extended ranges means NATO aircraft operating from bases in Poland, Romania, and the Baltic states now face enhanced threat environments.

STRATEGIC IMPLICATIONS

IMMEDIATE IMPACT:
- NATO reconnaissance operations must now factor in S-500 threat radii, potentially reducing intelligence-gathering capabilities
- Air corridor management becomes more complex, with implications for both military and civilian aviation
- Regional allies may request enhanced air defense capabilities to counter perceived threats

MEDIUM-TERM CONSEQUENCES:
- Potential acceleration of NATO air defense investments and deployment of counter-systems
- Increased complexity for any future humanitarian or defensive air operations in the region
- Enhanced deterrent value for Russian position in ongoing regional diplomatic negotiations

LONG-TERM RAMIFICATIONS:
- Fundamental shift in regional air superiority assumptions, requiring NATO strategy reassessment
- Potential catalyst for advanced air defense technology development and deployment across NATO
- Increased importance of space-based and cyber warfare capabilities as alternatives to traditional air power

RECOMMENDED ACTIONS

INTELLIGENCE PRIORITIES:
- Enhanced monitoring of S-500 system operational parameters and deployment patterns
- Assessment of integration with existing Russian air defense networks
- Evaluation of potential vulnerabilities and countermeasure effectiveness

STRATEGIC RESPONSES:
- Coordinate with NATO allies on updated threat assessment and response protocols
- Review air operation procedures and safety protocols for regional reconnaissance missions
- Consider deployment of electronic warfare and counter-air defense capabilities

DIPLOMATIC CONSIDERATIONS:
- Engage regional partners on enhanced air defense cooperation
- Utilize diplomatic channels to express concerns about destabilizing military deployments
- Coordinate international response to prevent normalization of such deployments

This deployment represents more than tactical military positioning—it constitutes a strategic signal of Russia's commitment to maintaining military advantages in contested regions and willingness to deploy advanced capabilities to support geopolitical objectives.`,
  url: 'https://drill.ghostbrief.com/briefs/russia-s500-strategic-assessment',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  source: 'drill_intelligence_analysis',
  originalArticle: null, // Not promoted from article
  intelligence: {
    relevanceScore: 94,
    confidenceLevel: 96,
    priority: 'CRITICAL',
    categories: ['MILITARY', 'GEOPOLITICS', 'STRATEGIC ANALYSIS'],
    tags: ['RUSSIA', 'S-500', 'NATO', 'AIR DEFENSE', 'STRATEGIC ASSESSMENT', 'EASTERN EUROPE', 'MILITARY DEPLOYMENT'],
    entities: {
      countries: ['RUSSIA', 'UKRAINE', 'BELARUS', 'POLAND', 'ROMANIA'],
      organizations: ['RUSSIAN ARMED FORCES', 'NATO', 'BALTIC STATES'],
      technologies: ['S-500 PROMETHEUS', 'S-300', 'S-400', 'RADAR SYSTEMS', 'STEALTH AIRCRAFT'],
      weapons: ['AIR DEFENSE SYSTEMS', 'HYPERSONIC MISSILES', 'ANTI-AIRCRAFT MISSILES']
    },
    isAdvertisement: false,
    isDuplicate: false
  },
  tags: ['RUSSIA', 'S-500', 'NATO', 'AIR DEFENSE', 'STRATEGIC ASSESSMENT', 'EASTERN EUROPE', 'MILITARY DEPLOYMENT'],
  priority: 'CRITICAL',
  category: 'STRATEGIC ANALYSIS',
  isPermanent: true,
  briefingType: 'STRATEGIC_ASSESSMENT',
  classification: 'DRILL_EXERCISE',
  executiveSummaryLength: 'comprehensive',
  analysisDepth: 'strategic',
  timeHorizon: 'medium_to_long_term',
  stakeholders: ['NATO_COMMAND', 'POLICY_MAKERS', 'INTELLIGENCE_COMMUNITY'],
  processingMetadata: {
    generatedAt: new Date().toISOString(),
    briefingVersion: '2.0-executive',
    analysisModel: 'strategic_intelligence_assessment',
    reviewStatus: 'drill_complete'
  }
};

/**
 * Drill Data Initialization Function
 * Adds drill content to storage for immediate testing
 */
export const initializeDrillData = async (storageService) => {
  try {
    console.log('🎯 Initializing drill data for testing...');
    
    // Add drill signal to articles
    const existingArticles = await storageService.getArticles();
    const hasDrillSignal = existingArticles.some(article => article.id === drillSignal.id);
    
    if (!hasDrillSignal) {
      await storageService.addArticles([drillSignal]);
      console.log('✅ Added drill signal for testing');
    }
    
    // Add drill brief
    const existingBriefs = await storageService.getBriefs();
    const hasDrillBrief = existingBriefs.some(brief => brief.id === drillBrief.id);
    
    if (!hasDrillBrief) {
      await storageService.addBrief(drillBrief);
      console.log('✅ Added drill brief for testing');
    }
    
    console.log('🎯 Drill data initialization complete');
    return true;
    
  } catch (error) {
    console.error('❌ Failed to initialize drill data:', error);
    return false;
  }
};

/**
 * Remove drill data (for cleanup)
 */
export const cleanupDrillData = async (storageService) => {
  try {
    console.log('🧹 Cleaning up drill data...');
    
    // Remove drill signal
    const articles = await storageService.getArticles();
    const filteredArticles = articles.filter(article => article.id !== drillSignal.id);
    if (filteredArticles.length !== articles.length) {
      await storageService.saveArticles(filteredArticles);
      console.log('✅ Removed drill signal');
    }
    
    // Remove drill brief
    const briefs = await storageService.getBriefs();
    const filteredBriefs = briefs.filter(brief => brief.id !== drillBrief.id);
    if (filteredBriefs.length !== briefs.length) {
      await storageService.saveBriefs(filteredBriefs);
      console.log('✅ Removed drill brief');
    }
    
    console.log('🧹 Drill data cleanup complete');
    return true;
    
  } catch (error) {
    console.error('❌ Failed to cleanup drill data:', error);
    return false;
  }
};