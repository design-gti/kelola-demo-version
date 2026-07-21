import { Employee, employees as defaultEmployees } from './orgChartData';
import { getAllImageIds } from './imageStorage';
import { generateDevelopmentData, calculateCompetencyScore } from './developmentData';

const STORAGE_KEY = 'org_chart_employees_data';
const DEFAULT_DATA_KEY = 'org_chart_default_employees';

// Helper function to generate consistent dummy data based on employee name and competency
// (Copied from orgChartData.ts for data migration)
const generateDummyData = (name: string, competencyScore: number) => {
  const cities = [
    'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Semarang', 
    'Medan', 'Denpasar', 'Makassar', 'Palembang', 'Tangerang',
    'Bekasi', 'Bogor', 'Depok', 'Malang', 'Solo'
  ];
  
  // Determine gender based on name
  const femaleNames = [
    'Dian', 'Yolanda', 'Chelsea', 'Novaria', 'Angela', 'Shani', 
    'Liliana', 'Aurora', 'Vicky', 'Shifa', 'Diana', 'Siti', 
    'Clarissa', 'Putri', 'Nana', 'Jesslyn', 'Harjaya', 'Devi',
    'Gilda', 'Ami', 'Hilda', 'Wirda', 'Tira', 'Zamira'
  ];
  
  const firstName = name.split(' ')[0];
  const isFemale = femaleNames.some(fn => firstName.includes(fn)) || 
                   name.includes('Susanti') || name.includes('Lailasari') || 
                   name.includes('Kuswoyo') || name.includes('Mulyani') ||
                   name.includes('Rahmawati') || name.includes('Widiastuti') ||
                   name.includes('Shania') || name.includes('Hastuti');
  
  const gender: 'Male' | 'Female' = isFemale ? 'Female' : 'Male';
  
  // Use name hash for consistent randomization
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Performance slightly below competency score (competency is 0-100 scale)
  // We'll make performance 2-10% below competency score
  const performanceGap = 2 + (hash % 9); // 2-10% gap
  const performance = Math.max(40, competencyScore - performanceGap);
  
  return {
    criticalPosition: hash % 3 === 0, // Every 3rd employee is critical
    gender,
    city: cities[hash % cities.length],
    maritalStatus: (hash % 2 === 0 ? 'Menikah' : 'Belum Menikah') as 'Menikah' | 'Belum Menikah',
    performance: Math.round(performance),
    iq: 105 + (hash % 26) // IQ between 105-130
  };
};

/**
 * Get localStorage usage statistics
 */
function getStorageStats(): { usedMB: number; totalMB: number; percentUsed: number } {
  let totalSize = 0;
  
  try {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const itemSize = localStorage.getItem(key)?.length || 0;
        totalSize += itemSize + key.length;
      }
    }
  } catch (e) {
    console.error('Error calculating storage size:', e);
  }
  
  const usedMB = totalSize / (1024 * 1024);
  const totalMB = 5; // Most browsers limit localStorage to ~5-10MB
  const percentUsed = (usedMB / totalMB) * 100;
  
  return { usedMB, totalMB, percentUsed };
}

export interface DataManager {
  getEmployees: () => Employee[];
  saveEmployees: (employees: Employee[]) => void;
  resetToDefault: () => void;
  exportData: () => string;
  importData: (jsonString: string) => boolean;
  getStorageStats: () => { usedMB: number; totalMB: number; percentUsed: number };
  cleanupBrokenImageRefs: (employees: Employee[]) => Promise<void>;
  saveCurrentAsDefault: () => void;
  getDefaultEmployees: () => Employee[];
}

export const dataManager: DataManager = {
  /**
   * Get employees from localStorage, fallback to default data
   * Also cleans up any base64 images and broken IndexedDB references
   */
  getEmployees: (): Employee[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate that it's an array
        if (Array.isArray(parsed)) {
          // Clean up base64 images and broken IndexedDB refs on load
          // ALSO: Migrate old data to add new fields
          const cleaned = parsed.map(emp => {
            const cleanedEmp = { ...emp };
            
            // Remove base64 images
            if (cleanedEmp.imageUrl && cleanedEmp.imageUrl.startsWith('data:')) {
              delete cleanedEmp.imageUrl;
            }
            
            // MIGRATION: Add new fields if they don't exist
            const needsMigration = 
              cleanedEmp.criticalPosition === undefined ||
              cleanedEmp.gender === undefined ||
              cleanedEmp.city === undefined ||
              cleanedEmp.maritalStatus === undefined ||
              cleanedEmp.performance === undefined ||
              cleanedEmp.iq === undefined;
            
            if (needsMigration) {
              const dummyData = generateDummyData(cleanedEmp.name, cleanedEmp.competencyScore);
              
              // Only fill missing fields (don't overwrite existing ones)
              if (cleanedEmp.criticalPosition === undefined) cleanedEmp.criticalPosition = dummyData.criticalPosition;
              if (cleanedEmp.gender === undefined) cleanedEmp.gender = dummyData.gender;
              if (cleanedEmp.city === undefined) cleanedEmp.city = dummyData.city;
              if (cleanedEmp.maritalStatus === undefined) cleanedEmp.maritalStatus = dummyData.maritalStatus;
              if (cleanedEmp.performance === undefined) cleanedEmp.performance = dummyData.performance;
              if (cleanedEmp.iq === undefined) cleanedEmp.iq = dummyData.iq;
            }
            
            // MIGRATION: Generate competencyDetails and idpRecommendations if they don't exist
            const needsCompetencyMigration = 
              !cleanedEmp.competencyDetails || cleanedEmp.competencyDetails.length === 0;
            
            if (needsCompetencyMigration) {
              // Store the original competency score before migration
              const originalCompetencyScore = cleanedEmp.competencyScore;
              
              // Get readiness score (use existing or calculate fallback)
              let readinessScore = cleanedEmp.readinessScore;
              if (readinessScore === undefined || readinessScore === null) {
                // Calculate fallback readiness score from competency score
                const currentScore = cleanedEmp.competencyScore;
                if (currentScore >= 91) {
                  readinessScore = Math.round(currentScore * 0.92);
                } else if (currentScore >= 76) {
                  readinessScore = Math.round(currentScore * 0.88);
                } else if (currentScore >= 66) {
                  readinessScore = Math.round(currentScore * 0.80);
                } else {
                  readinessScore = Math.round(currentScore * 0.72);
                }
                cleanedEmp.readinessScore = readinessScore;
              }
              
              // Generate development data based on readiness score
              const devData = generateDevelopmentData(cleanedEmp.id, readinessScore);
              cleanedEmp.competencyDetails = devData.competencyDetails;
              cleanedEmp.idpRecommendations = devData.idpRecommendations;
              
              // IMPORTANT: Preserve the original competency score from Excel/import
              // DO NOT recalculate - the competency score in Excel is the authoritative source
              cleanedEmp.competencyScore = originalCompetencyScore;
              
              console.log(`âœ… ${cleanedEmp.name}: Preserved competency score ${originalCompetencyScore}%`);
            }
            
            return cleanedEmp;
          });
          
          // Deduplicate by ID - keep only the first occurrence of each ID
          const seenIds = new Set<string>();
          const deduplicated = cleaned.filter(emp => {
            if (seenIds.has(emp.id)) {
              console.warn(`âš ï¸ Duplicate employee ID found: ${emp.id} (${emp.name}). Removing duplicate.`);
              return false;
            }
            seenIds.add(emp.id);
            return true;
          });
          
          // Check if we need to save migrated or deduplicated data
          const hasMigratedData = cleaned.some((emp, i) => {
            const original = parsed[i];
            return emp.criticalPosition !== original?.criticalPosition ||
                   emp.gender !== original?.gender ||
                   emp.city !== original?.city ||
                   emp.maritalStatus !== original?.maritalStatus ||
                   emp.performance !== original?.performance ||
                   emp.iq !== original?.iq;
          });
          
          // If duplicates were found OR data was migrated, save the cleaned data back to localStorage
          if (deduplicated.length < cleaned.length || hasMigratedData) {
            if (deduplicated.length < cleaned.length) {
              console.log(`ðŸ”§ Removed ${cleaned.length - deduplicated.length} duplicate(s). Saving cleaned data...`);
            }
            if (hasMigratedData) {
              console.log(`ðŸ”„ Migrated old data to include new fields (Critical Position, Gender, City, etc.)`);
            }
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(deduplicated));
            } catch (e) {
              console.error('Failed to save deduplicated data:', e);
            }
          }
          
          // Async cleanup of broken IndexedDB references (non-blocking)
          if (deduplicated.some(emp => emp.imageUrl?.startsWith('indexeddb:'))) {
            dataManager.cleanupBrokenImageRefs(deduplicated);
          }
          
          return deduplicated;
        }
      }
    } catch (error) {
      console.error('Error loading employees from localStorage:', error);
    }
    
    // Check if we have saved default data
    const defaultData = dataManager.getDefaultEmployees();
    
    // If this is first time (no custom default), save current orgChartData as default
    const hasCustomDefault = localStorage.getItem(DEFAULT_DATA_KEY);
    if (!hasCustomDefault) {
      console.log('ðŸŽ¯ First load - saving current data as default');
      try {
        localStorage.setItem(DEFAULT_DATA_KEY, JSON.stringify(defaultEmployees));
      } catch (e) {
        console.error('Failed to save initial default data:', e);
      }
    }
    
    return defaultData;
  },

  /**
   * Save employees to localStorage
   * Strips base64 images to prevent quota exceeded errors
   */
  saveEmployees: (employees: Employee[]): void => {
    try {
      // Strip base64 images (keep only URLs)
      const cleanedEmployees = employees.map(emp => {
        const cleaned = { ...emp };
        
        // If imageUrl is base64 (starts with "data:"), remove it
        if (cleaned.imageUrl && cleaned.imageUrl.startsWith('data:')) {
          console.warn(`âš ï¸ Removing base64 image for ${emp.name} (too large for localStorage)`);
          delete cleaned.imageUrl;
        }
        
        return cleaned;
      });
      
      const dataString = JSON.stringify(cleanedEmployees);
      const sizeInMB = new Blob([dataString]).size / (1024 * 1024);
      
      console.log(`ðŸ’¾ Saving data to localStorage: ${sizeInMB.toFixed(2)} MB`);
      
      if (sizeInMB > 4.5) {
        console.warn('âš ï¸ Data size is close to localStorage limit (5MB)');
      }
      
      localStorage.setItem(STORAGE_KEY, dataString);
      console.log('âœ… Data saved successfully');
      
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('âŒ QuotaExceededError: Data too large for localStorage');
        
        // Try to save without any images at all
        try {
          const minimalEmployees = employees.map(emp => {
            const minimal = { ...emp };
            delete minimal.imageUrl;
            return minimal;
          });
          
          localStorage.setItem(STORAGE_KEY, JSON.stringify(minimalEmployees));
          console.log('âœ… Saved without images to fit localStorage');
          throw new Error('Data too large. Images were removed to save data.');
        } catch (secondError) {
          console.error('âŒ Still failed after removing images:', secondError);
          throw new Error('Data too large even without images. Please reduce data size.');
        }
      } else {
        console.error('Error saving employees to localStorage:', error);
        throw new Error('Failed to save data');
      }
    }
  },

  /**
   * Reset to saved default data
   */
  resetToDefault: (): void => {
    try {
      // Remove current data - this will make getEmployees() return default data
      localStorage.removeItem(STORAGE_KEY);
      console.log('âœ… Data reset to saved default');
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  },

  /**
   * Export data as JSON string
   */
  exportData: (): string => {
    const employees = dataManager.getEmployees();
    return JSON.stringify(employees, null, 2);
  },

  /**
   * Import data from JSON string
   */
  importData: (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        dataManager.saveEmployees(parsed);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },

  /**
   * Get localStorage usage statistics
   */
  getStorageStats: () => {
    return getStorageStats();
  },

  /**
   * Clean up broken IndexedDB image references
   * Removes imageUrl if the referenced image doesn't exist in IndexedDB
   */
  cleanupBrokenImageRefs: async (employees: Employee[]): Promise<void> => {
    try {
      // Get all valid image IDs from IndexedDB
      const validImageIds = await getAllImageIds();
      const validImageIdSet = new Set(validImageIds);
      
      // Find employees with broken references
      const brokenRefs = employees.filter(emp => {
        if (!emp.imageUrl?.startsWith('indexeddb:')) return false;
        const imageId = emp.imageUrl.replace('indexeddb:', '');
        return !validImageIdSet.has(imageId);
      });
      
      if (brokenRefs.length > 0) {
        console.log(`ðŸ”§ Cleaning up ${brokenRefs.length} broken image references...`);
        
        // Remove broken references
        const cleaned = employees.map(emp => {
          if (!emp.imageUrl?.startsWith('indexeddb:')) return emp;
          
          const imageId = emp.imageUrl.replace('indexeddb:', '');
          if (!validImageIdSet.has(imageId)) {
            const cleanedEmp = { ...emp };
            delete cleanedEmp.imageUrl;
            return cleanedEmp;
          }
          return emp;
        });
        
        // Save cleaned data back to localStorage
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
          console.log('âœ… Broken image references cleaned up');
        } catch (error) {
          console.error('Failed to save cleaned data:', error);
        }
      }
    } catch (error) {
      console.error('Error cleaning up broken image refs:', error);
    }
  },

  /**
   * Get default employees data
   * Returns saved default from localStorage, or fallback to orgChartData
   */
  getDefaultEmployees: (): Employee[] => {
    try {
      const stored = localStorage.getItem(DEFAULT_DATA_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // MIGRATION: Add new fields to default data if they don't exist
          const migrated = parsed.map(emp => {
            const migratedEmp = { ...emp };
            
            const needsMigration = 
              migratedEmp.criticalPosition === undefined ||
              migratedEmp.gender === undefined ||
              migratedEmp.city === undefined ||
              migratedEmp.maritalStatus === undefined ||
              migratedEmp.performance === undefined ||
              migratedEmp.iq === undefined;
            
            if (needsMigration) {
              const dummyData = generateDummyData(migratedEmp.name, migratedEmp.competencyScore);
              
              if (migratedEmp.criticalPosition === undefined) migratedEmp.criticalPosition = dummyData.criticalPosition;
              if (migratedEmp.gender === undefined) migratedEmp.gender = dummyData.gender;
              if (migratedEmp.city === undefined) migratedEmp.city = dummyData.city;
              if (migratedEmp.maritalStatus === undefined) migratedEmp.maritalStatus = dummyData.maritalStatus;
              if (migratedEmp.performance === undefined) migratedEmp.performance = dummyData.performance;
              if (migratedEmp.iq === undefined) migratedEmp.iq = dummyData.iq;
            }
            
            // MIGRATION: Generate competencyDetails and idpRecommendations if they don't exist
            const needsCompetencyMigration = 
              !migratedEmp.competencyDetails || migratedEmp.competencyDetails.length === 0;
            
            if (needsCompetencyMigration) {
              // Store the original competency score before migration
              const originalCompetencyScore = migratedEmp.competencyScore;
              
              // Get readiness score (use existing or calculate fallback)
              let readinessScore = migratedEmp.readinessScore;
              if (readinessScore === undefined || readinessScore === null) {
                // Calculate fallback readiness score from competency score
                const currentScore = migratedEmp.competencyScore;
                if (currentScore >= 91) {
                  readinessScore = Math.round(currentScore * 0.92);
                } else if (currentScore >= 76) {
                  readinessScore = Math.round(currentScore * 0.88);
                } else if (currentScore >= 66) {
                  readinessScore = Math.round(currentScore * 0.80);
                } else {
                  readinessScore = Math.round(currentScore * 0.72);
                }
                migratedEmp.readinessScore = readinessScore;
              }
              
              // Generate development data based on readiness score
              const devData = generateDevelopmentData(migratedEmp.id, readinessScore);
              migratedEmp.competencyDetails = devData.competencyDetails;
              migratedEmp.idpRecommendations = devData.idpRecommendations;
              
              // IMPORTANT: Preserve the original competency score from Excel/import
              // DO NOT recalculate - the competency score in Excel is the authoritative source
              migratedEmp.competencyScore = originalCompetencyScore;
              
              console.log(`âœ… ${migratedEmp.name}: Preserved competency score ${originalCompetencyScore}%`);
            }
            
            return migratedEmp;
          });
          
          // If migration occurred, save updated default data
          if (migrated.some((emp, i) => emp !== parsed[i])) {
            console.log('ðŸ”„ Migrating default data to include new fields');
            try {
              localStorage.setItem(DEFAULT_DATA_KEY, JSON.stringify(migrated));
            } catch (e) {
              console.error('Failed to save migrated default data:', e);
            }
          }
          
          return migrated;
        }
      }
    } catch (error) {
      console.error('Error loading default employees:', error);
    }
    
    // Fallback to hardcoded default data
    return defaultEmployees;
  },

  /**
   * Save current data as the new default
   * This data will be used when Reset is clicked
   */
  saveCurrentAsDefault: (): void => {
    try {
      const currentEmployees = dataManager.getEmployees();
      
      // Clean the data (remove base64 and IndexedDB images, keep only URLs)
      const cleanedEmployees = currentEmployees.map(emp => {
        const cleaned = { ...emp };
        
        // Remove base64 and IndexedDB images from default
        if (cleaned.imageUrl && (cleaned.imageUrl.startsWith('data:') || cleaned.imageUrl.startsWith('indexeddb:'))) {
          delete cleaned.imageUrl;
        }
        
        return cleaned;
      });
      
      localStorage.setItem(DEFAULT_DATA_KEY, JSON.stringify(cleanedEmployees));
      console.log('âœ… Current data saved as default!');
    } catch (error) {
      console.error('Error saving current data as default:', error);
      throw new Error('Failed to save default data');
    }
  },
};
