/**
 * Briefing Services Index
 * Central export point for all briefing-related services
 */

// Main briefing generator (orchestrator)
export { dailyBriefingGenerator, DailyBriefingGenerator } from './briefingGenerator.js';

// Individual service modules
export { briefingPatternAnalyzer, BriefingPatternAnalyzer } from './patternAnalyzer.js';
export { briefingSectionGenerators, BriefingSectionGenerators } from './sectionGenerators.js';
export { briefingQualityAssessor, BriefingQualityAssessor } from './qualityAssessor.js';
export { briefingTemplateManager, BriefingTemplateManager } from './templateManager.js';