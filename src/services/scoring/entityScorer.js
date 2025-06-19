// Entity Significance Scoring Module for Ghost Brief
// Specialized entity analysis and scoring for intelligence assessment

/**
 * Entity Significance Scorer
 * Analyzes and scores the importance of detected entities in intelligence context
 */
export class EntityScorerService {
  constructor() {
    // Entity significance weightings
    this.entityWeights = {
      countries: 0.4,      // Geopolitical actors
      organizations: 0.3,  // Intelligence/military/terrorist orgs
      technologies: 0.2,   // Strategic technologies
      weapons: 0.1        // Weapon systems
    };

    // Country significance classifications
    this.countryClassifications = {
      MAJOR_POWERS: {
        score: 30,
        entities: ['USA', 'CHINA', 'RUSSIA', 'UNITED STATES']
      },
      CONFLICT_ZONES: {
        score: 25,
        entities: ['UKRAINE', 'TAIWAN', 'SYRIA', 'IRAN', 'ISRAEL', 'NORTH KOREA']
      },
      REGIONAL_POWERS: {
        score: 20,
        entities: ['INDIA', 'PAKISTAN', 'TURKEY', 'SAUDI ARABIA', 'JAPAN']
      },
      STANDARD: {
        score: 10,
        entities: []
      }
    };

    // Organization significance classifications
    this.organizationClassifications = {
      INTELLIGENCE: {
        score: 25,
        entities: ['CIA', 'FSB', 'MSS', 'MOSSAD', 'MI6', 'BND']
      },
      MILITARY: {
        score: 20,
        entities: ['NATO', 'PENTAGON', 'PLA', 'IRANIAN REVOLUTIONARY GUARD']
      },
      TERRORIST: {
        score: 30,
        entities: ['ISIS', 'AL-QAEDA', 'TALIBAN', 'HEZBOLLAH', 'HAMAS']
      },
      INTERNATIONAL: {
        score: 15,
        entities: ['UN', 'IAEA', 'WHO']
      },
      STANDARD: {
        score: 5,
        entities: []
      }
    };

    // Technology significance classifications
    this.technologyClassifications = {
      STRATEGIC: {
        score: 25,
        entities: ['NUCLEAR', 'QUANTUM', 'HYPERSONIC', 'AI', 'SATELLITE']
      },
      CYBER: {
        score: 20,
        entities: ['CYBER', 'MALWARE', 'ENCRYPTION', 'ZERO-DAY', 'RANSOMWARE']
      },
      MILITARY: {
        score: 15,
        entities: ['STEALTH', 'RADAR', 'DRONE', 'UAV', 'MISSILE']
      },
      STANDARD: {
        score: 5,
        entities: []
      }
    };

    // Weapon significance classifications
    this.weaponClassifications = {
      STRATEGIC: {
        score: 30,
        entities: ['NUCLEAR WEAPON', 'ICBM', 'SLBM', 'HYPERSONIC MISSILE']
      },
      ADVANCED: {
        score: 20,
        entities: ['F-35', 'F-22', 'SU-57', 'J-20', 'B-21']
      },
      CONVENTIONAL: {
        score: 10,
        entities: ['MISSILE', 'TANK', 'SUBMARINE', 'AIRCRAFT CARRIER']
      },
      STANDARD: {
        score: 5,
        entities: []
      }
    };

    // Known geopolitical tension pairs
    this.tensionPairs = [
      ['CHINA', 'USA'], ['CHINA', 'TAIWAN'], ['RUSSIA', 'NATO'], ['RUSSIA', 'UKRAINE'],
      ['IRAN', 'ISRAEL'], ['INDIA', 'PAKISTAN'], ['NORTH KOREA', 'USA'], ['NORTH KOREA', 'SOUTH KOREA']
    ];
  }

  /**
   * Calculate entity significance score
   * @param {Object} entityAnalysis - Entity analysis results
   * @returns {Object} Entity significance analysis
   */
  calculateEntitySignificance(entityAnalysis) {
    let entityScore = 0;
    const significanceFactors = [];

    // Country significance (higher for tension-prone regions)
    const countrySignificance = this.calculateCountrySignificance(entityAnalysis.countries || []);
    entityScore += countrySignificance.score * this.entityWeights.countries;
    significanceFactors.push({ type: 'countries', ...countrySignificance });

    // Organization significance (intelligence/military orgs weighted higher)
    const orgSignificance = this.calculateOrganizationSignificance(entityAnalysis.organizations || []);
    entityScore += orgSignificance.score * this.entityWeights.organizations;
    significanceFactors.push({ type: 'organizations', ...orgSignificance });

    // Technology significance (dual-use and military tech weighted higher)
    const techSignificance = this.calculateTechnologySignificance(entityAnalysis.technologies || []);
    entityScore += techSignificance.score * this.entityWeights.technologies;
    significanceFactors.push({ type: 'technologies', ...techSignificance });

    // Weapons significance (advanced weapons systems)
    const weaponSignificance = this.calculateWeaponSignificance(entityAnalysis.weapons || []);
    entityScore += weaponSignificance.score * this.entityWeights.weapons;
    significanceFactors.push({ type: 'weapons', ...weaponSignificance });

    return {
      score: Math.min(entityScore, 100),
      details: {
        factors: significanceFactors,
        totalEntities: Object.values(entityAnalysis).flat().length,
        density: entityAnalysis.density || 0
      }
    };
  }

  /**
   * Calculate country significance based on geopolitical importance
   * @param {Array} countries - Detected countries
   * @returns {Object} Country significance analysis
   */
  calculateCountrySignificance(countries) {
    let score = 0;
    const analysis = [];

    countries.forEach(country => {
      const classification = this.classifyCountry(country);
      score += classification.score;
      analysis.push({ country, ...classification });
    });

    // Check for multi-country tensions
    const tensionPairs = this.detectTensionPairs(countries);
    if (tensionPairs.length > 0) {
      const tensionBonus = tensionPairs.length * 15;
      score += tensionBonus;
      analysis.push({ 
        type: 'TENSION_PAIRS', 
        pairs: tensionPairs, 
        bonus: tensionBonus 
      });
    }

    return {
      score: Math.min(score, 100),
      details: analysis
    };
  }

  /**
   * Classify country by geopolitical significance
   * @param {string} country - Country name
   * @returns {Object} Classification result
   */
  classifyCountry(country) {
    for (const [type, data] of Object.entries(this.countryClassifications)) {
      if (data.entities.includes(country)) {
        return { type, score: data.score };
      }
    }
    return { type: 'STANDARD', score: this.countryClassifications.STANDARD.score };
  }

  /**
   * Detect tension pairs between countries
   * @param {Array} countries - Detected countries
   * @returns {Array} Tension pairs
   */
  detectTensionPairs(countries) {
    const tensionPairs = [];

    this.tensionPairs.forEach(([country1, country2]) => {
      if (countries.includes(country1) && countries.includes(country2)) {
        tensionPairs.push([country1, country2]);
      }
    });

    return tensionPairs;
  }

  /**
   * Calculate organization significance
   * @param {Array} organizations - Detected organizations
   * @returns {Object} Organization significance analysis
   */
  calculateOrganizationSignificance(organizations) {
    let score = 0;
    const analysis = [];

    organizations.forEach(org => {
      const classification = this.classifyOrganization(org);
      score += classification.score;
      analysis.push({ organization: org, ...classification });
    });

    return {
      score: Math.min(score, 100),
      details: analysis
    };
  }

  /**
   * Classify organization by significance
   * @param {string} organization - Organization name
   * @returns {Object} Classification result
   */
  classifyOrganization(organization) {
    for (const [type, data] of Object.entries(this.organizationClassifications)) {
      if (data.entities.includes(organization)) {
        return { type, score: data.score };
      }
    }
    return { type: 'STANDARD', score: this.organizationClassifications.STANDARD.score };
  }

  /**
   * Calculate technology significance
   * @param {Array} technologies - Detected technologies
   * @returns {Object} Technology significance analysis
   */
  calculateTechnologySignificance(technologies) {
    let score = 0;
    const analysis = [];

    technologies.forEach(tech => {
      const classification = this.classifyTechnology(tech);
      score += classification.score;
      analysis.push({ technology: tech, ...classification });
    });

    return {
      score: Math.min(score, 100),
      details: analysis
    };
  }

  /**
   * Classify technology by significance
   * @param {string} technology - Technology name
   * @returns {Object} Classification result
   */
  classifyTechnology(technology) {
    for (const [type, data] of Object.entries(this.technologyClassifications)) {
      if (data.entities.includes(technology)) {
        return { type, score: data.score };
      }
    }
    return { type: 'STANDARD', score: this.technologyClassifications.STANDARD.score };
  }

  /**
   * Calculate weapon significance
   * @param {Array} weapons - Detected weapons
   * @returns {Object} Weapon significance analysis
   */
  calculateWeaponSignificance(weapons) {
    let score = 0;
    const analysis = [];

    weapons.forEach(weapon => {
      const classification = this.classifyWeapon(weapon);
      score += classification.score;
      analysis.push({ weapon, ...classification });
    });

    return {
      score: Math.min(score, 100),
      details: analysis
    };
  }

  /**
   * Classify weapon by significance
   * @param {string} weapon - Weapon name
   * @returns {Object} Classification result
   */
  classifyWeapon(weapon) {
    for (const [type, data] of Object.entries(this.weaponClassifications)) {
      if (data.entities.includes(weapon)) {
        return { type, score: data.score };
      }
    }
    return { type: 'STANDARD', score: this.weaponClassifications.STANDARD.score };
  }

  /**
   * Extract simple entities for cross-reference analysis
   * @param {Object} article - Article object
   * @returns {Array} Simple entity list
   */
  extractSimpleEntities(article) {
    const content = (article.title + ' ' + (article.content || article.summary || '')).toUpperCase();
    const entities = [];
    
    const simpleEntityList = [
      'CHINA', 'RUSSIA', 'USA', 'IRAN', 'NORTH KOREA', 'UKRAINE', 'TAIWAN',
      'NUCLEAR', 'MISSILE', 'CYBER', 'MILITARY', 'INTELLIGENCE'
    ];
    
    simpleEntityList.forEach(entity => {
      if (content.includes(entity)) {
        entities.push(entity);
      }
    });
    
    return entities;
  }
}

// Export singleton instance
export const entityScorerService = new EntityScorerService();