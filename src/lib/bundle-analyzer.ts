/**
 * Bundle analysis utilities for performance optimization
 */

interface BundleInfo {
  name: string;
  size: number;
  gzippedSize: number;
  dependencies: string[];
}

interface ChunkInfo {
  id: string;
  name: string;
  size: number;
  modules: string[];
}

/**
 * Analyze bundle size and provide optimization recommendations
 */
export function analyzeBundle(bundleData: BundleInfo[]): {
  totalSize: number;
  totalGzippedSize: number;
  largestChunks: BundleInfo[];
  recommendations: string[];
} {
  const totalSize = bundleData.reduce((sum, chunk) => sum + chunk.size, 0);
  const totalGzippedSize = bundleData.reduce((sum, chunk) => sum + chunk.gzippedSize, 0);
  
  const largestChunks = [...bundleData]
    .sort((a, b) => b.size - a.size)
    .slice(0, 5);
  
  const recommendations: string[] = [];
  
  // Size-based recommendations
  if (totalSize > 2 * 1024 * 1024) { // 2MB
    recommendations.push('Bundle size is large (>2MB). Consider code splitting and lazy loading.');
  }
  
  if (totalGzippedSize > 500 * 1024) { // 500KB
    recommendations.push('Gzipped bundle size is large (>500KB). Optimize dependencies and remove unused code.');
  }
  
  // Chunk-based recommendations
  const largeChunks = largestChunks.filter(chunk => chunk.size > 200 * 1024); // 200KB
  if (largeChunks.length > 0) {
    recommendations.push(`Large chunks detected: ${largeChunks.map(c => c.name).join(', ')}. Consider splitting these chunks.`);
  }
  
  // Dependency-based recommendations
  const duplicateDeps = findDuplicateDependencies(bundleData);
  if (duplicateDeps.length > 0) {
    recommendations.push(`Duplicate dependencies found: ${duplicateDeps.join(', ')}. Consider deduplication.`);
  }
  
  return {
    totalSize,
    totalGzippedSize,
    largestChunks,
    recommendations,
  };
}

/**
 * Find duplicate dependencies across chunks
 */
function findDuplicateDependencies(bundleData: BundleInfo[]): string[] {
  const depCount: Record<string, number> = {};
  
  bundleData.forEach(chunk => {
    chunk.dependencies.forEach(dep => {
      depCount[dep] = (depCount[dep] || 0) + 1;
    });
  });
  
  return Object.entries(depCount)
    .filter(([_, count]) => count > 1)
    .map(([dep]) => dep);
}

/**
 * Generate code splitting recommendations
 */
export function generateCodeSplittingRecommendations(
  routes: string[],
  componentSizes: Record<string, number>
): {
  recommendedSplits: string[];
  lazyLoadCandidates: string[];
} {
  const recommendedSplits: string[] = [];
  const lazyLoadCandidates: string[] = [];
  
  // Route-based splitting
  routes.forEach(route => {
    if (componentSizes[route] && componentSizes[route] > 50 * 1024) { // 50KB
      recommendedSplits.push(`Route: ${route} (${formatBytes(componentSizes[route])})`);
    }
  });
  
  // Component-based lazy loading
  Object.entries(componentSizes).forEach(([component, size]) => {
    if (size > 100 * 1024) { // 100KB
      lazyLoadCandidates.push(`${component} (${formatBytes(size)})`);
    }
  });
  
  return {
    recommendedSplits,
    lazyLoadCandidates,
  };
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Calculate compression ratio
 */
export function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
  return ((originalSize - compressedSize) / originalSize) * 100;
}

/**
 * Performance budget checker
 */
export function checkPerformanceBudget(
  bundleSize: number,
  gzippedSize: number,
  budget: {
    maxBundleSize: number;
    maxGzippedSize: number;
  }
): {
  withinBudget: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  
  if (bundleSize > budget.maxBundleSize) {
    violations.push(`Bundle size (${formatBytes(bundleSize)}) exceeds budget (${formatBytes(budget.maxBundleSize)})`);
  }
  
  if (gzippedSize > budget.maxGzippedSize) {
    violations.push(`Gzipped size (${formatBytes(gzippedSize)}) exceeds budget (${formatBytes(budget.maxGzippedSize)})`);
  }
  
  return {
    withinBudget: violations.length === 0,
    violations,
  };
}

/**
 * Tree shaking analysis
 */
export function analyzeTreeShaking(
  imports: Record<string, string[]>,
  usedExports: Record<string, string[]>
): {
  unusedImports: string[];
  treeShakingEfficiency: number;
} {
  const unusedImports: string[] = [];
  let totalImports = 0;
  let usedImports = 0;
  
  Object.entries(imports).forEach(([module, imports]) => {
    const used = usedExports[module] || [];
    const unused = imports.filter(imp => !used.includes(imp));
    
    if (unused.length > 0) {
      unusedImports.push(`${module}: ${unused.join(', ')}`);
    }
    
    totalImports += imports.length;
    usedImports += used.length;
  });
  
  const treeShakingEfficiency = totalImports > 0 ? (usedImports / totalImports) * 100 : 100;
  
  return {
    unusedImports,
    treeShakingEfficiency,
  };
}
