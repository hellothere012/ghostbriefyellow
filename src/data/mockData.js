// Mock Data for Ghost Brief Intelligence Dashboard
// Enhanced with intelligence scoring and categorization

// Premium RSS Feed Sources for Intelligence Gathering
export const PREMIUM_RSS_FEEDS = [
  // Military & Defense
  {
    id: 'defense-news',
    name: 'Defense News',
    url: 'https://www.defensenews.com/rss/',
    category: 'MILITARY',
    tags: ['DEFENSE', 'MILITARY', 'WEAPONS'],
    isActive: true,
    credibilityScore: 95
  },
  {
    id: 'janes-defence',
    name: "Jane's Defence Weekly",
    url: 'https://www.janes.com/feeds/defence-news',
    category: 'MILITARY',
    tags: ['DEFENSE', 'INTELLIGENCE', 'WEAPONS'],
    isActive: true,
    credibilityScore: 98
  },
  {
    id: 'military-com',
    name: 'Military.com News',
    url: 'https://www.military.com/rss/news',
    category: 'MILITARY',
    tags: ['MILITARY', 'VETERANS', 'DEFENSE'],
    isActive: true,
    credibilityScore: 90
  },
  {
    id: 'breaking-defense',
    name: 'Breaking Defense',
    url: 'https://breakingdefense.com/feed/',
    category: 'MILITARY',
    tags: ['DEFENSE', 'TECH', 'PROCUREMENT'],
    isActive: true,
    credibilityScore: 92
  },
  {
    id: 'war-on-rocks',
    name: 'War on the Rocks',
    url: 'https://warontherocks.com/feed/',
    category: 'MILITARY',
    tags: ['STRATEGY', 'ANALYSIS', 'GEOPOLITICS'],
    isActive: true,
    credibilityScore: 94
  },

  // Technology & Cybersecurity
  {
    id: 'ars-technica',
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'TECHNOLOGY',
    tags: ['TECH', 'CYBERSECURITY', 'AI'],
    isActive: true,
    credibilityScore: 96
  },
  {
    id: 'hacker-news-feed',
    name: 'The Hacker News',
    url: 'https://feeds.feedburner.com/TheHackersNews',
    category: 'CYBERSECURITY',
    tags: ['CYBER', 'HACKING', 'SECURITY'],
    isActive: true,
    credibilityScore: 93
  },
  {
    id: 'mit-tech-review',
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
    category: 'TECHNOLOGY',
    tags: ['AI', 'QUANTUM', 'INNOVATION'],
    isActive: true,
    credibilityScore: 97
  },

  // Geopolitics & International
  {
    id: 'reuters-world',
    name: 'Reuters World News',
    url: 'https://feeds.reuters.com/reuters/worldNews',
    category: 'GEOPOLITICS',
    tags: ['WORLD', 'POLITICS', 'BREAKING'],
    isActive: true,
    credibilityScore: 98
  },
  {
    id: 'foreign-affairs',
    name: 'Foreign Affairs',
    url: 'https://www.foreignaffairs.com/rss',
    category: 'GEOPOLITICS',
    tags: ['DIPLOMACY', 'ANALYSIS', 'INTERNATIONAL'],
    isActive: true,
    credibilityScore: 96
  },
  {
    id: 'cfr-news',
    name: 'Council on Foreign Relations',
    url: 'https://www.cfr.org/rss-feeds',
    category: 'GEOPOLITICS',
    tags: ['POLICY', 'ANALYSIS', 'GLOBAL'],
    isActive: true,
    credibilityScore: 95
  },
  {
    id: 'bbc-world',
    name: 'BBC World News',
    url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'GEOPOLITICS',
    tags: ['WORLD', 'BREAKING', 'INTERNATIONAL'],
    isActive: true,
    credibilityScore: 94
  },

  // Finance & Economics
  {
    id: 'financial-times',
    name: 'Financial Times',
    url: 'https://www.ft.com/rss',
    category: 'FINANCE',
    tags: ['ECONOMY', 'MARKETS', 'TRADE'],
    isActive: true,
    credibilityScore: 96
  },
  {
    id: 'bloomberg-markets',
    name: 'Bloomberg Markets',
    url: 'https://feeds.bloomberg.com/markets/news.rss',
    category: 'FINANCE',
    tags: ['MARKETS', 'ECONOMY', 'TRADING'],
    isActive: true,
    credibilityScore: 95
  },

  // Health & Science
  {
    id: 'science-news',
    name: 'Science News',
    url: 'https://www.sciencenews.org/feeds/headlines.rss',
    category: 'SCIENCE',
    tags: ['SCIENCE', 'HEALTH', 'RESEARCH'],
    isActive: true,
    credibilityScore: 94
  }
];

// Intelligence Keywords for AI Processing
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

// Enhanced Briefs Data with Intelligence Scoring
export const briefsData = [
  {
    id: 1,
    title: "China Tests New Hypersonic Anti-Ship Missile",
    summary: "PLA Navy successfully tests DF-ZF hypersonic glide vehicle with anti-ship capabilities. Mach 8+ speeds threaten US carrier groups in South China Sea operations.",
    published: "2 hours ago",
    tags: ["CHINA", "WEAPONS", "NAVAL"],
    priority: "CRITICAL",
    category: "MILITARY",
    url: "https://example.com/briefs/china-hypersonic-missile",
    intelligence: {
      relevanceScore: 96,
      confidenceLevel: 94,
      categories: ["MILITARY", "TECHNOLOGY"],
      entities: {
        countries: ["CHINA", "USA"],
        organizations: ["PLA NAVY"],
        technologies: ["HYPERSONIC", "ANTI-SHIP MISSILE"],
        weapons: ["DF-ZF"]
      }
    }
  },
  {
    id: 2,
    title: "North Korean Lazarus Group Deploys AI-Enhanced Malware",
    summary: "New 'TigerRAT' variant uses machine learning for evasion and cryptocurrency theft. Active targeting of financial institutions across Southeast Asia.",
    published: "4 hours ago",
    tags: ["NORTH KOREA", "CYBER", "AI"],
    priority: "CRITICAL",
    category: "CYBERSECURITY",
    url: "https://example.com/briefs/nk-lazarus-ai-malware",
    intelligence: {
      relevanceScore: 94,
      confidenceLevel: 91,
      categories: ["CYBERSECURITY", "TECHNOLOGY"],
      entities: {
        countries: ["NORTH KOREA"],
        organizations: ["LAZARUS GROUP"],
        technologies: ["AI", "MACHINE LEARNING", "MALWARE"],
        weapons: ["TIGERRAT"]
      }
    }
  },
  {
    id: 3,
    title: "Pakistan Shoots Down Indian Rafale Fighter Jet",
    summary: "Pakistani F-16 intercepts and destroys Indian Rafale near Kashmir border. Escalating tensions prompt emergency UN Security Council session.",
    published: "6 hours ago",
    tags: ["PAKISTAN", "INDIA", "MILITARY"],
    priority: "CRITICAL",
    category: "GEOPOLITICS",
    url: "https://example.com/briefs/pakistan-india-rafale",
    intelligence: {
      relevanceScore: 98,
      confidenceLevel: 87,
      categories: ["MILITARY", "GEOPOLITICS"],
      entities: {
        countries: ["PAKISTAN", "INDIA"],
        organizations: ["UN SECURITY COUNCIL"],
        technologies: ["F-16", "RAFALE"],
        weapons: ["FIGHTER JET"]
      }
    }
  },
  {
    id: 4,
    title: "Ebola Outbreak Detected in Democratic Republic of Congo",
    summary: "WHO confirms new Ebola strain in Kinshasa with 15% higher transmission rate. International medical teams deploying to contain spread.",
    published: "8 hours ago",
    tags: ["AFRICA", "HEALTH", "OUTBREAK"],
    priority: "HIGH",
    category: "HEALTH",
    url: "https://example.com/briefs/drc-ebola-outbreak",
    intelligence: {
      relevanceScore: 89,
      confidenceLevel: 93,
      categories: ["HEALTH", "INTERNATIONAL"],
      entities: {
        countries: ["DEMOCRATIC REPUBLIC OF CONGO"],
        organizations: ["WHO"],
        technologies: ["VIRUS STRAIN"],
        weapons: []
      }
    }
  },
  {
    id: 5,
    title: "Anthropic Releases Claude 4 with Enhanced Reasoning",
    summary: "New AI model demonstrates breakthrough capabilities in strategic analysis and multi-step reasoning. Potential applications in military planning and intelligence analysis.",
    published: "10 hours ago",
    tags: ["AI", "TECHNOLOGY", "ANTHROPIC"],
    priority: "HIGH",
    category: "TECHNOLOGY",
    url: "https://example.com/briefs/anthropic-claude-4",
    intelligence: {
      relevanceScore: 85,
      confidenceLevel: 96,
      categories: ["TECHNOLOGY", "AI"],
      entities: {
        countries: ["USA"],
        organizations: ["ANTHROPIC"],
        technologies: ["AI", "MACHINE LEARNING", "REASONING"],
        weapons: []
      }
    }
  },
  {
    id: 6,
    title: "Russia Activates Dead Hand Nuclear System",
    summary: "Perimeter automatic nuclear response system reportedly activated amid Ukraine conflict escalation. Dead Hand ensures retaliation even if command structure destroyed.",
    published: "12 hours ago",
    tags: ["RUSSIA", "NUCLEAR", "UKRAINE"],
    priority: "CRITICAL",
    category: "MILITARY",
    url: "https://example.com/briefs/russia-dead-hand",
    intelligence: {
      relevanceScore: 99,
      confidenceLevel: 78,
      categories: ["MILITARY", "NUCLEAR"],
      entities: {
        countries: ["RUSSIA", "UKRAINE"],
        organizations: ["RUSSIAN MILITARY"],
        technologies: ["NUCLEAR", "AUTOMATED SYSTEM"],
        weapons: ["PERIMETER SYSTEM", "NUCLEAR WEAPONS"]
      }
    }
  }
];

// Enhanced Signals Data with Intelligence Scoring
export const signalsData = [
  {
    id: 1,
    title: "CHINESE QUANTUM RADAR DETECTS US F-35 STEALTH FIGHTER",
    content: "Quantum radar installation near Taiwan Strait successfully tracked and locked onto US F-35 during reconnaissance flight. Stealth technology potentially compromised.",
    time_ago: "15m ago",
    tags: ["CHINA", "QUANTUM", "STEALTH", "F-35"],
    priority: "CRITICAL",
    score: 97,
    url: "https://example.com/signals/china-quantum-radar",
    intelligence: {
      relevanceScore: 97,
      confidenceLevel: 89,
      categories: ["MILITARY", "TECHNOLOGY"],
      entities: {
        countries: ["CHINA", "USA"],
        technologies: ["QUANTUM RADAR", "STEALTH", "F-35"],
        weapons: ["F-35 FIGHTER"]
      }
    }
  },
  {
    id: 2,
    title: "IRANIAN CENTRIFUGES EXCEED WEAPONS-GRADE ENRICHMENT",
    content: "Natanz facility uranium enrichment reaches 90% purity, surpassing weapons threshold. IAEA inspectors denied access for third consecutive week.",
    time_ago: "32m ago",
    tags: ["IRAN", "NUCLEAR", "ENRICHMENT"],
    priority: "CRITICAL",
    score: 95,
    url: "https://example.com/signals/iran-enrichment",
    intelligence: {
      relevanceScore: 95,
      confidenceLevel: 92,
      categories: ["NUCLEAR", "WEAPONS"],
      entities: {
        countries: ["IRAN"],
        organizations: ["IAEA"],
        technologies: ["URANIUM ENRICHMENT", "CENTRIFUGES"],
        weapons: ["NUCLEAR WEAPONS"]
      }
    }
  },
  {
    id: 3,
    title: "RUSSIAN POSEIDON NUCLEAR TORPEDO DEPLOYED",
    content: "Belgorod submarine deploys Status-6 Poseidon nuclear-powered torpedo near Arctic. 100-megaton warhead capable of causing radioactive tsunamis.",
    time_ago: "1h ago",
    tags: ["RUSSIA", "NUCLEAR", "SUBMARINE"],
    priority: "CRITICAL",
    score: 94,
    url: "https://example.com/signals/russia-poseidon",
    intelligence: {
      relevanceScore: 94,
      confidenceLevel: 85,
      categories: ["NUCLEAR", "NAVAL"],
      entities: {
        countries: ["RUSSIA"],
        technologies: ["NUCLEAR TORPEDO", "SUBMARINE"],
        weapons: ["POSEIDON", "NUCLEAR WARHEAD"]
      }
    }
  },
  {
    id: 4,
    title: "AI DEEPFAKE DISRUPTS TAIWAN PRESIDENTIAL ELECTION",
    content: "Sophisticated deepfake video of Taiwanese president announcing surrender to China circulates on social media. Election integrity under threat.",
    time_ago: "2h ago",
    tags: ["TAIWAN", "AI", "DEEPFAKE", "ELECTION"],
    priority: "HIGH",
    score: 88,
    url: "https://example.com/signals/taiwan-deepfake",
    intelligence: {
      relevanceScore: 88,
      confidenceLevel: 91,
      categories: ["TECHNOLOGY", "GEOPOLITICS"],
      entities: {
        countries: ["TAIWAN", "CHINA"],
        technologies: ["AI", "DEEPFAKE"],
        weapons: []
      }
    }
  },
  {
    id: 5,
    title: "NORTH KOREA TESTS SUBMARINE-LAUNCHED BALLISTIC MISSILE",
    content: "Sinpo-class submarine successfully launches Pukguksong-3 SLBM with 1,900km range. Demonstrates second-strike nuclear capability.",
    time_ago: "3h ago",
    tags: ["NORTH KOREA", "SLBM", "NUCLEAR"],
    priority: "HIGH",
    score: 86,
    url: "https://example.com/signals/nk-slbm-test",
    intelligence: {
      relevanceScore: 86,
      confidenceLevel: 93,
      categories: ["NUCLEAR", "MILITARY"],
      entities: {
        countries: ["NORTH KOREA"],
        technologies: ["SUBMARINE", "BALLISTIC MISSILE"],
        weapons: ["PUKGUKSONG-3", "SLBM"]
      }
    }
  }
];

// Advertisement Detection Patterns
export const AD_DETECTION_PATTERNS = [
  // URL patterns
  /doubleclick\.net/i,
  /googleadservices\.com/i,
  /googlesyndication\.com/i,
  /amazon-adsystem\.com/i,
  /facebook\.com\/tr/i,
  /adsystem\.amazon/i,
  
  // Content patterns
  /sponsored content/i,
  /advertisement/i,
  /promoted post/i,
  /affiliate link/i,
  /buy now/i,
  /limited time offer/i,
  /click here to/i,
  /% off/i,
  /free trial/i,
  /subscribe now/i
];

// Duplicate Detection Settings
export const DUPLICATE_DETECTION = {
  titleSimilarityThreshold: 0.8,
  contentSimilarityThreshold: 0.7,
  timeWindowHours: 24,
  sourceDomainWeight: 0.3,
  keywordMatchWeight: 0.4,
  dateWeight: 0.3
};