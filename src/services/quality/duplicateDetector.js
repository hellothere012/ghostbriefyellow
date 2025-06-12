// Duplicate Detection Module for Ghost Brief
// Advanced duplicate detection and similarity analysis

/**
 * Duplicate Detector Service
 * Detects duplicate and similar content for quality filtering
 */
export class DuplicateDetectorService {
  constructor() {
    // Similarity thresholds
    this.similarityThresholds = {
      EXACT_DUPLICATE: 0.95,
      NEAR_DUPLICATE: 0.85,
      SIMILAR: 0.70,
      RELATED: 0.50
    };

    // Comparison weights
    this.comparisonWeights = {
      title: 0.4,
      content: 0.35,
      entities: 0.15,
      temporal: 0.10
    };

    // Time window for duplicate detection (24 hours)
    this.duplicateTimeWindow = 24 * 60 * 60 * 1000;
  }

  /**
   * Perform advanced duplicate detection
   * @param {Array} signals - Signals to check for duplicates
   * @returns {Object} Duplicate detection results
   */
  async advancedDuplicateDetection(signals) {
    console.log(`🔗 Detecting duplicates in ${signals.length} signals...`);

    const results = {
      input: signals.length,
      passed: [],
      rejected: [],
      duplicatePairs: [],
      similarityMatrix: []
    };

    const processedSignals = new Set();

    for (let i = 0; i < signals.length; i++) {
      if (processedSignals.has(i)) continue;

      const currentSignal = signals[i];
      const duplicates = [];

      // Compare with subsequent signals
      for (let j = i + 1; j < signals.length; j++) {
        if (processedSignals.has(j)) continue;

        const compareSignal = signals[j];
        const similarity = this.calculateSimilarity(currentSignal, compareSignal);

        if (similarity.overall >= this.similarityThresholds.NEAR_DUPLICATE) {
          duplicates.push({
            signal: compareSignal,
            similarity: similarity.overall,
            details: similarity
          });
          processedSignals.add(j);
        }

        // Store similarity data
        results.similarityMatrix.push({
          signal1: currentSignal.id,
          signal2: compareSignal.id,
          similarity: similarity.overall,
          type: this.categorizeSimilarity(similarity.overall)
        });
      }

      // Keep the highest quality signal from duplicate group
      if (duplicates.length > 0) {
        const bestSignal = this.selectBestSignal([currentSignal, ...duplicates.map(d => d.signal)]);
        results.passed.push(bestSignal);

        // Mark others as duplicates
        [currentSignal, ...duplicates.map(d => d.signal)]
          .filter(s => s.id !== bestSignal.id)
          .forEach(duplicate => {
            duplicate.rejectionReason = `Duplicate of signal ${bestSignal.id}`;
            results.rejected.push(duplicate);
          });

        results.duplicatePairs.push({
          primary: bestSignal.id,
          duplicates: duplicates.map(d => ({
            id: d.signal.id,
            similarity: d.similarity
          }))
        });
      } else {
        results.passed.push(currentSignal);
      }

      processedSignals.add(i);
    }

    console.log(`✅ Duplicate detection complete: ${results.passed.length}/${signals.length} unique signals`);
    return results;
  }

  /**
   * Calculate similarity between two signals
   * @param {Object} signal1 - First signal
   * @param {Object} signal2 - Second signal
   * @returns {Object} Similarity analysis
   */
  calculateSimilarity(signal1, signal2) {
    const titleSimilarity = this.calculateTextSimilarity(
      signal1.title || '', 
      signal2.title || ''
    );

    const contentSimilarity = this.calculateTextSimilarity(
      signal1.content || signal1.summary || '', 
      signal2.content || signal2.summary || ''
    );

    const entitySimilarity = this.calculateEntitySimilarity(
      signal1.intelligence?.entities || {},
      signal2.intelligence?.entities || {}
    );

    const temporalSimilarity = this.calculateTemporalSimilarity(
      signal1.publishedAt || signal1.fetchedAt,
      signal2.publishedAt || signal2.fetchedAt
    );

    const overall = 
      (titleSimilarity * this.comparisonWeights.title) +
      (contentSimilarity * this.comparisonWeights.content) +
      (entitySimilarity * this.comparisonWeights.entities) +
      (temporalSimilarity * this.comparisonWeights.temporal);

    return {
      overall: Math.round(overall * 100) / 100,
      title: titleSimilarity,
      content: contentSimilarity,
      entities: entitySimilarity,
      temporal: temporalSimilarity
    };
  }

  /**
   * Calculate text similarity using multiple methods
   * @param {string} text1 - First text
   * @param {string} text2 - Second text
   * @returns {number} Similarity score (0-1)
   */
  calculateTextSimilarity(text1, text2) {
    if (!text1 || !text2) return 0;

    // Jaccard similarity for quick comparison
    const jaccard = this.calculateJaccardSimilarity(text1, text2);
    
    // Cosine similarity for semantic comparison
    const cosine = this.calculateCosineSimilarity(text1, text2);
    
    // Longest common subsequence
    const lcs = this.calculateLCSRatio(text1, text2);

    // Weighted combination
    return (jaccard * 0.4) + (cosine * 0.4) + (lcs * 0.2);
  }

  /**
   * Calculate Jaccard similarity
   * @param {string} text1 - First text
   * @param {string} text2 - Second text
   * @returns {number} Jaccard similarity
   */
  calculateJaccardSimilarity(text1, text2) {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Calculate cosine similarity
   * @param {string} text1 - First text
   * @param {string} text2 - Second text
   * @returns {number} Cosine similarity
   */
  calculateCosineSimilarity(text1, text2) {
    const vector1 = this.createWordVector(text1);
    const vector2 = this.createWordVector(text2);
    
    return this.cosineSimilarity(vector1, vector2);
  }

  /**
   * Create word frequency vector
   * @param {string} text - Text to vectorize
   * @returns {Object} Word frequency vector
   */
  createWordVector(text) {
    const words = text.toLowerCase().split(/\s+/);
    const vector = {};
    
    words.forEach(word => {
      vector[word] = (vector[word] || 0) + 1;
    });
    
    return vector;
  }

  /**
   * Calculate cosine similarity between vectors
   * @param {Object} vector1 - First vector
   * @param {Object} vector2 - Second vector
   * @returns {number} Cosine similarity
   */
  cosineSimilarity(vector1, vector2) {
    const allKeys = new Set([...Object.keys(vector1), ...Object.keys(vector2)]);
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    allKeys.forEach(key => {
      const val1 = vector1[key] || 0;
      const val2 = vector2[key] || 0;
      
      dotProduct += val1 * val2;
      norm1 += val1 * val1;
      norm2 += val2 * val2;
    });
    
    const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
    return denominator > 0 ? dotProduct / denominator : 0;
  }

  /**
   * Calculate longest common subsequence ratio
   * @param {string} text1 - First text
   * @param {string} text2 - Second text
   * @returns {number} LCS ratio
   */
  calculateLCSRatio(text1, text2) {
    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);
    
    const lcsLength = this.longestCommonSubsequence(words1, words2);
    const maxLength = Math.max(words1.length, words2.length);
    
    return maxLength > 0 ? lcsLength / maxLength : 0;
  }

  /**
   * Calculate longest common subsequence
   * @param {Array} arr1 - First array
   * @param {Array} arr2 - Second array
   * @returns {number} LCS length
   */
  longestCommonSubsequence(arr1, arr2) {
    const m = arr1.length;
    const n = arr2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (arr1[i - 1] === arr2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    
    return dp[m][n];
  }

  /**
   * Calculate entity similarity
   * @param {Object} entities1 - First entity set
   * @param {Object} entities2 - Second entity set
   * @returns {number} Entity similarity
   */
  calculateEntitySimilarity(entities1, entities2) {
    const allEntities1 = [
      ...(entities1.countries || []),
      ...(entities1.organizations || []),
      ...(entities1.technologies || []),
      ...(entities1.weapons || [])
    ];
    
    const allEntities2 = [
      ...(entities2.countries || []),
      ...(entities2.organizations || []),
      ...(entities2.technologies || []),
      ...(entities2.weapons || [])
    ];
    
    if (allEntities1.length === 0 && allEntities2.length === 0) return 1;
    if (allEntities1.length === 0 || allEntities2.length === 0) return 0;
    
    const set1 = new Set(allEntities1);
    const set2 = new Set(allEntities2);
    const intersection = new Set([...set1].filter(entity => set2.has(entity)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  /**
   * Calculate temporal similarity
   * @param {string} time1 - First timestamp
   * @param {string} time2 - Second timestamp
   * @returns {number} Temporal similarity
   */
  calculateTemporalSimilarity(time1, time2) {
    if (!time1 || !time2) return 0;
    
    const date1 = new Date(time1).getTime();
    const date2 = new Date(time2).getTime();
    const timeDiff = Math.abs(date1 - date2);
    
    // Similarity decreases as time difference increases
    if (timeDiff > this.duplicateTimeWindow) return 0;
    
    return 1 - (timeDiff / this.duplicateTimeWindow);
  }

  /**
   * Select the best signal from a group of duplicates
   * @param {Array} signals - Duplicate signals
   * @returns {Object} Best signal
   */
  selectBestSignal(signals) {
    return signals.reduce((best, current) => {
      const bestScore = this.calculateSignalQuality(best);
      const currentScore = this.calculateSignalQuality(current);
      
      return currentScore > bestScore ? current : best;
    });
  }

  /**
   * Calculate signal quality for duplicate selection
   * @param {Object} signal - Signal to evaluate
   * @returns {number} Quality score
   */
  calculateSignalQuality(signal) {
    let score = 0;
    
    // Source credibility
    score += (signal.source?.credibilityScore || 70) * 0.3;
    
    // Content length
    const contentLength = (signal.content || signal.summary || '').length;
    score += Math.min(contentLength / 10, 30); // Max 30 points
    
    // Intelligence score
    score += (signal.intelligence?.relevanceScore || 50) * 0.4;
    
    return score;
  }

  /**
   * Categorize similarity level
   * @param {number} similarity - Similarity score
   * @returns {string} Similarity category
   */
  categorizeSimilarity(similarity) {
    if (similarity >= this.similarityThresholds.EXACT_DUPLICATE) return 'EXACT_DUPLICATE';
    if (similarity >= this.similarityThresholds.NEAR_DUPLICATE) return 'NEAR_DUPLICATE';
    if (similarity >= this.similarityThresholds.SIMILAR) return 'SIMILAR';
    if (similarity >= this.similarityThresholds.RELATED) return 'RELATED';
    return 'UNIQUE';
  }
}

// Export singleton instance
export const duplicateDetectorService = new DuplicateDetectorService();