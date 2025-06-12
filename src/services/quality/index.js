// Quality Module Exports for Ghost Brief
// Centralized exports for all quality filtering modules

// Import services for convenience export
import { contentAnalyzerService } from './contentAnalyzer.js';
import { sourceVerifierService } from './sourceVerifier.js';
import { duplicateDetectorService } from './duplicateDetector.js';

// Content quality analysis
export { contentAnalyzerService } from './contentAnalyzer.js';

// Source reliability verification
export { sourceVerifierService } from './sourceVerifier.js';

// Duplicate detection
export { duplicateDetectorService } from './duplicateDetector.js';

// Convenience exports for common operations
export const qualityServices = {
  content: contentAnalyzerService,
  source: sourceVerifierService,
  duplicate: duplicateDetectorService
};