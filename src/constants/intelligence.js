/**
 * Intelligence Analysis Constants
 * Centralized configuration for intelligence keyword databases, scoring, and entity recognition
 */

// Intelligence Keywords Database for Content Analysis
export const INTELLIGENCE_KEYWORDS = {
  CRITICAL: [
    'nuclear', 'weapon', 'attack', 'cyber', 'breach', 'classified', 'military', 'drone strike',
    'bioweapon', 'chemical weapon', 'terrorist', 'assassination', 'coup', 'war', 'invasion'
  ],
  HIGH: [
    'sanctions', 'deployment', 'missile', 'surveillance', 'intelligence', 'espionage',
    'hypersonic', 'satellite', 'radar', 'stealth', 'submarine', 'aircraft carrier'
  ],
  MEDIUM: [
    'diplomatic', 'trade war', 'alliance', 'defense', 'technology transfer', 'embargo',
    'treaty', 'summit', 'negotiation', 'partnership', 'cooperation'
  ],
  GEOPOLITICAL: [
    'china', 'russia', 'iran', 'north korea', 'taiwan', 'ukraine', 'syria', 'israel',
    'pakistan', 'india', 'turkey', 'saudi arabia', 'venezuela', 'myanmar'
  ],
  TECHNOLOGY: [
    'ai', 'artificial intelligence', 'quantum', 'hypersonic', 'satellite', 'blockchain',
    'neural', 'machine learning', 'deepfake', 'autonomous', 'drone', 'robot'
  ],
  HEALTH: [
    'outbreak', 'pandemic', 'bioweapon', 'vaccine', 'virus', 'epidemic', 'disease',
    'mutation', 'pathogen', 'laboratory', 'biosafety', 'quarantine'
  ]
};

// Intelligence Priority Levels
export const PRIORITY_LEVELS = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW'
};

// Intelligence Categories
export const INTELLIGENCE_CATEGORIES = {
  MILITARY: 'MILITARY',
  TECHNOLOGY: 'TECHNOLOGY',
  CYBERSECURITY: 'CYBERSECURITY',
  GEOPOLITICS: 'GEOPOLITICS',
  FINANCE: 'FINANCE',
  SCIENCE: 'SCIENCE',
  HEALTH: 'HEALTH'
};

// Entity Database for Advanced Recognition
export const ENTITY_DATABASE = {
  countries: [
    'CHINA', 'RUSSIA', 'IRAN', 'NORTH KOREA', 'UKRAINE', 'TAIWAN', 'SYRIA', 'ISRAEL',
    'PAKISTAN', 'INDIA', 'TURKEY', 'SAUDI ARABIA', 'VENEZUELA', 'MYANMAR', 'AFGHANISTAN',
    'USA', 'UNITED STATES', 'UK', 'BRITAIN', 'FRANCE', 'GERMANY', 'JAPAN', 'SOUTH KOREA',
    'NATO', 'EU', 'EUROPEAN UNION', 'ASEAN', 'BRICS'
  ],
  organizations: [
    'NATO', 'UN', 'IAEA', 'WHO', 'CIA', 'FSB', 'MSS', 'MOSSAD', 'MI6', 'BND',
    'PENTAGON', 'KREMLIN', 'PLA', 'IRANIAN REVOLUTIONARY GUARD', 'HEZBOLLAH', 'HAMAS',
    'ISIS', 'AL-QAEDA', 'TALIBAN', 'WAGNER GROUP', 'LAZARUS GROUP', 'APT', 'SCADA'
  ],
  technologies: [
    'HYPERSONIC', 'QUANTUM', 'AI', 'ARTIFICIAL INTELLIGENCE', 'NUCLEAR', 'CYBER',
    'SATELLITE', 'DRONE', 'UAV', 'STEALTH', 'RADAR', 'SONAR', 'GPS', 'BLOCKCHAIN',
    'CRYPTOCURRENCY', 'DEEPFAKE', 'BIOMETRIC', 'FACIAL RECOGNITION', 'SURVEILLANCE',
    'ENCRYPTION', 'ZERO-DAY', 'MALWARE', 'RANSOMWARE', 'BOTNET', 'DDOS'
  ],
  weapons: [
    'MISSILE', 'ICBM', 'SLBM', 'HYPERSONIC MISSILE', 'CRUISE MISSILE', 'BALLISTIC MISSILE',
    'NUCLEAR WEAPON', 'BIOWEAPON', 'CHEMICAL WEAPON', 'EMP', 'LASER WEAPON', 'RAILGUN',
    'F-35', 'F-22', 'SU-57', 'J-20', 'B-21', 'B-52', 'AIRCRAFT CARRIER', 'SUBMARINE',
    'DESTROYER', 'FRIGATE', 'TANK', 'APACHE', 'PREDATOR', 'REAPER', 'JAVELIN', 'PATRIOT'
  ]
};

// Intelligence Scoring Weights
export const SCORING_WEIGHTS = {
  keywordRelevance: 0.35,
  entityDensity: 0.25,
  sourceCredibility: 0.20,
  recency: 0.10,
  geopoliticalContext: 0.10
};

// Scoring Thresholds
export const SCORING_THRESHOLDS = {
  CRITICAL: 85,
  HIGH: 65,
  MEDIUM: 45,
  LOW: 25
};

// Content Quality Indicators
export const QUALITY_INDICATORS = {
  linguistic: {
    minWordCount: 50,
    maxWordCount: 10000,
    minSentenceLength: 5,
    maxSentenceLength: 200
  },
  intelligence: {
    minRelevanceScore: 25,
    minConfidenceLevel: 50,
    requiredEntityCount: 1
  },
  source: {
    minCredibilityScore: 50,
    blacklistedDomains: ['spam.com', 'clickbait.net'],
    whitelistedDomains: ['reuters.com', 'defensenews.com', 'janes.com']
  }
};

// Threat Assessment Categories
export const THREAT_CATEGORIES = {
  NUCLEAR: 'NUCLEAR',
  CYBER: 'CYBER', 
  MILITARY: 'MILITARY',
  TERRORIST: 'TERRORIST',
  ECONOMIC: 'ECONOMIC',
  BIOLOGICAL: 'BIOLOGICAL',
  SPACE: 'SPACE'
};

// Analysis Confidence Levels
export const CONFIDENCE_LEVELS = {
  VERY_HIGH: 'VERY_HIGH', // 90-100%
  HIGH: 'HIGH',           // 75-89%
  MEDIUM: 'MEDIUM',       // 50-74%
  LOW: 'LOW',             // 25-49%
  VERY_LOW: 'VERY_LOW'    // 0-24%
};