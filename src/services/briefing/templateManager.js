/**
 * Briefing Template Manager
 * Manages briefing templates, formatting, and compilation
 */

import { formatIntelligenceDate } from '../../utils/dateHelpers.js';
import { formatPriority } from '../../utils/formatters.js';

/**
 * Template Management Service for Daily Briefings
 * Handles briefing templates, formatting, and final compilation
 */
export class BriefingTemplateManager {
  constructor() {
    // Briefing template configurations
    this.templates = {
      STANDARD: {
        name: 'Standard Daily Intelligence Briefing',
        sections: ['EXECUTIVE_SUMMARY', 'PRIORITY_DEVELOPMENTS', 'THREAT_ASSESSMENT', 'REGIONAL_ANALYSIS', 'TECHNOLOGY_INTELLIGENCE', 'STRATEGIC_IMPLICATIONS', 'RECOMMENDATIONS'],
        format: 'markdown',
        classification: 'INTELLIGENCE ASSESSMENT'
      },
      EXECUTIVE: {
        name: 'Executive Intelligence Summary',
        sections: ['EXECUTIVE_SUMMARY', 'PRIORITY_DEVELOPMENTS', 'THREAT_ASSESSMENT', 'RECOMMENDATIONS'],
        format: 'markdown',
        classification: 'EXECUTIVE BRIEFING'
      },
      TACTICAL: {
        name: 'Tactical Intelligence Brief',
        sections: ['THREAT_ASSESSMENT', 'REGIONAL_ANALYSIS', 'PRIORITY_DEVELOPMENTS', 'RECOMMENDATIONS'],
        format: 'markdown',
        classification: 'TACTICAL BRIEFING'
      },
      MINIMAL: {
        name: 'Minimal Intelligence Update',
        sections: ['EXECUTIVE_SUMMARY', 'PRIORITY_DEVELOPMENTS'],
        format: 'markdown',
        classification: 'INTELLIGENCE UPDATE'
      }
    };

    // Section formatting configurations
    this.sectionFormats = {
      EXECUTIVE_SUMMARY: {
        header: '## EXECUTIVE SUMMARY',
        includeMetadata: true,
        emphasizeCritical: true
      },
      PRIORITY_DEVELOPMENTS: {
        header: '## PRIORITY INTELLIGENCE DEVELOPMENTS',
        includeSignalDetails: true,
        showRelevanceScores: true
      },
      THREAT_ASSESSMENT: {
        header: '## CURRENT THREAT ASSESSMENT',
        emphasizeThreatLevels: true,
        includeRiskMatrix: true
      },
      REGIONAL_ANALYSIS: {
        header: '## REGIONAL INTELLIGENCE ANALYSIS',
        showGeographicBreakdown: true,
        includeStabilityIndicators: true
      },
      TECHNOLOGY_INTELLIGENCE: {
        header: '## TECHNOLOGY INTELLIGENCE WATCH',
        highlightEmergingTech: true,
        showStrategicImpact: true
      },
      STRATEGIC_IMPLICATIONS: {
        header: '## STRATEGIC IMPLICATIONS ASSESSMENT',
        showTimeframes: true,
        emphasizeImplications: true
      },
      RECOMMENDATIONS: {
        header: '## INTELLIGENCE RECOMMENDATIONS',
        prioritizeActions: true,
        showTimeframes: true
      }
    };
  }

  /**
   * Compile final briefing from sections and metadata
   * @param {Object} briefingData - Complete briefing data
   * @param {Array} signals - Source signals used
   * @param {string} templateType - Template type to use
   * @returns {Object} Compiled briefing
   */
  compileFinalBriefing(briefingData, signals, templateType = 'STANDARD') {
    const template = this.templates[templateType];
    if (!template) {
      throw new Error(`Unknown template type: ${templateType}`);
    }

    const compiledBriefing = {
      id: briefingData.metadata.briefingId,
      title: this.generateBriefingTitle(briefingData.metadata, templateType),
      metadata: this.enhanceMetadata(briefingData.metadata, template),
      content: '',
      sections: {},
      analysis: this.generateAnalysisSummary(briefingData, signals),
      quality: null // To be filled by quality assessor
    };

    // Generate briefing header
    compiledBriefing.content += this.generateBriefingHeader(compiledBriefing.metadata, template);

    // Compile each section according to template
    template.sections.forEach(sectionName => {
      if (briefingData.sections[sectionName]) {
        const formattedSection = this.formatSection(
          sectionName,
          briefingData.sections[sectionName],
          this.sectionFormats[sectionName]
        );
        
        compiledBriefing.sections[sectionName] = briefingData.sections[sectionName];
        compiledBriefing.content += formattedSection;
      }
    });

    // Add briefing footer
    compiledBriefing.content += this.generateBriefingFooter(compiledBriefing.metadata, signals);

    // Calculate final statistics
    compiledBriefing.statistics = this.calculateBriefingStatistics(compiledBriefing, signals);

    return compiledBriefing;
  }

  /**
   * Generate briefing title based on metadata and template
   * @param {Object} metadata - Briefing metadata
   * @param {string} templateType - Template type
   * @returns {string} Generated title
   */
  generateBriefingTitle(metadata, templateType) {
    const template = this.templates[templateType];
    const date = new Date(metadata.generatedAt);
    const dateStr = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `${template.name} - ${dateStr}`;
  }

  /**
   * Enhance metadata with template-specific information
   * @param {Object} metadata - Original metadata
   * @param {Object} template - Template configuration
   * @returns {Object} Enhanced metadata
   */
  enhanceMetadata(metadata, template) {
    return {
      ...metadata,
      templateType: template.name,
      templateFormat: template.format,
      classification: template.classification,
      compiledAt: new Date().toISOString(),
      version: '1.0',
      distribution: 'AUTHORIZED PERSONNEL ONLY'
    };
  }

  /**
   * Generate briefing header
   * @param {Object} metadata - Briefing metadata
   * @param {Object} template - Template configuration
   * @returns {string} Formatted header
   */
  generateBriefingHeader(metadata, template) {
    const date = formatIntelligenceDate(metadata.generatedAt);
    
    return `# ${metadata.title || 'Daily Intelligence Briefing'}

**Classification:** ${metadata.classification}  
**Date:** ${date}  
**Briefing ID:** ${metadata.briefingId}  
**Reporting Period:** ${metadata.reportingPeriod}  
**Distribution:** ${metadata.distribution}  

---

`;
  }

  /**
   * Format individual section according to configuration
   * @param {string} sectionName - Name of the section
   * @param {Object} sectionData - Section data
   * @param {Object} formatConfig - Formatting configuration
   * @returns {string} Formatted section content
   */
  formatSection(sectionName, sectionData, formatConfig) {
    let formattedContent = `\n${formatConfig.header}\n\n`;

    switch (sectionName) {
      case 'EXECUTIVE_SUMMARY':
        formattedContent += this.formatExecutiveSummary(sectionData, formatConfig);
        break;
      case 'PRIORITY_DEVELOPMENTS':
        formattedContent += this.formatPriorityDevelopments(sectionData, formatConfig);
        break;
      case 'THREAT_ASSESSMENT':
        formattedContent += this.formatThreatAssessment(sectionData, formatConfig);
        break;
      case 'REGIONAL_ANALYSIS':
        formattedContent += this.formatRegionalAnalysis(sectionData, formatConfig);
        break;
      case 'TECHNOLOGY_INTELLIGENCE':
        formattedContent += this.formatTechnologyIntelligence(sectionData, formatConfig);
        break;
      case 'STRATEGIC_IMPLICATIONS':
        formattedContent += this.formatStrategicImplications(sectionData, formatConfig);
        break;
      case 'RECOMMENDATIONS':
        formattedContent += this.formatRecommendations(sectionData, formatConfig);
        break;
      default:
        formattedContent += this.formatGenericSection(sectionData, formatConfig);
    }

    formattedContent += '\n---\n';
    return formattedContent;
  }

  /**
   * Format Executive Summary section
   * @param {Object} sectionData - Section data
   * @param {Object} formatConfig - Format configuration
   * @returns {string} Formatted content
   */
  formatExecutiveSummary(sectionData, formatConfig) {
    const content = sectionData.content;
    let formatted = `**Overview:** ${content.overviewStatement}\n\n`;

    if (content.keyHighlights && content.keyHighlights.length > 0) {
      formatted += '**Key Highlights:**\n';
      content.keyHighlights.forEach(highlight => {
        formatted += `- ${highlight}\n`;
      });
      formatted += '\n';
    }

    if (content.criticalDevelopments && content.criticalDevelopments.length > 0) {
      formatted += '**Critical Developments:**\n';
      content.criticalDevelopments.forEach((dev, index) => {
        formatted += `${index + 1}. **${dev.title}** (${formatPriority(dev.priority).text})\n`;
        if (dev.entities && dev.entities.length > 0) {
          formatted += `   - Entities: ${dev.entities.join(', ')}\n`;
        }
        formatted += `   - Timeframe: ${dev.timeframe}\n\n`;
      });
    }

    if (content.recommendedActions && content.recommendedActions.length > 0) {
      formatted += '**Immediate Actions Required:**\n';
      content.recommendedActions.forEach(action => {
        formatted += `- ${action}\n`;
      });
      formatted += '\n';
    }

    if (formatConfig.includeMetadata && sectionData.metadata) {
      formatted += `*Analysis based on ${sectionData.metadata.signalCount} signals with ${sectionData.metadata.confidence}% confidence*\n\n`;
    }

    return formatted;
  }

  /**
   * Format Priority Developments section
   * @param {Object} sectionData - Section data
   * @param {Object} formatConfig - Format configuration
   * @returns {string} Formatted content
   */
  formatPriorityDevelopments(sectionData, formatConfig) {
    const content = sectionData.content;
    let formatted = `${content.summary}\n\n`;

    if (content.developments && content.developments.length > 0) {
      content.developments.forEach((dev, index) => {
        const priority = formatPriority(dev.priority);
        formatted += `### ${index + 1}. ${dev.title} ${priority.icon}\n\n`;
        formatted += `**Summary:** ${dev.summary}\n\n`;
        formatted += `**Priority:** ${priority.text}`;
        
        if (formatConfig.showRelevanceScores && dev.relevanceScore) {
          formatted += ` | **Relevance:** ${dev.relevanceScore}%`;
        }
        formatted += '\n\n';

        if (dev.entities) {
          const entityStrings = [];
          if (dev.entities.countries?.length) {
            entityStrings.push(`Countries: ${dev.entities.countries.join(', ')}`);
          }
          if (dev.entities.organizations?.length) {
            entityStrings.push(`Organizations: ${dev.entities.organizations.join(', ')}`);
          }
          if (entityStrings.length > 0) {
            formatted += `**Entities:** ${entityStrings.join(' | ')}\n\n`;
          }
        }

        formatted += `**Timeframe:** ${dev.timeframe}\n`;
        
        if (dev.source) {
          formatted += `**Source:** ${dev.source.name} (Credibility: ${dev.source.credibility}%)\n`;
        }
        
        formatted += '\n';
      });
    }

    if (content.trends && content.trends.length > 0) {
      formatted += '**Observed Trends:**\n';
      content.trends.forEach(trend => {
        formatted += `- ${trend}\n`;
      });
      formatted += '\n';
    }

    return formatted;
  }

  /**
   * Format Threat Assessment section
   * @param {Object} sectionData - Section data
   * @param {Object} formatConfig - Format configuration
   * @returns {string} Formatted content
   */
  formatThreatAssessment(sectionData, formatConfig) {
    const content = sectionData.content;
    let formatted = `**Overall Threat Level:** ${content.overallThreatLevel}\n\n`;

    if (content.threatsByType && Object.keys(content.threatsByType).length > 0) {
      formatted += '**Threat Categories:**\n\n';
      Object.values(content.threatsByType).forEach(threat => {
        formatted += `#### ${threat.type} Threat\n`;
        formatted += `- **Severity:** ${threat.severity}\n`;
        formatted += `- **Signal Count:** ${threat.signalCount}\n`;
        formatted += `- **Risk Level:** ${threat.riskLevel}\n`;
        formatted += `- **Timeframe:** ${threat.timeframe}\n\n`;

        if (threat.signals && threat.signals.length > 0) {
          formatted += '**Key Indicators:**\n';
          threat.signals.forEach(signal => {
            formatted += `- ${signal.title}\n`;
          });
          formatted += '\n';
        }
      });
    }

    if (content.immediateThreats && content.immediateThreats.length > 0) {
      formatted += '**Immediate Threats:**\n';
      content.immediateThreats.forEach(threat => {
        formatted += `- **${threat.title}** (${formatPriority(threat.intelligence?.priority).text})\n`;
      });
      formatted += '\n';
    }

    if (content.emergingThreats && content.emergingThreats.length > 0) {
      formatted += '**Emerging Threats:**\n';
      content.emergingThreats.forEach(threat => {
        formatted += `- ${threat}\n`;
      });
      formatted += '\n';
    }

    if (content.recommendation) {
      formatted += `**Recommendation:** ${content.recommendation}\n\n`;
    }

    return formatted;
  }

  /**
   * Format Regional Analysis section
   * @param {Object} sectionData - Section data
   * @param {Object} formatConfig - Format configuration
   * @returns {string} Formatted content
   */
  formatRegionalAnalysis(sectionData, formatConfig) {
    const content = sectionData.content;
    let formatted = `**Active Regions:** ${content.activeRegions}\n`;
    formatted += `**Stability Assessment:** ${content.stabilityAssessment}\n\n`;

    if (content.regionalBreakdown && Object.keys(content.regionalBreakdown).length > 0) {
      formatted += '**Regional Breakdown:**\n\n';
      Object.entries(content.regionalBreakdown).forEach(([region, data]) => {
        const regionName = region.replace('_', ' ');
        formatted += `#### ${regionName}\n`;
        formatted += `- **Activity Level:** ${data.signalCount} signals\n`;
        formatted += `- **Threat Level:** ${data.threatLevel}\n`;
        
        if (data.primaryCountries && data.primaryCountries.length > 0) {
          formatted += `- **Primary Countries:** ${data.primaryCountries.join(', ')}\n`;
        }
        
        if (data.dominantThemes && data.dominantThemes.length > 0) {
          formatted += `- **Key Themes:** ${data.dominantThemes.join(', ')}\n`;
        }

        if (data.keyDevelopments && data.keyDevelopments.length > 0) {
          formatted += '- **Key Developments:**\n';
          data.keyDevelopments.forEach(dev => {
            formatted += `  - ${dev.title}\n`;
          });
        }
        
        formatted += '\n';
      });
    }

    if (content.hotspots && content.hotspots.length > 0) {
      formatted += '**Regional Hotspots:**\n';
      content.hotspots.forEach(hotspot => {
        formatted += `- ${hotspot.replace('_', ' ')}\n`;
      });
      formatted += '\n';
    }

    return formatted;
  }

  /**
   * Format Technology Intelligence section
   * @param {Object} sectionData - Section data
   * @param {Object} formatConfig - Format configuration
   * @returns {string} Formatted content
   */
  formatTechnologyIntelligence(sectionData, formatConfig) {
    const content = sectionData.content;
    let formatted = '';

    if (content.technologyAreas && Object.keys(content.technologyAreas).length > 0) {
      formatted += '**Technology Areas:**\n\n';
      Object.values(content.technologyAreas).forEach(area => {
        const areaName = area.area.replace('_', ' ');
        formatted += `#### ${areaName}\n`;
        formatted += `- **Activity Level:** ${area.activityLevel}\n`;
        formatted += `- **Strategic Impact:** ${area.strategicImpact}\n`;
        formatted += `- **Timeframe:** ${area.timeframe}\n`;
        formatted += `- **Signal Count:** ${area.signalCount}\n`;

        if (area.developments && area.developments.length > 0) {
          formatted += '- **Key Developments:**\n';
          area.developments.forEach(dev => {
            formatted += `  - ${dev.title} (${formatPriority(dev.priority).text})\n`;
          });
        }
        
        formatted += '\n';
      });
    }

    if (content.cyberThreats) {
      formatted += `**Cyber Threat Assessment:** ${content.cyberThreats}\n\n`;
    }

    if (content.technologyTrends && content.technologyTrends.length > 0) {
      formatted += '**Technology Trends:**\n';
      content.technologyTrends.forEach(trend => {
        formatted += `- ${trend}\n`;
      });
      formatted += '\n';
    }

    if (content.emergingTechnologies && content.emergingTechnologies.length > 0) {
      formatted += '**Emerging Technologies:**\n';
      content.emergingTechnologies.forEach(tech => {
        formatted += `- ${tech}\n`;
      });
      formatted += '\n';
    }

    return formatted;
  }

  /**
   * Format Strategic Implications section
   * @param {Object} sectionData - Section data
   * @param {Object} formatConfig - Format configuration
   * @returns {string} Formatted content
   */
  formatStrategicImplications(sectionData, formatConfig) {
    const content = sectionData.content;
    let formatted = '';

    if (content.timeframes) {
      formatted += '**Strategic Timeframes:**\n\n';
      
      if (content.timeframes.immediate && content.timeframes.immediate.length > 0) {
        formatted += '**Immediate (0-48 hours):**\n';
        content.timeframes.immediate.forEach(implication => {
          formatted += `- ${implication}\n`;
        });
        formatted += '\n';
      }

      if (content.timeframes.shortTerm && content.timeframes.shortTerm.length > 0) {
        formatted += '**Short-term (1-4 weeks):**\n';
        content.timeframes.shortTerm.forEach(implication => {
          formatted += `- ${implication}\n`;
        });
        formatted += '\n';
      }

      if (content.timeframes.longTerm && content.timeframes.longTerm.length > 0) {
        formatted += '**Long-term (1-6 months):**\n';
        content.timeframes.longTerm.forEach(implication => {
          formatted += `- ${implication}\n`;
        });
        formatted += '\n';
      }
    }

    if (content.geopoliticalShifts && content.geopoliticalShifts.length > 0) {
      formatted += '**Geopolitical Shifts:**\n';
      content.geopoliticalShifts.forEach(shift => {
        formatted += `- ${shift}\n`;
      });
      formatted += '\n';
    }

    if (content.riskFactors && content.riskFactors.length > 0) {
      formatted += '**Risk Factors:**\n';
      content.riskFactors.forEach(risk => {
        formatted += `- ${risk}\n`;
      });
      formatted += '\n';
    }

    if (content.opportunities && content.opportunities.length > 0) {
      formatted += '**Strategic Opportunities:**\n';
      content.opportunities.forEach(opportunity => {
        formatted += `- ${opportunity}\n`;
      });
      formatted += '\n';
    }

    return formatted;
  }

  /**
   * Format Recommendations section
   * @param {Object} sectionData - Section data
   * @param {Object} formatConfig - Format configuration
   * @returns {string} Formatted content
   */
  formatRecommendations(sectionData, formatConfig) {
    const content = sectionData.content;
    let formatted = '';

    if (content.immediate && content.immediate.length > 0) {
      formatted += '### Immediate Actions (0-6 hours)\n';
      content.immediate.forEach((rec, index) => {
        formatted += `${index + 1}. **${rec.action}**\n`;
        formatted += `   - Rationale: ${rec.rationale}\n`;
        formatted += `   - Priority: ${formatPriority(rec.priority).text}\n`;
        if (rec.entities && rec.entities.length > 0) {
          formatted += `   - Focus: ${rec.entities.join(', ')}\n`;
        }
        formatted += '\n';
      });
    }

    if (content.shortTerm && content.shortTerm.length > 0) {
      formatted += '### Short-term Actions (24-72 hours)\n';
      content.shortTerm.forEach((rec, index) => {
        formatted += `${index + 1}. **${rec.action}**\n`;
        formatted += `   - Rationale: ${rec.rationale}\n`;
        formatted += `   - Timeframe: ${rec.timeframe}\n`;
        formatted += `   - Priority: ${formatPriority(rec.priority).text}\n`;
        if (rec.affectedRegions && rec.affectedRegions.length > 0) {
          formatted += `   - Regions: ${rec.affectedRegions.join(', ')}\n`;
        }
        formatted += '\n';
      });
    }

    if (content.strategic && content.strategic.length > 0) {
      formatted += '### Strategic Actions (1-4 weeks)\n';
      content.strategic.forEach((rec, index) => {
        formatted += `${index + 1}. **${rec.action}**\n`;
        formatted += `   - Rationale: ${rec.rationale}\n`;
        formatted += `   - Timeframe: ${rec.timeframe}\n`;
        formatted += `   - Priority: ${formatPriority(rec.priority).text}\n`;
        if (rec.expectedOutcome) {
          formatted += `   - Expected Outcome: ${rec.expectedOutcome}\n`;
        }
        formatted += '\n';
      });
    }

    return formatted;
  }

  /**
   * Format generic section (fallback)
   * @param {Object} sectionData - Section data
   * @param {Object} formatConfig - Format configuration
   * @returns {string} Formatted content
   */
  formatGenericSection(sectionData, formatConfig) {
    if (typeof sectionData.content === 'string') {
      return sectionData.content + '\n\n';
    }
    return JSON.stringify(sectionData.content, null, 2) + '\n\n';
  }

  /**
   * Generate briefing footer
   * @param {Object} metadata - Briefing metadata
   * @param {Array} signals - Source signals
   * @returns {string} Formatted footer
   */
  generateBriefingFooter(metadata, signals) {
    const generatedAt = formatIntelligenceDate(metadata.compiledAt || metadata.generatedAt);
    
    return `
---

## BRIEFING METADATA

**Generated:** ${generatedAt}  
**Sources:** ${signals.length} intelligence signals processed  
**Coverage Period:** ${metadata.reportingPeriod}  
**Next Briefing:** Scheduled for next day at 06:00 UTC  

**Classification:** ${metadata.classification}  
**Distribution:** ${metadata.distribution}  

*This briefing was generated using automated intelligence analysis. Human review and validation recommended for critical decisions.*

---

**END OF BRIEFING**
`;
  }

  /**
   * Generate analysis summary for briefing metadata
   * @param {Object} briefingData - Complete briefing data
   * @param {Array} signals - Source signals
   * @returns {Object} Analysis summary
   */
  generateAnalysisSummary(briefingData, signals) {
    const entities = this.extractAllEntities(signals);
    const sourceAnalysis = this.analyzeSourceQuality(signals);
    const signalAnalysis = this.analyzeSignalDistribution(signals);

    return {
      entities,
      sourceAnalysis,
      signalAnalysis,
      patterns: briefingData.patterns || {},
      generationStats: {
        totalSignals: signals.length,
        sectionsGenerated: Object.keys(briefingData.sections).length,
        averageConfidence: this.calculateAverageConfidence(briefingData.sections),
        processingTime: Date.now() - new Date(briefingData.metadata.generatedAt).getTime()
      }
    };
  }

  /**
   * Calculate briefing statistics
   * @param {Object} briefing - Compiled briefing
   * @param {Array} signals - Source signals
   * @returns {Object} Briefing statistics
   */
  calculateBriefingStatistics(briefing, signals) {
    const content = briefing.content || '';
    const words = content.split(/\s+/).filter(word => word.length > 0);
    
    return {
      wordCount: words.length,
      sectionCount: Object.keys(briefing.sections).length,
      signalCount: signals.length,
      averageRelevance: signals.reduce((sum, s) => sum + (s.intelligence?.relevanceScore || 0), 0) / signals.length,
      priorityDistribution: this.calculatePriorityDistribution(signals),
      categoryDistribution: this.calculateCategoryDistribution(signals),
      readingTimeMinutes: Math.ceil(words.length / 200) // Assuming 200 WPM reading speed
    };
  }

  // Helper methods

  extractAllEntities(signals) {
    const entities = { countries: new Set(), organizations: new Set(), technologies: new Set(), weapons: new Set() };
    
    signals.forEach(signal => {
      const signalEntities = signal.intelligence?.entities || {};
      Object.entries(signalEntities).forEach(([type, entityList]) => {
        if (entities[type]) {
          entityList.forEach(entity => entities[type].add(entity));
        }
      });
    });

    return Object.fromEntries(
      Object.entries(entities).map(([type, entitySet]) => [type, Array.from(entitySet)])
    );
  }

  analyzeSourceQuality(signals) {
    const sources = signals.map(s => s.source).filter(Boolean);
    const totalSources = new Set(sources.map(s => s.feedId)).size;
    const avgCredibility = sources.reduce((sum, s) => sum + (s.credibilityScore || 70), 0) / sources.length;
    const highCredibilityCount = sources.filter(s => (s.credibilityScore || 70) >= 85).length;
    const recentSignalCount = signals.filter(s => {
      const ageHours = (Date.now() - new Date(s.publishedAt || s.fetchedAt)) / (1000 * 60 * 60);
      return ageHours <= 24;
    }).length;

    return {
      totalSources,
      averageCredibility: Math.round(avgCredibility),
      highCredibilityRatio: highCredibilityCount / sources.length,
      sourceDiversity: totalSources / sources.length,
      recentSourceRatio: recentSignalCount / signals.length
    };
  }

  analyzeSignalDistribution(signals) {
    const priorityCount = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    const recentCount = signals.filter(s => {
      const ageHours = (Date.now() - new Date(s.publishedAt || s.fetchedAt)) / (1000 * 60 * 60);
      return ageHours <= 24;
    }).length;

    signals.forEach(signal => {
      const priority = signal.intelligence?.priority || 'LOW';
      priorityCount[priority]++;
    });

    return {
      prioritySignalCount: priorityCount.CRITICAL + priorityCount.HIGH,
      recentSignalRatio: recentCount / signals.length,
      priorityDistribution: priorityCount
    };
  }

  calculateAverageConfidence(sections) {
    const confidenceValues = Object.values(sections)
      .map(section => section.metadata?.confidence)
      .filter(conf => conf !== undefined);

    if (confidenceValues.length === 0) return 70;
    return Math.round(confidenceValues.reduce((sum, conf) => sum + conf, 0) / confidenceValues.length);
  }

  calculatePriorityDistribution(signals) {
    const distribution = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    signals.forEach(signal => {
      const priority = signal.intelligence?.priority || 'LOW';
      distribution[priority]++;
    });
    return distribution;
  }

  calculateCategoryDistribution(signals) {
    const distribution = {};
    signals.forEach(signal => {
      const categories = signal.intelligence?.categories || [];
      categories.forEach(category => {
        distribution[category] = (distribution[category] || 0) + 1;
      });
    });
    return distribution;
  }
}

// Export singleton instance
export const briefingTemplateManager = new BriefingTemplateManager();