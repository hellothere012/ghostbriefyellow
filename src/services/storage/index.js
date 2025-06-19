// Storage Module Exports for Ghost Brief
// Centralized exports for all storage management modules

// Import services for convenience export
import { articleManagerService } from './articleManager.js';
import { briefManagerService } from './briefManager.js';
import { feedManagerService } from './feedManager.js';
import { settingsManagerService } from './settingsManager.js';
import { retentionManagerService } from './retentionManager.js';

// Article management
export { articleManagerService } from './articleManager.js';

// Brief management
export { briefManagerService } from './briefManager.js';

// Feed management
export { feedManagerService } from './feedManager.js';

// Settings management
export { settingsManagerService } from './settingsManager.js';

// Retention and cleanup management
export { retentionManagerService } from './retentionManager.js';

// Convenience exports for common operations
export const storageServices = {
  articles: articleManagerService,
  briefs: briefManagerService,
  feeds: feedManagerService,
  settings: settingsManagerService,
  retention: retentionManagerService
};