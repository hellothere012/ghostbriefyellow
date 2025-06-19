// Advanced Entity Extraction Service for Ghost Brief
// Professional intelligence-grade entity recognition and analysis

/**
 * Advanced Entity Extraction Service
 * Provides sophisticated entity recognition for intelligence analysis
 */
export class AdvancedEntityExtractionService {
  constructor() {
    // Enhanced entity databases with aliases and variants
    this.entityDatabases = {
      countries: {
        'UNITED STATES': ['USA', 'US', 'AMERICA', 'UNITED STATES OF AMERICA'],
        'CHINA': ['PRC', 'PEOPLES REPUBLIC OF CHINA', 'MAINLAND CHINA'],
        'RUSSIA': ['RUSSIAN FEDERATION', 'MOSCOW', 'KREMLIN'],
        'IRAN': ['ISLAMIC REPUBLIC OF IRAN', 'PERSIA', 'TEHRAN'],
        'NORTH KOREA': ['DPRK', 'DEMOCRATIC PEOPLES REPUBLIC OF KOREA', 'PYONGYANG'],
        'SOUTH KOREA': ['ROK', 'REPUBLIC OF KOREA', 'SEOUL'],
        'UKRAINE': ['KIEV', 'KYIV'],
        'TAIWAN': ['ROC', 'REPUBLIC OF CHINA', 'TAIPEI'],
        'ISRAEL': ['JEWISH STATE', 'TEL AVIV', 'JERUSALEM'],
        'PALESTINE': ['PALESTINIAN TERRITORIES', 'GAZA', 'WEST BANK'],
        'UNITED KINGDOM': ['UK', 'BRITAIN', 'GREAT BRITAIN', 'ENGLAND'],
        'SAUDI ARABIA': ['KINGDOM OF SAUDI ARABIA', 'RIYADH'],
        'TURKEY': ['TURKISH REPUBLIC', 'ANKARA'],
        'PAKISTAN': ['ISLAMIC REPUBLIC OF PAKISTAN', 'ISLAMABAD'],
        'INDIA': ['REPUBLIC OF INDIA', 'NEW DELHI'],
        'JAPAN': ['NIPPON', 'TOKYO'],
        'GERMANY': ['FEDERAL REPUBLIC OF GERMANY', 'BERLIN'],
        'FRANCE': ['FRENCH REPUBLIC', 'PARIS']
      },
      
      organizations: {
        // Intelligence Agencies
        'CIA': ['CENTRAL INTELLIGENCE AGENCY', 'AGENCY'],
        'FBI': ['FEDERAL BUREAU OF INVESTIGATION'],
        'NSA': ['NATIONAL SECURITY AGENCY'],
        'FSB': ['FEDERAL SECURITY SERVICE'],
        'SVR': ['FOREIGN INTELLIGENCE SERVICE'],
        'MSS': ['MINISTRY OF STATE SECURITY'],
        'MOSSAD': ['INSTITUTE FOR INTELLIGENCE AND SPECIAL OPERATIONS'],
        'MI6': ['SECRET INTELLIGENCE SERVICE', 'SIS'],
        'MI5': ['SECURITY SERVICE'],
        'BND': ['FEDERAL INTELLIGENCE SERVICE'],
        'DGSE': ['DIRECTORATE-GENERAL FOR EXTERNAL SECURITY'],
        'ISI': ['INTER-SERVICES INTELLIGENCE'],
        
        // Military Organizations
        'NATO': ['NORTH ATLANTIC TREATY ORGANIZATION'],
        'PENTAGON': ['DEPARTMENT OF DEFENSE', 'DOD'],
        'PLA': ['PEOPLES LIBERATION ARMY'],
        'IRGC': ['IRANIAN REVOLUTIONARY GUARD CORPS', 'REVOLUTIONARY GUARD'],
        'IDF': ['ISRAEL DEFENSE FORCES'],
        'BUNDESWEHR': ['GERMAN ARMED FORCES'],
        
        // International Organizations
        'UN': ['UNITED NATIONS'],
        'IAEA': ['INTERNATIONAL ATOMIC ENERGY AGENCY'],
        'WHO': ['WORLD HEALTH ORGANIZATION'],
        'EU': ['EUROPEAN UNION'],
        'ASEAN': ['ASSOCIATION OF SOUTHEAST ASIAN NATIONS'],
        'BRICS': ['BRAZIL RUSSIA INDIA CHINA SOUTH AFRICA'],
        
        // Terrorist/Criminal Organizations
        'ISIS': ['ISLAMIC STATE', 'ISIL', 'DAESH'],
        'AL-QAEDA': ['AL QAEDA', 'AQ'],
        'TALIBAN': ['ISLAMIC EMIRATE OF AFGHANISTAN'],
        'HEZBOLLAH': ['PARTY OF GOD'],
        'HAMAS': ['ISLAMIC RESISTANCE MOVEMENT'],
        'PKK': ['KURDISTAN WORKERS PARTY'],
        'WAGNER GROUP': ['WAGNER PMC', 'WAGNER MERCENARIES'],
        
        // Cyber Groups
        'LAZARUS GROUP': ['HIDDEN COBRA', 'ZINC'],
        'APT1': ['COMMENT CREW', 'PLA UNIT 61398'],
        'APT28': ['FANCY BEAR', 'SOFACY'],
        'APT29': ['COZY BEAR', 'THE DUKES'],
        'SANDWORM': ['VOODOO BEAR', 'IRON VIKING']
      },
      
      technologies: {
        // Nuclear Technology
        'NUCLEAR REACTOR': ['REACTOR', 'NUCLEAR PLANT', 'POWER PLANT'],
        'URANIUM ENRICHMENT': ['ENRICHMENT', 'CENTRIFUGE', 'ISOTOPE SEPARATION'],
        'PLUTONIUM': ['WEAPONS-GRADE PLUTONIUM'],
        'NUCLEAR WEAPON': ['ATOMIC WEAPON', 'NUCLEAR WARHEAD', 'NUKE'],
        
        // Cyber Technology
        'ARTIFICIAL INTELLIGENCE': ['AI', 'MACHINE LEARNING', 'ML', 'NEURAL NETWORK'],
        'QUANTUM COMPUTING': ['QUANTUM COMPUTER', 'QUANTUM PROCESSOR'],
        'BLOCKCHAIN': ['DISTRIBUTED LEDGER', 'CRYPTOCURRENCY'],
        'DEEPFAKE': ['SYNTHETIC MEDIA', 'AI-GENERATED'],
        'ZERO-DAY': ['0-DAY', 'ZERO DAY EXPLOIT'],
        'MALWARE': ['VIRUS', 'TROJAN', 'WORM', 'ROOTKIT'],
        'RANSOMWARE': ['CRYPTO-MALWARE', 'RANSOM MALWARE'],
        'BOTNET': ['ZOMBIE NETWORK', 'BOT NETWORK'],
        
        // Military Technology
        'HYPERSONIC MISSILE': ['HYPERSONIC WEAPON', 'HYPERSONIC GLIDE VEHICLE'],
        'STEALTH TECHNOLOGY': ['STEALTH', 'LOW OBSERVABLE'],
        'SATELLITE': ['ORBITAL VEHICLE', 'SPACECRAFT'],
        'DRONE': ['UAV', 'UNMANNED AERIAL VEHICLE', 'UAS'],
        'RADAR': ['DETECTION SYSTEM', 'SURVEILLANCE RADAR'],
        'SONAR': ['ACOUSTIC DETECTION', 'UNDERWATER DETECTION'],
        'GPS': ['GLOBAL POSITIONING SYSTEM', 'NAVIGATION SATELLITE'],
        'SURVEILLANCE': ['MONITORING', 'RECONNAISSANCE', 'INTELLIGENCE GATHERING']
      },
      
      weapons: {
        // Strategic Weapons
        'ICBM': ['INTERCONTINENTAL BALLISTIC MISSILE', 'LONG-RANGE MISSILE'],
        'SLBM': ['SUBMARINE-LAUNCHED BALLISTIC MISSILE'],
        'HYPERSONIC MISSILE': ['HYPERSONIC WEAPON', 'MACH 5 MISSILE'],
        'CRUISE MISSILE': ['LAND-ATTACK MISSILE', 'TOMAHAWK'],
        'BALLISTIC MISSILE': ['SURFACE-TO-SURFACE MISSILE'],
        
        // Nuclear Weapons
        'NUCLEAR WARHEAD': ['ATOMIC WARHEAD', 'NUCLEAR BOMB'],
        'HYDROGEN BOMB': ['H-BOMB', 'THERMONUCLEAR WEAPON'],
        'TACTICAL NUCLEAR WEAPON': ['BATTLEFIELD NUCLEAR WEAPON'],
        
        // Aircraft
        'F-35': ['F-35 LIGHTNING', 'JOINT STRIKE FIGHTER'],
        'F-22': ['F-22 RAPTOR'],
        'SU-57': ['SUKHOI SU-57', 'PAK FA'],
        'J-20': ['CHENGDU J-20', 'MIGHTY DRAGON'],
        'B-21': ['B-21 RAIDER'],
        'B-52': ['B-52 STRATOFORTRESS'],
        
        // Naval Weapons
        'AIRCRAFT CARRIER': ['CARRIER', 'FLATTOP'],
        'SUBMARINE': ['SUB', 'UNDERWATER VESSEL'],
        'DESTROYER': ['GUIDED MISSILE DESTROYER'],
        'FRIGATE': ['WARSHIP'],
        
        // Conventional Weapons
        'JAVELIN': ['JAVELIN MISSILE', 'ANTI-TANK MISSILE'],
        'PATRIOT': ['PATRIOT MISSILE', 'AIR DEFENSE SYSTEM'],
        'HIMARS': ['HIGH MOBILITY ARTILLERY ROCKET SYSTEM'],
        'APACHE': ['AH-64 APACHE', 'ATTACK HELICOPTER'],
        'PREDATOR': ['MQ-1 PREDATOR', 'PREDATOR DRONE'],
        'REAPER': ['MQ-9 REAPER', 'REAPER DRONE']
      },
      
      weaponSystems: {
        // Air Defense Systems
        'S-300': ['S-300 SYSTEM', 'SA-10'],
        'S-400': ['S-400 TRIUMF', 'SA-21'],
        'S-500': ['S-500 PROMETHEUS', 'SA-X-23'],
        'IRON DOME': ['IRON DOME SYSTEM'],
        'THAAD': ['TERMINAL HIGH ALTITUDE AREA DEFENSE'],
        'AEGIS': ['AEGIS COMBAT SYSTEM'],
        
        // Missile Systems
        'ISKANDER': ['ISKANDER MISSILE SYSTEM'],
        'DF-21': ['DONG FENG 21', 'CARRIER KILLER'],
        'DF-26': ['DONG FENG 26', 'GUAM KILLER'],
        'KINZHAL': ['KINZHAL MISSILE', 'DAGGER MISSILE'],
        'ZIRCON': ['ZIRCON HYPERSONIC MISSILE'],
        'SARMAT': ['RS-28 SARMAT', 'SATAN 2']
      },
      
      locations: {
        // Military Bases
        'PENTAGON': ['DEPARTMENT OF DEFENSE HQ'],
        'CHEYENNE MOUNTAIN': ['NORAD HEADQUARTERS'],
        'AREA 51': ['GROOM LAKE', 'DREAMLAND'],
        'GUANTANAMO BAY': ['GITMO'],
        'DIEGO GARCIA': ['BRITISH INDIAN OCEAN TERRITORY'],
        
        // Nuclear Facilities
        'NATANZ': ['NATANZ ENRICHMENT FACILITY'],
        'FORDOW': ['FORDOW FUEL ENRICHMENT PLANT'],
        'YONGBYON': ['YONGBYON NUCLEAR COMPLEX'],
        'DIMONA': ['NEGEV NUCLEAR RESEARCH CENTER'],
        
        // Strategic Locations
        'STRAIT OF HORMUZ': ['HORMUZ STRAIT'],
        'SOUTH CHINA SEA': ['SCS'],
        'TAIWAN STRAIT': ['FORMOSA STRAIT'],
        'SUEZ CANAL': ['SUEZ WATERWAY'],
        'GIBRALTAR': ['STRAIT OF GIBRALTAR'],
        'BOSPHORUS': ['BOSPHORUS STRAIT']
      }
    };

    // Entity relationship patterns
    this.relationshipPatterns = {
      ADVERSARIAL: [
        ['USA', 'CHINA'], ['USA', 'RUSSIA'], ['USA', 'IRAN'], ['USA', 'NORTH KOREA'],
        ['CHINA', 'TAIWAN'], ['RUSSIA', 'NATO'], ['IRAN', 'ISRAEL'], ['INDIA', 'PAKISTAN']
      ],
      ALLIED: [
        ['USA', 'NATO'], ['USA', 'JAPAN'], ['USA', 'SOUTH KOREA'], ['USA', 'ISRAEL'],
        ['EU', 'NATO'], ['CHINA', 'RUSSIA'], ['CHINA', 'NORTH KOREA']
      ],
      COMPETITIVE: [
        ['USA', 'CHINA'], ['NATO', 'RUSSIA'], ['SAUDI ARABIA', 'IRAN']
      ]
    };

    // Context-based entity scoring
    this.contextScoring = {
      CRITICAL_COMBINATIONS: [
        ['NUCLEAR', 'IRAN'], ['NUCLEAR', 'NORTH KOREA'], ['CYBER', 'ATTACK'],
        ['MISSILE', 'TEST'], ['MILITARY', 'DEPLOYMENT'], ['TERRORIST', 'ATTACK']
      ],
      HIGH_VALUE_ENTITIES: [
        'USA', 'CHINA', 'RUSSIA', 'NUCLEAR', 'CYBER', 'MISSILE', 'CIA', 'FSB', 'MSS'
      ],
      ESCALATION_INDICATORS: [
        'DEPLOYMENT', 'MOBILIZATION', 'ALERT', 'READINESS', 'EXERCISE', 'BUILDUP'
      ]
    };

    // Advanced pattern matching
    this.patterns = {
      WEAPON_DESIGNATIONS: /([A-Z]{1,3}-\d{1,3}[A-Z]?|[A-Z]+-\d{1,3})/g,
      MILITARY_UNITS: /(DIVISION|BRIGADE|REGIMENT|BATTALION|SQUADRON|FLEET|ARMY|CORPS)/gi,
      COORDINATES: /(\d{1,3}\.?\d*°?\s*[NS],?\s*\d{1,3}\.?\d*°?\s*[EW])/g,
      DATES_TIMES: /(\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}:\d{2})/g,
      MONETARY: /(\$\d+(?:\.\d+)?\s*(?:billion|million|thousand))/gi,
      CASUALTY_NUMBERS: /(\d+\s*(?:killed|wounded|injured|casualties|deaths))/gi
    };
  }

  /**
   * Extract advanced intelligence entities from content
   * @param {Object} processedContent - Preprocessed content
   * @param {Object} article - Original article object
   * @returns {Object} Enhanced entity extraction results
   */
  extractAdvancedEntities(processedContent, article) {
    console.log(`🔍 Advanced entity extraction for: ${article.title.substring(0, 50)}...`);

    // Step 1: Extract standard entities with aliases
    const standardEntities = this.extractStandardEntities(processedContent.combined);
    
    // Step 2: Extract contextual entities and relationships
    const relationships = this.extractEntityRelationships(standardEntities);
    
    // Step 3: Extract technical designations and codes
    const technicalEntities = this.extractTechnicalEntities(processedContent.combined);
    
    // Step 4: Extract geographical and strategic locations
    const strategicLocations = this.extractStrategicLocations(processedContent.combined);
    
    // Step 5: Analyze entity significance and context
    const entitySignificance = this.analyzeEntitySignificance(standardEntities, relationships);
    
    // Step 6: Extract temporal and quantitative data
    const quantitativeData = this.extractQuantitativeData(processedContent.combined);
    
    // Step 7: Calculate entity density and distribution
    const densityAnalysis = this.calculateEntityDensity(processedContent, standardEntities);

    // Compile comprehensive entity analysis
    const enhancedEntities = {
      // Standard entity categories (enhanced)
      countries: standardEntities.countries || [],
      organizations: standardEntities.organizations || [],
      technologies: standardEntities.technologies || [],
      weapons: standardEntities.weapons || [],
      weaponSystems: standardEntities.weaponSystems || [],
      locations: strategicLocations,
      
      // Advanced extractions
      technicalDesignations: technicalEntities,
      quantitativeData: quantitativeData,
      relationships: relationships,
      
      // Analysis metadata
      significance: entitySignificance,
      density: densityAnalysis.overall,
      distribution: densityAnalysis.distribution,
      
      // Enhanced metrics
      totalEntities: Object.values(standardEntities).flat().length,
      uniqueEntities: this.countUniqueEntities(standardEntities),
      criticalCombinations: this.detectCriticalCombinations(standardEntities),
      escalationIndicators: this.detectEscalationIndicators(processedContent.combined)
    };

    console.log(`✅ Advanced entity extraction complete: ${enhancedEntities.totalEntities} entities, ${enhancedEntities.relationships.length} relationships`);
    return enhancedEntities;
  }

  /**
   * Extract standard entities with enhanced alias matching
   * @param {string} content - Content to analyze
   * @returns {Object} Standard entities with aliases resolved
   */
  extractStandardEntities(content) {
    const entities = {
      countries: [],
      organizations: [],
      technologies: [],
      weapons: [],
      weaponSystems: [],
      locations: []
    };

    // Process each entity database
    Object.entries(this.entityDatabases).forEach(([category, entityMap]) => {
      Object.entries(entityMap).forEach(([primaryName, aliases]) => {
        // Check primary name
        if (content.includes(primaryName)) {
          entities[category].push({
            name: primaryName,
            aliases: aliases,
            frequency: (content.match(new RegExp(primaryName, 'g')) || []).length,
            isPrimary: true
          });
        }
        
        // Check aliases
        aliases.forEach(alias => {
          if (content.includes(alias) && !entities[category].some(e => e.name === primaryName)) {
            entities[category].push({
              name: primaryName,
              aliases: aliases,
              frequency: (content.match(new RegExp(alias, 'gi')) || []).length,
              matchedAlias: alias,
              isPrimary: false
            });
          }
        });
      });
    });

    // Sort by frequency and relevance
    Object.keys(entities).forEach(category => {
      entities[category] = entities[category]
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 15) // Limit to top 15 per category
        .map(entity => entity.name); // Return just names for compatibility
    });

    return entities;
  }

  /**
   * Extract entity relationships and interactions
   * @param {Object} entities - Extracted entities
   * @returns {Array} Detected relationships
   */
  extractEntityRelationships(entities) {
    const relationships = [];
    const allCountries = entities.countries || [];

    // Check for known relationship patterns
    this.relationshipPatterns.ADVERSARIAL.forEach(([country1, country2]) => {
      if (allCountries.includes(country1) && allCountries.includes(country2)) {
        relationships.push({
          type: 'ADVERSARIAL',
          entities: [country1, country2],
          significance: 'HIGH',
          context: 'Known adversarial relationship'
        });
      }
    });

    this.relationshipPatterns.ALLIED.forEach(([country1, country2]) => {
      if (allCountries.includes(country1) && allCountries.includes(country2)) {
        relationships.push({
          type: 'ALLIED',
          entities: [country1, country2],
          significance: 'MEDIUM',
          context: 'Allied relationship'
        });
      }
    });

    // Check for multi-entity scenarios
    if (allCountries.length >= 3) {
      relationships.push({
        type: 'MULTILATERAL',
        entities: allCountries.slice(0, 5), // Top 5 countries
        significance: 'HIGH',
        context: 'Complex multi-party scenario'
      });
    }

    return relationships;
  }

  /**
   * Extract technical designations and military codes
   * @param {string} content - Content to analyze
   * @returns {Object} Technical entities
   */
  extractTechnicalEntities(content) {
    const technical = {
      weaponDesignations: [],
      militaryUnits: [],
      coordinates: [],
      timestamps: [],
      monetary: [],
      casualties: []
    };

    // Extract weapon/system designations (e.g., F-35, S-400, DF-21)
    const weaponMatches = content.match(this.patterns.WEAPON_DESIGNATIONS) || [];
    technical.weaponDesignations = [...new Set(weaponMatches)].slice(0, 10);

    // Extract military unit mentions
    const unitMatches = content.match(this.patterns.MILITARY_UNITS) || [];
    technical.militaryUnits = [...new Set(unitMatches.map(u => u.toUpperCase()))].slice(0, 5);

    // Extract coordinates
    const coordMatches = content.match(this.patterns.COORDINATES) || [];
    technical.coordinates = [...new Set(coordMatches)].slice(0, 3);

    // Extract timestamps
    const timeMatches = content.match(this.patterns.DATES_TIMES) || [];
    technical.timestamps = [...new Set(timeMatches)].slice(0, 5);

    // Extract monetary figures
    const moneyMatches = content.match(this.patterns.MONETARY) || [];
    technical.monetary = [...new Set(moneyMatches)].slice(0, 3);

    // Extract casualty numbers
    const casualtyMatches = content.match(this.patterns.CASUALTY_NUMBERS) || [];
    technical.casualties = [...new Set(casualtyMatches)].slice(0, 3);

    return technical;
  }

  /**
   * Extract strategic locations and geographical entities
   * @param {string} content - Content to analyze
   * @returns {Array} Strategic locations
   */
  extractStrategicLocations(content) {
    const locations = [];

    Object.entries(this.entityDatabases.locations).forEach(([primaryName, aliases]) => {
      if (content.includes(primaryName)) {
        locations.push({
          name: primaryName,
          type: this.categorizeLocation(primaryName),
          aliases: aliases,
          strategicValue: this.assessLocationValue(primaryName)
        });
      }
      
      aliases.forEach(alias => {
        if (content.includes(alias) && !locations.some(l => l.name === primaryName)) {
          locations.push({
            name: primaryName,
            type: this.categorizeLocation(primaryName),
            aliases: aliases,
            matchedAlias: alias,
            strategicValue: this.assessLocationValue(primaryName)
          });
        }
      });
    });

    return locations.map(loc => loc.name); // Return names for compatibility
  }

  /**
   * Categorize location type
   * @param {string} location - Location name
   * @returns {string} Location category
   */
  categorizeLocation(location) {
    const militaryBases = ['PENTAGON', 'CHEYENNE MOUNTAIN', 'AREA 51', 'GUANTANAMO BAY'];
    const nuclearSites = ['NATANZ', 'FORDOW', 'YONGBYON', 'DIMONA'];
    const straits = ['STRAIT OF HORMUZ', 'TAIWAN STRAIT', 'GIBRALTAR', 'BOSPHORUS'];

    if (militaryBases.includes(location)) return 'MILITARY_BASE';
    if (nuclearSites.includes(location)) return 'NUCLEAR_FACILITY';
    if (straits.includes(location)) return 'STRATEGIC_WATERWAY';
    return 'STRATEGIC_LOCATION';
  }

  /**
   * Assess strategic value of location
   * @param {string} location - Location name
   * @returns {string} Strategic value assessment
   */
  assessLocationValue(location) {
    const critical = ['STRAIT OF HORMUZ', 'TAIWAN STRAIT', 'SUEZ CANAL', 'PENTAGON'];
    const high = ['SOUTH CHINA SEA', 'NATANZ', 'YONGBYON', 'GIBRALTAR'];
    
    if (critical.includes(location)) return 'CRITICAL';
    if (high.includes(location)) return 'HIGH';
    return 'MEDIUM';
  }

  /**
   * Analyze entity significance based on intelligence value
   * @param {Object} entities - Extracted entities
   * @param {Array} relationships - Entity relationships
   * @returns {Object} Significance analysis
   */
  analyzeEntitySignificance(entities, relationships) {
    const significance = {
      overall: 'LOW',
      factors: [],
      criticalEntities: [],
      escalationRisk: 'LOW'
    };

    // Check for high-value entities
    const highValueCount = Object.values(entities).flat().filter(entity => 
      this.contextScoring.HIGH_VALUE_ENTITIES.includes(entity)
    ).length;

    if (highValueCount >= 3) {
      significance.overall = 'CRITICAL';
      significance.factors.push('Multiple high-value entities detected');
    } else if (highValueCount >= 2) {
      significance.overall = 'HIGH';
      significance.factors.push('High-value entities present');
    } else if (highValueCount >= 1) {
      significance.overall = 'MEDIUM';
      significance.factors.push('Some high-value entities detected');
    }

    // Check for adversarial relationships
    const adversarialCount = relationships.filter(r => r.type === 'ADVERSARIAL').length;
    if (adversarialCount >= 2) {
      significance.escalationRisk = 'HIGH';
      significance.factors.push('Multiple adversarial relationships');
    } else if (adversarialCount >= 1) {
      significance.escalationRisk = 'MEDIUM';
      significance.factors.push('Adversarial relationship detected');
    }

    // Identify critical entities
    significance.criticalEntities = Object.values(entities).flat().filter(entity => 
      this.contextScoring.HIGH_VALUE_ENTITIES.includes(entity)
    );

    return significance;
  }

  /**
   * Extract quantitative data from content
   * @param {string} content - Content to analyze
   * @returns {Object} Quantitative data
   */
  extractQuantitativeData(content) {
    const numbers = {
      monetary: [],
      casualties: [],
      quantities: [],
      percentages: [],
      distances: []
    };

    // Extract monetary amounts
    const moneyPattern = /\$?\d+(?:\.\d+)?\s*(?:billion|million|thousand|trillion)/gi;
    numbers.monetary = [...new Set(content.match(moneyPattern) || [])];

    // Extract casualty figures
    const casualtyPattern = /\d+\s*(?:killed|wounded|injured|casualties|deaths|victims)/gi;
    numbers.casualties = [...new Set(content.match(casualtyPattern) || [])];

    // Extract general quantities
    const quantityPattern = /\d+\s*(?:troops|soldiers|personnel|aircraft|ships|missiles|tanks)/gi;
    numbers.quantities = [...new Set(content.match(quantityPattern) || [])];

    // Extract percentages
    const percentPattern = /\d+(?:\.\d+)?%/g;
    numbers.percentages = [...new Set(content.match(percentPattern) || [])];

    // Extract distances/ranges
    const distancePattern = /\d+(?:\.\d+)?\s*(?:km|kilometers|miles|nautical miles)/gi;
    numbers.distances = [...new Set(content.match(distancePattern) || [])];

    return numbers;
  }

  /**
   * Calculate entity density and distribution analysis
   * @param {Object} processedContent - Processed content
   * @param {Object} entities - Extracted entities
   * @returns {Object} Density analysis
   */
  calculateEntityDensity(processedContent, entities) {
    const totalWords = processedContent.wordCount;
    const totalEntities = Object.values(entities).flat().length;
    const overall = (totalEntities / totalWords) * 100;

    const distribution = {};
    Object.entries(entities).forEach(([category, entityList]) => {
      distribution[category] = {
        count: entityList.length,
        density: (entityList.length / totalWords) * 100,
        percentage: (entityList.length / totalEntities) * 100
      };
    });

    return {
      overall: Math.round(overall * 100) / 100,
      distribution,
      classification: this.classifyDensity(overall)
    };
  }

  /**
   * Classify entity density level
   * @param {number} density - Density value
   * @returns {string} Density classification
   */
  classifyDensity(density) {
    if (density >= 5) return 'VERY_HIGH';
    if (density >= 3) return 'HIGH';
    if (density >= 1.5) return 'MEDIUM';
    if (density >= 0.5) return 'LOW';
    return 'VERY_LOW';
  }

  /**
   * Count unique entities across all categories
   * @param {Object} entities - Extracted entities
   * @returns {number} Unique entity count
   */
  countUniqueEntities(entities) {
    const allEntities = Object.values(entities).flat();
    return new Set(allEntities).size;
  }

  /**
   * Detect critical entity combinations
   * @param {Object} entities - Extracted entities
   * @returns {Array} Critical combinations found
   */
  detectCriticalCombinations(entities) {
    const combinations = [];
    const allEntities = Object.values(entities).flat();

    this.contextScoring.CRITICAL_COMBINATIONS.forEach(([entity1, entity2]) => {
      if (allEntities.includes(entity1) && allEntities.includes(entity2)) {
        combinations.push({
          entities: [entity1, entity2],
          significance: 'CRITICAL',
          reason: 'High-risk entity combination'
        });
      }
    });

    return combinations;
  }

  /**
   * Detect escalation indicators in content
   * @param {string} content - Content to analyze
   * @returns {Array} Escalation indicators found
   */
  detectEscalationIndicators(content) {
    const indicators = [];

    this.contextScoring.ESCALATION_INDICATORS.forEach(indicator => {
      if (content.includes(indicator)) {
        indicators.push({
          indicator,
          context: 'Military escalation signal',
          risk: 'HIGH'
        });
      }
    });

    return indicators;
  }

  /**
   * Generate entity extraction report
   * @param {Object} extractionResults - Extraction results
   * @returns {Object} Extraction report
   */
  generateExtractionReport(extractionResults) {
    return {
      summary: {
        totalEntities: extractionResults.totalEntities,
        uniqueEntities: extractionResults.uniqueEntities,
        entityDensity: extractionResults.density,
        significanceLevel: extractionResults.significance.overall
      },
      breakdown: {
        countries: extractionResults.countries.length,
        organizations: extractionResults.organizations.length,
        technologies: extractionResults.technologies.length,
        weapons: extractionResults.weapons.length,
        locations: extractionResults.locations.length
      },
      analysis: {
        relationships: extractionResults.relationships.length,
        criticalCombinations: extractionResults.criticalCombinations.length,
        escalationIndicators: extractionResults.escalationIndicators.length,
        strategicImplications: this.assessStrategicImplications(extractionResults)
      },
      metadata: {
        extractionAlgorithm: 'advanced-entity-v2.0',
        extractedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Assess strategic implications of extracted entities
   * @param {Object} extractionResults - Extraction results
   * @returns {string} Strategic implications assessment
   */
  assessStrategicImplications(extractionResults) {
    const { relationships, criticalCombinations, escalationIndicators } = extractionResults;

    if (criticalCombinations.length >= 2 || escalationIndicators.length >= 3) {
      return 'High strategic implications with multiple risk factors';
    }
    
    if (relationships.length >= 2 || criticalCombinations.length >= 1) {
      return 'Moderate strategic implications requiring monitoring';
    }
    
    if (relationships.length >= 1 || escalationIndicators.length >= 1) {
      return 'Limited strategic implications with some concerns';
    }
    
    return 'Minimal strategic implications identified';
  }
}

// Export singleton instance
export const advancedEntityExtractionService = new AdvancedEntityExtractionService();