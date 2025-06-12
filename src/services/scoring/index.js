// Scoring Module Exports for Ghost Brief
// Centralized exports for all scoring modules

// Import services for convenience export
import { keywordScorerService } from './keywordScorer.js';
import { entityScorerService } from './entityScorer.js';
import { temporalScorerService } from './temporalScorer.js';
import { sourceAssessorService } from './sourceAssessor.js';
import { threatAssessorService } from './threatAssessor.js';
import { scoreCombinerService } from './scoreCombiner.js';

// Keyword analysis and scoring
export { keywordScorerService } from './keywordScorer.js';

// Entity significance analysis
export { entityScorerService } from './entityScorer.js';

// Temporal relevance scoring
export { temporalScorerService } from './temporalScorer.js';

// Source credibility assessment
export { sourceAssessorService } from './sourceAssessor.js';

// Threat level calculation
export { threatAssessorService } from './threatAssessor.js';

// Final score combination and classification
export { scoreCombinerService } from './scoreCombiner.js';

// Convenience exports for common operations
export const scoringServices = {
  keyword: keywordScorerService,
  entity: entityScorerService,
  temporal: temporalScorerService,
  source: sourceAssessorService,
  threat: threatAssessorService,
  combiner: scoreCombinerService
};